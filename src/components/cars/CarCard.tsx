import Link from "next/link";
import Image from "next/image";
import { Gauge, Settings, Images } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn, formatPrice, formatMileage, buildCarWhatsAppUrl } from "@/lib/utils";
import type { Car } from "@/types";

interface CarCardProps {
  car: Car;
  whatsappNumber?: string;
}

export function CarCard({ car, whatsappNumber = "5493804796317" }: CarCardProps) {
  const fuelLabel: Record<string, string> = {
    nafta: "Nafta", diesel: "Diésel", electrico: "Eléctrico",
    hibrido: "Híbrido", gnc: "GNC",
  };
  const transLabel: Record<string, string> = {
    manual: "Manual", automatico: "Automático", automatica: "Automática",
  };

  const mainImage = car.images?.[0];
  const waUrl = buildCarWhatsAppUrl(car, whatsappNumber);

  return (
    <div
      className="group relative bg-white overflow-hidden border border-[#173A5E]/12 hover:border-brand-red/60 flex flex-col transition-all duration-300 drop-shadow-[0_5px_18px_rgba(23,58,94,0.13)] hover:drop-shadow-[0_14px_32px_rgba(204,32,32,0.20)] hover:-translate-y-1"
      style={{
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      {/* Link que cubre toda la tarjeta (stretched link) */}
      <Link
        href={`/auto/${car.slug}`}
        className="absolute inset-0 z-20"
        aria-label={`Ver ${car.brand} ${car.model} ${car.year}`}
      />

      {/* Red racing stripe top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-red z-10 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={`${car.brand} ${car.model} ${car.year}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient overlay sutil para legibilidad de badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-[#EFF2F8] flex items-center justify-center">
            <span className="font-display text-[#5B6B7D]/60 text-xs uppercase tracking-[0.4em]">Sin imagen</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className={cn(
              "text-[10px] font-black uppercase px-2.5 py-1 tracking-wider",
              car.condition === "new"
                ? "bg-brand-red text-white"
                : "bg-white/90 text-[#173A5E] border border-[#173A5E]/20"
            )}
            style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
          >
            {car.condition === "new" ? "0 km" : "Usado"}
          </span>
          {car.is_featured && (
            <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-1 tracking-wider"
              style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
            >
              Destacado
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className="font-display font-bold text-white text-xs bg-black/70 border border-white/10 px-2.5 py-1 tracking-wider"
            style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
          >
            {car.year}
          </span>
          {car.financing_available && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-black uppercase px-2.5 py-1 tracking-wider"
              style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
            >
              Financia
            </span>
          )}
        </div>

        {/* Image count badge */}
        {car.images && car.images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 text-white/80 text-[10px] font-mono">
            <Images size={9} />
            {car.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 border-t border-[#173A5E]/15">
        {/* Brand + racing number accent */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-brand-red text-[10px] font-black uppercase tracking-[0.3em]">
            {car.brand}
          </p>
          <span className="font-display font-black text-[#173A5E]/5 text-4xl leading-none select-none absolute right-4 top-[calc(56.25%+12px)]">
            {car.year}
          </span>
        </div>

        <h3 className="font-display font-extrabold text-xl text-[#173A5E] uppercase tracking-wide leading-tight mb-0.5">
          {car.model}
          {car.version && (
            <span className="font-normal text-[#5B6B7D]/90 text-sm ml-2 normal-case tracking-normal">
              {car.version}
            </span>
          )}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-3 text-[11px] text-[#5B6B7D] mt-2 mb-4">
          {car.mileage != null && car.mileage > 0 && (
            <span className="flex items-center gap-1">
              <Gauge size={11} />
              {formatMileage(car.mileage)}
            </span>
          )}
          {car.transmission && (
            <>
              <span className="w-px h-3 bg-[#173A5E]/15" />
              <span className="flex items-center gap-1">
                <Settings size={11} />
                {transLabel[car.transmission] ?? car.transmission}
              </span>
            </>
          )}
          {car.fuel_type && (
            <>
              <span className="w-px h-3 bg-[#173A5E]/15" />
              <span>{fuelLabel[car.fuel_type] ?? car.fuel_type}</span>
            </>
          )}
        </div>

        {/* Racing divider */}
        <div className="relative w-full h-px bg-[#EFF2F8] mb-4">
          <div className="absolute left-0 top-0 h-full w-10 bg-brand-red/60" />
        </div>

        {/* Price + CTAs */}
        <div className="flex items-center justify-between mt-auto gap-3">
          <div>
            {car.show_price && car.price ? (
              <div>
                <p className="text-[#5B6B7D]/70 text-[9px] uppercase tracking-[0.25em] mb-0.5">Precio</p>
                <span className="font-display font-extrabold text-xl text-[#173A5E] leading-none">
                  {formatPrice(car.price, car.currency || "ARS")}
                </span>
              </div>
            ) : (
              <div>
                <p className="text-[#5B6B7D]/70 text-[9px] uppercase tracking-[0.25em] mb-0.5">Precio</p>
                <span className="text-sm text-[#5B6B7D] font-mono">Consultar</span>
              </div>
            )}
          </div>

          <div className="relative z-30 flex gap-2 shrink-0">
            <Link
              href={`/auto/${car.slug}`}
              className="bg-brand-red hover:bg-brand-red-dark text-white text-sm font-bold px-4 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-brand-red/30 uppercase tracking-wide"
              style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
            >
              {car.vehicle_type === "moto" ? "Ver moto" : "Ver auto"}
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 flex items-center justify-center bg-[#25D366] hover:bg-[#20c45e] text-white transition-all duration-200"
              style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
              aria-label="Consultar por WhatsApp"
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
