import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getPerishableAdvisory } from '../../utils/priceUtils';
import { formatPrice } from '../../utils/formatPrice';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Award,
  Clock,
  ShieldAlert,
  PieChart
} from 'lucide-react';

export const PriceSummary = ({ bestResult, crop, summary }) => {
  const { language, t } = useLanguage();

  if (!bestResult && !summary) return null;

  const calc = bestResult?.calculation || {};
  const advisory = crop ? getPerishableAdvisory(crop, language) : null;

  const highestPrice = summary?.highestPrice || calc.maxPrice || 0;
  const lowestPrice = summary?.lowestPrice || calc.minPrice || 0;
  const avgModalPrice = summary?.averageModalPrice || calc.modalPrice || 0;
  const bestMandiName = summary?.bestMandi || bestResult?.market || bestResult?.mandi?.name || 'Top Mandi';

  // Percentage breakdown of gross revenue
  const gross = calc.grossValue || 1;
  const transportShare = calc.transportCost ? ((calc.transportCost / gross) * 100).toFixed(1) : '0';
  const feeShare = calc.totalMandiFees ? ((calc.totalMandiFees / gross) * 100).toFixed(1) : '0';
  const netShare = calc.netReturn ? ((calc.netReturn / gross) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-4">
      {/* 1. Price Summary Key Metrics Grid (Section 12 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Highest Price */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Highest Price
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700">
            {formatPrice(highestPrice)}<span className="text-xs font-semibold text-slate-400">/Q</span>
          </p>
          <span className="text-[10px] text-slate-500 block">Peak market rate</span>
        </div>

        {/* Lowest Price */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lowest Price
            </span>
            <div className="w-7 h-7 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-800">
            {formatPrice(lowestPrice)}<span className="text-xs font-semibold text-slate-400">/Q</span>
          </p>
          <span className="text-[10px] text-slate-500 block">Base market floor</span>
        </div>

        {/* Average Modal Price */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Avg Modal Price
            </span>
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-sky-800">
            {formatPrice(avgModalPrice)}<span className="text-xs font-semibold text-slate-400">/Q</span>
          </p>
          <span className="text-[10px] text-slate-500 block">Regional cluster average</span>
        </div>

        {/* Best Mandi */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
              🏆 Best Mandi
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-amber-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-emerald-900 truncate" title={bestMandiName}>
            {bestMandiName.split(' ')[0]} {bestMandiName.split(' ')[1] || ''}
          </p>
          <span className="text-[10px] font-bold text-emerald-700 block">
            Top Net Realisation
          </span>
        </div>
      </div>

      {/* 2. Advisory & Waterfall Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Storage & Perishability Risk Advisory */}
        {advisory && (
          <div className={`p-5 rounded-3xl border ${
            advisory.type === 'warning'
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {advisory.type === 'warning' ? (
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              ) : (
                <Clock className="w-5 h-5 text-emerald-600" />
              )}
              <h4 className="text-sm font-bold text-slate-900">{t('sellNowVsWait')}</h4>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                advisory.type === 'warning'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}>
                {advisory.badge}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {advisory.text}
            </p>
          </div>
        )}

        {/* Revenue Retention Waterfall Breakdown */}
        {calc.grossValue > 0 && (
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Net Value Retention
                </h4>
              </div>
              <span className="text-xs font-extrabold text-emerald-700">
                {netShare}% Net Profit
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${netShare}%` }}
                className="bg-emerald-600 h-full transition-all duration-500"
                title={`Net Take-Home: ${netShare}%`}
              ></div>
              <div
                style={{ width: `${transportShare}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Transport Cost: ${transportShare}%`}
              ></div>
              <div
                style={{ width: `${feeShare}%` }}
                className="bg-red-400 h-full transition-all duration-500"
                title={`Mandi Cess & Labor: ${feeShare}%`}
              ></div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
                Net ({formatPrice(calc.netReturn)})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span>
                Transport (-₹{calc.transportCost})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-red-400"></span>
                Cess & Fees (-₹{calc.totalMandiFees})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceSummary;