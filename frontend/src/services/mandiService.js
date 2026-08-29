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
  return ALL_MANDIS.find((mandi) => mandi.id === id) || null;
};
