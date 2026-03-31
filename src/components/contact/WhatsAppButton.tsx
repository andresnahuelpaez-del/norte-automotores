"use client";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317";
  const url = `https://wa.me/${number}?text=${encodeURIComponent("Hola! Quiero consultar sobre sus vehículos.")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-0 hover:gap-3 bg-[#25D366] hover:bg-[#20c45e] text-white rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 overflow-hidden"
      aria-label="Consultanos por WhatsApp"
    >
      <span className="max-w-0 group-hover:max-w-[160px] overflow-hidden transition-all duration-300 whitespace-nowrap text-sm font-semibold pl-0 group-hover:pl-5">
        Consultanos
      </span>
      <div className="w-14 h-14 flex items-center justify-center rounded-full shrink-0">
        <WhatsAppIcon size={26} />
      </div>
    </a>
  );
}
