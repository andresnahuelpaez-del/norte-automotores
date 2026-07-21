// Cinta de marcas que se venden en Argentina — scroll continuo (CSS puro).
const MARCAS = [
  "Toyota", "Volkswagen", "Ford", "Chevrolet", "Fiat", "Renault",
  "Peugeot", "Citroën", "Nissan", "Honda", "Jeep", "Hyundai",
  "Kia", "RAM", "Chery", "Mercedes-Benz", "Volvo", "Suzuki",
];

export function BrandsMarquee() {
  // Se duplica la lista para que el loop de -50% sea continuo.
  const loop = [...MARCAS, ...MARCAS];

  return (
    <section className="bg-[#132C56] border-y border-brand-red/40 py-4 sm:py-5 overflow-hidden">
      <div className="flex items-center gap-8 sm:gap-12 w-max marquee-track">
        {loop.map((marca, i) => (
          <div key={i} className="flex items-center gap-8 sm:gap-12 shrink-0">
            <span className="font-display font-bold text-white/60 text-lg sm:text-2xl uppercase tracking-wider whitespace-nowrap">
              {marca}
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
