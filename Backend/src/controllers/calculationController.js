import { rankMandisByNetReturn, buildRecommendationExplanation } from '../services/netReturnService.js';
import { getHistoricalPriceTrends } from '../services/historicalPriceService.js';
import { getMandisList } from '../services/mandiService.js';
import { CROPS } from '../data/cropsData.js';

export async function calculateNetReturnHandler(req, res, next) {
  try {
    const {
      cropId = 'onion',
      variety = '',
      quantity = 10,
      state = 'Maharashtra',
      district = 'Nashik',
      farmerLat,
      farmerLng,
      vehicleRate = 14,
      baseLoadingFee = 300,
      language = 'en'
    } = req.body;

    const crop = CROPS.find(c => c.id === cropId) || CROPS[0];

    // Fetch relevant mandis with computed distances from farmer coordinates
    const relevantMandis = await getMandisList({
      state,
      district,
      cropId,
      farmerLat,
      farmerLng
    });

    const { rankedResults, bestResult, closestResult } = rankMandisByNetReturn({
      cropId,
      quantity: Number(quantity),
      mandis: relevantMandis,
      vehicleRate: Number(vehicleRate),
      baseLoadingFee: Number(baseLoadingFee)
    });

    // Build vernacular explainable comparison
    const explanation = buildRecommendationExplanation(bestResult, closestResult, crop, language);

    return res.json({
      success: true,
      crop,
      quantity: Number(quantity),
      rankedResults,
      bestResult,
      closestResult,
      explanation
    });
  } catch (error) {
    next(error);
  }
}

export async function getHistoricalTrendsHandler(req, res, next) {
  try {
    const { cropId = 'onion', mandiId = 'lasalgaon-apmc', days = 14 } = req.query;
    const trends = await getHistoricalPriceTrends(cropId, mandiId, Number(days));
    return res.json({
      success: true,
      cropId,
      mandiId,
      trends
    });
  } catch (error) {
    next(error);
  }
}
