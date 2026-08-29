import axios from 'axios'
import { env } from '../config/env.js'

export async function fetchAgmarknetPrices(filters) {
  if (!env.apiKey) {
    const error = new Error('AGMARKNET_API_KEY is not configured')
    error.code = 'MISSING_API_KEY'
    throw error
  }

  const params = {
    'api-key': env.apiKey,
    format: 'json',
    limit: 100,
    'filters[commodity]': filters.commodity,
    'filters[state]': filters.state,
    'filters[district]': filters.district,
  }
  if (filters.market) params['filters[market]'] = filters.market
  if (filters.date) params['filters[arrival_date]'] = filters.date

  const response = await axios.get(env.apiUrl, { params, timeout: 10000 })
  if (!response.data || !Array.isArray(response.data.records)) {
    const error = new Error('Invalid agriculture API response')
    error.code = 'INVALID_RESPONSE'
    throw error
  }
  return { records: response.data.records, total: response.data.total ?? response.data.records.length }
}
