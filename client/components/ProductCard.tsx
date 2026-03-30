import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  is_featured: boolean;
  is_promoted: boolean;
  promotion_tag?: string;
  description: string;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const defaultImageSrc = "/placeholder.svg";
  const initialImageSrc = product.images && product.images[0] ? product.images[0] : defaultImageSrc;
  const [src, setSrc] = useState(initialImageSrc);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group overflow-hidden rounded-[14px] bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      {/* Image Container */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-200">
        <img
          src={src}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={() => setSrc(defaultImageSrc)}
        />

        {/* Promotion Badge */}
        {product.is_promoted && product.promotion_tag && (
          <div className="absolute right-4 top-4">
            <Badge className="bg-accent text-primary font-semibold text-sm">
              {product.promotion_tag}
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {product.is_featured && !product.is_promoted && (
          <div className="absolute right-4 top-4">
            <Badge className="bg-accent text-primary font-semibold text-sm">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="font-heading text-lg font-bold leading-tight text-primary line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-heading text-2xl font-bold text-primary">
              {product.currency} {product.price.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-gray-100 rounded px-2 py-1">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
