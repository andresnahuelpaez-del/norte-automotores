import type { Metadata } from "next";
import { FinanciacionClient } from "./FinanciacionClient";

export const metadata: Metadata = {
  title: "Financiación de Autos y Motos en La Rioja | Cuotas Fijas",
  description:
    "Financiá tu auto o moto en La Rioja con cuotas fijas y financiación propia. Sin anticipo en planes seleccionados. Aprobación rápida. Norte Automotores, La Rioja, Argentina.",
  alternates: { canonical: "/financiacion" },
  keywords: [
    "financiación autos La Rioja",
    "financiación propia La Rioja",
    "crédito automotor La Rioja",
    "cuotas auto La Rioja",
    "financiar moto La Rioja",
    "comprar auto en cuotas La Rioja",
    "plan de cuotas auto La Rioja",
    "préstamo auto La Rioja",
    "financiamiento autos usados La Rioja",
  ],
  openGraph: {
    title: "Financiación de Autos y Motos — Norte Automotores La Rioja",
    description: "Financiación propia en cuotas fijas para autos y motos en La Rioja. Aprobación rápida, sin burocracia.",
    images: [{ url: "/local.jpg", width: 1200, height: 630, alt: "Financiación autos — Norte Automotores La Rioja" }],
  },
};

export default function FinanciacionPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#060E1C] py-14 overflow-hidden border-b border-brand-red/20">
        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px)" }}
        />
        {/* Red glow */}
        <div className="absolute -top-10 -right-20 w-72 h-72 bg-brand-red/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[3px] bg-brand-red" />
            <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.45em] font-mono">Financiación</span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white uppercase leading-[0.85] mb-3">
            A tu <span className="text-brand-red">medida</span>
          </h1>
          <p className="text-white/40 text-base font-mono tracking-wider">
            Llevate el auto hoy — pagalo en cuotas accesibles, sin tanto trámite
          </p>
        </div>
      </section>

      <FinanciacionClient />
    </>
  );
}
