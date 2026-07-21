"use client";
import { useState } from "react";

// Cinta de marcas que se venden en Argentina — scroll continuo (CSS puro).
// Muestra el logo desde /public/brands/{slug}.png; si el archivo no existe
// todavía, cae al nombre en texto (así nunca se ve roto).
const MARCAS = [
  { name: "Toyota", slug: "toyota" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Ford", slug: "ford" },
  { name: "Chevrolet", slug: "chevrolet" },
  { name: "Fiat", slug: "fiat" },
  { name: "Renault", slug: "renault" },
  { name: "Peugeot", slug: "peugeot" },
  { name: "Citroën", slug: "citroen" },
  { name: "Nissan", slug: "nissan" },
  { name: "Honda", slug: "honda" },
  { name: "Jeep", slug: "jeep" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "Kia", slug: "kia" },
  { name: "RAM", slug: "ram" },
  { name: "Chery", slug: "chery" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "Volvo", slug: "volvo" },
  { name: "Suzuki", slug: "suzuki" },
];

export function BrandsMarquee() {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  // Se duplica la lista para que el loop de -50% sea continuo.
  const loop = [...MARCAS, ...MARCAS];

  return (
    <section className="bg-[#EFF2F8] border-y border-[#173A5E]/10 py-5 sm:py-6 overflow-hidden">
      <div className="flex items-center gap-10 sm:gap-16 w-max marquee-track">
        {loop.map((marca, i) => (
          <div key={i} className="flex items-center gap-10 sm:gap-16 shrink-0">
            {failed[marca.slug] ? (
              <span className="font-display font-bold text-[#173A5E]/50 text-lg sm:text-2xl uppercase tracking-wider whitespace-nowrap">
                {marca.name}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/brands/${marca.slug}.png`}
                alt={marca.name}
                className="h-7 sm:h-9 w-auto object-contain grayscale opacity-55 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                onError={() => setFailed((f) => ({ ...f, [marca.slug]: true }))}
              />
            )}
            <span
              className="w-2 h-2 bg-brand-red shrink-0"
              style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
