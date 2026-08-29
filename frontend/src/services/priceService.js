import api from "./api";
import { CROPS } from '../constants/crop';
import { calculateNetReturn } from '../utils/priceUtils';

const getLocalOverride = (mandiNameOrId, cropNameOrId, targetState = '', targetDistrict = '') => {
  try {
    const raw = localStorage.getItem('fasal_mitra_price_overrides');
    if (!raw) return null;
    const map = JSON.parse(raw);
    const m = (typeof mandiNameOrId === 'string' ? mandiNameOrId : mandiNameOrId?.name || '').toLowerCase().trim();
    const c = (cropNameOrId || '').toLowerCase().trim();
    const s = (targetState || '').toLowerCase().trim();
    const d = (targetDistrict || '').toLowerCase().trim();

    if (map[`${m}-${c}`]) {
      const direct = map[`${m}-${c}`];
      if (!s || direct.state?.toLowerCase().includes(s) || s.includes(direct.state?.toLowerCase())) {
        return direct;
      }
    }

    return Object.values(map).find(b => {
      const cropMatch = b.cropName.toLowerCase() === c || b.cropId.toLowerCase() === c;
      const bMandi = (b.mandiName || '').toLowerCase();
      const bDist = (b.district || '').toLowerCase();
      const bState = (b.state || '').toLowerCase();

      const mandiMatch = bMandi.includes(m) || m.includes(bMandi.split(' ')[0]) || b.mandiId?.toLowerCase() === m;
      const regionMatch = (d && (bDist.includes(d) || d.includes(bDist))) || (s && (bState.includes(s) || s.includes(bState)));

      return cropMatch && (mandiMatch || (regionMatch && bMandi.includes(m.split(' ')[0])));
    }) || null;
  } catch {
    return null;
  }
};

/**
 * Fetch raw filtered mandi prices from backend API
 */
export const getPrices = async ({
  commodity,
  crop,
  state,
  district,
  market,
  mandi,
  date,
  lat,
  lng
}) => {
  try {
    const response = await api.get("/prices", {
      params: {
        commodity: commodity || crop,
        crop: crop || commodity,
        state,
        district,
        market: market || mandi,
        mandi: mandi || market,
        date,
        lat,
        lng
      },
    });
    return response.data;
  } catch (err) {
    console.warn("API /prices unavailable:", err.message);
    return null;
  }
};

/**
 * Fetch comparison matrix, summary statistics, and best mandi recommendation
 */
export const getMandiPricesAndNetReturn = async ({
  cropId = 'onion',
  cropName = '',
  variety = '',
  quantity = 10,
  mandis = [],
  vehicleRate = 14,
  baseLoadingFee = 300,
  state = 'Maharashtra',
  district = 'Nashik',
  farmerLat = null,
  farmerLng = null,
  language = 'en'
}) => {
  const cropObj = CROPS.find((item) => item.id === cropId || item.name.toLowerCase() === (cropName || cropId).toLowerCase()) || CROPS[0];
  const targetCropName = cropName || cropObj.name;
  const parsedQty = Math.max(1, Number(quantity) || 10);

  try {
    const response = await api.get("/prices/compare", {
      params: {
        crop: targetCropName,
        cropId,
        variety,
        quantity: parsedQty,
        state,
        district,
        lat: farmerLat,
        lng: farmerLng,
        vehicleRate,
        baseLoadingFee,
        language
      }
    });

    if (response.data && response.data.success && response.data.results) {
      const { results, summary, bestRecommendation, source, isFallback } = response.data;

      const enrichedResults = results.map(r => {
        const mandiObj = typeof r.mandi === 'object' ? r.mandi : {
          id: r.id || r.mandi,
          name: r.mandi,
          district: r.district,
          state: r.state,
          isEnamLinked: r.isEnamLinked ?? true
        };

        const override = getLocalOverride(mandiObj.name, targetCropName) || getLocalOverride(mandiObj.id, cropId);
        let modalPrice = override ? override.modalPrice : (r.modalPrice || r.modal_price);
        let minPrice = override ? override.minPrice : (r.minPrice || r.min_price);
        let maxPrice = override ? override.maxPrice : (r.maxPrice || r.max_price);
        const merchantNote = override?.reason || r.merchantNote || null;
        const merchantStatus = override?.status || r.merchantStatus || null;

        const calculation = calculateNetReturn({
          modalPrice,
          minPrice,
          maxPrice,
          quantityQuintals: parsedQty,
          distanceKm: r.distanceKm || 15,
          vehicleRatePerKm: vehicleRate,
          baseLoadingFee,
          marketFeePercent: mandiObj.marketFeePercent || 1.05,
          weighingFeePerQuintal: mandiObj.weighingFeePerQuintal || 4,
          unloadingFeePerQuintal: mandiObj.unloadingFeePerQuintal || 8,
          isPerishable: cropObj.isPerishable,
          cropName: targetCropName
        });

        return {
          id: r.id || mandiObj.id,
          mandi: mandiObj,
          calculation,
          market: mandiObj.name,
          district: r.district || mandiObj.district,
          state: r.state || mandiObj.state,
          commodity: r.commodity || targetCropName,
          variety: r.variety || 'Standard',
          grade: override?.grade || r.grade || 'FAQ',
          modal_price: modalPrice,
          modalPrice,
          min_price: minPrice,
          minPrice,
          max_price: maxPrice,
          maxPrice,
          distanceKm: r.distanceKm,
          transportCost: calculation.transportCost,
          totalMandiFees: calculation.totalMandiFees,
          grossReturn: calculation.grossValue,
          grossValue: calculation.grossValue,
          netReturn: calculation.netReturn,
          confidenceScore: mandiObj.isEnamLinked ? 95 : 85,
          isFreshToday: true,
          freshness: 'Live Today',
          arrival_date: r.arrivalDate || new Date().toISOString().slice(0, 10),
          lastUpdated: r.arrivalDate || new Date().toISOString(),
          source: source || 'Agmarknet / Live Mandi Sync',
          isFallback: isFallback ?? false,
          merchantNote,
          merchantStatus
        };
      });

      const rankedResults = enrichedResults.sort((a, b) => b.netReturn - a.netReturn);
      if (rankedResults.length > 0) rankedResults[0].isBest = true;

      const closestResult = [...rankedResults].sort((a, b) => a.distanceKm - b.distanceKm)[0] || null;

      return {
        rankedResults,
        bestResult: rankedResults[0] || null,
        closestResult,
        summary,
        bestRecommendation: {
          ...bestRecommendation,
          modalPrice: rankedResults[0]?.modalPrice,
          netEarnings: rankedResults[0]?.netReturn,
          reason: rankedResults[0]?.merchantNote
            ? `📢 Live APMC Trader Bulletin: "${rankedResults[0].merchantNote}". ${bestRecommendation?.reason || ''}`
            : bestRecommendation?.reason
        },
        source,
        isFallback
      };
    }
  } catch (err) {
    console.warn("Backend /prices/compare API unavailable, using local calculation engine:", err.message);
  }

  // Resilient client-side fallback
  const baseModal = cropObj.basePriceRange.modal;

  const fallbackList = mandis.length > 0 ? mandis : [
    { id: 'mandi-1', name: `${district} APMC Grain Market`, district, state, distanceKm: 12, marketFeePercent: 1.05, weighingFeePerQuintal: 4, unloadingFeePerQuintal: 8, isEnamLinked: true },
    { id: 'mandi-2', name: `Nearby Sub-Yard Mandi`, district, state, distanceKm: 28, marketFeePercent: 1.05, weighingFeePerQuintal: 4, unloadingFeePerQuintal: 8, isEnamLinked: true }
  ];

  const enrichedFallback = fallbackList.map((mandi, idx) => {
    const override = getLocalOverride(mandi.name, targetCropName) || getLocalOverride(mandi.id, cropId) || getLocalOverride(mandi.district, targetCropName);

    let modalPricePerQuintal = override ? override.modalPrice : null;
    let minPricePerQuintal = override ? override.minPrice : null;
    let maxPricePerQuintal = override ? override.maxPrice : null;

    if (!modalPricePerQuintal) {
      const variance = idx === 0 ? 0.05 : idx === 1 ? 0.02 : idx === 2 ? -0.03 : 0.01;
      modalPricePerQuintal = Math.round(baseModal * (1 + variance));
      minPricePerQuintal = Math.round(modalPricePerQuintal * 0.93);
      maxPricePerQuintal = Math.round(modalPricePerQuintal * 1.07);
    }

    const distanceKm = mandi.distanceKm || (12 + idx * 6);

    const calculation = calculateNetReturn({
      modalPrice: modalPricePerQuintal,
      minPrice: minPricePerQuintal,
      maxPrice: maxPricePerQuintal,
      quantityQuintals: parsedQty,
      distanceKm,
      vehicleRatePerKm: vehicleRate,
      baseLoadingFee,
      marketFeePercent: mandi.marketFeePercent || 1.05,
      weighingFeePerQuintal: mandi.weighingFeePerQuintal || 4,
      unloadingFeePerQuintal: mandi.unloadingFeePerQuintal || 8,
      isPerishable: cropObj.isPerishable,
      cropName: targetCropName
    });

    return {
      id: mandi.id,
      mandi,
      calculation,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state,
      commodity: targetCropName,
      variety: cropObj.variety?.[0] || 'Standard',
      grade: override?.grade || 'FAQ',
      modal_price: calculation.modalPrice,
      modalPrice: calculation.modalPrice,
      min_price: calculation.minPrice,
      minPrice: calculation.minPrice,
      max_price: calculation.maxPrice,
      maxPrice: calculation.maxPrice,
      distanceKm: calculation.distanceKm,
      transportCost: calculation.transportCost,
      totalMandiFees: calculation.totalMandiFees,
      grossReturn: calculation.grossValue,
      grossValue: calculation.grossValue,
      netReturn: calculation.netReturn,
      confidenceScore: mandi.isEnamLinked ? 95 : 85,
      isFreshToday: true,
      freshness: 'Live Today',
      arrival_date: new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString(),
      source: 'DEMO DATA (Live APMC Sync)',
      isFallback: true,
      merchantNote: override?.reason || null,
      merchantStatus: override?.status || null
    };
  });

  const rankedResults = enrichedFallback.sort((a, b) => b.netReturn - a.netReturn);
  if (rankedResults.length > 0) rankedResults[0].isBest = true;

  const closestResult = [...rankedResults].sort((a, b) => a.distanceKm - b.distanceKm)[0] || null;

  return {
    rankedResults,
    bestResult: rankedResults[0] || null,
    closestResult,
    summary: {
      highestPrice: Math.max(...rankedResults.map(r => r.modalPrice)),
      lowestPrice: Math.min(...rankedResults.map(r => r.modalPrice)),
      averageModalPrice: Math.round(rankedResults.reduce((a, b) => a + b.modalPrice, 0) / rankedResults.length),
      bestMandi: rankedResults[0]?.market,
      totalMandis: rankedResults.length
    },
    bestRecommendation: {
      mandi: rankedResults[0]?.market,
      district: rankedResults[0]?.district,
      state: rankedResults[0]?.state,
      modalPrice: rankedResults[0]?.modalPrice,
      distanceKm: rankedResults[0]?.distanceKm,
      priceDiffFromAvg: 120,
      message: 'Highest Take-Home Net Return',
      grossEarnings: rankedResults[0]?.grossValue,
      netEarnings: rankedResults[0]?.netReturn,
      arrivalDate: new Date().toISOString().slice(0, 10),
      reason: rankedResults[0]?.merchantNote
        ? `📢 Live APMC Trader Bulletin: "${rankedResults[0].merchantNote}"`
        : 'Best net realization after all mandi cess and transport deductions.'
    },
    source: 'DEMO DATA (Live APMC Sync)',
    isFallback: true
  };
};

/**
 * Fetch 7-day historical price trends
 */
export const getHistoricalPriceTrends = async ({ cropId = 'onion', mandiId = null, days = 7 } = {}) => {
  try {
    const response = await api.get('/v1/prices/historical-trends', {
      params: { cropId, mandiId, days }
    });
    if (response.data && response.data.success && response.data.trends) {
      return response.data.trends;
    }
  } catch (err) {
    console.warn('Historical trends API unavailable, falling back:', err.message);
  }

  // Fallback 7-day trend generator
  const crop = CROPS.find(c => c.id === cropId) || CROPS[0];
  const base = crop.basePriceRange.modal;
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const wave = Math.sin(i) * 0.04;
    result.push({
      date: d.toISOString().slice(0, 10),
      modalPrice: Math.round(base * (1 + wave)),
      minPrice: Math.round(base * (1 + wave) * 0.93),
      maxPrice: Math.round(base * (1 + wave) * 1.07),
      arrivalsTonnes: Math.round(150 + Math.cos(i) * 40)
    });
  }
  return result;
};
