import { Product } from "@/components/ProductCard";
import { getTopProductsByMetric } from "@/lib/analytics";

/**
 * Auto-feature products based on performance metrics
 * - Top 5 by score → featured
 * - Top 3 by clicks → promoted
 * - Auto-assign "🔥 Trending Now" tag
 */
export function autoFeatureProducts(products: Product[]): Product[] {
  const productIds = products.map((p) => p.id);

  // Get top products
  const topByScore = getTopProductsByMetric(productIds, "score", 5);
  const topByClicks = getTopProductsByMetric(productIds, "clicks", 3);

  // Update products
  return products.map((product) => {
    const isTopScore = topByScore.includes(product.id);
    const isTopClicks = topByClicks.includes(product.id);

    return {
      ...product,
      is_featured: isTopScore,
      is_promoted: isTopClicks,
      promotion_tag: isTopClicks ? "🔥 Trending Now" : product.promotion_tag,
    };
  });
}

/**
 * Get top 3 products for homepage banner
 */
export function getTopProductsForBanner(products: Product[]): Product[] {
  const productIds = products.map((p) => p.id);
  const topByScore = getTopProductsByMetric(productIds, "score", 3);

  // Filter and sort products
  const topProducts = products.filter((p) => topByScore.includes(p.id));
  const sortedByScore = topProducts.sort(
    (a, b) =>
      topByScore.indexOf(a.id) - topByScore.indexOf(b.id)
  );

  return sortedByScore;
}

/**
 * Check if auto-feature should be applied
 * Only apply if there's meaningful analytics data
 */
export function shouldApplyAutoFeature(products: Product[]): boolean {
  // Only apply if at least 5 products have been viewed or clicked
  const minProductsWithActivity = 5;
  const productsWithActivity = products.filter(
    (p) =>
      (p as any)._views > 0 || (p as any)._clicks > 0
  ).length;

  return productsWithActivity >= minProductsWithActivity;
}
