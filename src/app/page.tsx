export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Zap, Clock,
  ChevronRight, MapPin, Phone, FileCheck2, Shield, Bike, Car, Calculator,
} from "lucide-react";
import { CarCard } from "@/components/cars/CarCard";
import { QuickSearchForm } from "@/components/cars/QuickSearchForm";
import { CotizadorHome } from "@/components/cars/CotizadorHome";
import { HeroSlider } from "@/components/cars/HeroSlider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCars, getSiteConfig } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Norte Automotores | Venta de Autos Usados en La Rioja",
  description: "Comprá tu auto o moto usado o 0km en La Rioja capital. Financiación propia en cuotas fijas, gestoría automotor y seguros. Stock de autos y motos usados en La Rioja, Argentina.",
  alternates: { canonical: "/" },
  keywords: [
    "autos usados La Rioja",
    "comprar auto La Rioja",
    "usados La Rioja capital",
    "motos usadas La Rioja",
    "financiación auto La Rioja",
    "0km La Rioja",
    "okm la rioja",
    "concesionaria La Rioja",
    "autos La Rioja Argentina",
    "usados La Rioja Argentina",
  ],
};

const WA = "5493804796317";
const ADDRESS = "Av. Coronel Felipe Varela y Senador Rodolfo Blanco, La Rioja Capital";
const GOOGLE_MAPS = "https://www.google.com/maps/search/?api=1&query=Av.+Coronel+Felipe+Varela+y+Senador+Rodolfo+Blanco,+La+Rioja";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof getCars>> = [];
  let latestCars: Awaited<ReturnType<typeof getCars>> = [];
  let latestMotos: Awaited<ReturnType<typeof getCars>> = [];
  let financingCars: Awaited<ReturnType<typeof getCars>> = [];
  let config: Awaited<ReturnType<typeof getSiteConfig>>;

  try {
    [featured, latestCars, latestMotos, financingCars, config] = await Promise.all([
      getCars({ is_featured: true, vehicle_type: "all", limit: 6, light: true }),
      getCars({ vehicle_type: "car", limit: 6, light: true }),
      getCars({ vehicle_type: "moto", limit: 3, light: true }),
      getCars({ financing_available: true, vehicle_type: "car", limit: 60, light: true }),
      getSiteConfig(),
    ]);
  } catch (err) {
    console.error("[HomePage] Error fetching data:", err);
    config = {
      whatsapp_number: WA,
      show_prices_globally: "true",
      show_financing_globally: "true",
      hero_title: "",
      hero_subtitle: "",
      address: ADDRESS,
      phone: "+54 380 479-6317",
      email: "ventas@norteautomotores.com.ar",
      instagram: "norte.automotores",
      facebook: "https://facebook.com/share/177Lw7quNV/?mibextid=wwXlfr",
    };
  }

  const wa = config.whatsapp_number || WA;
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent("Hola! Quiero consultar sobre sus vehículos.")}`;

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F7F9FB] -mt-[108px] pt-[108px]">

        {/* ── MOBILE ── */}
        <div className="relative lg:hidden overflow-hidden flex flex-col justify-center px-5 pt-[130px] pb-12 bg-white">

          <div className="relative">
            {/* Racing tag */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[3px] bg-brand-red" />
              <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.4em] font-mono">La Rioja, Argentina</span>
              <div className="w-4 h-[3px] bg-brand-red/40" />
            </div>

            <div className="glint">
            <h1 className="font-display font-black text-[3.8rem] text-[#173A5E] uppercase tracking-tight leading-[0.85] mb-5">
              {config.hero_title ? config.hero_title : (
                <>TU AUTO IDEAL<br /><span className="text-brand-red" style={{ textShadow: "0 0 40px rgba(204,32,32,0.5)" }}>ESTÁ EN</span><br />NORTE</>
              )}
            </h1>
            </div>

            <p className="text-[#5B6B7D] text-[13px] mb-7 leading-relaxed font-mono">
              {config.hero_subtitle || "Autos · Motos · Financiación propia — La Rioja"}
            </p>

            <div className="flex gap-3 mb-4">
              <Link href="/catalogo"
                className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white font-black text-sm py-4 uppercase tracking-wider transition-all active:scale-95"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)", boxShadow: "0 0 20px rgba(204,32,32,0.35)" }}
              >
                Ver catálogo <ArrowRight size={15} />
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-black text-sm py-4 uppercase tracking-wider transition-all active:scale-95"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                <WhatsAppIcon size={15} /> WhatsApp
              </a>
            </div>
            <a href="#cotizador"
              className="flex items-center justify-center gap-2 w-full border border-brand-red/50 bg-brand-red/5 hover:bg-brand-red text-brand-red hover:text-white font-black text-sm py-3.5 uppercase tracking-wider transition-all duration-300 mb-8"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
            >
              <Calculator size={15} />
              Cotizá tu financiamiento
            </a>

            {/* Franja slider de autos con el logo Norte */}
            <div
              className="relative h-48 mb-7 overflow-hidden bg-[#132C56] border-t-2 border-brand-red"
              style={{ clipPath: "polygon(0 0, 100% 4%, 100% 100%, 0 100%)" }}
            >
              <HeroSlider images={["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"]} dots={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1B38]/80 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 z-10 bg-white px-2.5 py-1.5 shadow-lg shadow-black/30"
                style={{ clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/norte-logo.PNG" alt="Norte Automotores" className="h-8 w-auto object-contain" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex pt-5 border-t border-brand-red/20">
              {[
                { to: 150, suffix: "+", label: "en stock" },
                { to: 24, suffix: "hs", label: "respuesta" },
                { to: 100, suffix: "%", label: "financiación" },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 ${i > 0 ? "border-l border-[#173A5E]/15 pl-4" : ""}`}>
                  <AnimatedCounter to={s.to} suffix={s.suffix} className="font-display font-black text-[1.8rem] text-[#173A5E] leading-none" />
                  <p className="text-[#5B6B7D]/90 text-[10px] mt-1 uppercase tracking-wider font-mono">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden lg:block relative min-h-[88dvh] bg-white overflow-hidden">

          {/* Filo rojo del corte diagonal */}
          <div
            className="absolute top-0 right-0 w-[45%] h-full bg-brand-red"
            style={{ clipPath: "polygon(128px 0, 150px 0, 22px 100%, 0 100%)" }}
          />
          {/* Panel derecho — slider de autos con el logo Norte encima */}
          <div
            className="absolute top-0 right-0 w-[45%] h-full bg-[#132C56] overflow-hidden"
            style={{ clipPath: "polygon(150px 0, 100% 0, 100% 100%, 22px 100%)" }}
          >
            <HeroSlider images={["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"]} />
            {/* Degradado inferior para dar profundidad y legibilidad al logo */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1B38]/85 via-transparent to-[#0A1B38]/25 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#132C56] to-transparent pointer-events-none" />
            {/* Logo Norte en placa */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-white px-4 py-2.5 shadow-xl shadow-black/30"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/norte-logo.PNG" alt="Norte Automotores" className="h-14 w-auto object-contain" />
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex items-center min-h-[88dvh] pt-[108px] pb-16">
            <div className="max-w-2xl">

              {/* Racing tag */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-[3px] bg-brand-red" />
                <span className="text-brand-red text-[11px] font-black uppercase tracking-[0.5em] font-mono">Norte Automotores — La Rioja</span>
              </div>

              <div className="glint">
              <h1 className="font-display font-black text-[clamp(3.5rem,7vw,7.5rem)] text-[#173A5E] uppercase tracking-tight leading-[0.85] mb-8">
                {config.hero_title ? config.hero_title : (
                  <>TU AUTO IDEAL<br /><span className="text-brand-red" style={{ textShadow: "0 0 60px rgba(204,32,32,0.45)" }}>ESTÁ EN</span><br />NORTE</>
                )}
              </h1>
              </div>

              <p className="text-[#5B6B7D] text-lg mb-10 max-w-md leading-relaxed font-mono tracking-wide">
                {config.hero_subtitle || "Autos · Motos · Financiación propia — La Rioja, Argentina"}
              </p>

              <div className="flex flex-wrap gap-3 mb-16">
                <Link
                  href="/catalogo"
                  className="pulse-glow group flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-black px-10 py-4 uppercase tracking-widest transition-all duration-200"
                  style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                >
                  Ver catálogo <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white font-black px-8 py-4 uppercase tracking-widest transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
                  style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                >
                  <WhatsAppIcon size={17} />
                  WhatsApp
                </a>
                <a
                  href="#cotizador"
                  className="flex items-center gap-2 border-2 border-brand-red/60 bg-brand-red/5 hover:bg-brand-red text-brand-red hover:text-white font-black px-8 py-4 uppercase tracking-widest transition-all duration-200"
                  style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                >
                  <Calculator size={16} />
                  Cotizá tu cuota
                </a>
              </div>

              {/* Stats con estilo tablero de carrera */}
              <div className="flex gap-8 pt-8 border-t border-brand-red/20">
                {[
                  { to: 150, suffix: "+", label: "Vehículos en stock" },
                  { to: 24, suffix: "hs", label: "Respuesta por WhatsApp" },
                  { to: 100, suffix: "%", label: "Financiación propia" },
                ].map((stat, i) => (
                  <div key={stat.label} className={i > 0 ? "border-l border-[#173A5E]/15 pl-8" : ""}>
                    <AnimatedCounter to={stat.to} suffix={stat.suffix} className="font-display font-black text-5xl text-[#173A5E] leading-none mb-2 tabular-nums" />
                    <p className="text-[#5B6B7D]/90 text-xs uppercase tracking-[0.2em] font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESTACADOS (autos + motos)
      ══════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-14 sm:py-24 bg-[#F7F9FB] relative overflow-hidden">
          {/* Speed lines */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(23,58,94,0.03) 80px, rgba(23,58,94,0.03) 81px)" }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-end justify-between mb-8 sm:mb-14">
              <div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-[3px] bg-brand-red" />
                  <span className="text-brand-red text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] font-mono">
                    Selección especial
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#173A5E] uppercase leading-none">
                  Destacados
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="hidden sm:flex items-center gap-1.5 text-[#5B6B7D] hover:text-brand-red text-sm font-bold uppercase tracking-wider transition-colors group font-mono"
              >
                Ver todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {featured.map((car, i) => (
                <FadeIn key={car.id} delay={i * 0.08} direction="up">
                  <CarCard car={car} whatsappNumber={wa} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          AUTOS (últimos ingresos)
      ══════════════════════════════════════════════════════ */}
      {latestCars.length > 0 && (
        <section className="py-14 sm:py-24 bg-[#EFF2F8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-end justify-between mb-8 sm:mb-14">
              <div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-[3px] bg-brand-red" />
                  <span className="text-brand-red text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] font-mono">
                    Últimos ingresos
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#173A5E] uppercase leading-none">
                  Autos
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="hidden sm:flex items-center gap-1.5 text-[#5B6B7D] hover:text-brand-red text-sm font-bold uppercase tracking-wider transition-colors group font-mono"
              >
                Ver todos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {latestCars.map((car, i) => (
                <FadeIn key={car.id} delay={i * 0.08} direction="up">
                  <CarCard car={car} whatsappNumber={wa} />
                </FadeIn>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/catalogo"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-brand-red/50 hover:bg-brand-red text-[#173A5E] hover:text-white font-black px-8 py-3.5 uppercase tracking-widest transition-all duration-200 text-sm"
                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
              >
                Ver catálogo completo <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          MOTOS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-[#16293F] relative overflow-hidden">
        {/* Marca de agua N sutil */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/isotipo-n.svg" alt="" aria-hidden="true"
          className="absolute pointer-events-none select-none opacity-[0.04] -rotate-12 w-[560px] max-w-none -left-32 bottom-[-120px] brightness-0 invert"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-14">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="h-px w-8 sm:w-10 bg-brand-red" />
                <span className="text-brand-red text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                  Dos ruedas
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
                Motos
              </h2>
            </div>
            <Link
              href="/motos"
              className="hidden sm:flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-medium transition-colors group"
            >
              Ver todas <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {latestMotos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
                {latestMotos.map((moto) => (
                  <CarCard key={moto.id} car={moto} whatsappNumber={wa} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/motos"
                  className="inline-flex items-center gap-2 border border-white/25 hover:border-brand-red hover:bg-brand-red text-white font-semibold px-7 py-3 rounded-none transition-all duration-300 text-sm active:scale-95"
                >
                  Ver catálogo completo de motos <ArrowRight size={15} />
                </Link>
              </div>
            </>
          ) : (
            <Link
              href="/motos"
              className="group relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white border border-[#173A5E]/15 hover:border-brand-red/40 rounded-none overflow-hidden p-7 sm:p-12 transition-all duration-500 active:scale-[0.99]"
            >
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-red/5 rounded-full pointer-events-none" />
              <span className="text-6xl sm:text-7xl lg:text-8xl shrink-0">🏍️</span>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[#173A5E] uppercase leading-none mb-3">
                  Honda · Yamaha<br className="sm:hidden" /> · Bajaj · Royal Enfield
                </h3>
                <p className="text-[#5B6B7D] text-sm sm:text-base max-w-md">
                  Todas revisadas, con papeles y financiación. Nuevas y usadas.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-brand-red/10 group-hover:bg-brand-red border border-brand-red/30 group-hover:border-transparent text-brand-red group-hover:text-white font-bold px-6 py-3 rounded-none transition-all duration-300 shrink-0">
                Ver motos <ArrowRight size={17} />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          QUICK SEARCH
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#132C56] py-6 sm:py-8 border-t border-brand-red/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.04] border border-white/10 p-4 sm:p-5"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          >
            <QuickSearchForm labelClassName="text-white/60" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORÍAS
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F7F9FB] relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-red/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px w-8 sm:w-12 bg-brand-red" />
              <span className="text-brand-red text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em]">
                Explorá el stock
              </span>
              <div className="h-px w-8 sm:w-12 bg-brand-red" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-[#173A5E] uppercase leading-none">
              Buscá tu vehículo
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "SUVs", icon: "suv", query: "/catalogo?tipo=suv", desc: "Los más buscados", num: "01" },
              { label: "Pickups", icon: "pickup", query: "/catalogo?tipo=pickup", desc: "Trabajo y aventura", num: "02" },
              { label: "Sedanes", icon: "sedan", query: "/catalogo?tipo=sedan", desc: "Confort urbano", num: "03" },
              { label: "0 km", icon: "0km", query: "/catalogo?condicion=new", desc: "Directo de fábrica", num: "04" },
              { label: "Motos", icon: "moto", query: "/motos", desc: "Todas las marcas", num: "05" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.query}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-none bg-[#EFF2F8] border border-[#173A5E]/15 hover:border-brand-red/60 hover:bg-brand-red/[0.05] transition-all duration-300 overflow-hidden min-h-[140px] sm:min-h-[170px]"
              >
                {/* Número decorativo */}
                <span className="absolute top-3 right-4 font-display font-black text-[2.5rem] sm:text-[3.5rem] leading-none text-[#173A5E]/[0.05] group-hover:text-brand-red/10 transition-colors select-none">
                  {cat.num}
                </span>

                {/* Icono SVG inline premium */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-none bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mb-4 group-hover:bg-brand-red/20 group-hover:border-brand-red/40 transition-all duration-300">
                  {cat.icon === "suv" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red"><path d="M3 12V15M21 12V15M3 15H21M5 15V17H7V15M17 15V17H19V15M4 12L6 7H18L20 12" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {cat.icon === "pickup" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red"><path d="M3 12V15M21 12V15M3 15H21M5 15V17H7V15M17 15V17H19V15M4 12L7 7H14L17 9H20L20 12" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {cat.icon === "sedan" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red"><path d="M3 13V15M21 13V15M3 15H21M5 15V17H7V15M17 15V17H19V15M4 13L7 9H17L20 13" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {cat.icon === "0km" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red"><path d="M12 3L13.5 8H19L14.5 11.5L16 17L12 13.5L8 17L9.5 11.5L5 8H10.5L12 3Z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {cat.icon === "moto" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red"><circle cx="6" cy="15" r="3"/><circle cx="18" cy="15" r="3"/><path d="M6 15H9L12 9H16L18 12M18 12H14L12 9" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>

                <div>
                  <p className="font-display font-black text-[#173A5E] uppercase text-sm sm:text-base leading-tight group-hover:text-brand-red transition-colors duration-300">
                    {cat.label}
                  </p>
                  <p className="text-[#5B6B7D]/90 text-[10px] sm:text-xs mt-1 group-hover:text-[#5B6B7D] transition-colors">{cat.desc}</p>
                </div>

                {/* Arrow bottom right */}
                <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full border border-[#173A5E]/20 flex items-center justify-center group-hover:border-brand-red group-hover:bg-brand-red transition-all duration-300">
                  <ChevronRight size={11} className="text-[#5B6B7D]/70 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COTIZADOR
      ══════════════════════════════════════════════════════ */}
      <CotizadorHome
        cars={financingCars}
        waNumber={wa}
        anticipoMin={parseInt(config.financing_anticipo_min || "100000")}
        anticipoMax={parseInt(config.financing_anticipo_max || "10000000")}
        cuotaSliderMax={parseInt(config.financing_cuota_slider_max || "1500000")}
      />

      {/* ══════════════════════════════════════════════════════
          ENTREGÁ TU VEHÍCULO COMO PARTE DE PAGO
      ══════════════════════════════════════════════════════ */}
      <section className="bg-brand-red py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute -top-24 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/isotipo-n.svg" alt="" aria-hidden="true"
          className="absolute pointer-events-none select-none opacity-[0.07] -rotate-12 w-[420px] max-w-none -right-24 -bottom-24 brightness-0 invert"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start">
                <div className="h-px w-8 sm:w-10 bg-white/60" />
                <span className="text-white/80 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em]">
                  Recibimos tu usado
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase leading-none mb-3">
                ¿Tenés un auto o moto?<br />
                <span className="text-white/85">Lo tomamos como parte de pago</span>
              </h2>
              <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto lg:mx-0">
                Mandanos los datos de tu vehículo por WhatsApp y te lo cotizamos para que lo entregues como parte de pago de tu próximo auto o moto.
              </p>
            </div>
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent("Hola! Tengo un vehículo para entregar como parte de pago y quiero cotizarlo. Les paso los datos:\n\n• Marca y modelo:\n• Año:\n• Kilometraje:\n• Estado general:")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20c45e] text-white font-black text-sm sm:text-base px-8 sm:px-10 py-4 uppercase tracking-widest transition-all duration-200 hover:shadow-2xl hover:shadow-green-500/30 active:scale-95"
              style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
            >
              <WhatsAppIcon size={18} />
              Cotizá tu vehículo
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SERVICIOS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px w-8 sm:w-10 bg-brand-red" />
              <span className="text-brand-red text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                Más que vender vehículos
              </span>
              <div className="h-px w-8 sm:w-10 bg-brand-red" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#173A5E] uppercase leading-none mb-3 sm:mb-4">
              Servicios adicionales
            </h2>
            <p className="text-[#5B6B7D] text-sm sm:text-base max-w-sm sm:max-w-lg mx-auto">
              Gestoría y seguros para autos y motos, todo en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: Car,
                badge: "Gestoría",
                title: "Automotor",
                desc: "Transferencias, patentes, altas y bajas. Todos los trámites del automotor sin que te muevas.",
              },
              {
                icon: Bike,
                badge: "Gestoría",
                title: "Motocicletas",
                desc: "Tramitaciones completas para tu moto. Habilitaciones, transferencias y documentación al día.",
              },
              {
                icon: Shield,
                badge: "Seguros",
                title: "Para tu auto",
                desc: "Las mejores coberturas con las principales aseguradoras. Cotizamos en el momento.",
              },
              {
                icon: ShieldCheck,
                badge: "Seguros",
                title: "Para tu moto",
                desc: "Desde responsabilidad civil hasta todo riesgo. Protección completa para tu motocicleta.",
              },
            ].map((svc) => (
              <div
                key={svc.title}
                className="group flex flex-col p-5 sm:p-6 rounded-none bg-[#EFF2F8] border border-[#173A5E]/15 hover:border-brand-red/50 hover:bg-brand-red/[0.04] transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-none bg-brand-red/10 group-hover:bg-brand-red/20 flex items-center justify-center mb-4 sm:mb-5 transition-colors">
                  <svc.icon size={20} className="text-brand-red" />
                </div>
                <p className="text-brand-red text-[10px] font-bold uppercase tracking-[0.22em] mb-1">{svc.badge}</p>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#173A5E] uppercase leading-tight mb-2 sm:mb-3">
                  {svc.title}
                </h3>
                <p className="text-[#5B6B7D] text-sm leading-relaxed flex-1">{svc.desc}</p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-5 flex items-center gap-1.5 text-[#25D366] text-sm font-semibold"
                >
                  <WhatsAppIcon size={13} />
                  Consultar por WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINANCIACIÓN
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 sm:w-10 bg-brand-red" />
                <span className="text-brand-red text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                  Sin vueltas
                </span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#173A5E] uppercase leading-[0.9] mb-5 sm:mb-6">
                Financiación<br />
                <span className="text-brand-red">a tu medida</span>
              </h2>
              <p className="text-[#5B6B7D] text-sm sm:text-base leading-relaxed mb-7 sm:mb-8 max-w-sm">
                Planes flexibles para autos y motos. Trámite en el momento, sin burocracia.
              </p>
              <Link
                href="/financiacion"
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-none transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/30 active:scale-95 text-sm sm:text-base"
              >
                Ver planes de financiación <ArrowRight size={17} />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { num: "01", title: "Cuotas fijas", desc: "Pagás siempre lo mismo, sin sorpresas ni ajustes." },
                { num: "02", title: "Sin anticipo", desc: "Arrancá sin desembolso inicial en planes seleccionados." },
                { num: "03", title: "Aprobación rápida", desc: "Respuesta en minutos. Simple y directo." },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-4 sm:gap-5 bg-[#EFF2F8] border border-[#173A5E]/15 hover:border-brand-red/30 rounded-none p-4 sm:p-5 transition-colors duration-200">
                  <span className="font-display font-black text-2xl sm:text-3xl text-brand-red/20 leading-none w-9 sm:w-10 shrink-0 pt-0.5">{b.num}</span>
                  <div>
                    <h3 className="font-display font-bold text-[#173A5E] uppercase text-sm sm:text-base mb-1">{b.title}</h3>
                    <p className="text-[#5B6B7D] text-xs sm:text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ¿POR QUÉ ELEGIRNOS?
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px w-8 sm:w-10 bg-brand-red" />
              <span className="text-brand-red text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em]">
                Nuestra diferencia
              </span>
              <div className="h-px w-8 sm:w-10 bg-brand-red" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#173A5E] uppercase leading-none">
              ¿Por qué elegirnos?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: ShieldCheck, title: "Stock propio", desc: "Todos nuestros vehículos. Sin intermediarios ni comisiones ocultas." },
              { icon: FileCheck2, title: "Documentación", desc: "Transferencia rápida, papeles en orden. Sin dolores de cabeza." },
              { icon: Zap, title: "Revisión mecánica", desc: "Control completo de cada vehículo antes de la venta." },
              { icon: Clock, title: "Asesoramiento", desc: "Te acompañamos en todo el proceso, de principio a fin." },
            ].map((item) => (
              <div
                key={item.title}
                className="group flex sm:flex-col items-start sm:items-start gap-4 sm:gap-0 p-5 sm:p-6 rounded-none bg-[#EFF2F8] border border-[#173A5E]/15 hover:border-brand-red/40 hover:bg-brand-red/[0.04] transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-none bg-brand-red/10 group-hover:bg-brand-red/20 flex items-center justify-center sm:mb-5 shrink-0 transition-colors">
                  <item.icon size={20} className="text-brand-red" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#173A5E] uppercase text-sm sm:text-base mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-[#5B6B7D] text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NUESTRO LOCAL — foto del showroom
      ══════════════════════════════════════════════════════ */}
      <section className="relative h-[360px] sm:h-[440px] lg:h-[520px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/local.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 15%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1B32]/88 via-[#0C1B32]/65 to-[#0C1B32]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B32]/70 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="h-px w-8 sm:w-10 bg-brand-red" />
              <span className="text-brand-red text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                Estamos en La Rioja
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none mb-4 sm:mb-5">
              Visitá nuestro<br />
              <span className="text-brand-red">showroom</span>
            </h2>
            <div className="flex items-start gap-2 text-white/70 text-sm mb-5 sm:mb-6">
              <MapPin size={15} className="text-brand-red shrink-0 mt-0.5" />
              <span>{ADDRESS}</span>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <a
                href={GOOGLE_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-5 py-3 rounded-none transition-all duration-300 text-sm active:scale-95"
              >
                <MapPin size={15} />
                Cómo llegar
              </a>
              <a
                href="tel:+543804796317"
                className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold px-5 py-3 rounded-none transition-all duration-300 hover:bg-white/10 text-sm active:scale-95"
              >
                <Phone size={15} />
                +54 380 479-6317
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-14 sm:py-24 bg-[#F7F9FB] overflow-hidden">
        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(23,58,94,0.03) 80px, rgba(23,58,94,0.03) 81px)" }}
        />
        {/* Red glow center */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[300px] bg-brand-red/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contenedor con cortes diagonales */}
          <div
            className="relative overflow-hidden p-8 sm:p-14 lg:p-20 text-center"
            style={{
              background: "linear-gradient(135deg, #0C1B32 0%, #081426 50%, #0C1B32 100%)",
              clipPath: "polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)",
            }}
          >
            {/* Raya roja izquierda */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-red via-brand-red/50 to-transparent" />
            {/* Raya roja derecha */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-brand-red/50 to-brand-red" />
            {/* Border top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent" />

            {/* Tag */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8 justify-center">
              <div className="w-10 h-[2px] bg-brand-red" />
              <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.5em] font-mono">
                Tu momento es ahora
              </span>
              <div className="w-10 h-[2px] bg-brand-red" />
            </div>

            <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white uppercase leading-[0.85] mb-4 sm:mb-6">
              ¿LISTO PARA DISFRUTAR<br /><span className="text-brand-red" style={{ textShadow: "0 0 40px rgba(204,32,32,0.4)" }}>TU NUEVO AUTO?</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base mb-10 sm:mb-12 max-w-sm mx-auto font-mono tracking-wider uppercase">
              Contactanos — respondemos al instante
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20c45e] text-white font-black text-base px-10 py-4 uppercase tracking-widest transition-all duration-200 hover:shadow-2xl hover:shadow-green-500/30"
                style={{ clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)" }}
              >
                <WhatsAppIcon size={20} />
                WhatsApp
              </a>
              <Link
                href="/catalogo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-brand-red hover:bg-brand-red/10 text-white font-black text-base px-10 py-4 uppercase tracking-widest transition-all duration-200"
                style={{ clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)" }}
              >
                Ver catálogo <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            "@id": `${SITE_URL}/#autoDealer`,
            name: "Norte Automotores",
            description: "Venta de autos usados seleccionados en excelente estado. Recibimos tu auto o moto. La Rioja, Argentina.",
            url: SITE_URL,
            telephone: "+543804796317",
            email: "ventas@norteautomotores.com.ar",
            priceRange: "$$",
            hasMap: GOOGLE_MAPS,
            image: `${SITE_URL}/local.jpg`,
            logo: `${SITE_URL}/norte-logo.PNG`,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Av. Coronel Felipe Varela y Senador Rodolfo Blanco",
              addressLocality: "La Rioja",
              addressRegion: "La Rioja",
              postalCode: "5300",
              addressCountry: "AR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -29.4405658,
              longitude: -66.8711093,
            },
            areaServed: {
              "@type": "City",
              name: "La Rioja",
              addressCountry: "AR",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "13:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "18:00",
                closes: "22:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Saturday"],
                opens: "09:00",
                closes: "13:00",
              },
            ],
            sameAs: [
              "https://instagram.com/norte.automotores",
              "https://facebook.com/share/177Lw7quNV/?mibextid=wwXlfr",
            ],
          }),
        }}
      />
    </>
  );
}
