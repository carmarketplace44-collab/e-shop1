import { Layout } from "@/components/Layout";
import { BannerSlider, BannerSlide } from "@/components/BannerSlider";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryCard } from "@/components/CategoryCard";
import { useProducts } from "@/hooks/useProducts";
import { useAnalyticsSync } from "@/hooks/useAnalyticsSync";
import { getTopProductsForBanner } from "@/lib/auto-feature";
import { Package, Truck, MessageCircle } from "lucide-react";

const DEMO_BANNERS: BannerSlide[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    title: "Welcome to e-shop",
    subtitle: "Discover premium products delivered with excellence",
    cta_text: "Shop Now",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=600&fit=crop",
    title: "New Arrivals",
    subtitle: "Explore our latest collection",
    cta_text: "Browse Collection",
  },
];

const TRUST_FEATURES = [
  {
    icon: <Package size={32} />,
    title: "Cash on Delivery",
    description: "Pay securely when your order arrives",
  },
  {
    icon: <Truck size={32} />,
    title: "Fast Delivery in Ghana",
    description: "Quick and reliable delivery to your doorstep",
  },
  {
    icon: <MessageCircle size={32} />,
    title: "Order via WhatsApp",
    description: "Easy ordering through WhatsApp messaging",
  },
];

export default function Home() {
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN || "";
  const githubOwner = import.meta.env.VITE_GITHUB_OWNER || "YOUR_USERNAME";
  const githubRepo = import.meta.env.VITE_GITHUB_REPO || "e-shop-data";

  const { products, loading } = useProducts(githubToken, githubOwner, githubRepo);

  // Initialize analytics sync
  useAnalyticsSync(githubToken, githubOwner, githubRepo, !!githubToken);

  // Generate dynamic banners from top products
  const topProductsForBanner = products?.products
    ? getTopProductsForBanner(products.products).slice(0, 3)
    : [];

  const dynamicBanners: BannerSlide[] = topProductsForBanner.map((product) => ({
    id: product.id,
    image: product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    title: product.name,
    subtitle: product.description.substring(0, 100),
    cta_text: "View Product",
  }));

  const banners = dynamicBanners.length > 0 ? dynamicBanners : DEMO_BANNERS;

  const featuredProducts =
    products?.products?.filter((p) => p.is_featured).slice(0, 4) || [];
  const promotedProducts =
    products?.products?.filter((p) => p.is_promoted).slice(0, 4) || [];
  const categories = products?.categories || [];

  return (
    <Layout>
      {/* Hero Banner - Auto-updated with top products */}
      <section>
        <BannerSlider slides={banners} autoPlay={true} autoPlayInterval={5000} />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-10 text-center text-primary">
              Shop by Category
            </h2>

            {categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const productCount = products?.products?.filter(
                    (p) => p.category === category
                  ).length || 0;
                  return (
                    <CategoryCard
                      key={category}
                      name={category}
                      productCount={productCount}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Categories will appear once you add products via the admin panel</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products or Setup Info */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-primary">
            Featured Products
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Handpicked items curated for quality and value
          </p>

          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} columns={4} />
          ) : (
            <div className="bg-white rounded-[14px] p-12 text-center border-2 border-dashed border-accent/30">
              <p className="text-muted-foreground mb-4">
                No products configured yet
              </p>
              <a
                href="/admin-secret-eshop"
                className="inline-block text-accent hover:underline font-semibold"
              >
                Go to Admin Panel to Add Products
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Promoted Products */}
      {promotedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-primary">
              Special Promotions
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Limited time offers on selected items
            </p>
            <ProductGrid products={promotedProducts} columns={4} />
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center text-primary">
            Why Shop With Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRUST_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center rounded-[14px] bg-white p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-accent mb-4">{feature.icon}</div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Shop?
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Browse our complete collection and order via WhatsApp
          </p>
          <a
            href="/products"
            className="inline-block bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Explore All Products
          </a>
        </div>
      </section>
    </Layout>
  );
}
