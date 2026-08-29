/**
 * Formats a number into Indian Rupee format (e.g. ₹2,450 or ₹1,24,500)
 */
export const formatPrice = (amount, includeSymbol = true) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN').format(rounded);
  return includeSymbol ? `₹${formatted}` : formatted;
};

export const formatINR = (amount, includeSymbol = true) => {
  return formatPrice(amount, includeSymbol);
};

export const formatPricePerQuintal = (amount) => {
  return `${formatPrice(amount)}/Q`;
};

export const formatPricePerQtl = (amount) => {
  return `${formatPrice(amount)}/qtl`;
};

export const formatPercent = (percent) => {
  return `${Number(percent).toFixed(1)}%`;
};