import api from './api';
import { ALL_MANDIS } from '../constants/location';

const distanceKm = (fromLat, fromLng, toLat, toLng) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getMandis = async ({ state, district, cropId, farmerLat, farmerLng }) => {
  try {
    const res = await api.get('/v1/mandis', {
      params: {
        state,
        district,
        cropId,
        lat: farmerLat,
        lng: farmerLng
      }
    });
    if (res.data && res.data.success && res.data.mandis) {
      return res.data.mandis;
    }
  } catch (err) {
    console.warn('Backend mandis API unavailable, falling back to local dataset:', err.message);
  }

  const normalizedState = state?.toLowerCase();
  const normalizedDistrict = district?.toLowerCase();

  const matches = ALL_MANDIS.filter((mandi) => {
    const stateMatches = !normalizedState || mandi.state.toLowerCase() === normalizedState;
    const districtMatches = !normalizedDistrict || mandi.district.toLowerCase() === normalizedDistrict;
    const cropMatches = !cropId || mandi.primaryCommodities?.includes(cropId);
    return stateMatches && (districtMatches || cropMatches);
  });

  const fallback = matches.length > 0
    ? matches
    : ALL_MANDIS.filter((mandi) => !cropId || mandi.primaryCommodities?.includes(cropId)).slice(0, 8);

  return fallback
    .map((mandi) => ({
      ...mandi,
      distanceKm: farmerLat && farmerLng
        ? Number(distanceKm(farmerLat, farmerLng, mandi.lat, mandi.lng).toFixed(1))
        : 0
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
};

export const getMandiById = async (id) => {
  try {
    const res = await api.get(`/v1/mandis/${id}`);
    if (res.data && res.data.success && res.data.mandi) {
      return res.data.mandi;
    }
  } catch (err) {
    console.warn('Backend mandi profile API unavailable, falling back:', err.message);
  }
  return ALL_MANDIS.find((mandi) => mandi.id === id) || null;
};

