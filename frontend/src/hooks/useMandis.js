import { useState, useEffect, useCallback } from 'react';
import { getMandis } from '../services/mandiService';
import { findDistrictCoordinates } from '../services/locationService';


export const useMandis = ({ state = 'Maharashtra', district = 'Nashik', cropId = 'onion', farmerCoords = null }) => {
  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMandis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use exact GPS coordinates if available, otherwise find district center
      const coords = farmerCoords && farmerCoords.lat && farmerCoords.lng
        ? farmerCoords
        : findDistrictCoordinates(state, district);

      const list = await getMandis({
        state,
        district,
        cropId,
        farmerLat: coords.lat,
        farmerLng: coords.lng
      });
      setMandis(list);
      setSelectedMandi((prev) => prev || (list.length > 0 ? list[0] : null));
    } catch (err) {
      setError(err.message || 'Failed to fetch mandis');
    } finally {
      setLoading(false);
    }
  }, [state, district, cropId, farmerCoords]);


  useEffect(() => {
    fetchMandis();
  }, [fetchMandis]);

  return {
    mandis,
    selectedMandi,
    setSelectedMandi,
    loading,
    error,
    refreshMandis: fetchMandis
  };
};