import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { formatPrice } from '../../utils/formatPrice.js';
import { formatDistance } from '../../utils/formatDistance.js';
import { buildRecommendationExplanation } from '../../utils/priceUtils.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { X, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';

const COLORS = ['#16a34a', '#0284c7', '#d97706', '#9333ea', '#64748b'];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-bold text-white mb-1">{d.fullMarket || d.market}</p>
        <p className="text-emerald-400 font-bold">Net Return: {formatPrice(d.netReturn)}</p>
        <p className="text-slate-300">Modal: {formatPrice(d.modal_price)}/Q</p>
        <p className="text-amber-400">Transport: -₹{d.transportCost}</p>
      </div>
    );
  }
  return null;
}

export default function PriceRanking({
  bestResult,
  closestResult,
  crop,
  onClose,
  results = [],
  lang
}) {
  const { language, t } = useLanguage();
  const currentLang = lang || language;

  // 1. MODAL MODE: Explain Decision Rationale
  if (onClose && bestResult) {
    const bestMandi = bestResult.mandi;
    const bestCalc = bestResult.calculation;
    const closestMandi = closestResult?.mandi || bestMandi;
    const closestCalc = closestResult?.calculation || bestCalc;

    const explanationText = buildRecommendationExplanation(bestResult, closestResult, crop, currentLang);
    const isSame = bestMandi.id === closestMandi.id;


    const comparisonData = [
      {
        market: bestMandi.name.split(' ')[0],
        fullMarket: bestMandi.name,
        netReturn: Math.round(bestCalc.netReturn),
        modal_price: bestCalc.modalPrice,
        transportCost: Math.round(bestCalc.transportCost)
      },
      ...(closestMandi && !isSame
        ? [
            {
              market: closestMandi.name.split(' ')[0],
              fullMarket: closestMandi.name,
              netReturn: Math.round(closestCalc.netReturn),
              modal_price: closestCalc.modalPrice,
              transportCost: Math.round(closestCalc.transportCost)
            }
          ]
        : [])
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('whyThisMandi')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Why {bestMandi.name} is Recommended
            </h2>
          </div>

          {/* Rationale Callout Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed shadow-2xs">
            💡 {explanationText}
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Recommended Mandi */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border-2 border-emerald-500/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[11px]">
                  🏆 Recommended
                </span>
                <span className="font-bold text-emerald-700">{formatDistance(bestCalc.distanceKm)}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{bestMandi.name}</h4>
              <div className="pt-2 border-t border-emerald-200/60 space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>Modal Rate:</span>
                  <span className="font-bold text-slate-900">{formatPrice(bestCalc.modalPrice)}/Q</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-semibold text-amber-700">-₹{bestCalc.transportCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>APMC Cess & Fees:</span>
                  <span className="font-semibold text-red-600">-₹{bestCalc.totalMandiFees}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200 text-emerald-800 font-extrabold text-sm">
                  <span>Final Net Return:</span>
                  <span>{formatPrice(bestCalc.netReturn)}</span>
                </div>
              </div>
            </div>

            {/* Closest Mandi */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[11px]">
                  📍 Closest Mandi
                </span>
                <span className="font-bold text-slate-600">{formatDistance(closestCalc.distanceKm)}</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{closestMandi.name}</h4>
              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Modal Rate:</span>
                  <span className="font-bold text-slate-900">{formatPrice(closestCalc.modalPrice)}/Q</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-semibold text-amber-700">-₹{closestCalc.transportCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>APMC Cess & Fees:</span>
                  <span className="font-semibold text-red-600">-₹{closestCalc.totalMandiFees}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-800 font-extrabold text-sm">
                  <span>Final Net Return:</span>
                  <span>{formatPrice(closestCalc.netReturn)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Chart */}
          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="market" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="netReturn" radius={[6, 6, 0, 0]}>
                  {comparisonData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="netReturn"
                    position="top"
                    formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
                    style={{ fontSize: 11, fontWeight: 'bold', fill: '#16a34a' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <Button fullWidth onClick={onClose} variant="primary">
              {t('close')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMBEDDED CHART MODE
  if (!results || results.length === 0) return null;

  const chartData = results.map((r) => {
    const m = r.mandi || r;
    const calc = r.calculation || r;
    const mName = m.name || r.market || 'Mandi';

    return {
      market: mName.length > 12 ? mName.slice(0, 12) + '…' : mName,
      fullMarket: mName,
      netReturn: Math.round(calc.netReturn || r.netReturn || 0),
      modal_price: calc.modalPrice || r.modal_price || 0,
      transportCost: Math.round(calc.transportCost || r.transportCost || 0),
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
      <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">
        {currentLang === 'hi' ? 'शुद्ध आय तुलना' : 'Net Return Comparison'}
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        {currentLang === 'hi' ? 'परिवहन व शुल्क के बाद' : 'After transport & fees — higher is better'}
      </p>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="market" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="netReturn" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
              <LabelList
                dataKey="netReturn"
                position="top"
                formatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                style={{ fontSize: 10, fill: '#334155', fontWeight: 'bold' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}