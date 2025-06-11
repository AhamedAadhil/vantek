export function parseCategoriesFromApiUrl(apiUrl) {
  if (!apiUrl) return null;

  try {
    // Use a dummy base to parse relative URL
    const url = new URL(apiUrl, "http://dummy-base");
    const mainCategory = url.searchParams.get("mainCategory");
    const subCategory1 = url.searchParams.get("subCategory1");

    if (mainCategory && subCategory1) {
      return { mainCategory, subCategory1 };
    }
  } catch (e) {
    console.warn("Failed to parse apiUrl:", e);
  }

  return null;
}
