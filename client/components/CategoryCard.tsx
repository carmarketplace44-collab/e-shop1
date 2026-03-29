import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  icon?: React.ReactNode;
  productCount?: number;
}

export function CategoryCard({
  name,
  icon,
  productCount,
}: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(name)}`}
      className="group flex flex-col items-center justify-center gap-3 rounded-[14px] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
    >
      {icon && (
        <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-center text-primary">
        {name}
      </h3>
      {productCount !== undefined && (
        <span className="text-sm text-muted-foreground">
          {productCount} products
        </span>
      )}
    </Link>
  );
}
