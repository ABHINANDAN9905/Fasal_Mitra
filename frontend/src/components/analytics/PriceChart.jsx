import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { TrendingUp } from 'lucide-react';

export const PriceChart = ({ trends = [], cropName = 'Crop', mandiName = 'Mandi' }) => {

  const { t } = useLanguage();

  if (!trends || trends.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t('historicalTrends')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {cropName} @ {mandiName} — Daily Modal Rate (₹/Q) & Market Arrivals (Tonnes)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-3 h-1 bg-emerald-600 rounded-full"></span>
            Modal Price
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="w-3 h-2 bg-amber-400/60 rounded-xs"></span>
            Arrivals (T)
          </span>
        </div>
      </div>

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
    </div>
  );
};

export default PriceChart;