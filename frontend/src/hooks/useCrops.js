import { useState, useEffect, useCallback } from 'react';
import { getCrops, getCropCategories } from '../services/cropService';

export const useCrops = (initialCategory = 'All') => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getCrops(category, searchQuery);
      setCrops(list);
      setSelectedCrop((prev) => prev || (list.length > 0 ? list[0] : null));
      setCategories(getCropCategories());
    } catch (err) {
      setError(err.message || 'Failed to load crops');
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  return {
    crops,
    selectedCrop,
    setSelectedCrop,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    categories,
    loading,
    error,
    refreshCrops: fetchCrops
  };
};