const numberValue = (value) => {
  const number = Number(String(value ?? '').replace(/,/g, '').trim())
  return Number.isFinite(number) && number >= 0 ? number : null
}

export const normalizePrices = (records = []) => records.map((record) => {
  const minPrice = numberValue(record.min_price ?? record.minPrice)
  const maxPrice = numberValue(record.max_price ?? record.maxPrice)
  const modalPrice = numberValue(record.modal_price ?? record.modalPrice)
  const market = String(record.market ?? '').trim()
  const commodity = String(record.commodity ?? '').trim()
  const date = String(record.arrival_date ?? record.date ?? '').trim()

  if (!market || !commodity || modalPrice === null || minPrice === null || maxPrice === null) return null

  return {
    market,
    commodity,
    variety: String(record.variety ?? 'Not specified').trim() || 'Not specified',
    minPrice,
    maxPrice,
    modalPrice,
    date,
  }
}).filter(Boolean)
