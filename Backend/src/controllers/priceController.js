import { getPrices, comparePrices } from '../services/priceService.js';

/**
 * Health check handler
 * Response: { "success": true, "message": "Fasal Mitra backend is running" }
 */
export async function health(_req, res) {
  return res.json({
    success: true,
    message: 'Fasal Mitra backend is running'
  });
}

/**
 * Standard filtered prices handler
 * GET /api/prices?crop=Wheat&state=Haryana&district=Gurugram
 */
export async function prices(req, res, next) {
  try {
    const { crop, commodity, state, district, market, mandi, date, lat, lng } = req.query;

    const result = await getPrices({
      crop: crop || commodity,
      commodity: commodity || crop,
      state,
      district,
      market: market || mandi,
      mandi: mandi || market,
      date,
      lat,
      lng
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in /api/prices:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to fetch mandi prices right now. Please try again later.'
    });
  }
}

/**
 * Compare Mandi Prices Handler
 * GET /api/prices/compare?crop=Wheat&state=Haryana
 */
export async function comparePricesHandler(req, res, next) {
  try {
    const params = {
      crop: req.query.crop || req.query.commodity || req.body?.crop || req.body?.cropId || 'Wheat',
      commodity: req.query.commodity || req.query.crop || req.body?.commodity || 'Wheat',
      cropId: req.query.cropId || req.body?.cropId,
      state: req.query.state || req.body?.state || 'Maharashtra',
      district: req.query.district || req.body?.district || 'Nashik',
      farmerLat: req.query.lat || req.query.farmerLat || req.body?.farmerLat || req.body?.lat,
      farmerLng: req.query.lng || req.query.farmerLng || req.body?.farmerLng || req.body?.lng,
      quantity: req.query.quantity || req.body?.quantity || 10,
      vehicleRate: req.query.vehicleRate || req.body?.vehicleRate || 14,
      baseLoadingFee: req.query.baseLoadingFee || req.body?.baseLoadingFee || 300,
      language: req.query.language || req.body?.language || 'en'
    };

    const comparison = await comparePrices(params);
    return res.json(comparison);
  } catch (error) {
    console.error('Error in /api/prices/compare:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to compute mandi price comparison right now. Please try again later.'
    });
  }
}
