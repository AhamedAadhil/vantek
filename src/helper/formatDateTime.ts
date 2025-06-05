// utils/dateFormatter.js

export function formatDateTime(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Colombo",
    dateStyle: "medium", // This is allowed by Intl.DateTimeFormatOptions
    timeStyle: "short", // Also allowed
  };

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-US", { ...defaultOptions, ...options });
}
