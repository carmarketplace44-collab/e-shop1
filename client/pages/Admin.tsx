import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminProductForm } from "@/components/AdminProductForm";
import { AdminProductList } from "@/components/AdminProductList";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings } from "lucide-react";

const ADMIN_PASSWORD_KEY = "e_shop_admin_password";
const DEFAULT_PASSWORD = "admin123"; // Should be changed in production

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const githubToken = import.meta.env.VITE_GITHUB_TOKEN || "";
  const githubOwner = import.meta.env.VITE_GITHUB_OWNER || "YOUR_USERNAME";
  const githubRepo = import.meta.env.VITE_GITHUB_REPO || "e-shop-data";

  const { products, updateProducts } = useProducts(
    githubToken,
    githubOwner,
    githubRepo
  );

  // Check authentication on mount
  useEffect(() => {
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (storedPassword === DEFAULT_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEFAULT_PASSWORD) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Invalid password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    setIsAuthenticated(false);
    setPassword("");
    navigate("/");
  };

  const handleAddProduct = async (
    product: Omit<Product, "created_at"> & { created_at?: string }
  ) => {
    if (!products) return;

    setIsLoading(true);
    try {
      const newProducts = {
        ...products,
        products: editingProduct
          ? products.products.map((p) => (p.id === product.id ? product : p))
          : [...products.products, product],
      };

      await updateProducts(newProducts);
      setEditingProduct(undefined);
      alert(
        editingProduct ? "Product updated successfully!" : "Product added successfully!"
      );
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Make sure GitHub token is configured.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!products) return;

    setIsLoading(true);
    try {
      const newProducts = {
        ...products,
        products: products.products.filter((p) => p.id !== productId),
      };

      await updateProducts(newProducts);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = (newCategory: string) => {
    if (!products || !newCategory.trim()) return;

    if (products.categories.includes(newCategory)) {
      alert("Category already exists");
      return;
    }

    const updatedData = {
      ...products,
      categories: [...products.categories, newCategory],
    };

    updateProducts(updatedData)
      .then(() => alert("Category added successfully!"))
      .catch(() => alert("Failed to add category"));
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                Admin Panel Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Default password: admin123
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Admin Dashboard
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage your e-shop products</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "products"
                ? "border-accent text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "settings"
                ? "border-accent text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        {/* Content */}
        {activeTab === "products" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <AdminProductForm
                categories={products?.categories || []}
                onSubmit={handleAddProduct}
                initialProduct={editingProduct}
                isLoading={isLoading}
              />
              {editingProduct && (
                <Button
                  onClick={() => setEditingProduct(undefined)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            {/* Product List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Products ({products?.products.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminProductList
                    products={products?.products || []}
                    onEdit={setEditingProduct}
                    onDelete={handleDeleteProduct}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-category">Add New Category</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="new-category"
                        placeholder="e.g., Electronics"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddCategory(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById(
                            "new-category"
                          ) as HTMLInputElement;
                          if (input) {
                            handleAddCategory(input.value);
                            input.value = "";
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 text-primary">
                      Current Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {products?.categories.map((cat) => (
                        <span
                          key={cat}
                          className="bg-gray-100 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>GitHub Token</Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Set the VITE_GITHUB_TOKEN environment variable to enable
                      GitHub sync
                    </p>
                  </div>
                  <div>
                    <Label>WhatsApp Phone Number</Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current: +233 571 778 866
                    </p>
                  </div>
                  <div>
                    <Label>Cache</Label>
                    <Button
                      onClick={() => {
                        localStorage.removeItem("e_shop_products_cache");
                        localStorage.removeItem(
                          "e_shop_products_cache_timestamp"
                        );
                        alert("Cache cleared");
                      }}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Clear Product Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
