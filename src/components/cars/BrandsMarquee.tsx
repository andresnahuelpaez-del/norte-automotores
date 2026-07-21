"use client";

import {
  siVolkswagen, siToyota, siFord, siPeugeot, siRenault,
  siFiat, siHonda, siNissan, siHyundai, siKia, siCitroen,
  siJeep, siChevrolet, siSuzuki, siVolvo, siSubaru,
} from "simple-icons";

// Marcas que se venden en Argentina — íconos oficiales del paquete simple-icons.
const BRANDS = [
  { icon: siToyota, name: "Toyota" },
  { icon: siVolkswagen, name: "Volkswagen" },
  { icon: siFord, name: "Ford" },
  { icon: siChevrolet, name: "Chevrolet" },
  { icon: siFiat, name: "Fiat" },
  { icon: siRenault, name: "Renault" },
  { icon: siPeugeot, name: "Peugeot" },
  { icon: siCitroen, name: "Citroën" },
  { icon: siNissan, name: "Nissan" },
  { icon: siHonda, name: "Honda" },
  { icon: siJeep, name: "Jeep" },
  { icon: siHyundai, name: "Hyundai" },
  { icon: siKia, name: "Kia" },
  { icon: siSuzuki, name: "Suzuki" },
  { icon: siVolvo, name: "Volvo" },
  { icon: siSubaru, name: "Subaru" },
];

export function BrandsMarquee() {
  // Se duplica la lista para que el loop de -50% sea continuo.
  const loop = [...BRANDS, ...BRANDS];

  return (
    <section className="bg-[#EFF2F8] border-y border-[#173A5E]/10 py-5 sm:py-6 overflow-hidden">
      <div className="flex items-center gap-10 sm:gap-14 w-max marquee-track">
        {loop.map((brand, i) => (
          <div key={i} className="group flex items-center gap-10 sm:gap-14 shrink-0">
            <span className="inline-flex items-center gap-2.5">
              <svg
                role="img"
                viewBox="0 0 24 24"
                aria-label={brand.name}
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 transition-colors duration-300"
                style={{ fill: "#173A5E" }}
              >
                <path d={brand.icon.path} />
              </svg>
              <span className="font-display font-bold text-[#173A5E]/55 text-base sm:text-xl uppercase tracking-wider whitespace-nowrap">
                {brand.name}
              </span>
            </span>
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
