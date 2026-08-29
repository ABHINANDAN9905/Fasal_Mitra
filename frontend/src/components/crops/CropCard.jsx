import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../common/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { Clock, ShieldAlert } from 'lucide-react';

export const CropCard = ({ crop, isSelected, onSelect, selectedState = 'Maharashtra', selectedDistrict = 'Nashik' }) => {
  const { language } = useLanguage();

  const getLocalizedName = () => {
    if (language === 'hi') return crop.hindiName;
    if (language === 'mr') return crop.marathiName;
    return crop.name;
  };

  // Region-aware live price calculation: strictly check if a merchant in the farmer's selected region updated the price
  const getRegionalLivePrice = () => {
    try {
      const raw = localStorage.getItem('fasal_mitra_price_overrides');
      if (raw) {
        const map = JSON.parse(raw);
        const c = crop.name.toLowerCase();
        const cid = crop.id.toLowerCase();
        const stateNorm = (selectedState || '').toLowerCase();
        const distNorm = (selectedDistrict || '').toLowerCase();

        for (const b of Object.values(map)) {
          const cropMatch = b.cropName?.toLowerCase() === c || b.cropId?.toLowerCase() === cid;
          const bDist = (b.district || '').toLowerCase();
          const bState = (b.state || '').toLowerCase();
          const bMandi = (b.mandiName || '').toLowerCase();

          // Check if this merchant bulletin belongs to the farmer's selected district, mandi, or state
          const regionMatch = (distNorm && (bDist.includes(distNorm) || distNorm.includes(bDist) || bMandi.includes(distNorm))) ||
                              (stateNorm && (bState.includes(stateNorm) || stateNorm.includes(bState)));

          if (cropMatch && regionMatch) {
            return {
              price: b.modalPrice,
              isMerchantLive: true,
              mandiName: b.mandiName
            };
          }
        }
      }
    } catch {}

    // Region-calibrated default baseline
    const base = crop.basePriceRange.modal;
    let regionalBase = base;
    const s = (selectedState || '').toLowerCase();

    // Small state-level agricultural variance if no active merchant bulletin
    if (crop.id === 'wheat') {
      if (s.includes('punjab')) regionalBase = 2420;
      else if (s.includes('haryana')) regionalBase = 2480;
      else if (s.includes('maharashtra')) regionalBase = 2510;
      else if (s.includes('madhya')) regionalBase = 2460;
    } else if (crop.id === 'onion') {
      if (s.includes('maharashtra')) regionalBase = 2450;
      else if (s.includes('karnataka')) regionalBase = 2380;
      else if (s.includes('madhya')) regionalBase = 2290;
      else regionalBase = 2400;
    } else if (crop.id === 'tomato') {
      if (s.includes('karnataka')) regionalBase = 1950;
      else if (s.includes('maharashtra')) regionalBase = 2050;
      else if (s.includes('punjab')) regionalBase = 2100;
    } else if (crop.id === 'cotton') {
      if (s.includes('gujarat')) regionalBase = 7600;
      else if (s.includes('maharashtra')) regionalBase = 7450;
      else if (s.includes('punjab') || s.includes('haryana')) regionalBase = 7520;
    }

    return {
      price: regionalBase,
      isMerchantLive: false
    };
  };

  const { price: currentPrice, isMerchantLive } = getRegionalLivePrice();

  return (
    <div
      onClick={() => onSelect(crop)}
      className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none ${
        isSelected
          ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/40 dark:to-slate-900 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-600/10'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      {/* Selection indicator pill */}
      {isSelected && (
        <span className="absolute top-3 right-3 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform flex items-center justify-center text-2xl shrink-0">
          {crop.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{getLocalizedName()}</h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{crop.variety[0]} & more</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium flex items-center gap-1">
            Avg Modal Rate
            {isMerchantLive && (
              <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-1 py-0.2 rounded" title={`Live Rate for ${selectedDistrict}`}>
                LIVE
              </span>
            )}
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatPrice(currentPrice)}/Q</span>
        </div>

        <div>
          {crop.isPerishable ? (
            <Badge variant="warning" size="sm" icon={ShieldAlert}>
              {crop.shelfLifeDays}d Perishable
            </Badge>
          ) : (
            <Badge variant="default" size="sm" icon={Clock}>
              {crop.shelfLifeDays}d Storage
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropCard;