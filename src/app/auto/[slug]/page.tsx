import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Calendar, Gauge, Settings, Droplets, Car, DoorOpen, CheckCircle2, Share2, ArrowLeft, MapPin } from "lucide-react";
import { getCarBySlug, getCars, getSiteConfig, incrementCarViews } from "@/lib/supabase/queries";
import { formatPrice, formatMileage } from "@/lib/utils";
import { CarCard } from "@/components/cars/CarCard";
import { ImageSlider } from "@/components/cars/ImageSlider";
import { ShareButtons } from "@/components/cars/ShareButtons";
import { FinanciacionAuto } from "@/components/cars/FinanciacionAuto";
import { SITE_URL } from "@/lib/constants";

const ADDRESS = "Av. Coronel Felipe Varela y Senador Rodolfo Blanco, La Rioja Capital";
const MAPS_EMBED = "https://maps.google.com/maps?q=Av.+Coronel+Felipe+Varela+y+Senador+Rodolfo+Blanco,+La+Rioja,+Argentina&z=17&output=embed";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Auto no encontrado" };

  const priceStr = car.show_price && car.price ? `Precio: ${formatPrice(car.price, car.currency || "ARS")}.` : "Consultá el precio.";
  const kmStr = car.mileage ? ` ${formatMileage(car.mileage)}.` : "";
  return {
    title: `${car.brand} ${car.model} ${car.year} en La Rioja | Norte Automotores`,
    description: `${car.brand} ${car.model} ${car.year} en venta en La Rioja.${kmStr} ${priceStr} Autos usados con financiación en La Rioja, Argentina — Norte Automotores.`,
    alternates: { canonical: `/auto/${car.slug}` },
    keywords: [
      `${car.brand} ${car.model} La Rioja`,
      `${car.brand} ${car.model} ${car.year} La Rioja`,
      `${car.brand} usado La Rioja`,
      `comprar ${car.brand} La Rioja`,
      "auto usado La Rioja",
      "comprar auto La Rioja",
      "autos usados La Rioja",
    ],
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year}${car.show_price && car.price ? ` — ${formatPrice(car.price, car.currency || "ARS")}` : ""} | La Rioja`,
      description: `${car.brand} ${car.model} ${car.year}${kmStr} en La Rioja. ${priceStr} Norte Automotores.`,
      images: car.images?.[0]
        ? [{ url: car.images[0], width: 1200, height: 630, alt: `${car.brand} ${car.model} ${car.year}` }]
        : [{ url: "/local.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function AutoDetailPage({ params }: Props) {
  const { slug } = await params;

  let car, config, related;
  try {
    [car, config] = await Promise.all([getCarBySlug(slug), getSiteConfig()]);
    if (!car) notFound();
    // Fire and forget — no bloquea el render
    incrementCarViews(car.id);
    related = await getCars({ body_type: car.body_type, limit: 4, light: true });
    related = related.filter((c) => c.id !== car!.id).slice(0, 4);
  } catch {
    notFound();
  }


  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Breadcrumb */}
      <div className="bg-[#16293F] border-b-2 border-brand-red/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/catalogo" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-10">
          {/* Gallery + descripción + equipamiento — 3/5 */}
          <div className="lg:col-span-3 mb-6 lg:mb-0 space-y-6">
            <ImageSlider
              images={car!.images || []}
              video_url={car!.video_url}
              alt={`${car!.brand} ${car!.model} ${car!.year}`}
            />

            {car!.description && (
              <div className="relative bg-white rounded-none border border-[#173A5E]/15 p-6">
                <div className="absolute top-0 left-0 w-16 h-[3px] bg-brand-red" />
                <h2 className="font-display font-bold text-2xl text-[#173A5E] uppercase mb-4">Descripción</h2>
                <p className="text-[#5B6B7D] text-sm leading-relaxed whitespace-pre-line">{car!.description}</p>
              </div>
            )}

            {car!.features && car!.features.length > 0 && (
              <div className="relative bg-[#16293F] rounded-none p-6 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/isotipo-n.svg" alt="" aria-hidden="true"
                  className="absolute pointer-events-none select-none opacity-[0.04] -rotate-12 w-[340px] max-w-none -right-16 -bottom-16 brightness-0 invert"
                />
                <div className="absolute top-0 left-0 w-16 h-[3px] bg-brand-red" />
                <h2 className="relative font-display font-bold text-2xl text-white uppercase mb-4">Equipamiento</h2>
                <ul className="relative grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car!.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/85">
                      <CheckCircle2 size={16} className="text-brand-red shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Info panel — 2/5 */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-none border border-[#173A5E]/15 overflow-hidden lg:sticky lg:top-24">
              {/* Cabecera navy del panel */}
              <div className="relative bg-[#16293F] px-6 pt-5 pb-4">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-red" />
                <span className={`inline-block text-xs font-bold uppercase px-2 py-1 rounded-md mb-3 ${
                  car!.condition === "new" ? "bg-brand-red text-white" : "bg-white/10 text-white/85"
                }`}>
                  {car!.condition === "new" ? "0km" : "Usado"}
                </span>

                <h1 className="font-display font-extrabold text-3xl text-white uppercase leading-tight">
                  {car!.brand} {car!.model}
                </h1>
                {car!.version && (
                  <p className="text-white/60 font-medium mt-1">{car!.version} · {car!.year}</p>
                )}
              </div>

              <div className="p-6">
              {/* Price */}
              <div className="mb-5 pb-4 border-b border-[#173A5E]/15">
                {car!.show_price && car!.price ? (
                  <span className="text-4xl font-bold text-brand-red">{formatPrice(car!.price, car!.currency || "ARS")}</span>
                ) : (
                  <span className="text-xl text-[#5B6B7D]">Consultá el precio</span>
                )}
              </div>

              {/* Financiación + CTA buttons */}
              <div className="flex flex-col gap-3">
                <FinanciacionAuto car={car!} whatsappNumber={config.whatsapp_number} />
                <a
                  href={`tel:${config.phone}`}
                  className="flex items-center justify-center gap-2 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold py-3 rounded-none transition-colors"
                >
                  <Phone size={18} />
                  Llamar ahora
                </a>
              </div>

              <ShareButtons
                url={`${SITE_URL}/auto/${car!.slug}`}
                title={`${car!.brand} ${car!.model} ${car!.year} — Norte Automotores`}
                text={`Mirá este ${car!.brand} ${car!.model} ${car!.year}${car!.show_price && car!.price ? ` a ${formatPrice(car!.price, car!.currency || "ARS")}` : ""} en Norte Automotores, La Rioja`}
              />

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                {[
                  { icon: Calendar, label: "Año", value: car!.year },
                  { icon: Gauge, label: "Kilometraje", value: car!.mileage != null ? formatMileage(car!.mileage) : "—" },
                  { icon: Settings, label: "Transmisión", value: car!.transmission || "—" },
                  { icon: Droplets, label: "Combustible", value: car!.fuel_type || "—" },
                  { icon: Car, label: "Carrocería", value: car!.body_type || "—" },
                  { icon: DoorOpen, label: "Puertas", value: car!.doors || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 bg-[#EFF2F8] rounded-none p-2">
                    <Icon size={14} className="text-brand-red shrink-0" />
                    <div>
                      <p className="text-[#5B6B7D] text-xs">{label}</p>
                      <p className="text-[#173A5E] font-semibold capitalize">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related cars */}
        {related && related.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-[3px] bg-brand-red" />
              <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.35em]">
                Seguí mirando
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl text-[#173A5E] uppercase mb-6">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((c) => (
                <CarCard key={c.id} car={c} whatsappNumber={config.whatsapp_number} />
              ))}
            </div>
          </div>
        )}

        {/* Ubicación */}
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-[3px] bg-brand-red" />
            <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.35em]">
              Dónde estamos
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-[#173A5E] uppercase mb-2">
            Vení a conocerlo
          </h2>
          <p className="flex items-start gap-2 text-[#5B6B7D] text-sm mb-5">
            <MapPin size={16} className="text-brand-red shrink-0 mt-0.5" />
            {config.address || ADDRESS}
          </p>
          <div className="overflow-hidden border border-[#173A5E]/15 h-64 sm:h-80">
            <iframe
              src={MAPS_EMBED}
              title="Ubicación de Norte Automotores en Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            name: `${car!.brand} ${car!.model} ${car!.year}`,
            brand: { "@type": "Brand", name: car!.brand },
            vehicleModelDate: String(car!.year),
            mileageFromOdometer: car!.mileage
              ? { "@type": "QuantitativeValue", value: car!.mileage, unitCode: "KMT" }
              : undefined,
            fuelType: car!.fuel_type || undefined,
            vehicleTransmission: car!.transmission || undefined,
            image: car!.images || [],
            description: car!.description || "",
            offers: car!.show_price && car!.price ? {
              "@type": "Offer",
              price: car!.price,
              priceCurrency: car!.currency || "ARS",
              availability: "https://schema.org/InStock",
              seller: { "@type": "AutoDealer", name: "Norte Automotores" },
            } : undefined,
          }),
        }}
      />
    </div>
  );
}
