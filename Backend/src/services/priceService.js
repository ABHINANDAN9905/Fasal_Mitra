import { fetchAgmarknetPrices } from './agmarknetService.js';
import { normalizePrices, normalizeCommodityName } from '../utils/priceNormalizer.js';
import { ALL_MANDIS } from '../data/mandisData.js';
import { CROPS } from '../data/cropsData.js';
import { STATES_AND_DISTRICTS } from '../data/locationData.js';
import { calculateDistanceKm } from './mandiService.js';
import { calculateNetReturn, buildRecommendationExplanation } from './netReturnService.js';
import { getMerchantPriceOverride } from './merchantService.js';

/**
 * Finds matching geographic profile for a given mandi from the master location dataset
 */
const matchMandiGeo = (mandiName, district, state) => {
  const normMandi = (mandiName || '').toLowerCase().trim();
  const normDist = (district || '').toLowerCase().trim();
  const normState = (state || '').toLowerCase().trim();

  return ALL_MANDIS.find(m => {
    const mName = m.name.toLowerCase();
    const nameMatch = mName.includes(normMandi) || normMandi.includes(mName.split(' ')[0]);
    const distMatch = !normDist || m.district.toLowerCase() === normDist;
    const stateMatch = !normState || m.state.toLowerCase() === normState;
    return nameMatch || (distMatch && stateMatch);
  }) || null;
};

/**
 * Finds district center coordinates from location master data
 */
const findDistrictCenter = (state, district) => {
  if (!state) return null;
  const stateObj = STATES_AND_DISTRICTS.find(s => s.state.toLowerCase() === state.toLowerCase());
  if (!stateObj) return null;
  const distObj = district ? stateObj.districts.find(d => d.name.toLowerCase() === district.toLowerCase()) : stateObj.districts[0];
  return distObj ? { lat: distObj.lat, lng: distObj.lng } : null;
};

/**
 * Fetches filtered mandi prices from Agmarknet
 */
export async function getPrices(filters = {}) {
  const { commodity, crop, state, district, market, mandi, date, lat, lng } = filters;
  const targetCommodity = commodity || crop || 'Wheat';
  const targetMarket = market || mandi;

  const result = await fetchAgmarknetPrices({
    commodity: targetCommodity,
    state,
    district,
    market: targetMarket,
    date
  });

  const normalized = normalizePrices(result.records);

  // If live data was returned, attach distance calculations and merchant updates
  const farmerLat = lat ? Number(lat) : null;
  const farmerLng = lng ? Number(lng) : null;

  const enriched = normalized.map((item) => {
    const geo = matchMandiGeo(item.mandi, item.district, item.state);
    let distanceKm = 15;

    if (farmerLat && farmerLng && geo?.lat && geo?.lng) {
      distanceKm = calculateDistanceKm(farmerLat, farmerLng, geo.lat, geo.lng);
    }

    const merchantOverride = getMerchantPriceOverride(item.mandi, item.commodity) || (geo ? getMerchantPriceOverride(geo.id, item.commodity) : null);
    const modalPrice = merchantOverride ? merchantOverride.modalPrice : item.modalPrice;
    const minPrice = merchantOverride ? merchantOverride.minPrice : item.minPrice;
    const maxPrice = merchantOverride ? merchantOverride.maxPrice : item.maxPrice;

    return {
      ...item,
      modalPrice,
      minPrice,
      maxPrice,
      modal_price: modalPrice,
      min_price: minPrice,
      max_price: maxPrice,
      distanceKm,
      lat: geo?.lat || null,
      lng: geo?.lng || null,
      isEnamLinked: geo?.isEnamLinked ?? true,
      merchantNote: merchantOverride?.reason || null,
      merchantStatus: merchantOverride?.status || null
    };
  });

  const latestDate = enriched.map(i => i.arrivalDate).filter(Boolean).sort().at(-1) || date || new Date().toISOString().slice(0, 10);

  return {
    success: true,
    crop: targetCommodity,
    source: result.source,
    isFallback: result.isFallback,
    date: latestDate,
    total: enriched.length,
    data: enriched
  };
}

/**
 * Compares latest available mandi prices for a given crop and location,
 * calculates summary metrics and produces the Best Mandi Recommendation.
 */
export async function comparePrices(filters = {}) {
  const {
    crop = 'Wheat',
    commodity,
    cropId,
    state = 'Maharashtra',
    district = 'Nashik',
    farmerLat,
    farmerLng,
    quantity = 10,
    vehicleRate = 14,
    baseLoadingFee = 300,
    language = 'en'
  } = filters;

  const normalizedCropName = normalizeCommodityName(commodity || crop || cropId || 'Wheat');
  const cropObj = CROPS.find(c =>
    c.name.toLowerCase() === normalizedCropName.toLowerCase() ||
    c.id.toLowerCase() === (cropId || normalizedCropName).toLowerCase()
  ) || CROPS[0];

  const parsedQty = Math.max(1, Number(quantity) || 10);
  const parsedRate = Number(vehicleRate) || 14;
  const parsedLoading = Number(baseLoadingFee) || 300;

  // 1. Fetch live government data
  const agmarknetResult = await fetchAgmarknetPrices({
    commodity: normalizedCropName,
    state,
    district
  });

  let normalizedRecords = normalizePrices(agmarknetResult.records);

  // Farmer reference coordinates (GPS or district center)
  let originLat = farmerLat ? Number(farmerLat) : null;
  let originLng = farmerLng ? Number(farmerLng) : null;

  if (!originLat || !originLng) {
    const center = findDistrictCenter(state, district);
    if (center) {
      originLat = center.lat;
      originLng = center.lng;
    }
  }

  let results = [];
  let isFallback = agmarknetResult.isFallback;
  let source = agmarknetResult.source;

  // 2. If government API returned data for this crop and region
  if (normalizedRecords.length > 0) {
    results = normalizedRecords.map((item, index) => {
      const geo = matchMandiGeo(item.mandi, item.district, item.state);
      const mandiId = geo?.id || `mandi-${index + 1}`;
      const distanceKm = (originLat && originLng && geo?.lat && geo?.lng)
        ? calculateDistanceKm(originLat, originLng, geo.lat, geo.lng)
        : (geo?.defaultDistance || 15 + index * 4);

      // Check for live merchant price bulletin override
      const merchantOverride = getMerchantPriceOverride(item.mandi, item.commodity) || getMerchantPriceOverride(mandiId, item.commodity);
      const modalPrice = merchantOverride ? merchantOverride.modalPrice : item.modalPrice;
      const minPrice = merchantOverride ? merchantOverride.minPrice : item.minPrice;
      const maxPrice = merchantOverride ? merchantOverride.maxPrice : item.maxPrice;

      const calculation = calculateNetReturn({
        modalPrice,
        minPrice,
        maxPrice,
        quantityQuintals: parsedQty,
        distanceKm,
        vehicleRatePerKm: parsedRate,
        baseLoadingFee: parsedLoading,
        marketFeePercent: geo?.marketFeePercent || 1.05,
        weighingFeePerQuintal: geo?.weighingFeePerQuintal || 4,
        unloadingFeePerQuintal: geo?.unloadingFeePerQuintal || 8,
        isPerishable: cropObj.isPerishable,
        cropName: cropObj.name
      });

      return {
        id: mandiId,
        mandi: item.mandi,
        market: item.mandi,
        district: item.district || district,
        state: item.state || state,
        commodity: item.commodity || normalizedCropName,
        variety: item.variety || 'Standard',
        grade: merchantOverride?.grade || item.grade || 'FAQ',
        arrivalDate: item.arrivalDate,
        arrival_date: item.arrivalDate,
        date: item.arrivalDate,
        minPrice,
        maxPrice,
        modalPrice,
        min_price: minPrice,
        max_price: maxPrice,
        modal_price: modalPrice,
        distanceKm,
        grossValue: calculation.grossValue,
        transportCost: calculation.transportCost,
        totalMandiFees: calculation.totalMandiFees,
        netReturn: calculation.netReturn,
        calculation,
        isEnamLinked: geo?.isEnamLinked ?? true,
        isFreshToday: item.arrivalDate === new Date().toISOString().slice(0, 10),
        merchantNote: merchantOverride?.reason || null,
        merchantStatus: merchantOverride?.status || null
      };
    });
  } else {
    // 3. Resilient Offline Demo Fallback Cluster (when no API key or government API has 0 records)
    isFallback = true;
    source = 'DEMO DATA (Offline Fallback)';

    const relevantMandis = ALL_MANDIS.filter(m => {
      const stateMatch = !state || m.state.toLowerCase() === state.toLowerCase();
      const distMatch = !district || m.district.toLowerCase() === district.toLowerCase();
      return stateMatch && (distMatch || m.primaryCommodities?.includes(cropObj.id));
    });

    const fallbackMandis = relevantMandis.length > 0
      ? relevantMandis
      : ALL_MANDIS.filter(m => m.primaryCommodities?.includes(cropObj.id)).slice(0, 5);

    const baseModal = cropObj.basePriceRange.modal;

    results = fallbackMandis.map((mandi, idx) => {
      // Check for live merchant price bulletin override
      const merchantOverride = getMerchantPriceOverride(mandi.name, cropObj.name) || getMerchantPriceOverride(mandi.id, cropObj.id);

      let modalPrice = merchantOverride ? merchantOverride.modalPrice : null;
      let minPrice = merchantOverride ? merchantOverride.minPrice : null;
      let maxPrice = merchantOverride ? merchantOverride.maxPrice : null;

      if (modalPrice === null) {
        const variance = (idx === 0 ? 0.05 : idx === 1 ? 0.02 : idx === 2 ? -0.03 : 0.01);
        modalPrice = Math.round(baseModal * (1 + variance));
        minPrice = Math.round(modalPrice * 0.93);
        maxPrice = Math.round(modalPrice * 1.07);
      }

      const distanceKm = (originLat && originLng)
        ? calculateDistanceKm(originLat, originLng, mandi.lat, mandi.lng)
        : (12 + idx * 6);

      const calculation = calculateNetReturn({
        modalPrice,
        minPrice,
        maxPrice,
        quantityQuintals: parsedQty,
        distanceKm,
        vehicleRatePerKm: parsedRate,
        baseLoadingFee: parsedLoading,
        marketFeePercent: mandi.marketFeePercent || 1.05,
        weighingFeePerQuintal: mandi.weighingFeePerQuintal || 4,
        unloadingFeePerQuintal: mandi.unloadingFeePerQuintal || 8,
        isPerishable: cropObj.isPerishable,
        cropName: cropObj.name
      });

      return {
        id: mandi.id,
        mandi: mandi.name,
        market: mandi.name,
        district: mandi.district,
        state: mandi.state,
        commodity: cropObj.name,
        variety: cropObj.variety?.[0] || 'Standard',
        grade: merchantOverride?.grade || 'FAQ',
        arrivalDate: new Date().toISOString().slice(0, 10),
        arrival_date: new Date().toISOString().slice(0, 10),
        date: new Date().toISOString().slice(0, 10),
        minPrice,
        maxPrice,
        modalPrice,
        min_price: minPrice,
        max_price: maxPrice,
        modal_price: modalPrice,
        distanceKm,
        grossValue: calculation.grossValue,
        transportCost: calculation.transportCost,
        totalMandiFees: calculation.totalMandiFees,
        netReturn: calculation.netReturn,
        calculation,
        isEnamLinked: mandi.isEnamLinked,
        isFreshToday: true,
        merchantNote: merchantOverride?.reason || null,
        merchantStatus: merchantOverride?.status || null
      };
    });
  }

  // 4. Rank mandis: Primary factor: Net Return (balancing Modal Price & Transport Distance)
  const rankedResults = results.sort((a, b) => b.netReturn - a.netReturn);

  // Mark the best mandi
  if (rankedResults.length > 0) {
    rankedResults[0].isBest = true;
  }

  // 5. Compute summary metrics
  const modalPrices = rankedResults.map(r => r.modalPrice);
  const highestPrice = modalPrices.length > 0 ? Math.max(...modalPrices) : 0;
  const lowestPrice = modalPrices.length > 0 ? Math.min(...modalPrices) : 0;
  const averageModalPrice = modalPrices.length > 0
    ? Math.round(modalPrices.reduce((acc, p) => acc + p, 0) / modalPrices.length)
    : 0;

  const bestResult = rankedResults[0] || null;
  const closestResult = [...rankedResults].sort((a, b) => a.distanceKm - b.distanceKm)[0] || null;

  // 6. Build Best Mandi Recommendation
  let bestRecommendation = null;
  if (bestResult) {
    const diffFromAvg = bestResult.modalPrice - averageModalPrice;
    const explanation = buildRecommendationExplanation(
      { mandi: { name: bestResult.mandi, id: bestResult.id }, calculation: bestResult.calculation },
      closestResult ? { mandi: { name: closestResult.mandi, id: closestResult.id }, calculation: closestResult.calculation } : null,
      cropObj,
      language
    );

    bestRecommendation = {
      mandi: bestResult.mandi,
      district: bestResult.district,
      state: bestResult.state,
      modalPrice: bestResult.modalPrice,
      distanceKm: bestResult.distanceKm,
      priceDiffFromAvg: diffFromAvg,
      message: diffFromAvg >= 0
        ? `₹${diffFromAvg} higher than nearby average`
        : `₹${Math.abs(diffFromAvg)} below nearby average (lowest transport cost)`,
      grossEarnings: bestResult.grossValue,
      netEarnings: bestResult.netReturn,
      arrivalDate: bestResult.arrivalDate,
      reason: bestResult.merchantNote
        ? `${bestResult.merchantNote}. ${explanation}`
        : explanation
    };
  }

  return {
    success: true,
    crop: cropObj.name,
    cropDetails: cropObj,
    source,
    isFallback,
    summary: {
      highestPrice,
      lowestPrice,
      averageModalPrice,
      bestMandi: bestResult?.mandi || 'N/A',
      totalMandis: rankedResults.length,
      quantityQuintals: parsedQty
    },
    bestRecommendation,
    results: rankedResults
  };
}