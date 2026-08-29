import { formatPrice } from './formatPrice';


/**
 * Calculates complete net-realisation breakdown for a given mandi & harvest
 */
export const calculateNetReturn = ({
  modalPrice,
  minPrice,
  maxPrice,
  quantityQuintals,
  distanceKm,
  vehicleRatePerKm,
  baseLoadingFee = 300,
  marketFeePercent = 1.05,
  weighingFeePerQuintal = 4,
  unloadingFeePerQuintal = 8,
  isPerishable = false,
  cropName = ''
}) => {
  const qty = Math.max(1, Number(quantityQuintals) || 10);
  const dist = Math.max(1, Number(distanceKm) || 10);
  const rateKm = Number(vehicleRatePerKm) || 14;

  // 1. Gross sales value
  const grossValue = modalPrice * qty;
  const minGrossValue = minPrice * qty;
  const maxGrossValue = maxPrice * qty;

  // 2. Transport cost (roundtrip / one-way loaded + base loading)
  const transportCost = Math.round(dist * rateKm + baseLoadingFee);

  // 3. APMC Cess / Mandi fees & handling
  const apmcCess = Math.round((grossValue * marketFeePercent) / 100);
  const laborAndWeighing = Math.round((weighingFeePerQuintal + unloadingFeePerQuintal) * qty);
  const totalMandiFees = apmcCess + laborAndWeighing;

  // 4. Perishable transit & handling loss factor (e.g. tomatoes, soft vegetables experience bruising on longer distances)
  const riskMultiplier = isPerishable ? 0.0015 : 0.0003;
  const transitSpoilageLoss = Math.round(grossValue * Math.min(0.06, dist * riskMultiplier));

  // 5. Net Realisation (Total in farmer's pocket)
  const totalDeductions = transportCost + totalMandiFees + transitSpoilageLoss;
  const netReturn = Math.max(0, grossValue - totalDeductions);
  const netPricePerQuintal = Math.round(netReturn / qty);

  // 6. Net Profit Margin %
  const netMarginPercent = grossValue > 0 ? ((netReturn / grossValue) * 100).toFixed(1) : 0;

  return {
    grossValue,
    minGrossValue,
    maxGrossValue,
    transportCost,
    apmcCess,
    laborAndWeighing,
    totalMandiFees,
    transitSpoilageLoss,
    totalDeductions,
    netReturn,
    netPricePerQuintal,
    netMarginPercent,
    distanceKm: dist,
    modalPrice,
    minPrice,
    maxPrice,
    quantity: qty
  };
};

/**
 * Builds an explainable rationale comparing the Recommended Mandi vs the Closest Mandi
 */
export const buildRecommendationExplanation = (bestMandiResult, closestMandiResult, crop, language = 'en') => {
  if (!bestMandiResult || !closestMandiResult) return '';

  const isSameMandi = bestMandiResult.mandi.id === closestMandiResult.mandi.id;
  const netDiff = bestMandiResult.calculation.netReturn - closestMandiResult.calculation.netReturn;
  const rateDiff = bestMandiResult.calculation.modalPrice - closestMandiResult.calculation.modalPrice;
  const distDiff = bestMandiResult.calculation.distanceKm - closestMandiResult.calculation.distanceKm;
  const extraTransport = bestMandiResult.calculation.transportCost - closestMandiResult.calculation.transportCost;

  if (isSameMandi) {
    if (language === 'hi') {
      return `आपके सबसे नजदीकी मंडी (${bestMandiResult.mandi.name}) ही सबसे ज्यादा शुद्ध मुनाफा दे रही है। अतिरिक्त दूरी तय करने का कोई अतिरिक्त लाभ नहीं है।`;
    } else if (language === 'mr') {
      return `तुमची सर्वात जवळची बाजार समिती (${bestMandiResult.mandi.name}) हीच सर्वात जास्त निव्वळ नफा देत आहे. लांब जाण्याची गरज नाही.`;
    }
    return `Your closest mandi (${bestMandiResult.mandi.name}) also offers the highest net return. No extra travel needed.`;
  }

  if (language === 'hi') {
    return `${bestMandiResult.mandi.name} जाने पर आपको ${formatPrice(netDiff)} का अतिरिक्त शुद्ध मुनाफा मिलेगा! यद्यपि यह ${distDiff} किमी दूर है (अतिरिक्त भाड़ा ₹${Math.abs(extraTransport)}), लेकिन इसका भाव ₹${rateDiff}/क्विंटल अधिक होने से कुल मिलाकर आपकी बचत बढ़ जाती है।`;
  } else if (language === 'mr') {
    return `${bestMandiResult.mandi.name} येथे विक्री केल्यास तुम्हाला ${formatPrice(netDiff)} जास्तीचा निव्वळ नफा मिळेल! हे अंतर ${distDiff} किमी जास्त असले तरी (अतिरिक्त भाडे ₹${Math.abs(extraTransport)}), येथील दर ₹${rateDiff}/क्विंटल जास्त असल्यामुळे तुमचा मोठा फायदा होतो.`;
  }

  return `Selling at ${bestMandiResult.mandi.name} gives you ${formatPrice(netDiff)} more net profit! Even though it is ${distDiff} km further (₹${Math.abs(extraTransport)} extra transport), its higher rate (+₹${rateDiff}/Q) more than pays for the extra trip.`;
};

/**
 * Creates formatted text for instant WhatsApp sharing with fellow farmers or FPO managers
 */
export const generateWhatsAppShare = (bestResult, crop, locationName) => {
  if (!bestResult) return '';
  const m = bestResult.mandi;
  const c = bestResult.calculation;

  const text = `🌾 *Fasal Mitra Net Price Advice* 🌾
-----------------------------------
🚜 *Crop:* ${crop?.name || 'Produce'} (${c.quantity} Quintals)
📍 *Origin:* ${locationName || 'Farmer Location'}

🏆 *Recommended Mandi:* ${m.name} (${m.district}, ${m.state})
💰 *Modal Rate:* ${formatPrice(c.modalPrice)}/Quintal
🚗 *Distance:* ${c.distanceKm} km
-----------------------------------
💵 *Gross Sale:* ${formatPrice(c.grossValue)}
📉 *Transport Cost:* -${formatPrice(c.transportCost)}
📉 *Mandi Fees & Cess:* -${formatPrice(c.totalMandiFees)}
✨ *FINAL NET RETURN:* ${formatPrice(c.netReturn)} (${formatPrice(c.netPricePerQuintal)}/Q)
-----------------------------------
📲 *Calculated via Fasal Mitra Decision Engine* (Verified Agmarknet data)`;

  return encodeURIComponent(text);
};

/**
 * Returns a freshness status badge config for a given arrival date string
 */
export const getFreshnessLabel = (dateStr) => {
  if (!dateStr) {
    return { label: 'Today (Live)', labelHi: 'आज (ताजा भाव)', color: 'success' };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) {
    return { label: 'Today (Live)', labelHi: 'आज (ताजा भाव)', color: 'success' };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === yesterday) {
    return { label: 'Yesterday', labelHi: 'कल का भाव', color: 'warning' };
  }
  return { label: 'Recent (e-NAM)', labelHi: 'हालिया भाव', color: 'info' };
};

/**
 * Perishable advisory
 */
export const getPerishableAdvisory = (crop, language = 'en') => {
  if (!crop) return null;
  if (crop.isPerishable) {
    return {
      type: 'warning',
      badge: 'High Perishability / नाशवान',
      text: language === 'hi'
        ? `${crop.name} जल्दी खराब हो सकती है (शेल्फ लाइफ 3-5 दिन)। लंबी दूरी की मंडियों में यात्रा समय और धूप का ध्यान रखें।`
        : language === 'mr'
        ? `${crop.name} नाशवंत आहे (३-५ दिवस टिकते). जास्त लांबच्या बाजार समितीत नेताना वाहतुकीची काळजी घ्या.`
        : `${crop.name} is perishable (3-5 days shelf life). Minimize transit delay to avoid weight & quality loss.`
    };
  }
  return {
    type: 'success',
    badge: 'Good Storage Life / भंडारण योग्य',
    text: language === 'hi'
      ? `${crop.name} की भंडारण क्षमता अच्छी है (${crop.shelfLifeDays} दिन)। यदि बाजार में मंदी हो तो 2-3 दिन रुकने पर विचार किया जा सकता है।`
      : language === 'mr'
      ? `${crop.name} साठवणूक क्षमता चांगली आहे (${crop.shelfLifeDays} दिवस). गरज असल्यास २-३ दिवस थांबू शकता.`
      : `${crop.name} has a stable shelf life (${crop.shelfLifeDays} days). You can hold if prices are expected to rise.`
  };
};