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
const PRODUCTS_VERSION = "v2.1"; // Increment when sample data changes

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
      name: "Samsung 55\" 4K Smart TV",
      price: 4999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop"],
      category: "TVs",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "Best Seller",
      description: "Crystal clear 4K UHD display with smart TV features, built-in streaming apps, and voice control.",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Dell Inspiron 15 Laptop",
      price: 3499,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop"],
      category: "Laptops",
      is_featured: true,
      is_promoted: false,
      description: "15.6-inch Full HD laptop with Intel Core i5, 8GB RAM, 512GB SSD. Perfect for work and study.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      name: "Sony WH-1000XM5 Headphones",
      price: 1299,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop"],
      category: "Audio",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "Premium",
      description: "Industry-leading noise cancellation, 30-hour battery life, premium comfort and sound quality.",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "4",
      name: "iPhone 15 Pro Max",
      price: 6999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop"],
      category: "Smartphones",
      is_featured: true,
      is_promoted: false,
      description: "Latest iPhone with Pro camera system, titanium design, and A17 Pro chip. 256GB storage.",
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "5",
      name: "iPad Air 5th Gen",
      price: 2999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop"],
      category: "Tablets",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "New Arrival",
      description: "10.9-inch Liquid Retina display, M1 chip, all-day battery life. Perfect for creativity and productivity.",
      created_at: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: "6",
      name: "PlayStation 5 Console",
      price: 3999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop"],
      category: "Gaming",
      is_featured: true,
      is_promoted: false,
      description: "Next-gen gaming console with ultra-high speed SSD, Ray Tracing, and 4K gaming capabilities.",
      created_at: new Date(Date.now() - 432000000).toISOString(),
    },
    {
      id: "7",
      name: "Canon EOS R50 Camera",
      price: 4999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop"],
      category: "Cameras",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Photography",
      description: "24.2MP APS-C mirrorless camera with 4K video, vari-angle touchscreen, and creative filters.",
      created_at: new Date(Date.now() - 518400000).toISOString(),
    },
    {
      id: "8",
      name: "Apple MacBook Air M3",
      price: 5999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop"],
      category: "Laptops",
      is_featured: true,
      is_promoted: false,
      description: "13.6-inch Liquid Retina display, M3 chip, up to 18 hours battery life. Ultra-thin and powerful.",
      created_at: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: "9",
      name: "Samsung Galaxy S24 Ultra",
      price: 6499,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop"],
      category: "Smartphones",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Flagship",
      description: "200MP camera, S Pen included, titanium frame, and AI-powered features. 512GB storage.",
      created_at: new Date(Date.now() - 691200000).toISOString(),
    },
    {
      id: "10",
      name: "LG 65\" OLED C3 TV",
      price: 7999,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop"],
      category: "TVs",
      is_featured: true,
      is_promoted: false,
      description: "65-inch OLED display with perfect blacks, webOS smart platform, and Dolby Atmos sound.",
      created_at: new Date(Date.now() - 777600000).toISOString(),
    },
    {
      id: "11",
      name: "Bose QuietComfort Earbuds II",
      price: 1499,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop"],
      category: "Audio",
      is_featured: false,
      is_promoted: false,
      description: "World-class noise cancellation, spatial audio, and 6-hour battery life per charge.",
      created_at: new Date(Date.now() - 864000000).toISOString(),
    },
    {
      id: "12",
      name: "Nintendo Switch OLED",
      price: 2499,
      currency: "GHS",
      images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"],
      category: "Gaming",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Family Fun",
      description: "7-inch OLED screen, enhanced audio, 64GB storage. Play anywhere, anytime.",
      created_at: new Date(Date.now() - 950400000).toISOString(),
    },
  ],
  categories: ["TVs", "Laptops", "Audio", "Smartphones", "Tablets", "Gaming", "Cameras"],
};

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
      // Check if we need to clear old cache due to version change
      const currentVersion = localStorage.getItem("e_shop_products_version");
      if (currentVersion !== PRODUCTS_VERSION) {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        localStorage.removeItem(LOCAL_PRODUCTS_KEY);
        localStorage.setItem("e_shop_products_version", PRODUCTS_VERSION);
      }

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
