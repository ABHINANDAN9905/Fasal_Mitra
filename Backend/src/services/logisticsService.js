import { VEHICLE_PRESETS } from '../data/vehiclesData.js';

export const getVehiclePresets = () => {
  return VEHICLE_PRESETS;
};

export const calculateTransportQuote = ({ vehicleId = 'bolero', distanceKm = 20, customRatePerKm = null }) => {
  const vehicle = VEHICLE_PRESETS.find(v => v.id === vehicleId) || VEHICLE_PRESETS[1];
  const ratePerKm = customRatePerKm ? Number(customRatePerKm) : vehicle.ratePerKm;
  const dist = Math.max(1, Number(distanceKm));

  const totalTransportCost = Math.round(dist * ratePerKm + vehicle.baseLoadingFee);

  return {
    vehicle,
    distanceKm: dist,
    ratePerKm,
    baseLoadingFee: vehicle.baseLoadingFee,
    totalTransportCost,
    costPerQuintalAtFullCapacity: Number((totalTransportCost / vehicle.capacityQuintals).toFixed(1))
  };
};
