/**
 * Calculates geographical distance between two lat/lng points using Haversine formula (in km)
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 25; // fallback average distance
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadFactor = 1.25; // actual road distance is ~25% longer than straight line
  return Math.round(R * c * roadFactor);
};

export const formatDistance = (km) => {
  return `${Math.round(km || 0)} km`;
};

export const formatKm = (km) => {
  return formatDistance(km);
};

export const estimateTravelTime = (distanceKm) => {
  // Average rural mini-truck/tractor speed is ~35-40 km/h
  const dist = Number(distanceKm) || 0;
  const hours = dist / 38;
  const mins = Math.round(hours * 60);
  if (mins < 60) {
    return `${mins} mins`;
  }
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hrs`;
};

export const formatDistanceTime = (distanceKm) => {
  const distStr = formatDistance(distanceKm);
  const timeStr = estimateTravelTime(distanceKm);
  return `${distStr} (~${timeStr})`;
};