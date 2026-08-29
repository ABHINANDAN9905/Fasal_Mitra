import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCrops } from '../hooks/useCrops';
import { useMandis } from '../hooks/useMandis';
import { usePrices } from '../hooks/usePrices';
import { VEHICLE_PRESETS, STATES_AND_DISTRICTS } from '../constants/location';
import { CROPS } from '../constants/crop';
import { generateWhatsAppShare } from '../utils/priceUtils';

// Components
import CropSelector from '../components/crops/CropSelector';
import LocationSelector from '../components/location/LocationSelector';
import PriceSearch from '../components/prices/PriceSearch';
import PriceCard from '../components/prices/PriceCard';
import PriceTable from '../components/prices/PriceTable';
import PriceRanking from '../components/prices/PriceRanking';
import PriceFreshness from '../components/prices/PriceFreshness';
import MandiList from '../components/mandis/MandiList';
import MandiDetails from '../components/mandis/MandiDetails';
import MandiMap from '../components/map/MandiMap';
import PriceChart from '../components/analytics/PriceChart';
import PriceSummary from '../components/analytics/PriceSummary';
import Loading from '../components/common/Loading';

import {
  Sparkles,
  MapPin,
  Share2,
  Wheat
} from 'lucide-react';

export const Dashboard = () => {
  const { t } = useLanguage();


  // State Management
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const [villageName, setVillageName] = useState('Niphad');
  const [quantity, setQuantity] = useState(10);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[1]); // Bolero Pickup
  const [customRatePerKm, setCustomRatePerKm] = useState(14);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'table' | 'map' | 'trends'
  const [farmerCoords, setFarmerCoords] = useState(null);
  const [gpsActive, setGpsActive] = useState(false);

  // Modals & Drawers
  const [explainingResult, setExplainingResult] = useState(null);
  const [detailedMandi, setDetailedMandi] = useState(null);

  // Handle State selection change with auto district sync
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const stateObj = STATES_AND_DISTRICTS.find(s => s.state.toLowerCase() === newState.toLowerCase());
    if (stateObj && stateObj.districts.length > 0) {
      setSelectedDistrict(stateObj.districts[0].name);
      setVillageName(stateObj.districts[0].hub);
    }
    setFarmerCoords(null);
    setGpsActive(false);
  };

  const handleDistrictChange = (newDistrict) => {
    setSelectedDistrict(newDistrict);
    setFarmerCoords(null);
    setGpsActive(false);
  };

  const handleLocationDetected = (detected) => {
    setSelectedState(detected.state);
    setSelectedDistrict(detected.district);
    setVillageName(detected.village || detected.pincode || detected.district);
    setFarmerCoords({ lat: detected.lat, lng: detected.lng });
    setGpsActive(true);
  };

  // Hooks
  const {
    crops,
    selectedCrop,
    setSelectedCrop,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    categories,
    loading: cropsLoading
  } = useCrops();

  const {
    mandis,
    loading: mandisLoading
  } = useMandis({
    state: selectedState,
    district: selectedDistrict,
    cropId: selectedCrop?.id || 'onion',
    farmerCoords: farmerCoords
  });

  const {
    rankedResults,
    bestResult,
    closestResult,
    historicalTrends,
    loading: pricesLoading,
    recalculate
  } = usePrices({
    cropId: selectedCrop?.id || 'onion',
    variety: selectedCrop?.variety?.[0] || '',
    quantity: quantity,
    mandis: mandis,
    vehicleRate: customRatePerKm,
    baseLoadingFee: selectedVehicle?.baseLoadingFee || 300
  });

  // Quick Scenario Loaders (for Judges & Demo)
  const handleQuickScenario = (scenario) => {
    if (scenario === 'onion') {
      const onion = CROPS.find(c => c.id === 'onion');
      if (onion) setSelectedCrop(onion);
      setSelectedState('Maharashtra');
      setSelectedDistrict('Nashik');
      setVillageName('Lasalgaon Village');
      setQuantity(10);
      setSelectedVehicle(VEHICLE_PRESETS[1]);
      setCustomRatePerKm(14);
    } else if (scenario === 'tomato') {
      const tomato = CROPS.find(c => c.id === 'tomato');
      if (tomato) setSelectedCrop(tomato);
      setSelectedState('Karnataka');
      setSelectedDistrict('Kolar');
      setVillageName('Kolar Rural');
      setQuantity(25);
      setSelectedVehicle(VEHICLE_PRESETS[1]);
      setCustomRatePerKm(14);
    } else if (scenario === 'wheat') {
      const wheat = CROPS.find(c => c.id === 'wheat');
      if (wheat) setSelectedCrop(wheat);
      setSelectedState('Punjab');
      setSelectedDistrict('Khanna');
      setVillageName('Khanna Farm Node');
      setQuantity(50);
      setSelectedVehicle(VEHICLE_PRESETS[2]); // Tractor
      setCustomRatePerKm(18);
    } else if (scenario === 'soybean') {
      const soy = CROPS.find(c => c.id === 'soybean');
      if (soy) setSelectedCrop(soy);
      setSelectedState('Madhya Pradesh');
      setSelectedDistrict('Indore');
      setVillageName('Sanwer Road Hub');
      setQuantity(30);
      setSelectedVehicle(VEHICLE_PRESETS[1]);
      setCustomRatePerKm(14);
    }
  };

  // Voice Input Parsing
  const handleVoiceDetected = (phrase) => {
    const p = phrase.toLowerCase();
    
    // Check for crop matches
    CROPS.forEach(c => {
      if (p.includes(c.name.toLowerCase()) || p.includes(c.id) || (c.hindiName && p.includes('प्याज') && c.id === 'onion')) {
        setSelectedCrop(c);
      }
    });

    // Check for quantities (e.g. 10 quintal, 25 q)
    const qtyMatch = p.match(/\b(\d+)\s*(quintal|quental|q|क्विंटल|टन|ton)?/i);
    if (qtyMatch && qtyMatch[1]) {
      setQuantity(Number(qtyMatch[1]));
    }

    // Check for location
    if (p.includes('nashik') || p.includes('नाशिक')) {
      setSelectedState('Maharashtra');
      setSelectedDistrict('Nashik');
    } else if (p.includes('kolar') || p.includes('कोलार')) {
      setSelectedState('Karnataka');
      setSelectedDistrict('Kolar');
    } else if (p.includes('indore') || p.includes('इंदौर')) {
      setSelectedState('Madhya Pradesh');
      setSelectedDistrict('Indore');
    } else if (p.includes('punjab') || p.includes('khanna') || p.includes('पंजाब')) {
      setSelectedState('Punjab');
      setSelectedDistrict('Khanna');
    }
  };

  // WhatsApp Share Trigger
  const handleShareWhatsApp = (result) => {
    const shareText = generateWhatsAppShare(result || bestResult, selectedCrop, `${villageName || selectedDistrict}, ${selectedState}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const isLoading = cropsLoading || mandisLoading || pricesLoading;

  return (
    <div className="space-y-6">
      {/* Hero Banner with Quick Demo Scenarios */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Quick Demo Scenarios Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-300 mr-1">{t('quickPresets')}</span>
            <button
              onClick={() => handleQuickScenario('onion')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1.5"
            >
              🧅 {t('scenario1')}
            </button>
            <button
              onClick={() => handleQuickScenario('tomato')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1.5"
            >
              🍅 {t('scenario2')}
            </button>
            <button
              onClick={() => handleQuickScenario('wheat')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1.5"
            >
              🌾 {t('scenario3')}
            </button>
            <button
              onClick={() => handleQuickScenario('soybean')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1.5"
            >
              🌱 {t('scenario4')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Form: Crop, Quantity, Location & Voice Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Crop Selection & Quantity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Crop Selection */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Wheat className="w-4 h-4 text-emerald-600" />
                {t('selectCrop')}
              </h2>
              {selectedCrop && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Selected: {selectedCrop.name}
                </span>
              )}
            </div>

            <CropSelector
              crops={crops}
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              categories={categories}
              activeCategory={category}
              onSelectCategory={setCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Voice Search & Advanced Transport Adjuster */}
          <PriceSearch
            quantity={quantity}
            onQuantityChange={setQuantity}
            selectedVehicle={selectedVehicle}
            onVehicleChange={setSelectedVehicle}
            customRatePerKm={customRatePerKm}
            onCustomRateChange={setCustomRatePerKm}
            onVoiceDetected={handleVoiceDetected}
            onCalculate={recalculate}
          />
        </div>

        {/* Right Column: Quantity & Location Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
            {/* Step 2: Quantity Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="harvest-quantity-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  {t('enterQuantity')}
                </label>
                <span className="text-xs font-bold text-emerald-700">
                  {quantity} Quintals ({(quantity * 100).toLocaleString()} kg)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    id="harvest-quantity-input"
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Quintal
                  </span>
                </div>

                {/* Quick Increment Buttons */}
                <div className="flex items-center gap-1.5">
                  {[5, 10, 25, 50].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        quantity === q
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {q}Q
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Location Selector */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {t('selectLocation')}
              </h3>
              <LocationSelector
                state={selectedState}
                district={selectedDistrict}
                villageOrPincode={villageName}
                onStateChange={handleStateChange}
                onDistrictChange={handleDistrictChange}
                onVillageChange={setVillageName}
                onLocationDetected={handleLocationDetected}
                gpsActive={gpsActive}
                gpsCoordinates={farmerCoords}
              />
            </div>

            {/* Price Freshness Badge */}
            {bestResult && <PriceFreshness result={bestResult} />}
          </div>

          {/* Winner Realisation Card */}
          {bestResult && (
            <PriceCard
              bestResult={bestResult}
              crop={selectedCrop}
              quantity={quantity}
            />
          )}
        </div>
      </div>

      {/* Results View & Tabs */}
      {isLoading ? (
        <Loading fullPage={false} />
      ) : rankedResults.length > 0 ? (
        <div className="space-y-6 pt-4">
          {/* Navigation View Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'cards'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Mandi Cards ({rankedResults.length})
              </button>

              <button
                onClick={() => setActiveTab('table')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'table'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Comparison Matrix
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'map'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Interactive Map
              </button>

              <button
                onClick={() => setActiveTab('trends')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'trends'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Price Trends & Risk
              </button>
            </div>

            {/* WhatsApp Share Button */}
            <button
              onClick={() => handleShareWhatsApp(bestResult)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('shareOnWhatsApp')}</span>
            </button>
          </div>

          {/* Tab 1: Cards Grid */}
          {activeTab === 'cards' && (
            <MandiList
              results={rankedResults}
              onExplain={(res) => setExplainingResult(res)}
              onViewDetails={(m) => setDetailedMandi(m)}
              onShareWhatsApp={handleShareWhatsApp}
            />
          )}

          {/* Tab 2: Comparison Table Matrix */}
          {activeTab === 'table' && (
            <PriceTable
              results={rankedResults}
              bestResult={bestResult}
              onSelectMandi={(m) => setDetailedMandi(m)}
            />
          )}

          {/* Tab 3: Interactive Radial Map */}
          {activeTab === 'map' && (
            <MandiMap
              results={rankedResults}
              originLocationName={`${villageName || selectedDistrict}, ${selectedState}`}
              onSelectMandi={(m) => setDetailedMandi(m)}
            />
          )}

          {/* Tab 4: Historical Trends & Analytics */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <PriceChart
                trends={historicalTrends}
                cropName={selectedCrop?.name}
                mandiName={bestResult?.mandi?.name}
              />
              <PriceSummary bestResult={bestResult} crop={selectedCrop} />
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
          No mandi prices found for the selected configuration.
        </div>
      )}

      {/* Explain Decision Rationale Modal */}
      {explainingResult && (
        <PriceRanking
          bestResult={explainingResult}
          closestResult={closestResult}
          crop={selectedCrop}
          onClose={() => setExplainingResult(null)}
        />
      )}

      {/* APMC Mandi Full Profile Modal */}
      {detailedMandi && (
        <MandiDetails
          mandi={detailedMandi}
          onClose={() => setDetailedMandi(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
