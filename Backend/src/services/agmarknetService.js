import axios from 'axios';
import { env } from '../config/env.js';

// Standard commodity mapping helper for data.gov.in filter values
const formatFilterValue = (val) => {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  // Capitalize first letter of each word
  return trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Fetches latest mandi price records from Government of India data.gov.in API
 * Resource ID: 9ef84268-d588-465a-a308-a864a43d0070 (Agmarknet daily mandi prices)
 */
export async function fetchAgmarknetPrices(filters = {}) {
  if (!env.apiKey) {
    return {
      success: true,
      records: [],
      total: 0,
      isFallback: true,
      source: 'DEMO DATA (Offline Fallback - Add DATA_GOV_API_KEY in .env for live API)'
    };
  }

  const { commodity, state, district, market, date, limit = 500 } = filters;

  const params = {
    'api-key': env.apiKey,
    format: 'json',
    limit: Math.min(Number(limit) || 500, 1000)
  };

  if (commodity) params['filters[commodity]'] = formatFilterValue(commodity);
  if (state) params['filters[state]'] = formatFilterValue(state);
  if (district) params['filters[district]'] = formatFilterValue(district);
  if (market) params['filters[market]'] = formatFilterValue(market);
  if (date) params['filters[arrival_date]'] = date;

  try {
    const response = await axios.get(env.apiUrl, {
      params,
      timeout: 10000,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data.records)) {
      // If specific district filter yielded 0 records, retry with broader state filter to catch alternate district names
      if (response.data.records.length === 0 && district && state && commodity) {
        try {
          const broaderParams = {
            'api-key': env.apiKey,
            format: 'json',
            limit: 500,
            'filters[commodity]': formatFilterValue(commodity),
            'filters[state]': formatFilterValue(state)
          };
          const broaderRes = await axios.get(env.apiUrl, { params: broaderParams, timeout: 8000 });
          if (broaderRes.data && Array.isArray(broaderRes.data.records) && broaderRes.data.records.length > 0) {
            return {
              success: true,
              records: broaderRes.data.records,
              total: broaderRes.data.total ?? broaderRes.data.records.length,
              isFallback: false,
              source: 'Agmarknet / data.gov.in'
            };
          }
        } catch (broadErr) {
          // Broad fallback query failed, continue with original empty response
        }
      }

      return {
        success: true,
        records: response.data.records,
        total: response.data.total ?? response.data.records.length,
        isFallback: false,
        source: 'Agmarknet / data.gov.in'
      };
    }

    return {
      success: true,
      records: [],
      total: 0,
      isFallback: true,
      source: 'Agmarknet / data.gov.in'
    };
  } catch (err) {
    const statusCode = err.response?.status;
    console.warn(`[Agmarknet API] Live fetch error (${statusCode || err.code || 'Network'}): ${err.message}`);

    return {
      success: false,
      error: err.message,
      statusCode,
      code: statusCode === 401 || statusCode === 403 ? 'INVALID_API_KEY' : statusCode === 429 ? 'RATE_LIMIT' : 'API_UNAVAILABLE',
      records: [],
      total: 0,
      isFallback: true,
      source: 'Offline Demo Fallback'
    };
  }
}
