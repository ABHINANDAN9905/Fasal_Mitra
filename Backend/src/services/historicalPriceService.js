import { CROPS } from '../data/cropsData.js';

const seededOffset = (value) => {
  let hash = 0;
  for (const char of String(value)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  return (hash % 21) - 10;
};

/**
 * Returns historical daily price trends and arrival volumes for charting
 */
export const getHistoricalPriceTrends = async (cropId = 'onion', mandiId = 'lasalgaon-apmc', daysCount = 14) => {
  const crop = CROPS.find((item) => item.id === cropId) || CROPS[0];
  const count = Math.min(60, Math.max(7, Number(daysCount) || 14));
  const today = new Date();

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (count - 1 - index));
    const offset = seededOffset(`${cropId}-${mandiId}-${index}`);
    const arrivalOffset = seededOffset(`${mandiId}-${cropId}-${index}`);

    const baseArrivals = 120 + Math.abs(arrivalOffset) * 18;

    return {
      date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isoDate: day.toISOString().slice(0, 10),
      modalPrice: Math.round(crop.basePriceRange.modal * (1 + offset / 180)),
      minPrice: Math.round(crop.basePriceRange.min * (1 + offset / 220)),
      maxPrice: Math.round(crop.basePriceRange.max * (1 + offset / 220)),
      arrivalsTonnes: baseArrivals,
      tradeVolumeLakhs: Number(((baseArrivals * crop.basePriceRange.modal * 10) / 100000).toFixed(2))
    };
  });
};
