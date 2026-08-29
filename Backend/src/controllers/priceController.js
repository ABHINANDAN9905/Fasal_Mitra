import { getPrices } from '../services/priceService.js'

export async function health(_request, response) {
  response.json({ success: true, message: 'GRITECH API is running' })
}

export async function prices(request, response) {
  const { commodity, state, district, market, date } = request.query
  if (!commodity || !state || !district) {
    return response.status(400).json({ success: false, message: 'Crop, state, and district are required.' })
  }

  try {
    const result = await getPrices({ commodity, state, district, market, date })
    if (!result.data.length) {
      return response.json({ success: true, source: 'Agmarknet / data.gov.in', date: date || null, data: [], message: 'No price data found.' })
    }
    const latestDate = result.data.map((item) => item.date).filter(Boolean).sort().at(-1) || date || null
    return response.json({ success: true, source: 'Agmarknet / data.gov.in', date: latestDate, data: result.data })
  } catch (error) {
    const message = error.code === 'MISSING_API_KEY'
      ? 'Agriculture data access is not configured. Add AGMARKNET_API_KEY to Backend/.env.'
      : 'Unable to fetch mandi prices right now.'
    return response.status(error.response?.status === 429 ? 429 : 502).json({ success: false, message })
  }
}
