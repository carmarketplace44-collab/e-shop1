import { useState, useEffect, useCallback } from "react";
import {
  GitHubProductData,
  fetchProductsFromGitHub,
  updateProductsOnGitHub,
} from "@/lib/github";

const CACHE_KEY = "e_shop_products_cache";
const CACHE_TIMESTAMP_KEY = "e_shop_products_cache_timestamp";
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in ms
const LOCAL_PRODUCTS_KEY = "e_shop_products_local";

function isValidProductData(data: any): data is GitHubProductData {
  return (
    data &&
    Array.isArray(data.products) &&
    Array.isArray(data.categories) &&
    data.products.length >= 0
  );
}

function getLocalProducts(): GitHubProductData | null {
  try {
    const local = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!local) return null;
    const parsed = JSON.parse(local);
    if (isValidProductData(parsed)) return parsed;
  } catch (err) {
    console.warn("Failed to parse local products:", err);
  }
  return null;
}

function setLocalProducts(data: GitHubProductData) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to set local products:", err);
  }
}

// Sample products for demo/fallback
const SAMPLE_PRODUCTS: GitHubProductData = {
  products: [
    {
      id: "1",
      name: "Premium Smartphone",
      price: 2499,
      currency: "GHS",
      images: ["https://picsum.photos/seed/phone1/500/500"],
      category: "Electronics",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "Hot Deal",
      description: "Latest flagship smartphone with 5G, 120Hz display, and advanced camera system.",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Wireless Earbuds",
      price: 599,
      currency: "GHS",
      images: ["https://picsum.photos/seed/earbuds/500/500"],
      category: "Audio",
      is_featured: true,
      is_promoted: false,
      description: "True wireless earbuds with noise cancellation and 12-hour battery life.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      name: "Fitness Smartwatch",
      price: 899,
      currency: "GHS",
      images: ["https://picsum.photos/seed/watch1/500/500"],
      category: "Wearables",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "New",
      description: "All-day fitness tracking with heart rate monitoring and water resistance.",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "4",
      name: "Portable Power Bank",
      price: 299,
      currency: "GHS",
      images: ["https://picsum.photos/seed/powerbank/500/500"],
      category: "Accessories",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Best Value",
      description: "20000mAh capacity with fast charging support for all devices.",
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "5",
      name: "USB-C Cable Bundle",
      price: 149,
      currency: "GHS",
      images: ["https://picsum.photos/seed/cable/500/500"],
      category: "Accessories",
      is_featured: false,
      is_promoted: false,
      description: "3-pack of high-quality USB-C cables for fast data transfer and charging.",
      created_at: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: "6",
      name: "LED Light Bulbs",
      price: 79,
      currency: "GHS",
      images: ["https://picsum.photos/seed/lightbulb/500/500"],
      category: "Home",
      is_featured: true,
      is_promoted: false,
      description: "Energy-efficient LED bulbs with 25,000-hour lifespan. Set of 4.",
      created_at: new Date(Date.now() - 432000000).toISOString(),
    },
    {
      id: "7",
      name: "Phone Screen Protector",
      price: 49,
      currency: "GHS",
      images: ["https://picsum.photos/seed/protector/500/500"],
      category: "Accessories",
      is_featured: false,
      is_promoted: false,
      description: "Tempered glass screen protector with easy installation kit.",
      created_at: new Date(Date.now() - 518400000).toISOString(),
    },
    {
      id: "8",
      name: "Phone Case Bundle",
      price: 199,
      currency: "GHS",
      images: ["https://picsum.photos/seed/phonecase/500/500"],
      category: "Accessories",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Limited",
      description: "Premium protective cases in multiple colors and designs.",
      created_at: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: "9",
      name: "Charging Dock Station",
      price: 399,
      currency: "GHS",
      images: ["https://picsum.photos/seed/dock/500/500"],
      category: "Electronics",
      is_featured: true,
      is_promoted: false,
      description: "Multi-device wireless charging dock for phones, watches, and earbuds.",
      created_at: new Date(Date.now() - 691200000).toISOString(),
    },
    {
      id: "10",
      name: "Screen Cleaning Kit",
      price: 59,
      currency: "GHS",
      images: ["https://picsum.photos/seed/cleaning/500/500"],
      category: "Accessories",
      is_featured: false,
      is_promoted: false,
      description: "Microfiber cloth and special solution for safe screen cleaning.",
      created_at: new Date(Date.now() - 777600000).toISOString(),
    },
    {
      id: "11",
      name: "Portable Phone Stand",
      price: 99,
      currency: "GHS",
      images: ["https://picsum.photos/seed/stand/500/500"],
      category: "Accessories",
      is_featured: false,
      is_promoted: false,
      description: "Adjustable aluminum stand works with any phone or tablet.",
      created_at: new Date(Date.now() - 864000000).toISOString(),
    },
    {
      id: "12",
      name: "Bluetooth Speaker",
      price: 449,
      currency: "GHS",
      images: ["https://picsum.photos/seed/speaker1/500/500"],
      category: "Audio",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "Trending",
      description: "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
      created_at: new Date(Date.now() - 950400000).toISOString(),
    },
  ],
  categories: ["Electronics", "Audio", "Wearables", "Accessories", "Home"],
};

function isValidProductData(data: any): data is GitHubProductData {
  return (
    data &&
    Array.isArray(data.products) &&
    data.products.length > 0 &&
    Array.isArray(data.categories)
  );
}

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
      // Try to get local products first (admin saved data)
      const localData = getLocalProducts();
      if (localData) {
        setProducts(localData);
        setCachedProducts(localData);
        setLoading(false);
        return localData;
      }

      // Try to get cached products next
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return cached;
      }

      // If GitHub token is provided, try to fetch from GitHub
      if (githubToken) {
        const data = await fetchProductsFromGitHub(
          githubToken,
          githubOwner,
          githubRepo
        );

        if (isValidProductData(data)) {
          setProducts(data);
          setCachedProducts(data);
          setLocalProducts(data);
          return data;
        }

        console.warn("GitHub product data is empty or invalid, falling back to sample products.");
      }

      // Fallback to sample products for demo/preview
      setProducts(SAMPLE_PRODUCTS);
      setCachedProducts(SAMPLE_PRODUCTS);
      setLocalProducts(SAMPLE_PRODUCTS);
      return SAMPLE_PRODUCTS;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);

      // Try to use cached data on error
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached);
        return cached;
      }

      // Final fallback to sample products on error
      setProducts(SAMPLE_PRODUCTS);
      return SAMPLE_PRODUCTS;
    } finally {
      setLoading(false);
    }
  }, [githubToken, githubOwner, githubRepo, getCachedProducts, setCachedProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProducts = useCallback(
    async (newData: GitHubProductData) => {
      setProducts(newData);
      setCachedProducts(newData);
      setLocalProducts(newData);

      // Save to GitHub only if token and repo details are present
      if (githubToken) {
        try {
          await updateProductsOnGitHub(
            githubToken,
            newData,
            githubOwner,
            githubRepo
          );
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to update products on GitHub";
          setError(errorMessage);
          console.warn(errorMessage);
          // Do not throw; local state is already updated for client preview.
        }
      }

      return newData;
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
