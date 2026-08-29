import React from 'react';
import { formatPrice } from '../../utils/formatPrice.js';
import { formatDistance, estimateTravelTime } from '../../utils/formatDistance.js';
import PriceFreshness from './PriceFreshness.jsx';
import { ChevronRight, Trophy, Megaphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PriceTable({ results = [], onSelectMandi, lang }) {
  const { language } = useLanguage();
  const currentLang = lang || language;

  if (!results || results.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Mandi / Market Yard</th>
              <th className="px-3 py-3.5 text-right">Min</th>
              <th className="px-3 py-3.5 text-right">Max</th>
              <th className="px-4 py-3.5 text-right font-black text-slate-900 dark:text-white">Modal Rate</th>
              <th className="px-3 py-3.5 text-right">Distance</th>
              <th className="px-3 py-3.5 text-right">Transport</th>
              <th className="px-3 py-3.5 text-right">APMC Fees</th>
              <th className="px-4 py-3.5 text-right font-black text-emerald-800 dark:text-emerald-400">Est. Net Return</th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-3 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {results.map((r, i) => {
              const isTop = i === 0 || r.isBest;
              const mandi = r.mandi || r;
              const calc = r.calculation || r;
              const minPrice = calc.minPrice || r.minPrice || r.min_price || 0;
              const maxPrice = calc.maxPrice || r.maxPrice || r.max_price || 0;
              const modalPrice = calc.modalPrice || r.modalPrice || r.modal_price || 0;
              const distanceKm = calc.distanceKm || r.distanceKm || 0;

              const localizedName =
                currentLang === 'hi'
                  ? mandi.hindiName || mandi.name || r.market
                  : currentLang === 'mr'
                  ? mandi.marathiName || mandi.name || r.market
                  : mandi.name || r.market;

              return (
                <tr
                  key={r.id || mandi.id || i}
                  className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer ${
                    isTop ? 'bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold' : ''
                  }`}
                  onClick={() => onSelectMandi && onSelectMandi(mandi)}
                >
                  {/* Mandi Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-start gap-2">
                      {isTop ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs mt-0.5" title="Top Mandi Choice">
                          ★
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                      )}
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block text-xs flex items-center gap-1">
                          {localizedName}
                          {isTop && <span className="text-[10px] text-amber-500 font-black">🏆</span>}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {mandi.district || r.district}, {mandi.state || r.state}
                        </span>
                        {r.merchantNote && (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                            <Megaphone className="w-2.5 h-2.5" />
                            <span>{r.merchantNote}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Min Price */}
                  <td className="px-3 py-3.5 text-right font-medium text-slate-600 dark:text-slate-300">
                    {formatPrice(minPrice)}
                  </td>

                  {/* Max Price */}
                  <td className="px-3 py-3.5 text-right font-medium text-slate-600 dark:text-slate-300">
                    {formatPrice(maxPrice)}
                  </td>

                  {/* Modal Price */}
                  <td className="px-4 py-3.5 text-right font-extrabold text-slate-900 dark:text-white text-xs">
                    {formatPrice(modalPrice)}/Q
                  </td>

                  {/* Distance */}
                  <td className="px-3 py-3.5 text-right text-slate-700 dark:text-slate-300">
                    <div className="font-semibold">{formatDistance(distanceKm)}</div>
                    <div className="text-[10px] text-slate-400">
                      ~{estimateTravelTime(distanceKm)}
                    </div>
                  </td>

                  {/* Transport Deduction */}
                  <td className="px-3 py-3.5 text-right text-amber-700 dark:text-amber-400 font-semibold">
                    -₹{calc.transportCost || r.transportCost || 0}
                  </td>

                  {/* Mandi Fees */}
                  <td className="px-3 py-3.5 text-right text-slate-500 dark:text-slate-400">
                    -₹{calc.totalMandiFees || r.totalMandiFees || 0}
                  </td>

                  {/* Final Net Return */}
                  <td className="px-4 py-3.5 text-right font-black text-sm text-emerald-700 dark:text-emerald-400">
                    {formatPrice(calc.netReturn || r.netReturn || 0)}
                    <span className="block text-[10px] font-semibold text-slate-400">
                      {formatPrice(calc.netPricePerQuintal || Math.round((calc.netReturn || r.netReturn || 0) / (calc.quantity || 10)))}/Q Net
                    </span>
                  </td>

                  {/* Freshness */}
                  <td className="px-4 py-3.5 text-center">
                    <PriceFreshness result={r} lang={currentLang} />
                  </td>

                  {/* Action */}
                  <td className="px-3 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectMandi) onSelectMandi(mandi);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="View APMC Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}