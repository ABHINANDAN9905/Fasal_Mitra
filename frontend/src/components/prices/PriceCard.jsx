import React from 'react';
import { formatPrice, formatPricePerQuintal } from '../../utils/formatPrice.js';
import { formatDistance, estimateTravelTime } from '../../utils/formatDistance.js';
import PriceFreshness from './PriceFreshness.jsx';
import { Trophy, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PriceCard({ bestResult, record, crop, lang }) {
  const { language } = useLanguage();

  const currentLang = lang || language;

  // Support record prop format
  if (record && !bestResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-slate-800">{record.market}</p>
            <p className="text-xs text-slate-500">{record.district}, {record.state}</p>
          </div>
          <PriceFreshness dateStr={record.arrival_date} lang={currentLang} />
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Modal</p>
            <p className="font-bold text-slate-900">{formatPricePerQuintal(record.modal_price)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Range</p>
            <p className="text-slate-600">{formatPrice(record.min_price)} – {formatPrice(record.max_price)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bestResult) return null;

  const mandi = bestResult.mandi;
  const calc = bestResult.calculation;

  const localizedName =
    currentLang === 'hi'
      ? mandi.hindiName || mandi.name
      : currentLang === 'mr'
      ? mandi.marathiName || mandi.name
      : mandi.name;

  return (
    <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/20 p-5 shadow-lg shadow-emerald-600/5 space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs tracking-wider uppercase">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>Top Mandi Choice</span>
        </div>

        <div className="flex items-center gap-2">
          {mandi.isEnamLinked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              e-NAM
            </span>
          )}
          <PriceFreshness result={bestResult} lang={currentLang} />
        </div>
      </div>

      {/* Mandi Name & Distance */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {localizedName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mandi.district}, {mandi.state}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-slate-500" />
            {formatDistance(calc.distanceKm)}
          </span>
          <span className="block text-[10px] text-slate-400 mt-0.5">
            ~{estimateTravelTime(calc.distanceKm)}
          </span>
        </div>
      </div>

      {/* Net Return Highlight */}
      <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs">
        <div className="flex items-baseline justify-between text-xs text-slate-500 font-semibold mb-1">
          <span className="uppercase tracking-wider">Est. Net Take-Home</span>
          <span className="font-extrabold text-emerald-700">
            {formatPrice(calc.netPricePerQuintal)}/Q Net
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            {formatPrice(calc.netReturn)}
          </span>
          <span className="text-xs font-bold text-slate-500">
            ({calc.quantity} Quintals {crop?.name || ''})
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Modal Price</span>
          <span className="font-bold text-slate-800">{formatPrice(calc.modalPrice)}/Q</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Transport</span>
          <span className="font-bold text-amber-600">-₹{calc.transportCost}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">APMC Cess</span>
          <span className="font-bold text-red-500">-₹{calc.totalMandiFees}</span>
        </div>
      </div>
    </div>
  );
}