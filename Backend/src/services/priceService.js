import { fetchAgmarknetPrices } from './agmarknetService.js'
import { normalizePrices } from '../utils/priceNormalizer.js'

export async function getPrices(filters) {
  const result = await fetchAgmarknetPrices(filters)
  const data = normalizePrices(result.records)
  return { data, total: result.total }
}