import React, { useState } from 'react';
import StateSelector from './StateSelector';
import DistrictSelector from './DistrictSelector';
import { getFarmerCoordinatesFromBrowser, reverseGeocodeCoords, getDistrictDetails } from '../../services/locationService';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Building
} from 'lucide-react';

export const LocationSelector = ({
  state,
  district,
  villageOrPincode,
  onStateChange,
  onDistrictChange,
  onVillageChange,
  onLocationDetected,
  gpsActive = false,
  gpsCoordinates = null
}) => {
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Get full agricultural profile for selected State & District
  const districtDetails = getDistrictDetails(state, district);


  const handleDetectGps = async () => {
    setDetectingGps(true);
    setGpsError(null);

    try {
      const coords = await getFarmerCoordinatesFromBrowser();
      const locationData = await reverseGeocodeCoords(coords.lat, coords.lng);

      if (onLocationDetected) {
        onLocationDetected({
          state: locationData.state,
          district: locationData.district,
          village: locationData.village,
          pincode: locationData.pincode,
          lat: coords.lat,
          lng: coords.lng
        });
      }
    } catch (err) {
      console.warn('GPS detection issue:', err.message);
      setGpsError(err.message || 'Could not fetch GPS. Please select State & District manually.');
    } finally {
      setDetectingGps(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* State & District Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StateSelector selectedState={state} onChange={onStateChange} />
        <DistrictSelector selectedState={state} selectedDistrict={district} onChange={onDistrictChange} />
      </div>

      {/* Village / Pincode & GPS Auto-Locate Button */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Village name or Pincode (e.g. Niphad 422303)"
              value={villageOrPincode}
              onChange={(e) => onVillageChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleDetectGps}
            disabled={detectingGps}
            title="Auto-detect exact farm location using browser GPS"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs ${
              detectingGps
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : gpsActive
                ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200'
            }`}
          >
            <Navigation className={`w-4 h-4 ${detectingGps ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{detectingGps ? 'Locating...' : gpsActive ? 'GPS Active' : 'Use GPS'}</span>
          </button>
        </div>

        {/* GPS Active / Success Indicator */}
        {gpsCoordinates && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              GPS Lat: {gpsCoordinates.lat.toFixed(4)}, Lng: {gpsCoordinates.lng.toFixed(4)} • Distances calculated from your live coordinates
            </span>
          </div>
        )}

        {/* GPS Error Alert */}
        {gpsError && (
          <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">{gpsError}</span>
              <p className="text-[10px] text-amber-700 mt-0.5">
                (Make sure Location permission is enabled for this site in your browser settings)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive District & State Agricultural Details Card */}
      {districtDetails && (
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {districtDetails.districtName} District Agricultural Profile
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              PIN: {districtDetails.defaultPincode}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {/* Major Mandi Hub */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Major APMC Hub</span>
              <span className="font-bold text-slate-800 block truncate" title={districtDetails.hub}>
                {districtDetails.hub}
              </span>
            </div>

            {/* Top Crops */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Primary Crops</span>
              <span className="font-bold text-emerald-700 block truncate" title={districtDetails.topCrop}>
                {districtDetails.topCrop}
              </span>
            </div>

            {/* Total Mandis & e-NAM */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">APMC Mandis</span>
              <span className="font-bold text-slate-800 block">
                {districtDetails.mandisCount} Mandis ({districtDetails.enamLinkedPercent}% e-NAM)
              </span>
            </div>

            {/* Soil Type */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Soil Profile</span>
              <span className="font-bold text-slate-700 block truncate" title={districtDetails.soilType}>
                {districtDetails.soilType}
              </span>
            </div>

            {/* Agro-Climatic Zone */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs col-span-2 sm:col-span-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Agro-Climatic Zone</span>
              <span className="font-bold text-slate-700 block truncate" title={districtDetails.agroZone}>
                {districtDetails.agroZone}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;