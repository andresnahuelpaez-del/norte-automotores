import { getCars, getSiteConfig } from "@/lib/supabase/queries";
import { CarCard } from "@/components/cars/CarCard";
import { BODY_TYPES, BRANDS } from "@/lib/constants";
import Link from "next/link";

interface Props {
  searchParams?: { [key: string]: string | undefined };
}

function buildFilterUrl(base: Record<string, string | undefined>, override: Record<string, string | undefined>) {
  const merged = { ...base, ...override };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/catalogo${qs ? `?${qs}` : ""}`;
}

export async function CatalogContent({ searchParams = {} }: Props) {
  const condicion = searchParams.condicion;
  const marca = searchParams.marca;
  const tipo = searchParams.tipo;
  const financiacion = searchParams.financiacion;
  const orden = searchParams.orden;

  let cars: Awaited<ReturnType<typeof getCars>> = [];
  let suggested: Awaited<ReturnType<typeof getCars>> = [];
  let config: Awaited<ReturnType<typeof getSiteConfig>>;

  const hasFilters = !!(condicion || marca || tipo || financiacion);

  try {
    [cars, config] = await Promise.all([
      getCars({
        condition: condicion || undefined,
        brand: marca || undefined,
        body_type: tipo || undefined,
        financing_available: financiacion === "1" ? true : undefined,
        order_by: orden === "precio_asc" ? "price_asc" : orden === "precio_desc" ? "price_desc" : "created_at",
      }),
      getSiteConfig(),
    ]);

    // Si no hay resultados y había filtros activos, traer sugerencias
    if (cars.length === 0 && hasFilters) {
      suggested = await getCars({ limit: 6 });
    }
  } catch (err) {
    console.error("[CatalogContent] Error fetching data:", err);
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

  const activeFilters = { condicion, marca, tipo, financiacion, orden };

  const quickFilters: { label: string; params: Record<string, string | undefined> }[] = [
    { label: "Todos", params: { condicion: undefined, marca: undefined, tipo: undefined, financiacion: undefined } },
    { label: "0km", params: { condicion: "new" } },
    { label: "Usados", params: { condicion: "used" } },
    { label: "Con financiación", params: { financiacion: "1" } },
    ...BODY_TYPES.map(b => ({ label: b.label, params: { tipo: b.value } })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results count + sort */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm font-medium">
          <span className="text-white font-bold text-lg">{cars.length}</span> autos encontrados
          {(condicion || marca || tipo || financiacion) && (
            <Link
              href="/catalogo"
              className="ml-3 text-brand-red text-xs hover:underline"
            >
              × Limpiar filtros
            </Link>
          )}
        </p>
        <div className="flex items-center gap-2">
          {[
            { label: "Más recientes", value: "" },
            { label: "Menor precio", value: "precio_asc" },
            { label: "Mayor precio", value: "precio_desc" },
          ].map(opt => (
            <Link
              key={opt.value}
              href={buildFilterUrl(activeFilters, { orden: opt.value || undefined })}
              className={`px-3 py-1.5 rounded-none text-xs font-medium border transition-colors ${
                (orden || "") === opt.value
                  ? "bg-brand-red text-white border-brand-red"
                  : "bg-white/[0.03] text-white/50 border-white/[0.08] hover:border-brand-red hover:text-brand-red"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {quickFilters.map(({ label, params }) => {
          const href = buildFilterUrl(activeFilters, params);
          const isActive = Object.entries(params).every(([k, v]) => {
            const cur = activeFilters[k as keyof typeof activeFilters];
            return v === undefined ? !cur : cur === v;
          });
          return (
            <Link
              key={label}
              href={href}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-red text-white border-brand-red"
                  : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-brand-red hover:text-brand-red"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Marca filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs text-white/40 self-center font-medium">Marca:</span>
        {["", ...BRANDS.slice(0, 10)].map(b => (
          <Link
            key={b || "todas"}
            href={buildFilterUrl(activeFilters, { marca: b || undefined })}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              (marca || "") === b
                ? "bg-white/[0.12] text-white border-white/30"
                : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-brand-red hover:text-brand-red"
            }`}
          >
            {b || "Todas"}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {cars.length === 0 ? (
        <div>
          {/* Mensaje sin resultados */}
          <div className="bg-white/[0.03] rounded-none border border-white/[0.08] px-8 py-10 mb-10 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <h3 className="font-display font-bold text-xl text-white uppercase mb-1">
              Sin resultados para esa búsqueda
            </h3>
            <p className="text-white/50 text-sm mb-4">
              No encontramos vehículos con los filtros seleccionados, pero tenemos estas opciones que podrían interesarte.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-6 py-2.5 rounded-none text-sm transition-colors"
            >
              Ver todo el catálogo
            </Link>
          </div>

          {/* Sugerencias */}
          {suggested.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest px-2">Te recomendamos</span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggested.map((car) => (
                  <CarCard key={car.id} car={car} whatsappNumber={config.whatsapp_number} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} whatsappNumber={config.whatsapp_number} />
          ))}
        </div>
      )}
    </div>
  );
}
