import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronLeft, Heart } from "lucide-react";
import { trackProductView, trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_PHONE = "233571778866";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const githubToken = import.meta.env.VITE_GITHUB_TOKEN || "";
  const githubOwner = import.meta.env.VITE_GITHUB_OWNER || "YOUR_USERNAME";
  const githubRepo = import.meta.env.VITE_GITHUB_REPO || "e-shop-data";

  const { products } = useProducts(githubToken, githubOwner, githubRepo);

  const product = products?.products.find((p) => p.id === id);

  // Track product view on page load
  useEffect(() => {
    if (id) {
      trackProductView(id);
    }
  }, [id]);

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/products")}>
            <ChevronLeft size={16} />
            Back to Products
          </Button>
        </div>
      </Layout>
    );
  }

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(product.id);
    const message = `Hello, I'm interested in this product:\n\n🛍️ ${product.name}\n💰 Price: ${product.currency} ${product.price.toLocaleString()}\n📝 ${product.description}\n\nPlease assist me with ordering.`;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
    window.open(waLink, "_blank");
  };

  const relatedProducts = products?.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-accent hover:underline mb-8"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-square rounded-[14px] overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg">
              {product.images && product.images[selectedImageIndex] ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No image</span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === index
                        ? "border-accent"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category & Badges */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full inline-block mb-3">
                {product.category}
              </span>
              <div className="flex gap-2">
                {product.is_featured && (
                  <Badge className="bg-accent text-primary">Featured</Badge>
                )}
                {product.is_promoted && product.promotion_tag && (
                  <Badge className="bg-green-500 text-white">
                    {product.promotion_tag}
                  </Badge>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">Price</p>
              <p className="font-heading text-4xl md:text-5xl font-bold text-primary">
                {product.currency} {product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-base h-12"
              >
                <MessageCircle size={20} />
                Order on WhatsApp
              </Button>
              <Button
                onClick={() => setIsFavorite(!isFavorite)}
                variant="outline"
                size="lg"
                className="w-full text-base h-12"
              >
                <Heart
                  size={20}
                  className={isFavorite ? "fill-current" : ""}
                />
                {isFavorite ? "Saved" : "Save for Later"}
              </Button>
            </div>

            {/* Trust Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">
                  Cash on Delivery Available
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">
                  Fast Delivery in Ghana
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">
                  Secure WhatsApp Ordering
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="cursor-pointer group overflow-hidden rounded-[14px] bg-white shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-gray-200">
                    {p.images && p.images[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-primary text-sm mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="font-heading text-lg font-bold text-primary">
                      {p.currency} {p.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
