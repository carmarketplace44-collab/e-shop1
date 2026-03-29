import { Product } from "./ProductCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, Edit2 } from "lucide-react";

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  isLoading?: boolean;
}

export function AdminProductList({
  products,
  onEdit,
  onDelete,
  isLoading = false,
}: AdminProductListProps) {
  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await onDelete(productId);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No products yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Category</th>
            <th className="text-left py-3 px-4 font-semibold">Price</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.description.substring(0, 50)}...
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">{product.category}</td>
              <td className="py-4 px-4">
                {product.currency} {product.price.toLocaleString()}
              </td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  {product.is_featured && (
                    <Badge className="bg-accent text-primary">Featured</Badge>
                  )}
                  {product.is_promoted && (
                    <Badge className="bg-green-500 text-white">
                      {product.promotion_tag || "Promoted"}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
