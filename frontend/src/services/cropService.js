import { CROPS, CROP_CATEGORIES } from '../constants/crop';

/**
 * Fetch crops filtered by category and search query.
 */
export const getCrops = async (category = 'All', searchQuery = '') => {
  let filtered = [...CROPS];

  if (category && category !== 'All') {
    filtered = filtered.filter(
      (c) => c.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((c) => {
      const matchName = c.name?.toLowerCase().includes(q);
      const matchHindi = c.hindiName?.toLowerCase().includes(q);
      const matchMarathi = c.marathiName?.toLowerCase().includes(q);
      const matchVariety = c.variety?.some((v) => v.toLowerCase().includes(q));
      const matchDesc = c.description?.toLowerCase().includes(q);
      return matchName || matchHindi || matchMarathi || matchVariety || matchDesc;
    });
  }

  return filtered;
};

/**
 * Get list of all crop categories.
 */
export const getCropCategories = () => {
  return CROP_CATEGORIES;
};

/**
 * Get a specific crop by ID.
 */
export const getCropById = async (id) => {
  return CROPS.find((c) => c.id === id) || null;
};

/**
 * Get all crops.
 */
export const getAllCrops = async () => {
  return CROPS;
};
