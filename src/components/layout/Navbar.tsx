"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

const links = [
  { href: "/catalogo", label: "Autos" },
  { href: "/motos", label: "Motos" },
  { href: "/financiacion", label: "Financiación" },
  { href: "/contacto", label: "Contacto" },
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Racing stripe top */}
      <div className="h-[3px] bg-gradient-to-r from-brand-red via-brand-red to-transparent" />

      {/* Topbar */}
      <div
        className={cn(
          "border-b transition-all duration-400 bg-[#081426]/90",
          scrolled
            ? "opacity-0 pointer-events-none border-transparent"
            : "opacity-100 border-white/[0.06]"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] text-white/40 transition-all duration-400",
            scrolled ? "h-0 overflow-hidden" : "h-8"
          )}
        >
          <div className="flex items-center gap-5">
            <span className="hidden sm:flex items-center gap-1.5 font-mono">
              <MapPin size={10} className="text-brand-red shrink-0" />
              Av. Coronel Felipe Varela 1776, La Rioja
            </span>
            <a
              href="tel:+543804796317"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-mono"
            >
              <Phone size={10} className="text-brand-red shrink-0" />
              +54 380 479-6317
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/20 hidden sm:block font-mono tracking-wider text-[10px]">LUN–VIE 9–13 / 18–22 · SÁB 9–13</span>
            <a
              href={`https://wa.me/${WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#25D366] hover:text-[#20c45e] transition-colors font-bold tracking-wider"
            >
              <WhatsAppIcon size={10} />
              WHATSAPP
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "transition-all duration-500 relative",
          scrolled
            ? "bg-[#081426]/97 backdrop-blur-xl shadow-[0_2px_0_rgba(204,32,32,0.4)]"
            : "bg-[#081426]/80 backdrop-blur-sm"
        )}
      >
        {/* Carbon fiber bg subtle */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)"
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <div className="bg-white p-1.5 shadow-md shadow-black/30">
                  <Image
                    src="/norte-logo.PNG"
                    alt="Norte Automotores"
                    width={34}
                    height={34}
                    className="h-[34px] w-auto object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col leading-none gap-[2px]">
                <span className="font-display font-black text-white text-[18px] tracking-[0.2em] uppercase leading-none">
                  Norte
                </span>
                <span className="font-display text-brand-red text-[8px] tracking-[0.55em] uppercase leading-none font-bold">
                  Automotores
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative text-white/55 hover:text-white text-[13px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 group px-4 py-2"
                >
                  {l.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-red group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white text-[13px] font-bold px-5 py-2.5 uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                <WhatsAppIcon size={14} />
                WhatsApp
              </a>
            </div>

            <button
              className="md:hidden text-white/70 hover:text-white p-2 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {/* Bottom red accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-brand-red/80 via-brand-red/20 to-transparent" />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#081426]/99 backdrop-blur-xl border-t border-brand-red/30 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    className="flex items-center justify-between text-white/70 hover:text-white font-bold text-lg uppercase tracking-wider transition-colors border-l-2 border-transparent hover:border-brand-red pl-3"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                    <ChevronRight size={16} className="text-white/20" />
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-white/[0.06] pt-4">
                <a
                  href="tel:+543804796317"
                  className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors font-mono"
                >
                  <Phone size={14} className="text-brand-red" />
                  +54 380 479-6317
                </a>
              </div>

              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white font-bold px-4 py-3.5 w-full justify-center transition-colors uppercase tracking-wider"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                onClick={() => setOpen(false)}
              >
                <WhatsAppIcon size={18} />
                Hablar por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
