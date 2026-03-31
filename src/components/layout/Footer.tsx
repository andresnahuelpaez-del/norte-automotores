import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Instagram, Facebook, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317";
const IG = "https://instagram.com/norte.automotores";
const FB = "https://facebook.com/share/177Lw7quNV/?mibextid=wwXlfr";
const ADDRESS = "Av. Coronel Felipe Varela 1776, La Rioja, Argentina";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#060E1C] text-white overflow-hidden">
      {/* Racing stripe top */}
      <div className="h-[3px] bg-gradient-to-r from-brand-red via-brand-red/80 to-transparent" />

      {/* Speed lines bg */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.008) 80px, rgba(255,255,255,0.008) 81px)"
        }}
      />

      {/* Red glow top-left */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="block mb-5 w-fit group">
              <div className="bg-white p-3 shadow-lg shadow-black/30 group-hover:shadow-brand-red/20 transition-shadow duration-300 overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              >
                <Image
                  src="/norte-logo.PNG"
                  alt="Norte Automotores"
                  width={200}
                  height={100}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-5">
              Venta de autos usados seleccionados. Recibimos tu auto o moto. La Rioja, Argentina.
            </p>
            <div className="flex gap-2.5">
              <a
                href={IG}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-white/[0.04] hover:bg-brand-red border border-white/[0.06] hover:border-brand-red flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
              >
                <Instagram size={15} />
              </a>
              <a
                href={FB}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 bg-white/[0.04] hover:bg-brand-red border border-white/[0.06] hover:border-brand-red flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
              >
                <Facebook size={15} />
              </a>
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 bg-white/[0.04] hover:bg-[#25D366] border border-white/[0.06] hover:border-[#25D366] flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
              >
                <WhatsAppIcon size={15} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-display font-black text-[10px] uppercase tracking-[0.35em] text-brand-red mb-5 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-brand-red" />
              Navegación
            </h3>
            <ul className="space-y-2.5 text-white/45 text-sm">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo de autos" },
                { href: "/motos", label: "Motos" },
                { href: "/financiacion", label: "Financiación" },
                { href: "/contacto", label: "Contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:pl-1 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-brand-red/50 group-hover:bg-brand-red transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="font-display font-black text-[10px] uppercase tracking-[0.35em] text-brand-red mb-5 flex items-center gap-2">
              <Clock size={10} className="text-brand-red" />
              Horarios
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1 font-mono">Lunes a Viernes</p>
                <p className="text-white/80 font-medium">09:00 – 13:00</p>
                <p className="text-white/80 font-medium">18:00 – 22:00</p>
              </li>
              <li className="pt-1">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1 font-mono">Sábado</p>
                <p className="text-white/80 font-medium">09:00 – 13:00</p>
              </li>
              <li className="pt-1">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1 font-mono">Domingo</p>
                <p className="text-white/25">Cerrado</p>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-black text-[10px] uppercase tracking-[0.35em] text-brand-red mb-5 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-brand-red" />
              Contacto
            </h3>
            <ul className="space-y-4 text-white/45 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5 text-brand-red" />
                <span>{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-brand-red shrink-0" />
                <a href="tel:+543804796317" className="hover:text-white transition-colors font-mono">
                  +54 380 479-6317
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-brand-red shrink-0" />
                <a href="mailto:ventas@norteautomotores.com.ar" className="hover:text-white transition-colors">
                  ventas@norteautomotores.com.ar
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <WhatsAppIcon size={14} className="text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${WA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:text-[#20c45e] transition-colors font-medium"
                >
                  Escribinos por WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/15 text-xs font-mono border-t border-white/[0.04]">
          <span>© {year} Norte Automotores — Todos los derechos reservados.</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-red/50" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
            La Rioja, Argentina
          </span>
        </div>
      </div>
    </footer>
  );
}
