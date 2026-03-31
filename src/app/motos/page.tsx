import { Suspense } from "react";
import type { Metadata } from "next";
import { getCars, getSiteConfig } from "@/lib/supabase/queries";
import { CarCard } from "@/components/cars/CarCard";

export const metadata: Metadata = {
  title: "Motos Usadas y 0km en La Rioja | Honda, Yamaha, Bajaj",
  description: "Comprá tu moto usada o 0km en La Rioja. Honda, Yamaha, Bajaj, Royal Enfield y más. Todas revisadas, financiación disponible. Stock actualizado en La Rioja, Argentina.",
  alternates: { canonical: "/motos" },
  keywords: [
    "motos usadas La Rioja",
    "motos La Rioja",
    "la rioja motos",
    "motos 0km La Rioja",
    "comprar moto La Rioja",
    "Honda La Rioja",
    "Yamaha La Rioja",
    "Bajaj La Rioja",
    "Royal Enfield La Rioja",
    "motos con financiación La Rioja",
    "motos usadas La Rioja capital",
    "motos baratas La Rioja",
  ],
  openGraph: {
    title: "Motos Usadas y 0km en La Rioja — Norte Automotores",
    description: "Honda, Yamaha, Bajaj y más. Motos usadas y 0km con financiación en La Rioja, Argentina.",
    images: [{ url: "/local.jpg", width: 1200, height: 630, alt: "Motos usadas — Norte Automotores La Rioja" }],
  },
};

export default async function MotosPage() {
  let motos: Awaited<ReturnType<typeof getCars>> = [];
  let config: Awaited<ReturnType<typeof getSiteConfig>>;

  try {
    const [motosData, configData] = await Promise.all([
      getCars({ vehicle_type: 'moto' }),
      getSiteConfig(),
    ]);
    motos = motosData;
    config = configData;
  } catch {
    config = {
      whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317",
      show_prices_globally: "true",
      show_financing_globally: "true",
      hero_title: "",
      hero_subtitle: "",
      address: "",
      phone: "",
      email: "",
      instagram: "",
      facebook: "",
    };
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-brand-red text-sm font-semibold uppercase tracking-widest">Stock disponible</span>
          <h1 className="font-display font-extrabold text-5xl text-white uppercase mt-2 mb-3">
            Motos Usadas
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            Honda, Yamaha, Bajaj, Royal Enfield y más. Todas revisadas y con documentación en orden.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="bg-brand-gray-light min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {motos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏍️</div>
              <p className="text-brand-gray text-lg mb-4">
                Próximamente actualizamos nuestro stock de motos.
              </p>
              <a
                href={`https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola! Quisiera consultar sobre motos disponibles.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-none hover:bg-[#20c45e] transition-colors"
              >
                Consultar disponibilidad
              </a>
            </div>
          ) : (
            <>
              <p className="text-brand-gray text-sm font-medium mb-6">
                <span className="text-brand-dark font-bold text-lg">{motos.length}</span> motos disponibles
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {motos.map((moto) => (
                  <CarCard key={moto.id} car={moto} whatsappNumber={config.whatsapp_number} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
