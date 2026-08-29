import React from 'react';
import { formatPrice, formatPricePerQuintal } from '../../utils/formatPrice.js';
import { formatDistance, estimateTravelTime } from '../../utils/formatDistance.js';
import PriceFreshness from './PriceFreshness.jsx';
import { Trophy, ShieldCheck, Truck, Sparkles, Calculator, ArrowUpRight, Megaphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PriceCard({
  bestResult,
  bestRecommendation,
  record,
  crop,
  quantity = 10,
  lang
}) {
  const { language } = useLanguage();
  const currentLang = lang || language;

  // Support record prop format
  if (record && !bestResult) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">{record.market}</p>
            <p className="text-xs text-slate-500">{record.district}, {record.state}</p>
          </div>
          <PriceFreshness dateStr={record.arrival_date} lang={currentLang} />
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">Modal Price</p>
            <p className="font-bold text-slate-900 dark:text-white">{formatPricePerQuintal(record.modal_price)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Range</p>
            <p className="text-slate-600 dark:text-slate-300">{formatPrice(record.min_price)} – {formatPrice(record.max_price)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bestResult) return null;

  const mandi = bestResult.mandi || {};
  const calc = bestResult.calculation || {};
  const qty = Number(quantity || calc.quantity || 10);
  const modalPrice = calc.modalPrice || bestResult.modalPrice || bestResult.modal_price || 0;
  const grossEarnings = modalPrice * qty;

  const localizedName =
    currentLang === 'hi'
      ? mandi.hindiName || mandi.name || bestResult.market
      : currentLang === 'mr'
      ? mandi.marathiName || mandi.name || bestResult.market
      : mandi.name || bestResult.market;

  const diffMsg = bestRecommendation?.message || (bestResult.diffMessage || null);

  return (
    <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 p-5 sm:p-6 shadow-xl shadow-emerald-700/5 space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs tracking-wider uppercase">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>🏆 Best Mandi for You</span>
        </div>

        <div className="flex items-center gap-2">
          {mandi.isEnamLinked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              e-NAM
            </span>
          )}
          <PriceFreshness result={bestResult} lang={currentLang} />
        </div>
      </div>

      {/* Mandi Name & Distance */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {localizedName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {mandi.district || bestResult.district}, {mandi.state || bestResult.state}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-extrabold shadow-2xs">
            <Truck className="w-4 h-4 text-emerald-600" />
            {formatDistance(calc.distanceKm || bestResult.distanceKm)}
          </span>
          <span className="block text-[10px] text-slate-400 mt-0.5">
            ~{estimateTravelTime(calc.distanceKm || bestResult.distanceKm)}
          </span>
        </div>
      </div>

      {/* Live Merchant Bulletin Notification */}
      {bestResult.merchantNote && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-extrabold block">📢 Live APMC Trader Bulletin:</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">"{bestResult.merchantNote}"</span>
          </div>
        </div>
      )}

      {/* Best Mandi Recommendation Metric Highlight */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-2xs space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Latest Modal Rate
          </span>
          <span className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
            {formatPrice(modalPrice)} <span className="text-xs font-bold text-slate-500">/ quintal</span>
          </span>
        </div>

        {diffMsg && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{diffMsg}</span>
          </div>
        )}
      </div>

      {/* Earnings Calculator Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs text-emerald-300 font-bold border-b border-white/10 pb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Estimated Earnings
          </span>
          <span>
            {qty} Quintals × {formatPrice(modalPrice)}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
              {formatPrice(grossEarnings)}
            </span>
            <span className="text-xs text-emerald-200/80 block mt-0.5">
              Gross sales value ({qty} Quintals {crop?.name || ''})
            </span>
          </div>

          <div className="text-right">
            <span className="text-base sm:text-lg font-extrabold text-emerald-400 block">
              {formatPrice(calc.netReturn || grossEarnings)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Est. In-Pocket Net
            </span>
          </div>
        </div>

        <p className="text-[10px] text-emerald-200/60 pt-1 italic">
          * Estimated earnings based on latest available mandi price.
        </p>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center shadow-2xs">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Min-Max</span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100 text-xs truncate block">
            {formatPrice(calc.minPrice || bestResult.minPrice)}–{formatPrice(calc.maxPrice || bestResult.maxPrice)}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center shadow-2xs">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Transport</span>
          <span className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">
            -₹{calc.transportCost || 0}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center shadow-2xs">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Mandi Cess</span>
          <span className="font-extrabold text-red-600 dark:text-red-400 text-xs">
            -₹{calc.totalMandiFees || 0}
          </span>
        </div>
      </div>
    </div>
  );
}