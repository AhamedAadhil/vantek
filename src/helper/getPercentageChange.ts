export const getPercentageChange = (
  current: number,
  previous: number
): { percentage: number; impact: "positive" | "negative" | "neutral" } => {
  if (previous === 0) {
    if (current === 0) {
      return { percentage: 0, impact: "neutral" };
    }
    return { percentage: 100, impact: "positive" };
  }

  const percentage = ((current - previous) / previous) * 100;
  const impact =
    percentage > 0 ? "positive" : percentage < 0 ? "negative" : "neutral";

  return { percentage, impact };
};
