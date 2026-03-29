import { useState, useEffect, useCallback } from "react";
import {
  GitHubProductData,
  fetchProductsFromGitHub,
  updateProductsOnGitHub,
} from "@/lib/github";

const CACHE_KEY = "e_shop_products_cache";
const CACHE_TIMESTAMP_KEY = "e_shop_products_cache_timestamp";
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in ms

export function useProducts(
  githubToken?: string,
  githubOwner?: string,
  githubRepo?: string
) {
  const [products, setProducts] = useState<GitHubProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCachedProducts = useCallback((): GitHubProductData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (!cached || !timestamp) return null;

      const cacheAge = Date.now() - parseInt(timestamp, 10);
      if (cacheAge > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        return null;
      }

      return JSON.parse(cached);
    } catch {
      return null;
    }
  }, []);

  const setCachedProducts = useCallback((data: GitHubProductData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(
        CACHE_TIMESTAMP_KEY,
        Date.now().toString()
      );
    } catch (e) {
      console.warn("Failed to cache products:", e);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get cached products first
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return cached;
      }

      // Fallback to default products if no token
      if (!githubToken) {
        const defaultProducts: GitHubProductData = {
          products: [],
          categories: [],
        };
        setProducts(defaultProducts);
        setCachedProducts(defaultProducts);
        setLoading(false);
        return defaultProducts;
      }

      // Fetch from GitHub
      const data = await fetchProductsFromGitHub(
        githubToken,
        githubOwner,
        githubRepo
      );
      setProducts(data);
      setCachedProducts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      
      // Try to use cached data on error
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached);
      }
    } finally {
      setLoading(false);
    }
  }, [githubToken, githubOwner, githubRepo, getCachedProducts, setCachedProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProducts = useCallback(
    async (newData: GitHubProductData) => {
      if (!githubToken) {
        throw new Error("GitHub token is required to update products");
      }

      try {
        await updateProductsOnGitHub(
          githubToken,
          newData,
          githubOwner,
          githubRepo
        );
        setProducts(newData);
        setCachedProducts(newData);
        return newData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update products";
        setError(errorMessage);
        throw err;
      }
    },
    [githubToken, githubOwner, githubRepo, setCachedProducts]
  );

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    updateProducts,
    clearCache,
  };
}
