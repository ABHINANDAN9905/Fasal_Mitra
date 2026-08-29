/**
 * Generates verified WhatsApp message template and instant share links
 */
export const generateWhatsAppPayload = ({ bestResult, crop, originLocation }) => {
  if (!bestResult) {
    throw new Error('Mandi calculation result is required to generate WhatsApp receipt');
  }

  const m = bestResult.mandi;
  const c = bestResult.calculation;
  const formatCurrency = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  const messageText = `🌾 *Fasal Mitra Net Price Advice* 🌾
-----------------------------------
🚜 *Crop:* ${crop?.name || 'Produce'} (${c.quantity} Quintals)
📍 *Origin:* ${originLocation || `${m.district}, ${m.state}`}

🏆 *Recommended Mandi:* ${m.name} (${m.district}, ${m.state})
💰 *Modal Rate:* ${formatCurrency(c.modalPrice)}/Quintal
🚗 *Distance:* ${c.distanceKm} km
-----------------------------------
💵 *Gross Sale:* ${formatCurrency(c.grossValue)}
📉 *Transport Cost:* -${formatCurrency(c.transportCost)}
📉 *Mandi Fees & Cess:* -${formatCurrency(c.totalMandiFees)}
✨ *FINAL NET RETURN:* ${formatCurrency(c.netReturn)} (${formatCurrency(c.netPricePerQuintal)}/Q)
-----------------------------------
📲 *Calculated via Fasal Mitra Decision Engine* (Verified Agmarknet & e-NAM Data)`;

  const encodedUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

  return {
    rawMessage: messageText,
    whatsappUrl: encodedUrl,
    summary: {
      cropName: crop?.name,
      mandiName: m.name,
      netReturn: c.netReturn,
      netPricePerQuintal: c.netPricePerQuintal
    }
  };
};
