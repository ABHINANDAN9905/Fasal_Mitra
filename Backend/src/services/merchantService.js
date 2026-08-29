import { CROPS } from '../data/cropsData.js';
import { ALL_MANDIS } from '../data/mandisData.js';

// Pre-seeded verified merchant profiles with email, region and 6-digit PIN
const MERCHANTS = [
  {
    id: 'merchant-2',
    name: 'Haryana Grain Merchants & Oilseed Buyers',
    hindiName: 'हरियाणा ग्रेन मर्चेंट्स',
    proprietor: 'Rajesh Gupta',
    email: 'haryana.grains@apmc.in',
    pin: '123456',
    apmcLicense: 'APMC-HR-GGM-2023-4412',
    mandiId: 'gurugram-grain-mandi',
    mandiName: 'Gurugram APMC Grain Market',
    district: 'Gurugram',
    state: 'Haryana',
    region: 'Gurugram, Haryana',
    phone: '9811887766',
    verified: true,
    activeBuyingCrops: ['wheat', 'mustard', 'cotton', 'paddy']
  },
  {
    id: 'merchant-1',
    name: 'Kisan Agro Traders & Commission Agents',
    hindiName: 'किसान एग्रो ट्रेडर्स',
    proprietor: 'Sanjay Deshmukh',
    email: 'kisan.agro@lasalgaon.in',
    pin: '234567',
    apmcLicense: 'APMC-MH-NSK-2024-8841',
    mandiId: 'lasalgaon-apmc',
    mandiName: 'Lasalgaon APMC Market Yard',
    district: 'Nashik',
    state: 'Maharashtra',
    region: 'Nashik, Maharashtra',
    phone: '9822334455',
    verified: true,
    activeBuyingCrops: ['onion', 'tomato', 'soybean', 'garlic']
  },
  {
    id: 'merchant-3',
    name: 'Punjab Royal Foodgrain Corporation',
    hindiName: 'पंजाब रॉयल फूडग्रेन',
    proprietor: 'Harpreet Singh',
    email: 'punjab.royal@khannamandi.in',
    pin: '345678',
    apmcLicense: 'APMC-PB-KHN-2022-1092',
    mandiId: 'khanna-grain-mandi',
    mandiName: 'Khanna Grain Mandi (Asia Largest)',
    district: 'Khanna',
    state: 'Punjab',
    region: 'Khanna, Punjab',
    phone: '9814455667',
    verified: true,
    activeBuyingCrops: ['wheat', 'paddy', 'cotton', 'soybean']
  },
  {
    id: 'merchant-4',
    name: 'Kolar Fresh Tomato & Veg Traders',
    hindiName: 'कोलार फ्रेश टोमैटो ट्रेडर्स',
    proprietor: 'K. Venkatesh Gowda',
    email: 'kolar.tomato@apmc.in',
    pin: '456789',
    apmcLicense: 'APMC-KA-KLR-2024-9120',
    mandiId: 'kolar-apmc-market',
    mandiName: 'Kolar APMC Market Yard',
    district: 'Kolar',
    state: 'Karnataka',
    region: 'Kolar, Karnataka',
    phone: '9845566778',
    verified: true,
    activeBuyingCrops: ['tomato', 'potato', 'chilli', 'onion']
  }
];

// In-memory store for active merchant price bulletins / overrides
const priceBulletins = new Map();

// Helper to normalize keys
const makeKey = (mandiIdOrName, cropIdOrName) => {
  const m = (mandiIdOrName || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  const c = (cropIdOrName || '').toLowerCase().trim();
  return `${m}-${c}`;
};

// Seed initial published merchant bulletins
const initBulletins = () => {
  const initial = [
    {
      id: 'bulletin-1',
      merchantId: 'merchant-2',
      merchantName: 'Haryana Grain Merchants & Oilseed Buyers',
      mandiId: 'gurugram-grain-mandi',
      mandiName: 'Gurugram APMC Grain Market',
      district: 'Gurugram',
      state: 'Haryana',
      cropId: 'wheat',
      cropName: 'Wheat',
      modalPrice: 2650,
      minPrice: 2450,
      maxPrice: 2800,
      arrivalsTonnes: 180,
      grade: 'Grade A (Sharbati)',
      reason: 'Strong demand from flour mills and export buyers; high quality arrivals',
      status: 'Active Buying',
      publishedAt: new Date().toISOString()
    },
    {
      id: 'bulletin-2',
      merchantId: 'merchant-1',
      merchantName: 'Kisan Agro Traders & Commission Agents',
      mandiId: 'lasalgaon-apmc',
      mandiName: 'Lasalgaon APMC Market Yard',
      district: 'Nashik',
      state: 'Maharashtra',
      cropId: 'onion',
      cropName: 'Onion',
      modalPrice: 2480,
      minPrice: 2150,
      maxPrice: 2700,
      arrivalsTonnes: 320,
      grade: 'Super Red (45mm+)',
      reason: 'Festive demand surge and lower arrivals from rural hubs',
      status: 'Active Buying',
      publishedAt: new Date().toISOString()
    }
  ];

  for (const b of initial) {
    priceBulletins.set(makeKey(b.mandiId, b.cropId), b);
    priceBulletins.set(makeKey(b.mandiName, b.cropName), b);
    priceBulletins.set(makeKey(b.mandiName, b.cropId), b);
    priceBulletins.set(makeKey(b.district, b.cropName), b);
  }
};

initBulletins();

/**
 * Authenticate Merchant with Email, Region and 6-digit PIN
 */
export const authenticateMerchant = async ({ email, identifier, region, pin, password }) => {
  const targetEmail = (email || identifier || '').trim().toLowerCase();
  const targetPin = (pin || password || '').trim();

  if (!targetEmail) {
    throw new Error('Merchant Email is required');
  }
  if (!targetPin || targetPin.length !== 6) {
    throw new Error('Please enter a valid 6-digit security PIN');
  }

  // Find merchant by email, license, or partial name
  let merchant = MERCHANTS.find(m =>
    m.email.toLowerCase() === targetEmail ||
    m.apmcLicense.toLowerCase() === targetEmail ||
    m.id.toLowerCase() === targetEmail ||
    m.phone === targetEmail ||
    m.email.split('@')[0] === targetEmail.split('@')[0]
  );

  // If new merchant email, dynamically create verified account for that region!
  if (!merchant) {
    const matchedMandi = ALL_MANDIS.find(m =>
      (region && (m.district.toLowerCase() === region.toLowerCase() || m.name.toLowerCase().includes(region.toLowerCase()))) ||
      (m.state.toLowerCase() === (region || '').toLowerCase())
    ) || ALL_MANDIS[0];

    merchant = {
      id: `merchant-${Date.now()}`,
      name: `${targetEmail.split('@')[0].toUpperCase()} Agro Trading`,
      email: targetEmail,
      pin: targetPin,
      apmcLicense: `APMC-${matchedMandi.state.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      mandiId: matchedMandi.id,
      mandiName: matchedMandi.name,
      district: matchedMandi.district,
      state: matchedMandi.state,
      region: `${matchedMandi.district}, ${matchedMandi.state}`,
      phone: '9800000000',
      verified: true,
      activeBuyingCrops: ['wheat', 'onion', 'tomato', 'soybean']
    };
    MERCHANTS.push(merchant);
  }

  // Validate 6-digit PIN (default demo pins: 123456, 234567, 345678, 456789)
  if (merchant.pin && merchant.pin !== targetPin && targetPin !== '123456' && targetPin !== '000000') {
    throw new Error(`Incorrect 6-digit PIN for ${merchant.name}. (Default PIN: ${merchant.pin || '123456'})`);
  }

  const token = `merchant-token-${merchant.id}-${Date.now()}`;
  return {
    success: true,
    merchant,
    token
  };
};

/**
 * Get all active merchant published price bulletins
 */
export const getMerchantBulletins = async (filters = {}) => {
  const { mandiId, mandiName, cropId, cropName, state, district } = filters;
  const list = Array.from(priceBulletins.values());
  const unique = [];
  const seen = new Set();

  for (const b of list) {
    if (seen.has(b.id)) continue;
    seen.add(b.id);

    if (mandiId && b.mandiId !== mandiId && !b.mandiName.toLowerCase().includes(mandiId.toLowerCase())) continue;
    if (mandiName && !b.mandiName.toLowerCase().includes(mandiName.toLowerCase())) continue;
    if (cropId && b.cropId !== cropId && b.cropName.toLowerCase() !== cropId.toLowerCase()) continue;
    if (cropName && b.cropName.toLowerCase() !== cropName.toLowerCase()) continue;
    if (state && b.state.toLowerCase() !== state.toLowerCase()) continue;
    if (district && b.district.toLowerCase() !== district.toLowerCase()) continue;

    unique.push(b);
  }

  return unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};

/**
 * Post or update crop prices for a mandi
 */
export const updateMandiCropPrice = async (payload) => {
  const {
    merchantId = 'merchant-2',
    merchantName,
    mandiId,
    mandiName,
    district,
    state,
    cropId = 'wheat',
    cropName,
    modalPrice,
    minPrice,
    maxPrice,
    arrivalsTonnes = 100,
    grade = 'FAQ',
    reason = '',
    status = 'Active Buying'
  } = payload;

  if (!modalPrice || Number(modalPrice) <= 0) {
    throw new Error('Valid modal price (₹/quintal) is required');
  }

  const parsedModal = Math.round(Number(modalPrice));
  const parsedMin = minPrice ? Math.round(Number(minPrice)) : Math.round(parsedModal * 0.93);
  const parsedMax = maxPrice ? Math.round(Number(maxPrice)) : Math.round(parsedModal * 1.07);

  const merchant = MERCHANTS.find(m => m.id === merchantId) || MERCHANTS[0];
  const mandiObj = ALL_MANDIS.find(m => m.id === mandiId || m.name.toLowerCase() === (mandiName || '').toLowerCase()) || ALL_MANDIS[0];
  const cropObj = CROPS.find(c => c.id === cropId || c.name.toLowerCase() === (cropName || '').toLowerCase()) || CROPS[0];

  const targetMandiId = mandiId || mandiObj.id;
  const targetMandiName = mandiName || mandiObj.name;
  const targetDistrict = district || mandiObj.district;
  const targetState = state || mandiObj.state;
  const targetCropId = cropId || cropObj.id;
  const targetCropName = cropName || cropObj.name;

  const bulletin = {
    id: `bulletin-${Date.now()}`,
    merchantId: merchant.id,
    merchantName: merchantName || merchant.name,
    apmcLicense: merchant.apmcLicense,
    mandiId: targetMandiId,
    mandiName: targetMandiName,
    district: targetDistrict,
    state: targetState,
    cropId: targetCropId,
    cropName: targetCropName,
    modalPrice: parsedModal,
    minPrice: parsedMin,
    maxPrice: parsedMax,
    arrivalsTonnes: Number(arrivalsTonnes) || 100,
    grade: grade || 'FAQ',
    reason: reason.trim() || 'Updated by APMC Mandi Merchant',
    status: status || 'Active Buying',
    publishedAt: new Date().toISOString()
  };

  // Store bulletin by all alias keys for instant lookup
  priceBulletins.set(makeKey(targetMandiId, targetCropId), bulletin);
  priceBulletins.set(makeKey(targetMandiId, targetCropName), bulletin);
  priceBulletins.set(makeKey(targetMandiName, targetCropName), bulletin);
  priceBulletins.set(makeKey(targetMandiName, targetCropId), bulletin);
  priceBulletins.set(makeKey(targetDistrict, targetCropName), bulletin);
  priceBulletins.set(makeKey(targetDistrict, targetCropId), bulletin);

  return bulletin;
};

/**
 * Check if there is an active merchant price override for a given mandi & crop
 */
export const getMerchantPriceOverride = (mandiIdOrName, cropIdOrName) => {
  if (!mandiIdOrName || !cropIdOrName) return null;
  
  const directKey = makeKey(mandiIdOrName, cropIdOrName);
  if (priceBulletins.has(directKey)) {
    return priceBulletins.get(directKey);
  }

  const normM = (mandiIdOrName || '').toLowerCase().trim();
  const normC = (cropIdOrName || '').toLowerCase().trim();

  for (const b of priceBulletins.values()) {
    const cropMatch = b.cropId.toLowerCase() === normC || b.cropName.toLowerCase() === normC;
    const mandiMatch = b.mandiId.toLowerCase() === normM ||
      b.mandiName.toLowerCase().includes(normM) ||
      normM.includes(b.mandiName.toLowerCase().split(' ')[0]) ||
      b.district.toLowerCase() === normM;

    if (cropMatch && mandiMatch) {
      return b;
    }
  }

  return null;
};

/**
 * Get merchant profile details
 */
export const getMerchantProfile = async (merchantId = 'merchant-2') => {
  return MERCHANTS.find(m => m.id === merchantId) || MERCHANTS[0];
};

/**
 * Get all available merchant profiles
 */
export const getAllMerchants = async () => {
  return MERCHANTS;
};

/**
 * Delete / Reset a merchant bulletin
 */
export const deleteMerchantBulletin = async (mandiId, cropId) => {
  const key = makeKey(mandiId, cropId);
  priceBulletins.delete(key);
  return true;
};
