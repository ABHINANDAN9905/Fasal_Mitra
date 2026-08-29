import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../common/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { Clock, ShieldAlert } from 'lucide-react';

export const CropCard = ({ crop, isSelected, onSelect }) => {
  const { language } = useLanguage();


  const getLocalizedName = () => {
    if (language === 'hi') return crop.hindiName;
    if (language === 'mr') return crop.marathiName;
    return crop.name;
  };

  return (
    <div
      onClick={() => onSelect(crop)}
      className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none ${
        isSelected
          ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/50 to-white ring-2 ring-emerald-500/20 shadow-md shadow-emerald-600/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Selection indicator pill */}
      {isSelected && (
        <span className="absolute top-3 right-3 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform flex items-center justify-center text-2xl shrink-0">
          {crop.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-slate-900 truncate">{getLocalizedName()}</h4>
          </div>
          <p className="text-[11px] text-slate-500 truncate">{crop.variety[0]} & more</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Avg Modal Rate</span>
          <span className="font-bold text-emerald-700">{formatPrice(crop.basePriceRange.modal)}/Q</span>
        </div>

        <div>
          {crop.isPerishable ? (
            <Badge variant="warning" size="sm" icon={ShieldAlert}>
              {crop.shelfLifeDays}d Perishable
            </Badge>
          ) : (
            <Badge variant="default" size="sm" icon={Clock}>
              {crop.shelfLifeDays}d Storage
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropCard;