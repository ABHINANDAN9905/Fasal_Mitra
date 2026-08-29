import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { formatDistance, estimateTravelTime } from '../../utils/formatDistance';
import {
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Share2
} from 'lucide-react';

export const MandiCard = ({
  result,
  rank = 1,
  isTopChoice = false,
  onExplain,
  onViewDetails,
  onShareWhatsApp
}) => {
  const { language, t } = useLanguage();
  const { mandi, calculation, freshness } = result;


  const getLocalizedMandiName = () => {
    if (language === 'hi') return mandi.hindiName || mandi.name;
    if (language === 'mr') return mandi.marathiName || mandi.name;
    return mandi.name;
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
        isTopChoice
          ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-700/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner for Winner / Rank */}
      <div
        className={`px-5 py-2.5 rounded-t-2xl flex items-center justify-between text-xs font-bold ${
          isTopChoice
            ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white'
            : 'bg-slate-100 text-slate-700 border-b border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {isTopChoice ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="tracking-wide uppercase text-[11px] font-extrabold">
                {t('recommendedBadge')}
              </span>
            </>
          ) : (
            <span className="text-slate-600">
              Rank #{rank} Option
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mandi.isEnamLinked && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isTopChoice ? 'bg-emerald-800/80 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              e-NAM
            </span>
          )}
          <span className={`text-[10px] ${isTopChoice ? 'text-emerald-100' : 'text-slate-500'}`}>
            {freshness}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Mandi Name & Location */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {getLocalizedMandiName()}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {mandi.district}, {mandi.state}
              </p>
            </div>

            {/* Travel info pill */}
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                {formatDistance(calculation.distanceKm)}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                ~{estimateTravelTime(calculation.distanceKm)}
              </span>
            </div>
          </div>
        </div>

        {/* Big Net Realisation Highlight */}
        <div className={`p-4 rounded-xl border ${
          isTopChoice
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('estimatedNetProfit')}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              {formatPrice(calculation.netPricePerQuintal)}/Q Net
            </span>
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isTopChoice ? 'text-emerald-700' : 'text-slate-900'
            }`}>
              {formatPrice(calculation.netReturn)}
            </span>
            <span className="text-xs font-medium text-slate-500">
              for {calculation.quantity} Q
            </span>
          </div>
        </div>

        {/* Breakdown Row: Gross vs Deductions */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">{t('modalPrice')}</span>
            <span className="font-bold text-slate-800">{formatPrice(calculation.modalPrice)}/Q</span>
            <span className="text-[10px] text-slate-400 block truncate">Range: {formatPrice(calculation.minPrice)}-{formatPrice(calculation.maxPrice)}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Deductions</span>
            <span className="font-bold text-red-600">-{formatPrice(calculation.totalDeductions)}</span>
            <span className="text-[10px] text-slate-400 block truncate">
              Tr: -₹{calculation.transportCost} | Fee: -₹{calculation.totalMandiFees}
            </span>
          </div>
        </div>

        {/* Action Buttons: Explain, APMC Profile, WhatsApp */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onExplain(result)}
            className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              isTopChoice
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('explainDecision')}</span>
          </button>

          <button
            onClick={() => onViewDetails(mandi)}
            title={t('viewDetails')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {onShareWhatsApp && (
            <button
              onClick={() => onShareWhatsApp(result)}
              title={t('shareOnWhatsApp')}
              className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MandiCard;