import { useState, useEffect, useCallback } from 'react';
import { getMandiPricesAndNetReturn, getHistoricalPriceTrends } from '../services/priceService';

export const usePrices = ({
  cropId = 'onion',
  cropName = '',
  variety = '',
  quantity = 10,
  mandis = [],
  vehicleRate = 14,
  baseLoadingFee = 300,
  state = 'Maharashtra',
  district = 'Nashik',
  farmerCoords = null
}) => {
  const [rankedResults, setRankedResults] = useState([]);
  const [bestResult, setBestResult] = useState(null);
  const [closestResult, setClosestResult] = useState(null);
  const [summary, setSummary] = useState(null);
  const [bestRecommendation, setBestRecommendation] = useState(null);
  const [dataSource, setDataSource] = useState('Agmarknet / data.gov.in');
  const [isFallback, setIsFallback] = useState(false);
  const [historicalTrends, setHistoricalTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculatePrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMandiPricesAndNetReturn({
        cropId,
        cropName,
        variety,
        quantity,
        mandis,
        vehicleRate,
        baseLoadingFee,
        state,
        district,
        farmerLat: farmerCoords?.lat,
        farmerLng: farmerCoords?.lng
      });

      if (res) {
        setRankedResults(res.rankedResults || []);
        setBestResult(res.bestResult || null);
        setClosestResult(res.closestResult || null);
        setSummary(res.summary || null);
        setBestRecommendation(res.bestRecommendation || null);
        setDataSource(res.source || 'Agmarknet / data.gov.in');
        setIsFallback(res.isFallback ?? false);

        if (res.bestResult) {
          const trends = await getHistoricalPriceTrends(cropId, res.bestResult.id || res.bestResult.mandi?.id || 'mandi-1');
          setHistoricalTrends(trends || []);
        }
      }
    } catch (err) {
      console.error('Error in usePrices calculatePrices:', err);
      setError(err.message || 'Error computing mandi prices');
    } finally {
      setLoading(false);
    }
  }, [cropId, cropName, variety, quantity, mandis, vehicleRate, baseLoadingFee, state, district, farmerCoords]);

  useEffect(() => {
    calculatePrices();
  }, [calculatePrices]);

  return {
    rankedResults,
    bestResult,
    closestResult,
    summary,
    bestRecommendation,
    dataSource,
    isFallback,
    historicalTrends,
    loading,
    error,
    recalculate: calculatePrices
  };
};

export default usePrices;