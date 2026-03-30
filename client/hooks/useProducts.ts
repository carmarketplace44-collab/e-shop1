import { useState, useEffect, useCallback } from "react";
import {
  GitHubProductData,
  fetchProductsFromGitHub,
  updateProductsOnGitHub,
} from "@/lib/github";

const CACHE_KEY = "e_shop_products_cache";
const CACHE_TIMESTAMP_KEY = "e_shop_products_cache_timestamp";
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in ms

// Sample products for demo/fallback
const SAMPLE_PRODUCTS: GitHubProductData = {
  products: [
    {
      id: "1",
      name: "MacBook Pro 16\" M3 Max",
      price: 3999,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1560750588-68563e3ceb0a?w=500&h=500&fit=crop&q=80",
      ],
      category: "Laptops",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "Sale 15%",
      description:
        "Powerful MacBook Pro with M3 Max chip, 36GB unified memory, 512GB SSD storage. Perfect for professionals.",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Dell XPS 15 Laptop",
      price: 2899,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1540932020986-a8468ec8b39f?w=500&h=500&fit=crop&q=80",
      ],
      category: "Laptops",
      is_featured: true,
      is_promoted: false,
      description:
        "Dell XPS 15 with Intel i9 processor, RTX 4090, 32GB RAM, 1TB SSD. Excellent for gaming and design work.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      name: "iPad Pro 12.9\" M2",
      price: 1899,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=500&fit=crop&q=80",
      ],
      category: "Tablets",
      is_featured: true,
      is_promoted: true,
      promotion_tag: "New",
      description:
        "iPad Pro with M2 chip, 12.9-inch Liquid Retina display, 256GB storage. Perfect for creative professionals.",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "4",
      name: "Sony WH-1000XM5 Headphones",
      price: 599,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&q=80",
      ],
      category: "Audio",
      is_featured: true,
      is_promoted: false,
      description:
        "Industry-leading noise cancellation, 30-hour battery life, premium sound quality.",
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "5",
      name: "Samsung 4K Curved Monitor 49\"",
      price: 1499,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1534156826476-ed80f30a7ae0?w=500&h=500&fit=crop&q=80",
      ],
      category: "Monitors",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Flash Sale",
      description:
        "Ultra-wide curved 4K monitor with 144Hz refresh rate. Ideal for gaming and productivity.",
      created_at: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: "6",
      name: "Logitech MX Master 3S Mouse",
      price: 299,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80",
      ],
      category: "Accessories",
      is_featured: false,
      is_promoted: false,
      description:
        "Advanced wireless mouse with precision scrolling and customizable buttons.",
      created_at: new Date(Date.now() - 432000000).toISOString(),
    },
    {
      id: "7",
      name: "Mechanical Gaming Keyboard RGB",
      price: 449,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1587829191301-7c86dcb803c0?w=500&h=500&fit=crop&q=80",
      ],
      category: "Accessories",
      is_featured: true,
      is_promoted: false,
      description:
        "Cherry MX switches, RGB backlight, aluminum frame. Professional gaming keyboard.",
      created_at: new Date(Date.now() - 518400000).toISOString(),
    },
    {
      id: "8",
      name: "NVIDIA RTX 4090 Graphics Card",
      price: 2499,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1591290619447-14aa534da0a0?w=500&h=500&fit=crop&q=80",
      ],
      category: "Components",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Limited Stock",
      description:
        "Flagship graphics card with 24GB GDDR6X memory. Ultimate gaming and AI performance.",
      created_at: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: "9",
      name: "LG OLED 55\" Smart TV",
      price: 1999,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop&q=80",
      ],
      category: "TVs",
      is_featured: true,
      is_promoted: false,
      description:
        "55-inch 4K OLED display with HDR support, smart TV features, and Dolby Atmos sound.",
      created_at: new Date(Date.now() - 691200000).toISOString(),
    },
    {
      id: "10",
      name: "AirPods Pro (2nd Gen)",
      price: 399,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop&q=80",
      ],
      category: "Audio",
      is_featured: false,
      is_promoted: false,
      description:
        "Active noise cancellation, spatial audio, up to 6 hours of battery life per charge.",
      created_at: new Date(Date.now() - 777600000).toISOString(),
    },
    {
      id: "11",
      name: "Asus ROG Gaming Laptop",
      price: 2199,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1547814050-b774088ecd41?w=500&h=500&fit=crop&q=80",
      ],
      category: "Laptops",
      is_featured: false,
      is_promoted: true,
      promotion_tag: "Trending",
      description:
        "High-performance gaming laptop with RTX 4080, i9 processor, 32GB RAM, 1TB SSD.",
      created_at: new Date(Date.now() - 864000000).toISOString(),
    },
    {
      id: "12",
      name: "Webcam Logitech 4K Pro",
      price: 199,
      currency: "GHS",
      images: [
        "https://images.unsplash.com/photo-1598148715386-084fbb1ecd54?w=500&h=500&fit=crop&q=80",
      ],
      category: "Accessories",
      is_featured: false,
      is_promoted: false,
      description:
        "Ultra HD 4K webcam with auto-focus, perfect for streaming and video conferencing.",
      created_at: new Date(Date.now() - 950400000).toISOString(),
    },
  ],
  categories: ["Laptops", "Tablets", "Audio", "Monitors", "Accessories", "Components", "TVs"],
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
      // Try to get cached products first
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
        setProducts(data);
        setCachedProducts(data);
        return data;
      }

      // Fallback to sample products for demo/preview
      setProducts(SAMPLE_PRODUCTS);
      setCachedProducts(SAMPLE_PRODUCTS);
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
