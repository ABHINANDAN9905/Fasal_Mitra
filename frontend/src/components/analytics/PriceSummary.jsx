import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getPerishableAdvisory } from '../../utils/priceUtils';
import { formatPrice } from '../../utils/formatPrice';
import { Clock, ShieldAlert, PieChart } from 'lucide-react';


export const PriceSummary = ({ bestResult, crop }) => {
  const { language, t } = useLanguage();

  if (!bestResult || !crop) return null;

  const advisory = getPerishableAdvisory(crop, language);
  const calc = bestResult.calculation;

  // Percentage breakdown of gross revenue
  const transportShare = ((calc.transportCost / calc.grossValue) * 100).toFixed(1);
  const feeShare = ((calc.totalMandiFees / calc.grossValue) * 100).toFixed(1);
  const netShare = ((calc.netReturn / calc.grossValue) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Storage & Perishability Risk Advisory */}
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

      {/* 2. Revenue Retention Waterfall Breakdown */}
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
    </div>
  );
};

export default PriceSummary;