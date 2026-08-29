import React from 'react';
import CropCard from './CropCard';
import { useLanguage } from '../../context/LanguageContext';
import { Search } from 'lucide-react';

export const CropSelector = ({
  crops = [],
  selectedCrop,
  onSelectCrop,
  categories = [],
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedState = 'Maharashtra',
  selectedDistrict = 'Nashik'
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? t('allCrops') : cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchCropPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Crops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {crops.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            isSelected={selectedCrop?.id === crop.id}
            onSelect={onSelectCrop}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
          />
        ))}
      </div>

      {crops.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          No matching crops found. Try searching for "Onion", "Tomato", or "Wheat".
        </div>
      )}
    </div>
  );
};

export default CropSelector;