"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, Handshake, PiggyBank, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatPrice } from "@/lib/utils";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317";

// Coeficiente total por plazo (total pagado / monto financiado)
const COEFICIENTES: Record<number, number> = {
  12: 1.4,
  24: 2.2,
  36: 3.5,
  48: 5.0,
  60: 6.8,
};

const plans = [
  {
    title: "Crédito bancario",
    tag: "BANCO",
    Icon: CreditCard,
    desc: "Trabajamos con los principales bancos de La Rioja. Te asesoramos en el trámite completo.",
    highlight: false,
  },
  {
    title: "Plan propio",
    tag: "MÁS ELEGIDO",
    Icon: Handshake,
    desc: "Financiación directa con nosotros. Sin banco, sin tantos requisitos. Cuotas fijas en pesos.",
    highlight: true,
  },
  {
    title: "Plan de ahorro",
    tag: "CUOTAS DESDE $0",
    Icon: PiggyBank,
    desc: "Adherite a un plan de ahorro y accedé a tu auto con cuotas desde cero.",
    highlight: false,
  },
];

const requirements = [
  "DNI argentino vigente",
  "Comprobante de ingresos (recibo de sueldo, monotributo, etc.)",
  "Constancia de domicilio actualizada",
  "Ser mayor de 18 años",
];

export function FinanciacionClient() {
  const [anticipo, setAnticipo] = useState(1600000);
  const [maxCuota, setMaxCuota] = useState(225000);
  const [cuotas, setCuotas] = useState(36);

  const coef = COEFICIENTES[cuotas];
  const financiado = (maxCuota * cuotas) / coef;
  const vehicleMax = anticipo + financiado;

  // Odómetro — anima el precio resultado al cambiar sliders
  const [displayPrice, setDisplayPrice] = useState(vehicleMax);
  useEffect(() => {
    const target = vehicleMax;
    const start = displayPrice;
    const startTime = Date.now();
    const duration = 500;
    const update = () => {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayPrice(Math.round(start + (target - start) * ease));
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleMax]);

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola! Quiero consultar sobre financiación de un auto.")}`;

  return (
    <div className="min-h-screen bg-[#060E1C]">

      {/* ── Planes ── */}
      <section className="relative py-16 bg-[#0C1B32] overflow-hidden">
        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.010) 80px, rgba(255,255,255,0.010) 81px)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-[3px] bg-brand-red" />
            <h2 className="font-display font-black text-3xl text-white uppercase tracking-wider">
              Modalidades
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <FadeIn key={plan.title} delay={i * 0.12} direction="up">
              <div
                className={`rotating-border-wrap ${plan.highlight ? "" : "p-0"}`}
                style={plan.highlight ? {} : { padding: 0, background: "none" }}
              >
              <div
                className={`relative overflow-hidden p-7 border transition-all duration-300 h-full ${
                  plan.highlight
                    ? "border-transparent bg-brand-red/[0.07] shadow-xl shadow-brand-red/10"
                    : "border-white/[0.07] bg-[#060E1C] hover:border-brand-red/40"
                }`}
                style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
              >
                {/* Red stripe top */}
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-red" />
                )}
                {/* Tag */}
                <div className="mb-5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.3em] font-mono px-2.5 py-1 ${
                      plan.highlight ? "bg-brand-red text-white" : "bg-white/[0.05] text-white/40 border border-white/10"
                    }`}
                    style={{ clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}
                  >
                    {plan.tag}
                  </span>
                </div>
                <plan.Icon
                  size={28}
                  className={plan.highlight ? "text-brand-red mb-4" : "text-white/25 mb-4"}
                />
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wide mb-3">{plan.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed font-mono">{plan.desc}</p>
              </div>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Simulador ── */}
      <section className="py-16 bg-[#060E1C]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[3px] bg-brand-red" />
            <h2 className="font-display font-black text-3xl text-white uppercase tracking-wider">
              Simulador
            </h2>
          </div>

          <div
            className="relative bg-[#0C1B32] border border-white/[0.07] p-8 space-y-8"
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
                min={100000}
                max={10000000}
                step={100000}
                value={anticipo}
                onChange={(e) => setAnticipo(Number(e.target.value))}
                className="w-full accent-brand-red h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1.5 font-mono">
                <span>$100.000</span><span>$10.000.000</span>
              </div>
            </div>

            {/* Cuota máxima */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.35em] font-mono">
                  Cuota mensual máxima
                </label>
                <span className="font-display font-black text-2xl text-brand-red">
                  {formatPrice(maxCuota)}<span className="text-base text-white/40">/mes</span>
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1500000}
                step={10000}
                value={maxCuota}
                onChange={(e) => setMaxCuota(Number(e.target.value))}
                className="w-full accent-brand-red h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1.5 font-mono">
                <span>$50.000</span><span>$1.500.000</span>
              </div>
            </div>

            {/* Cuotas */}
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.35em] font-mono block mb-3">
                Cantidad de cuotas
              </label>
              <div className="flex gap-2 flex-wrap">
                {[12, 24, 36, 48, 60].map((n) => (
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

            {/* Resultado */}
            <div
              className="pulse-glow bg-[#081426] border border-brand-red/20 p-6 text-center"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
            >
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em] font-mono mb-2">
                Accedés a vehículos de hasta
              </p>
              <p className="font-display font-black text-5xl text-white leading-none mb-2 tabular-nums">
                {formatPrice(displayPrice)}
              </p>
              <p className="text-white/20 text-[10px] font-mono mt-3">
                * Valores orientativos. Coeficiente {coef.toFixed(1)} para {cuotas} cuotas.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalogo"
                className="flex items-center justify-center gap-2 flex-1 bg-brand-red hover:bg-brand-red-dark text-white font-black py-4 uppercase tracking-widest text-sm transition-colors"
                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
              >
                Ver autos disponibles <ArrowRight size={16} />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 bg-[#25D366] hover:bg-[#20c45e] text-white font-black py-4 uppercase tracking-widest text-sm transition-colors"
                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
              >
                <WhatsAppIcon size={16} />
                Consultar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Requisitos ── */}
      <section className="py-16 bg-[#0C1B32] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.010) 80px, rgba(255,255,255,0.010) 81px)" }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[3px] bg-brand-red" />
            <h2 className="font-display font-black text-3xl text-white uppercase tracking-wider">
              Requisitos
            </h2>
          </div>
          <ul className="space-y-3">
            {requirements.map((req) => (
              <li
                key={req}
                className="flex items-center gap-4 bg-[#060E1C] border border-white/[0.06] hover:border-brand-red/30 px-5 py-4 text-white/70 text-sm font-mono transition-colors"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
              >
                <CheckCircle2 size={16} className="text-brand-red shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#060E1C] relative overflow-hidden">
        {/* Red glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-red/8 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[10px] font-black text-brand-red uppercase tracking-[0.4em] font-mono mb-4">
            — Sin vueltas —
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase leading-[0.9] mb-5">
            ¿Dudas sobre <span className="text-brand-red">tu plan?</span>
          </h2>
          <p className="text-white/35 font-mono text-sm mb-8 tracking-wider">
            Consultanos sin compromiso y te armamos una propuesta a medida.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white font-black px-10 py-4 uppercase tracking-widest text-sm transition-all hover:shadow-lg hover:shadow-green-500/20"
            style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
          >
            <WhatsAppIcon size={18} />
            Consultá tu plan <ArrowRight size={16} />
          </a>
        </div>
      </section>

    </div>
  );
}
