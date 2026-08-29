import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ALL_MANDIS } from '../constants/location';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, MapPin, ArrowLeft } from 'lucide-react';

export const MandiDetailsPage = ({ mandiId = 'lasalgaon-apmc', onBack }) => {
  const { t } = useLanguage();

  const mandi = ALL_MANDIS.find(m => m.id === mandiId) || ALL_MANDIS[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('backToDashboard')}
          </button>
        )}

        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {mandi.isEnamLinked && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    e-NAM Integrated APMC
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  ★ {mandi.rating} Farmer Rating
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{mandi.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {mandi.district}, {mandi.state}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Market Cess</span>
              <span className="text-base font-bold text-slate-800">{mandi.marketFeePercent}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Weighing Fee</span>
              <span className="text-base font-bold text-slate-800">₹{mandi.weighingFeePerQuintal}/Q</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Unloading Fee</span>
              <span className="text-base font-bold text-slate-800">₹{mandi.unloadingFeePerQuintal}/Q</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Daily Arrivals</span>
              <span className="text-base font-bold text-emerald-700">{mandi.dailyArrivalTonnes} Tonnes</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Infrastructure & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mandi.facilities?.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MandiDetailsPage;