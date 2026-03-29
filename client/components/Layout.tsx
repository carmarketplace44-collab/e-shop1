import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-lg">E</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary hidden sm:inline">
                e-shop
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-primary hover:text-accent transition">
                Home
              </Link>
              <Link to="/products" className="text-primary hover:text-accent transition">
                Shop
              </Link>
              <Link
                to="/admin-secret-eshop"
                className="text-primary hover:text-accent transition"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-primary"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-3 border-t pt-4">
              <Link
                to="/"
                className="text-primary hover:text-accent transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-primary hover:text-accent transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/admin-secret-eshop"
                className="text-primary hover:text-accent transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-heading text-lg font-bold mb-4">About e-shop</h3>
              <p className="text-gray-300 text-sm">
                Premium online storefront for quality products, delivered with excellence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/" className="hover:text-accent transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-accent transition">
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin-secret-eshop"
                    className="hover:text-accent transition"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-300 text-sm">
                <strong>WhatsApp:</strong> +233 571 778 866
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Available Mon-Fri, 9 AM - 6 PM
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; {new Date().getFullYear()} e-shop. All rights reserved.</p>
            <p>Designed for excellence • Optimized for conversion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
