import api from './api';
import { CROPS, CROP_CATEGORIES } from '../constants/crop';

/**
 * Fetch crops filtered by category and search query.
 */
export const getCrops = async (category = 'All', searchQuery = '') => {
  try {
    const res = await api.get('/v1/crops', {
      params: {
        category,
        search: searchQuery
      }
    });
    if (res.data && res.data.success && res.data.crops) {
      return res.data.crops;
    }
  } catch (err) {
    console.warn('Backend crops API unavailable, falling back:', err.message);
  }

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
  try {
    const res = await api.get(`/v1/crops/${id}`);
    if (res.data && res.data.success && res.data.crop) {
      return res.data.crop;
    }
  } catch (err) {
    console.warn('Backend crop profile API unavailable, falling back:', err.message);
  }
  return CROPS.find((c) => c.id === id) || null;
};

/**
 * Get all crops.
 */
export const getAllCrops = async () => {
  try {
    const res = await api.get('/v1/crops');
    if (res.data && res.data.success && res.data.crops) {
      return res.data.crops;
    }
  } catch (err) {
    console.warn('Backend all crops API unavailable, falling back:', err.message);
  }
  return CROPS;
};

