import { useEffect, useCallback } from "react";
import {
  getLocalAnalytics,
  shouldSync,
  updateLastSync,
  mergeAnalytics,
  AnalyticsData,
} from "@/lib/analytics";
import {
  fetchProductsFromGitHub,
  updateProductsOnGitHub,
  GitHubProductData,
} from "@/lib/github";

export function useAnalyticsSync(
  githubToken?: string,
  githubOwner?: string,
  githubRepo?: string,
  enabled: boolean = true
) {
  const syncAnalytics = useCallback(async () => {
    if (!enabled || !githubToken || !shouldSync()) {
      return null;
    }

    try {
      // Fetch current data from GitHub
      const remoteData = await fetchProductsFromGitHub(
        githubToken,
        githubOwner,
        githubRepo
      );

      // Get local analytics
      const localAnalytics = getLocalAnalytics();

      // Extract remote analytics (if exists)
      const remoteAnalytics = (remoteData as any).analytics || {
        product_views: {},
        whatsapp_clicks: {},
        last_synced_at: "",
      };

      // Merge analytics
      const mergedViews = mergeAnalytics(
        localAnalytics.product_views,
        remoteAnalytics.product_views || {}
      );
      const mergedClicks = mergeAnalytics(
        localAnalytics.whatsapp_clicks,
        remoteAnalytics.whatsapp_clicks || {}
      );

      // Create updated data with merged analytics
      const updatedData: GitHubProductData & { analytics?: AnalyticsData } = {
        ...remoteData,
        analytics: {
          product_views: mergedViews,
          whatsapp_clicks: mergedClicks,
          last_synced_at: new Date().toISOString(),
        },
      };

      // Push to GitHub
      await updateProductsOnGitHub(
        githubToken,
        updatedData,
        githubOwner,
        githubRepo
      );

      // Update local sync time
      updateLastSync();

      console.log("Analytics synced successfully to GitHub");
      return updatedData.analytics;
    } catch (error) {
      console.error("Failed to sync analytics:", error);
      return null;
    }
  }, [githubToken, githubOwner, githubRepo, enabled]);

  // Auto-sync on mount if needed
  useEffect(() => {
    if (enabled && githubToken && shouldSync()) {
      syncAnalytics();
    }
  }, [enabled, githubToken, syncAnalytics]);

  return {
    syncAnalytics,
    shouldSync: shouldSync(),
  };
}
