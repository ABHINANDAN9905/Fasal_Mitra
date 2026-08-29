import { ALL_MANDIS } from '../data/mandisData.js';

/**
 * Computes great-circle distance between two GPS coordinates using Haversine formula (km)
 */
export const calculateDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  if (!fromLat || !fromLng || !toLat || !toLng) return 0;
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;

  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
};

/**
 * Filter mandis by state, district, crop, and compute distance from farmer coordinates
 */
export const getMandisList = async ({
  state,
  district,
  cropId,
  farmerLat,
  farmerLng,
  radiusKm
}) => {
  const normalizedState = state?.toLowerCase()?.trim();
  const normalizedDistrict = district?.toLowerCase()?.trim();
  const normalizedCrop = cropId?.toLowerCase()?.trim();

  let matches = ALL_MANDIS.filter((mandi) => {
    const stateMatches = !normalizedState || mandi.state.toLowerCase() === normalizedState;
    const districtMatches = !normalizedDistrict || mandi.district.toLowerCase() === normalizedDistrict;
    const cropMatches = !normalizedCrop || mandi.primaryCommodities?.includes(normalizedCrop);
    return stateMatches && (districtMatches || cropMatches);
  });

  if (matches.length === 0) {
    matches = ALL_MANDIS.filter((mandi) => !normalizedCrop || mandi.primaryCommodities?.includes(normalizedCrop)).slice(0, 8);
  }

  // Calculate distance for all matching mandis
  const mandisWithDistance = matches.map((mandi) => {
    const distanceKm = farmerLat && farmerLng
      ? calculateDistanceKm(farmerLat, farmerLng, mandi.lat, mandi.lng)
      : (mandi.defaultDistance || 15);
    return {
      ...mandi,
      distanceKm
    };
  });

  // Apply radius filtering if specified
  const filtered = radiusKm
    ? mandisWithDistance.filter(m => m.distanceKm <= Number(radiusKm))
    : mandisWithDistance;

  return filtered.sort((a, b) => a.distanceKm - b.distanceKm);
};

export const getMandiById = async (id) => {
  return ALL_MANDIS.find((m) => m.id === id) || null;
};
