/**
 * Parses numeric price values cleanly, handling string formats, commas, and invalid values
 */
export const parsePrice = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const cleaned = String(value).replace(/,/g, '').replace(/[^0-9.]/g, '').trim();
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? Math.round(num) : null;
};

/**
 * Standardizes arrival date string into standard ISO YYYY-MM-DD format
 * Supports DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, and timestamp strings
 */
export const normalizeDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();

  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Match YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (ymdMatch) {
    const [, year, month, day] = ymdMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return trimmed;
};

/**
 * Normalizes commodity names to handle common synonyms and variations
 */
export const normalizeCommodityName = (name) => {
  if (!name || typeof name !== 'string') return 'Unknown';
  const clean = name.trim();
  const lower = clean.toLowerCase();

  if (lower.includes('wheat') || lower.includes('gehu')) return 'Wheat';
  if (lower.includes('onion') || lower.includes('pyaj') || lower.includes('kanda')) return 'Onion';
  if (lower.includes('tomato') || lower.includes('tamatar')) return 'Tomato';
  if (lower.includes('soyabean') || lower.includes('soybean')) return 'Soybean';
  if (lower.includes('potato') || lower.includes('batata') || lower.includes('aloo')) return 'Potato';
  if (lower.includes('cotton') || lower.includes('kapas')) return 'Cotton';
  if (lower.includes('garlic') || lower.includes('lahsun') || lower.includes('lasun')) return 'Garlic';
  if (lower.includes('chilli') || lower.includes('chili') || lower.includes('mirchi')) return 'Chilli';
  if (lower.includes('mustard') || lower.includes('sarson')) return 'Mustard';
  if (lower.includes('paddy') || lower.includes('rice') || lower.includes('dhan')) return 'Paddy';

  // Capitalize words
  return clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Normalizes raw government records into the standardized application schema:
 * {
 *   state,
 *   district,
 *   mandi,
 *   commodity,
 *   variety,
 *   grade,
 *   arrivalDate,
 *   minPrice,
 *   maxPrice,
 *   modalPrice
 * }
 */
export const normalizePrices = (records = []) => {
  if (!Array.isArray(records)) return [];

  const seen = new Set();
  const normalizedList = [];

  for (const record of records) {
    if (!record || typeof record !== 'object') continue;

    // 1. Extract and normalize location & market identifiers
    const state = String(record.state || record.State || '').trim();
    const district = String(record.district || record.District || '').trim();
    const rawMandi = String(record.market || record.Market || record.mandi || record.Mandi || '').trim();
    if (!rawMandi) continue;

    // Clean mandi display name
    const mandi = rawMandi
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    // 2. Extract and normalize commodity & variety
    const rawCommodity = record.commodity || record.Commodity || '';
    const commodity = normalizeCommodityName(rawCommodity);
    const variety = String(record.variety || record.Variety || 'Other').trim() || 'Other';
    const grade = String(record.grade || record.Grade || 'FAQ').trim() || 'FAQ';

    // 3. Extract and parse prices
    let minPrice = parsePrice(record.min_price ?? record.minPrice ?? record.Min_Price);
    let maxPrice = parsePrice(record.max_price ?? record.maxPrice ?? record.Max_Price);
    let modalPrice = parsePrice(record.modal_price ?? record.modalPrice ?? record.Modal_Price);

    // If modalPrice is missing, deduce from min/max; if min/max missing, deduce from modal
    if (modalPrice === null && minPrice !== null && maxPrice !== null) {
      modalPrice = Math.round((minPrice + maxPrice) / 2);
    }
    if (modalPrice === null) continue; // modalPrice is strictly required as the primary price

    if (minPrice === null) minPrice = Math.round(modalPrice * 0.95);
    if (maxPrice === null) maxPrice = Math.round(modalPrice * 1.05);

    // Ensure minPrice <= modalPrice <= maxPrice consistency
    if (minPrice > maxPrice) {
      const temp = minPrice;
      minPrice = maxPrice;
      maxPrice = temp;
    }
    if (modalPrice < minPrice) minPrice = modalPrice;
    if (modalPrice > maxPrice) maxPrice = modalPrice;

    // 4. Extract and normalize date
    const rawDate = record.arrival_date ?? record.arrivalDate ?? record.Arrival_Date ?? record.date ?? '';
    const arrivalDate = normalizeDate(rawDate) || new Date().toISOString().slice(0, 10);

    // 5. Deduplicate records
    const dedupeKey = `${state.toLowerCase()}-${district.toLowerCase()}-${mandi.toLowerCase()}-${commodity.toLowerCase()}-${variety.toLowerCase()}-${arrivalDate}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    normalizedList.push({
      state: state || 'Not specified',
      district: district || 'Not specified',
      mandi,
      market: mandi, // backward-compatible alias
      commodity,
      variety,
      grade,
      arrivalDate,
      date: arrivalDate, // backward-compatible alias
      minPrice,
      maxPrice,
      modalPrice,
      // Field aliases for components expecting snake_case or specific names
      min_price: minPrice,
      max_price: maxPrice,
      modal_price: modalPrice,
      arrival_date: arrivalDate
    });
  }

  // Sort by modalPrice descending by default
  return normalizedList.sort((a, b) => b.modalPrice - a.modalPrice);
};
