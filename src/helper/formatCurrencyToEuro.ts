export const formatToEuro = (amount: number, locale: string = "en-US") => {
  if (!amount) return "";
  if (isNaN(amount)) return "&euro; 0.00"; // Handle NaN case
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};
