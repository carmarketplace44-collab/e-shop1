import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  productId?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your products.",
  productId,
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    // Track click if product ID is provided
    if (productId) {
      trackWhatsAppClick(productId);
    }

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(waLink, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:scale-110"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  );
}
