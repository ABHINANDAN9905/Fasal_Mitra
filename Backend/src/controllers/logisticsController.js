import { getVehiclePresets, calculateTransportQuote } from '../services/logisticsService.js';

export async function getVehicles(req, res, next) {
  try {
    const vehicles = getVehiclePresets();
    return res.json({ success: true, vehicles });
  } catch (error) {
    next(error);
  }
}

export async function getQuote(req, res, next) {
  try {
    const { vehicleId, distanceKm, customRatePerKm } = req.body;
    const quote = calculateTransportQuote({ vehicleId, distanceKm, customRatePerKm });
    return res.json({ success: true, quote });
  } catch (error) {
    next(error);
  }
}
