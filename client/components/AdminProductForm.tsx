import { useState } from "react";
import { Product } from "./ProductCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";

interface AdminProductFormProps {
  categories: string[];
  onSubmit: (product: Omit<Product, "created_at"> & { created_at?: string }) => Promise<void>;
  initialProduct?: Product;
  isLoading?: boolean;
}

export function AdminProductForm({
  categories,
  onSubmit,
  initialProduct,
  isLoading = false,
}: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    id: initialProduct?.id || crypto.randomUUID(),
    name: initialProduct?.name || "",
    price: initialProduct?.price || 0,
    currency: initialProduct?.currency || "GHS",
    category: initialProduct?.category || categories[0] || "",
    description: initialProduct?.description || "",
    is_featured: initialProduct?.is_featured || false,
    is_promoted: initialProduct?.is_promoted || false,
    promotion_tag: initialProduct?.promotion_tag || "",
    images: initialProduct?.images || [""],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleToggle = (field: "is_featured" | "is_promoted") => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImageInput = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageInput = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      images: formData.images.filter((img) => img.trim()),
      created_at: initialProduct?.created_at || new Date().toISOString(),
    };
    await onSubmit(productData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {initialProduct ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </div>

          {/* Images */}
          <div className="space-y-3">
            <Label>Product Images</Label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Image URL"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeImageInput(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImageInput}
            >
              Add Image
            </Button>
          </div>

          {/* Toggles */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured Product</Label>
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={() => handleToggle("is_featured")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="promoted">Promoted Product</Label>
              <Switch
                id="promoted"
                checked={formData.is_promoted}
                onCheckedChange={() => handleToggle("is_promoted")}
              />
            </div>
          </div>

          {/* Promotion Tag */}
          {formData.is_promoted && (
            <div className="space-y-2">
              <Label htmlFor="promotion_tag">Promotion Tag</Label>
              <Input
                id="promotion_tag"
                name="promotion_tag"
                value={formData.promotion_tag}
                onChange={handleInputChange}
                placeholder="e.g., Sale, New, Limited"
              />
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading
                ? "Saving..."
                : initialProduct
                  ? "Update Product"
                  : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
