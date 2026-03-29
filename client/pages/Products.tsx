import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"latest" | "price-asc" | "price-desc">(
    "latest"
  );

  const githubToken = import.meta.env.VITE_GITHUB_TOKEN || "";
  const githubOwner = import.meta.env.VITE_GITHUB_OWNER || "YOUR_USERNAME";
  const githubRepo = import.meta.env.VITE_GITHUB_REPO || "e-shop-data";

  const { products, loading } = useProducts(githubToken, githubOwner, githubRepo);

  const selectedCategory = searchParams.get("category");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products?.products || [];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return sorted;
  }, [products?.products, selectedCategory, sortBy]);

  const categories = products?.categories || [];

  const handleCategoryChange = (category: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
            All Products
          </h1>
          <p className="text-muted-foreground">
            {filteredAndSortedProducts.length} products available
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[14px] p-6 shadow-sm sticky top-24">
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-heading font-bold text-primary mb-4">
                  Category
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`block w-full text-left px-3 py-2 rounded transition ${
                      !selectedCategory
                        ? "bg-accent text-primary font-semibold"
                        : "text-muted-foreground hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === cat
                          ? "bg-accent text-primary font-semibold"
                          : "text-muted-foreground hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="pt-6 border-t">
                <h3 className="font-heading font-bold text-primary mb-4">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "latest" | "price-asc" | "price-desc")
                  }
                  className="w-full px-3 py-2 rounded border border-input bg-background text-foreground"
                >
                  <option value="latest">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center min-h-96">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="flex justify-center items-center min-h-96 bg-white rounded-[14px]">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg">
                    No products found
                  </p>
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="mt-4 text-accent hover:underline font-semibold"
                  >
                    View all products
                  </button>
                </div>
              </div>
            ) : (
              <ProductGrid products={filteredAndSortedProducts} columns={3} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
