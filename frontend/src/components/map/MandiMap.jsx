import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDistance, estimateTravelTime } from '../../utils/formatDistance';
import { MapPin, Compass, Award } from 'lucide-react';


export const MandiMap = ({
  results = [],
  originLocationName = 'Your Farm Location',
  onSelectMandi
}) => {
  const { t } = useLanguage();
  const [activeMandiId, setActiveMandiId] = useState(results[0]?.mandi?.id);

  if (!results || results.length === 0) return null;

  const topResult = results[0];
  const activeResult = results.find(r => r.mandi.id === activeMandiId) || topResult;

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white overflow-hidden shadow-xl relative">
      {/* Map Header Bar */}
      <div className="p-4 bg-slate-800/90 border-b border-slate-700/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-slate-100">{t('viewOnMap')}</h4>
          <span className="text-[11px] text-slate-400 font-medium">({results.length} mandis plotted)</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Top Net Yield
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            Alternative APMC
          </span>
        </div>
      </div>

      {/* Interactive Canvas Visualization */}
      <div className="relative h-80 sm:h-96 w-full bg-[#0B1528] overflow-hidden flex items-center justify-center select-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38BDF8 1px, transparent 1px), radial-gradient(circle, #38BDF8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        ></div>

        {/* Distance radar circles around farmer origin */}
        <div className="absolute w-32 h-32 rounded-full border border-emerald-500/20 pointer-events-none"></div>
        <div className="absolute w-64 h-64 rounded-full border border-emerald-500/15 pointer-events-none"></div>
        <div className="absolute w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none"></div>

        {/* Center: Farmer Location */}
        <div className="absolute z-20 flex flex-col items-center">
          <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-extrabold shadow-lg mb-1 whitespace-nowrap">
            🌾 {originLocationName}
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center ring-4 ring-amber-500/30 animate-pulse">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Mandis Placed in Radial Geometry */}
        {results.map((item, index) => {
          const isTop = index === 0;
          const isSelected = item.mandi.id === activeMandiId;

          // Compute angle around origin
          const angle = (index * (360 / results.length) - 60) * (Math.PI / 180);
          const radius = Math.min(140, Math.max(75, item.calculation.distanceKm * 2.2));
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={item.mandi.id}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              className="absolute z-30 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => {
                setActiveMandiId(item.mandi.id);
                if (onSelectMandi) onSelectMandi(item.mandi);
              }}
            >
              {/* Route connecting line to origin */}
              <div
                className={`absolute pointer-events-none origin-bottom-left ${
                  isTop ? 'border-b-2 border-emerald-400 border-dashed opacity-80' : 'border-b border-slate-600/50 border-dotted opacity-50'
                }`}
                style={{
                  width: `${radius}px`,
                  transform: `rotate(${angle + Math.PI}rad)`,
                  transformOrigin: '0 0',
                  left: 0,
                  top: 0
                }}
              ></div>

              {/* Price Tag Pill */}
              <div
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-xl whitespace-nowrap transition-all ${
                  isTop
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300/40 shadow-emerald-500/30'
                    : isSelected
                    ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                <div className="font-extrabold">{item.mandi.name.split(' ')[0]}</div>
                <div className={isTop ? 'text-amber-300' : 'text-emerald-400'}>
                  {formatPrice(item.calculation.netReturn)} Net
                </div>
              </div>

              {/* Pin Icon */}
              <div
                className={`w-7 h-7 mt-1 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                  isTop
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-400/40 animate-bounce'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
                }`}
              >
                {isTop ? <Award className="w-3.5 h-3.5 text-amber-300" /> : <MapPin className="w-3.5 h-3.5" />}
              </div>

              <span className="text-[9px] font-semibold text-slate-400 mt-0.5">
                {formatDistance(item.calculation.distanceKm)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Mandi Live Floating Info Footer */}
      {activeResult && (
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{activeResult.mandi.name}</span>
                {activeResult.mandi.id === topResult.mandi.id && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full uppercase">
                    Top Net Return
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {activeResult.calculation.distanceKm} km away (~{estimateTravelTime(activeResult.calculation.distanceKm)}) • Modal: {formatPrice(activeResult.calculation.modalPrice)}/Q
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Est. Take-home Net</span>
              <span className="text-base font-extrabold text-emerald-400">
                {formatPrice(activeResult.calculation.netReturn)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandiMap;