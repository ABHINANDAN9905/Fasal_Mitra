import React from 'react';
import { formatPrice } from '../../utils/formatPrice.js';
import { formatDistance, estimateTravelTime } from '../../utils/formatDistance.js';
import PriceFreshness from './PriceFreshness.jsx';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PriceTable({ results = [], onSelectMandi, lang }) {
  const { language } = useLanguage();

  const currentLang = lang || language;

  if (!results || results.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Mandi / Market Yard</th>
              <th className="px-4 py-3.5 text-right">Modal Rate</th>
              <th className="px-4 py-3.5 text-right">Distance</th>
              <th className="px-4 py-3.5 text-right">Transport</th>
              <th className="px-4 py-3.5 text-right">APMC Fees</th>
              <th className="px-4 py-3.5 text-right font-black text-slate-800">Est. Net Return</th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {results.map((r, i) => {
              const isTop = i === 0;
              const mandi = r.mandi || r;
              const calc = r.calculation || r;

              const localizedName =
                currentLang === 'hi'
                  ? mandi.hindiName || mandi.name
                  : currentLang === 'mr'
                  ? mandi.marathiName || mandi.name
                  : mandi.name;

              return (
                <tr
                  key={r.id || mandi.id || i}
                  className={`transition-colors hover:bg-slate-50/80 cursor-pointer ${
                    isTop ? 'bg-emerald-50/40 font-semibold' : ''
                  }`}
                  onClick={() => onSelectMandi && onSelectMandi(mandi)}
                >
                  {/* Mandi Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0">
                          ★
                        </span>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          {localizedName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {mandi.district}, {mandi.state}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Modal Price */}
                  <td className="px-4 py-3.5 text-right font-bold text-slate-800">
                    {formatPrice(calc.modalPrice || r.modal_price)}/Q
                  </td>

                  {/* Distance */}
                  <td className="px-4 py-3.5 text-right text-slate-600">
                    <div>{formatDistance(calc.distanceKm || r.distanceKm)}</div>
                    <div className="text-[10px] text-slate-400">
                      ~{estimateTravelTime(calc.distanceKm || r.distanceKm)}
                    </div>
                  </td>

                  {/* Transport Deduction */}
                  <td className="px-4 py-3.5 text-right text-amber-700 font-semibold">
                    -₹{calc.transportCost || r.transportCost}
                  </td>

                  {/* Mandi Fees */}
                  <td className="px-4 py-3.5 text-right text-slate-500">
                    -₹{calc.totalMandiFees || r.totalMandiFees || 0}
                  </td>

                  {/* Final Net Return */}
                  <td className="px-4 py-3.5 text-right font-extrabold text-sm text-emerald-700">
                    {formatPrice(calc.netReturn || r.netReturn)}
                    <span className="block text-[10px] font-semibold text-slate-400">
                      {formatPrice(calc.netPricePerQuintal || Math.round((calc.netReturn || r.netReturn) / (calc.quantity || 10)))}/Q
                    </span>
                  </td>

                  {/* Freshness */}
                  <td className="px-4 py-3.5 text-center">
                    <PriceFreshness result={r} lang={currentLang} />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectMandi) onSelectMandi(mandi);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors"
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