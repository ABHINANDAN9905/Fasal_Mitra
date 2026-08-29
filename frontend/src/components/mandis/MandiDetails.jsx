import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  X,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Scale,
  Users,
  Truck,
  Coins
} from 'lucide-react';


export const MandiDetails = ({ mandi, onClose }) => {
  const { language, t } = useLanguage();

  if (!mandi) return null;

  const getLocalizedName = () => {
    if (language === 'hi') return mandi.hindiName || mandi.name;
    if (language === 'mr') return mandi.marathiName || mandi.name;
    return mandi.name;
  };

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

        {/* Mandi Title & e-NAM Status */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {mandi.isEnamLinked && (
              <Badge variant="primary" size="sm" icon={ShieldCheck}>
                {t('verifiedEnam')}
              </Badge>
            )}
            <Badge variant="info" size="sm">
              Rating: {mandi.rating} ★
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {getLocalizedName()}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            {mandi.district}, {mandi.state} • APMC Yard Node
          </p>
        </div>

        {/* Key APMC Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>APMC Cess</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{mandi.marketFeePercent}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Weighing Fee</span>
            </div>
            <span className="text-sm font-bold text-slate-800">₹{mandi.weighingFeePerQuintal}/Q</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Unloading Fee</span>
            </div>
            <span className="text-sm font-bold text-slate-800">₹{mandi.unloadingFeePerQuintal}/Q</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Avg Daily Volume</span>
            </div>
            <span className="text-sm font-bold text-emerald-700">{mandi.dailyArrivalTonnes} Tonnes</span>
          </div>
        </div>

        {/* Facilities List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            {t('facilitiesTitle')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mandi.facilities?.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Commodities Traded */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Major Commodities Traded
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {mandi.primaryCommodities?.map((comm, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider"
              >
                {comm}
              </span>
            ))}
          </div>
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
};

export default MandiDetails;