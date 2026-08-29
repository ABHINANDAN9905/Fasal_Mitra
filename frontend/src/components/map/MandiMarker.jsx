import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { MapPin, Award } from 'lucide-react';

export const MandiMarker = ({ result, isSelected, isTopChoice, onClick }) => {
  const { mandi, calculation } = result;

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
        isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
      }`}
    >
      {/* Price Tooltip Tag */}
      <div
        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-md whitespace-nowrap transition-transform ${
          isTopChoice
            ? 'bg-emerald-600 text-white shadow-emerald-700/30'
            : 'bg-white text-slate-800 border border-slate-200'
        }`}
      >
        <span className="block leading-tight">{mandi.name.split(' ')[0]}</span>
        <span className={isTopChoice ? 'text-amber-300 font-extrabold' : 'text-emerald-700'}>
          {formatPrice(calculation.netReturn)} Net
        </span>
      </div>

      {/* Pin Pinpoint */}
      <div
        className={`w-8 h-8 -mt-1 rounded-full flex items-center justify-center shadow-md ${
          isTopChoice
            ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 animate-bounce'
            : 'bg-slate-800 text-white ring-2 ring-white'
        }`}
      >
        {isTopChoice ? <Award className="w-4 h-4 text-amber-300" /> : <MapPin className="w-4 h-4" />}
      </div>

      <div className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-0.5"></div>
    </div>
  );
};

export default MandiMarker;