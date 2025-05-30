// utils/dateFormatter.js

export function formatDateTime(dateString, options = {}) {
  const defaultOptions = {
    timeZone: "Asia/Colombo", // You can change based on your preference
    dateStyle: "medium",
    timeStyle: "short",
  };

  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { ...defaultOptions, ...options });
  } catch (err) {
    return "Invalid Date";
  }
}
