import { getMandisList, getMandiById } from '../services/mandiService.js';

export async function getMandis(req, res, next) {
  try {
    const { state, district, cropId, lat, lng, radius } = req.query;
    const mandis = await getMandisList({
      state,
      district,
      cropId,
      farmerLat: lat ? Number(lat) : null,
      farmerLng: lng ? Number(lng) : null,
      radiusKm: radius ? Number(radius) : null
    });
    return res.json({ success: true, count: mandis.length, mandis });
  } catch (error) {
    next(error);
  }
}

export async function getMandiDetails(req, res, next) {
  try {
    const { id } = req.params;
    const mandi = await getMandiById(id);
    if (!mandi) {
      return res.status(404).json({ success: false, message: 'APMC Mandi not found' });
    }
    return res.json({ success: true, mandi });
  } catch (error) {
    next(error);
  }
}
