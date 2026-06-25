import { SITE_PHONE_DISPLAY, SITE_WHATSAPP_URL } from "@/constants/site";

interface WhatsAppLinkProps {
  className?: string;
  showNumber?: boolean;
}

export default function WhatsAppLink({
  className = "",
  showNumber = true,
}: WhatsAppLinkProps) {
  return (
    <a
      href={SITE_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 hover:text-elite-gold transition-colors ${className}`}
    >
      <i className="fa-brands fa-whatsapp text-[1.1rem] text-[#25D366]" aria-hidden />
      {showNumber && <span>{SITE_PHONE_DISPLAY}</span>}
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
