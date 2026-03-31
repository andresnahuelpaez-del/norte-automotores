"use client";

export function QuickSearchForm() {
  return (
    <form
      action="/catalogo"
      method="GET"
      suppressHydrationWarning
      className="grid grid-cols-2 sm:flex sm:flex-row gap-3 items-end"
    >
      <div className="col-span-1">
        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">
          Condición
        </label>
        <select
          name="condicion"
          suppressHydrationWarning
          className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 rounded-none px-3 py-3 text-white/80 focus:outline-none focus:border-brand-red text-sm transition-colors"
        >
          <option value="">Todos</option>
          <option value="used">Usado</option>
          <option value="new">0 km</option>
        </select>
      </div>

      <div className="col-span-1">
        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">
          Marca
        </label>
        <select
          name="marca"
          suppressHydrationWarning
          className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 rounded-none px-3 py-3 text-white/80 focus:outline-none focus:border-brand-red text-sm transition-colors"
        >
          <option value="">Todas</option>
          {["Toyota", "Ford", "Chevrolet", "Volkswagen", "Renault", "Fiat", "Honda", "Jeep", "Peugeot", "Citroën", "Hyundai", "Kia", "Nissan", "Mercedes-Benz", "BMW"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="col-span-1">
        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">
          Tipo
        </label>
        <select
          name="tipo"
          suppressHydrationWarning
          className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 rounded-none px-3 py-3 text-white/80 focus:outline-none focus:border-brand-red text-sm transition-colors"
        >
          <option value="">Todos</option>
          {["SUV", "Sedán", "Pickup", "Hatchback", "Coupé", "Familiar"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="col-span-2 sm:col-auto bg-brand-red hover:bg-brand-red-dark text-white font-bold px-8 py-3 rounded-none transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/30 whitespace-nowrap sm:self-end"
      >
        Buscar autos
      </button>
    </form>
  );
}
