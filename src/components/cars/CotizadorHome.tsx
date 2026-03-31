"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { CarCard } from "@/components/cars/CarCard";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatPrice } from "@/lib/utils";
import type { Car } from "@/types";

interface Props {
  cars: Car[];
  waNumber: string;
  coeficientes: Record<number, number>;
  anticipoMin: number;
  anticipoMax: number;
  cuotaSliderMax: number;
}

type Step = "form" | "results";

export function CotizadorHome({ cars, waNumber, coeficientes, anticipoMin, anticipoMax, cuotaSliderMax }: Props) {
  const cuotasOpciones = Object.keys(coeficientes).map(Number).sort((a, b) => a - b);
  const defaultCuotas = cuotasOpciones[Math.floor(cuotasOpciones.length / 2)] ?? 24;
  const defaultAnticipo = Math.round((anticipoMin + anticipoMax * 0.15) / 100000) * 100000;
  const defaultCuota = Math.round(cuotaSliderMax * 0.15 / 25000) * 25000;

  const [anticipo, setAnticipo] = useState(defaultAnticipo);
  const [cuotaMax, setCuotaMax] = useState(defaultCuota);
  const [cuotas, setCuotas] = useState(defaultCuotas);
  const [step, setStep] = useState<Step>("form");
  const [matchingCars, setMatchingCars] = useState<Car[]>([]);
  const [maxPrecio, setMaxPrecio] = useState(0);

  // Odómetro animado
  const coef = coeficientes[cuotas] ?? 2.0;
  const vehicleMax = (cuotaMax * cuotas) / coef + anticipo;
  const [displayPrice, setDisplayPrice] = useState(vehicleMax);
  useEffect(() => {
    const target = vehicleMax;
    const start = displayPrice;
    const startTime = Date.now();
    const duration = 450;
    const update = () => {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayPrice(Math.round(start + (target - start) * ease));
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleMax]);

  function calcular() {
    const matches = cars
      .filter((c) => c.price && c.show_price && c.financing_available && c.currency === "ARS" && c.price <= vehicleMax)
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 6);
    setMatchingCars(matches);
    setMaxPrecio(vehicleMax);
    setStep("results");
  }

  const waMsg = `Hola! Hice una cotización con anticipo de ${formatPrice(anticipo)} y cuota máxima de ${formatPrice(cuotaMax)}/mes en ${cuotas} cuotas. ¿Qué modelos tienen disponibles?`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;

  /* ─── FORM ─── */
  if (step === "form") {
    return (
      <div id="cotizador" className="relative bg-[#0C1B32] py-14 sm:py-20 overflow-hidden">
        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.010) 80px, rgba(255,255,255,0.010) 81px)" }}
        />
        {/* Red glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-brand-red/[0.07] blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="w-8 h-[3px] bg-brand-red" />
              <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.45em] font-mono">
                Financiación propia
              </span>
              <div className="w-8 h-[3px] bg-brand-red" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase leading-[0.9] mb-3">
              ¿A qué autos{" "}
              <span className="text-brand-red">podés acceder?</span>
            </h2>
            <p className="text-white/35 text-sm font-mono tracking-wider">
              Completá tu cotización y te mostramos los vehículos disponibles
            </p>
          </div>

          {/* Card */}
          <div
            className="relative bg-[#081426] border border-white/[0.07] p-6 sm:p-8 space-y-8"
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
          >
            {/* Red top stripe */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-red" />

            {/* Anticipo */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.35em] font-mono">
                  Anticipo disponible
                </label>
                <span className="font-display font-black text-2xl text-brand-red">{formatPrice(anticipo)}</span>
              </div>
              <input
                type="range"
                min={anticipoMin}
                max={anticipoMax}
                step={Math.max(10000, Math.round(anticipoMin / 10 / 10000) * 10000)}
                value={anticipo}
                onChange={(e) => setAnticipo(Number(e.target.value))}
                className="w-full accent-brand-red h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1.5 font-mono">
                <span>{formatPrice(anticipoMin)}</span>
                <span>{formatPrice(anticipoMax)}</span>
              </div>
            </div>

            {/* Cuota máxima */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.35em] font-mono">
                  Cuota mensual máxima
                </label>
                <span className="font-display font-black text-2xl text-brand-red">
                  {formatPrice(cuotaMax)}<span className="text-base text-white/40">/mes</span>
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={cuotaSliderMax}
                step={25000}
                value={cuotaMax}
                onChange={(e) => setCuotaMax(Number(e.target.value))}
                className="w-full accent-brand-red h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1.5 font-mono">
                <span>$ 50.000</span>
                <span>{formatPrice(cuotaSliderMax)}</span>
              </div>
            </div>

            {/* Cuotas */}
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.35em] font-mono block mb-3">
                Cantidad de cuotas
              </label>
              <div className="flex gap-2 flex-wrap">
                {cuotasOpciones.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCuotas(n)}
                    className={`px-5 py-2.5 font-black text-sm font-mono transition-all duration-200 border ${
                      cuotas === n
                        ? "bg-brand-red border-brand-red text-white"
                        : "border-white/[0.1] text-white/50 hover:border-brand-red/60 hover:text-white bg-transparent"
                    }`}
                    style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative w-full h-px bg-white/[0.05]">
              <div className="absolute left-0 top-0 h-full w-12 bg-brand-red/50" />
            </div>

            {/* Preview resultado */}
            <div
              className="pulse-glow bg-[#060E1C] border border-brand-red/20 p-5 sm:p-6"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
            >
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em] font-mono mb-2 text-center">
                Accedés a vehículos de hasta
              </p>
              <p className="font-display font-black text-4xl sm:text-5xl text-white leading-none text-center tabular-nums">
                {formatPrice(displayPrice)}
              </p>
              <p className="text-white/20 text-[10px] font-mono mt-3 text-center">
                * Valores orientativos. Coeficiente {coef.toFixed(1)} para {cuotas} cuotas.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={calcular}
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-black py-4 uppercase tracking-widest text-sm transition-colors"
              style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
            >
              Ver autos disponibles <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── RESULTS ─── */
  return (
    <div id="cotizador" className="relative bg-[#0C1B32] py-14 sm:py-20 overflow-hidden">
      {/* Speed lines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.010) 80px, rgba(255,255,255,0.010) 81px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-2 text-white/30 hover:text-brand-red text-[11px] font-black uppercase tracking-[0.3em] font-mono mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Modificar cotización
        </button>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-[3px] bg-brand-red" />
            <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.45em] font-mono">
              Tu cotización
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase leading-[0.9] mb-5">
            {matchingCars.length > 0
              ? <>Autos a tu <span className="text-brand-red">alcance</span></>
              : <>Sin resultados <span className="text-brand-red">exactos</span></>}
          </h2>

          {/* Resumen badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: "Anticipo", value: formatPrice(anticipo) },
              { label: "Cuota máx.", value: `${formatPrice(cuotaMax)}/mes` },
              { label: "Cuotas", value: `${cuotas} meses` },
              { label: "Precio máx.", value: formatPrice(maxPrecio) },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.07] text-white/50 text-[10px] px-3 py-1.5 font-mono"
                style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
              >
                <span className="text-white/25">{item.label}:</span>
                <span className="text-white font-black">{item.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Resultados */}
        {matchingCars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
              {matchingCars.map((car) => (
                <CarCard key={car.id} car={car} whatsappNumber={waNumber} />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href="/catalogo?financing=true"
                className="inline-flex items-center justify-center gap-2 border-2 border-brand-red/40 hover:bg-brand-red text-white font-black px-8 py-3.5 uppercase tracking-widest text-sm transition-all duration-200"
                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
              >
                Ver catálogo completo <ChevronRight size={16} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-10 mb-10">
            <div
              className="w-16 h-16 bg-brand-red/[0.06] border border-brand-red/20 flex items-center justify-center mx-auto mb-5"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
            >
              <span className="text-2xl text-white/20 font-display font-black">?</span>
            </div>
            <p className="text-white/50 text-base font-mono mb-2">
              No encontramos autos publicados con esas condiciones.
            </p>
            <p className="text-white/25 text-sm max-w-sm mx-auto font-mono">
              Pero tenemos más modelos disponibles — consultanos y te armamos una propuesta.
            </p>
          </div>
        )}

        {/* WA CTA */}
        <div
          className="relative bg-[#081426] border border-brand-red/20 p-6 sm:p-8 text-center overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-red via-brand-red/50 to-transparent" />
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-red via-brand-red/30 to-transparent" />

          <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.4em] font-mono block mb-3">
            — Más opciones —
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none mb-2">
            ¿Querés más opciones?
          </h3>
          <p className="text-white/35 text-sm font-mono mb-6 max-w-xs mx-auto tracking-wider">
            Tenemos modelos que no están publicados. Consultanos.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white font-black px-8 py-4 uppercase tracking-widest text-sm transition-all hover:shadow-lg hover:shadow-green-500/20"
            style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
          >
            <WhatsAppIcon size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
