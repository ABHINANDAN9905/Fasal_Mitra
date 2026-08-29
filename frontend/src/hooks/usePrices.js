import { useState, useEffect, useCallback } from 'react';
import { getMandiPricesAndNetReturn, getHistoricalPriceTrends } from '../services/priceService';

export const usePrices = ({
  cropId = 'onion',
  variety = '',
  quantity = 10,
  mandis = [],
  vehicleRate = 14,
  baseLoadingFee = 300
}) => {
  const [rankedResults, setRankedResults] = useState([]);
  const [bestResult, setBestResult] = useState(null);
  const [closestResult, setClosestResult] = useState(null);
  const [historicalTrends, setHistoricalTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculatePrices = useCallback(async () => {
    if (!mandis || mandis.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getMandiPricesAndNetReturn({
        cropId,
        variety,
        quantity,
        mandis,
        vehicleRate,
        baseLoadingFee
      });
      setRankedResults(res.rankedResults);
      setBestResult(res.bestResult);
      setClosestResult(res.closestResult);

      if (res.bestResult) {
        const trends = await getHistoricalPriceTrends(cropId, res.bestResult.mandi.id);
        setHistoricalTrends(trends);
      }
    } catch (err) {
      setError(err.message || 'Error computing mandi prices');
    } finally {
      setLoading(false);
    }
  }, [cropId, variety, quantity, mandis, vehicleRate, baseLoadingFee]);

  useEffect(() => {
    calculatePrices();
  }, [calculatePrices]);

  return {
    rankedResults,
    bestResult,
    closestResult,
    historicalTrends,
    loading,
    error,
    recalculate: calculatePrices
  };
};