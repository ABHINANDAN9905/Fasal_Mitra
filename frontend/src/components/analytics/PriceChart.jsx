import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { BarChart3, TrendingUp, Award } from 'lucide-react';

const COLORS = ['#16a34a', '#0284c7', '#d97706', '#9333ea', '#0d9488', '#ea580c', '#4f46e5'];

export const PriceChart = ({
  results = [],
  trends = [],
  cropName = 'Wheat',
  mandiName = 'Mandi'
}) => {
  const { t } = useLanguage();
  const [chartMode, setChartMode] = useState('comparison'); // 'comparison' | 'trends'

  // Prepare Mandi Comparison Bar Chart Data (Mandi vs Modal Price ₹/Q)
  const comparisonData = results.map((r, i) => {
    const m = r.mandi || r;
    const calc = r.calculation || r;
    const name = m.name || r.market || r.mandi || `Mandi ${i + 1}`;
    const modalPrice = calc.modalPrice || r.modalPrice || r.modal_price || 0;
    const minPrice = calc.minPrice || r.minPrice || r.min_price || 0;
    const maxPrice = calc.maxPrice || r.maxPrice || r.max_price || 0;

    return {
      mandi: name.length > 14 ? name.slice(0, 14) + '…' : name,
      fullMandi: name,
      modalPrice,
      minPrice,
      maxPrice,
      netReturn: calc.netReturn || r.netReturn,
      distanceKm: calc.distanceKm || r.distanceKm,
      isBest: i === 0 || r.isBest
    };
  });

  const hasComparisonData = comparisonData.length > 0;
  const hasTrendsData = trends && trends.length > 0;

  if (!hasComparisonData && !hasTrendsData) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header & Chart View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            {chartMode === 'comparison' ? (
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            )}
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {chartMode === 'comparison'
                ? `${cropName} Mandi Price Comparison (₹/Quintal)`
                : t('historicalTrends')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {chartMode === 'comparison'
              ? `Modal rate comparison across nearby mandis for ${cropName}`
              : `${cropName} @ ${mandiName} — Daily Modal Rate & Market Arrivals`}
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartMode === 'comparison'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mandi Comparison
          </button>
          {hasTrendsData && (
            <button
              type="button"
              onClick={() => setChartMode('trends')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'trends'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14-Day Trends
            </button>
          )}
        </div>
      </div>

      {/* Chart 1: Mandi vs Modal Price Bar Chart (Section 13 Requirement) */}
      {chartMode === 'comparison' && hasComparisonData && (
        <div className="space-y-2">
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 15, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="mandi"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(v) => `₹${v}`}
                  domain={['dataMin - 200', 'dataMax + 200']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xl text-xs space-y-1 border border-slate-800">
                          <div className="font-extrabold text-sm flex items-center gap-1.5">
                            {d.isBest && <Award className="w-4 h-4 text-amber-300" />}
                            <span>{d.fullMandi}</span>
                          </div>
                          <p className="text-emerald-400 font-bold text-sm">
                            Modal Price: {formatPrice(d.modalPrice)}/Q
                          </p>
                          <p className="text-slate-300 text-[11px]">
                            Range: {formatPrice(d.minPrice)} – {formatPrice(d.maxPrice)}/Q
                          </p>
                          <p className="text-amber-300 text-[11px]">
                            Distance: {d.distanceKm} km
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="modalPrice" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  {comparisonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isBest ? '#16a34a' : COLORS[index % COLORS.length]}
                      opacity={entry.isBest ? 1 : 0.85}
                    />
                  ))}
                  <LabelList
                    dataKey="modalPrice"
                    position="top"
                    formatter={(v) => `₹${v}`}
                    style={{ fontSize: 11, fontWeight: 'bold', fill: '#0f172a' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              🏆 Top Modal Price Mandi
            </span>
            <span className="text-[11px] text-slate-400">
              Prices in ₹ per Quintal (100 kg)
            </span>
          </div>
        </div>
      )}

      {/* Chart 2: Historical Trends & Daily Arrivals */}
      {chartMode === 'trends' && hasTrendsData && (
        <div className="space-y-2">
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  yAxisId="price"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(v) => `₹${v}`}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <YAxis
                  yAxisId="arrivals"
                  orientation="right"
                  stroke="#cbd5e1"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}T`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'modalPrice') return [formatPrice(value) + '/Q', 'Modal Rate'];
                    if (name === 'arrivalsTonnes') return [`${value} Tonnes`, 'Daily Arrival'];
                    return [value, name];
                  }}
                />
                <Bar
                  yAxisId="arrivals"
                  dataKey="arrivalsTonnes"
                  name="arrivalsTonnes"
                  fill="#fbbf24"
                  opacity={0.35}
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="modalPrice"
                  name="modalPrice"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#15803d' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-3 h-1 bg-emerald-600 rounded-full"></span>
              Modal Price Trend
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
              <span className="w-3 h-2 bg-amber-400/60 rounded-xs"></span>
              Arrivals (Tonnes)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;