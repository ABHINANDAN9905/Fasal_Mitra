import { STATES_AND_DISTRICTS } from '../constants/location';

export const findDistrictCoordinates = (state, district) => {
  const stateRecord = STATES_AND_DISTRICTS.find(
    (item) => item.state.toLowerCase() === state?.toLowerCase()
  );
  const districtRecord = stateRecord?.districts.find(
    (item) => item.name.toLowerCase() === district?.toLowerCase()
  );

  if (districtRecord) {
    return { lat: districtRecord.lat, lng: districtRecord.lng };
  }

  const firstDistrict = stateRecord?.districts[0] || STATES_AND_DISTRICTS[0].districts[0];
  return { lat: firstDistrict.lat, lng: firstDistrict.lng };
};

/**
 * Get farmer GPS coordinates using browser Geolocation API.
 */
export const getFarmerCoordinatesFromBrowser = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let msg = 'Could not fetch GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Reverse geocode coordinates to find the closest State and District.
 */
export const reverseGeocodeCoords = async (lat, lng) => {
  let closestDistrict = null;
  let closestState = null;
  let minDistance = Infinity;

  for (const stateObj of STATES_AND_DISTRICTS) {
    for (const dist of stateObj.districts) {
      const dLat = (dist.lat - lat) * (Math.PI / 180);
      const dLng = (dist.lng - lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * (Math.PI / 180)) *
          Math.cos(dist.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = 6371 * c;

      if (distKm < minDistance) {
        minDistance = distKm;
        closestDistrict = dist;
        closestState = stateObj;
      }
    }
  }

  return {
    state: closestState ? closestState.state : STATES_AND_DISTRICTS[0].state,
    district: closestDistrict ? closestDistrict.name : STATES_AND_DISTRICTS[0].districts[0].name,
    village: closestDistrict ? closestDistrict.hub : '',
    pincode: closestDistrict ? closestDistrict.defaultPincode : ''
  };
};

/**
 * Get comprehensive agricultural details for a state & district.
 */
export const getDistrictDetails = (state, district) => {
  if (!state || !district) return null;

  const stateRecord = STATES_AND_DISTRICTS.find(
    (item) => item.state.toLowerCase() === state.toLowerCase()
  );
  if (!stateRecord) return null;

  const districtRecord = stateRecord.districts.find(
    (item) => item.name.toLowerCase() === district.toLowerCase()
  );
  if (!districtRecord) return null;

  return {
    stateName: stateRecord.state,
    districtName: districtRecord.name,
    defaultPincode: districtRecord.defaultPincode,
    hub: districtRecord.hub,
    topCrop: districtRecord.topCrop,
    soilType: districtRecord.soilType,
    mandisCount: districtRecord.mandisCount,
    enamLinkedPercent: stateRecord.enamLinkedPercent,
    agroZone: stateRecord.agroZone,
    majorCrops: stateRecord.majorCrops
  };
};

/**
 * Get all districts for a given state.
 */
export const getDistrictsByState = (state) => {
  if (!state) return [];
  const stateRecord = STATES_AND_DISTRICTS.find(
    (item) => item.state.toLowerCase() === state.toLowerCase()
  );
  return stateRecord ? stateRecord.districts : [];
};

/**
 * Get all available states.
 */
export const getAllStates = () => {
  return STATES_AND_DISTRICTS;
};

