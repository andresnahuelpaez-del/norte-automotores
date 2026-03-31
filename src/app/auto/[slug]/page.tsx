import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Calendar, Gauge, Settings, Droplets, Car, DoorOpen, CheckCircle2, Share2, ArrowLeft } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getCarBySlug, getCars, getSiteConfig, incrementCarViews } from "@/lib/supabase/queries";
import { formatPrice, formatMileage, buildCarWhatsAppUrl } from "@/lib/utils";
import { CarCard } from "@/components/cars/CarCard";
import { ImageSlider } from "@/components/cars/ImageSlider";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Auto no encontrado" };

  const priceStr = car.show_price && car.price ? `Precio: ${formatPrice(car.price)}.` : "Consultá el precio.";
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
      title: `${car.brand} ${car.model} ${car.year}${car.show_price && car.price ? ` — ${formatPrice(car.price)}` : ""} | La Rioja`,
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
    related = await getCars({ body_type: car.body_type, limit: 4 });
    related = related.filter((c) => c.id !== car!.id).slice(0, 4);
  } catch {
    notFound();
  }

  const waUrl = buildCarWhatsAppUrl(car!, config.whatsapp_number);
  const mainImage = car!.images?.[0];

  return (
    <div className="min-h-screen bg-[#060E1C]">
      {/* Breadcrumb */}
      <div className="bg-[#060E1C] border-b border-white/[0.06] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/catalogo" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-10">
          {/* Gallery — 3/5 */}
          <div className="lg:col-span-3 mb-6 lg:mb-0">
            <ImageSlider
              images={car!.images || []}
              video_url={car!.video_url}
              alt={`${car!.brand} ${car!.model} ${car!.year}`}
            />
          </div>

          {/* Info panel — 2/5 */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] rounded-none border border-white/[0.08] p-6 lg:sticky lg:top-24">
              {/* Condition badge */}
              <span className={`inline-block text-xs font-bold uppercase px-2 py-1 rounded-md mb-3 ${
                car!.condition === "new" ? "bg-brand-red text-white" : "bg-white/[0.1] text-white/80"
              }`}>
                {car!.condition === "new" ? "0km" : "Usado"}
              </span>

              <h1 className="font-display font-extrabold text-3xl text-white uppercase leading-tight">
                {car!.brand} {car!.model}
              </h1>
              {car!.version && (
                <p className="text-white/50 font-medium mt-1">{car!.version} · {car!.year}</p>
              )}

              {/* Price */}
              <div className="my-5 py-4 border-y border-white/[0.08]">
                {car!.show_price && car!.price ? (
                  <span className="text-4xl font-bold text-brand-red">{formatPrice(car!.price)}</span>
                ) : (
                  <span className="text-xl text-white/40">Consultá el precio</span>
                )}
                {car!.financing_available && (
                  <div className="mt-2">
                    <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold uppercase px-2 py-1 rounded-md">
                      💳 Financiación disponible
                    </span>
                    {car!.financing_details && (
                      <p className="text-sm text-white/40 mt-1">{car!.financing_details}</p>
                    )}
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white font-bold py-3.5 rounded-none transition-colors"
                >
                  <WhatsAppIcon size={20} />
                  Consultar por WhatsApp
                </a>
                <a
                  href={`tel:${config.phone}`}
                  className="flex items-center justify-center gap-2 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold py-3 rounded-none transition-colors"
                >
                  <Phone size={18} />
                  Llamar ahora
                </a>
              </div>

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
                  <div key={label} className="flex items-center gap-2 bg-white/[0.05] rounded-none p-2">
                    <Icon size={14} className="text-brand-red shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs">{label}</p>
                      <p className="text-white font-semibold capitalize">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features & Description */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {car!.features && car!.features.length > 0 && (
            <div className="bg-[#111] rounded-none border border-white/[0.08] p-6">
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-5">Equipamiento</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car!.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-brand-red shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {car!.description && (
            <div className="bg-[#111] rounded-none border border-white/[0.08] p-6">
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-5">Descripción</h2>
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{car!.description}</p>
            </div>
          )}
        </div>

        {/* Related cars */}
        {related && related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display font-extrabold text-3xl text-white uppercase mb-6">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((c) => (
                <CarCard key={c.id} car={c} whatsappNumber={config.whatsapp_number} />
              ))}
            </div>
          </div>
        )}
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
              priceCurrency: "ARS",
              availability: "https://schema.org/InStock",
              seller: { "@type": "AutoDealer", name: "Norte Automotores" },
            } : undefined,
          }),
        }}
      />
    </div>
  );
}
