export function getEstimatedDelivery(createdAt: string) {
  const createdDate = new Date(createdAt);

  // For example, assume:
  const minDays = 2; // minimum delivery in 2 days
  const maxDays = 5; // maximum delivery in 5 days

  const minDelivery = new Date(createdDate);
  const maxDelivery = new Date(createdDate);
  minDelivery.setDate(minDelivery.getDate() + minDays);
  maxDelivery.setDate(maxDelivery.getDate() + maxDays);

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  return `${minDelivery.toLocaleDateString(
    undefined,
    formatOptions
  )} - ${maxDelivery.toLocaleDateString(undefined, formatOptions)}`;
}
