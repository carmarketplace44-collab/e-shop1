// Local analytics storage keys
const VIEWS_KEY = "e_shop_analytics_views";
const CLICKS_KEY = "e_shop_analytics_clicks";
const LAST_SYNC_KEY = "e_shop_analytics_last_sync";

export interface ProductAnalytics {
  [productId: string]: number;
}

export interface AnalyticsData {
  product_views: ProductAnalytics;
  whatsapp_clicks: ProductAnalytics;
  last_synced_at: string;
}

// Track product view
export function trackProductView(productId: string): void {
  try {
    const views = JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}");
    views[productId] = (views[productId] || 0) + 1;
    localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
  } catch (error) {
    console.warn("Failed to track product view:", error);
  }
}

// Track WhatsApp click
export function trackWhatsAppClick(productId: string): void {
  try {
    const clicks = JSON.parse(localStorage.getItem(CLICKS_KEY) || "{}");
    clicks[productId] = (clicks[productId] || 0) + 1;
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
  } catch (error) {
    console.warn("Failed to track WhatsApp click:", error);
  }
}

// Get view count for a product
export function getViews(productId: string): number {
  try {
    const views = JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}");
    return views[productId] || 0;
  } catch {
    return 0;
  }
}

// Get click count for a product
export function getClicks(productId: string): number {
  try {
    const clicks = JSON.parse(localStorage.getItem(CLICKS_KEY) || "{}");
    return clicks[productId] || 0;
  } catch {
    return 0;
  }
}

// Calculate conversion rate
export function getConversionRate(productId: string): number {
  const views = getViews(productId);
  const clicks = getClicks(productId);
  return views === 0 ? 0 : parseFloat(((clicks / views) * 100).toFixed(1));
}

// Calculate product score (clicks * 2 + views)
export function getProductScore(productId: string): number {
  return getClicks(productId) * 2 + getViews(productId);
}

// Get all local analytics
export function getLocalAnalytics(): AnalyticsData {
  return {
    product_views: JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}"),
    whatsapp_clicks: JSON.parse(localStorage.getItem(CLICKS_KEY) || "{}"),
    last_synced_at: localStorage.getItem(LAST_SYNC_KEY) || "",
  };
}

// Check if sync is needed (24 hours)
export function shouldSync(): boolean {
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);
  if (!lastSync) return true;

  const lastSyncTime = new Date(lastSync).getTime();
  const now = Date.now();
  const hoursSinceSync = (now - lastSyncTime) / (1000 * 60 * 60);

  return hoursSinceSync >= 24;
}

// Update last sync timestamp
export function updateLastSync(): void {
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
}

// Merge local and remote analytics
export function mergeAnalytics(
  local: ProductAnalytics,
  remote: ProductAnalytics
): ProductAnalytics {
  const result = { ...remote };

  for (const key in local) {
    result[key] = (result[key] || 0) + local[key];
  }

  return result;
}

// Clear all local analytics (for testing)
export function clearLocalAnalytics(): void {
  localStorage.removeItem(VIEWS_KEY);
  localStorage.removeItem(CLICKS_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
}

// Get all products sorted by score
export function getProductsRankedByScore(productIds: string[]): Array<{
  productId: string;
  score: number;
  views: number;
  clicks: number;
  conversionRate: number;
}> {
  return productIds
    .map((id) => ({
      productId: id,
      score: getProductScore(id),
      views: getViews(id),
      clicks: getClicks(id),
      conversionRate: getConversionRate(id),
    }))
    .sort((a, b) => b.score - a.score);
}

// Get top products by metric
export function getTopProductsByMetric(
  productIds: string[],
  metric: "score" | "views" | "clicks" | "conversion",
  limit: number = 5
): string[] {
  let sorted: Array<{ productId: string; value: number }>;

  if (metric === "score") {
    sorted = productIds.map((id) => ({
      productId: id,
      value: getProductScore(id),
    }));
  } else if (metric === "views") {
    sorted = productIds.map((id) => ({
      productId: id,
      value: getViews(id),
    }));
  } else if (metric === "clicks") {
    sorted = productIds.map((id) => ({
      productId: id,
      value: getClicks(id),
    }));
  } else {
    sorted = productIds.map((id) => ({
      productId: id,
      value: getConversionRate(id),
    }));
  }

  return sorted.sort((a, b) => b.value - a.value).slice(0, limit).map((item) => item.productId);
}
