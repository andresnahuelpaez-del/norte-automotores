"use client";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { calcularCuota, fmtARS, ENTREGA_MINIMA, PLANES } from "@/lib/financiacion";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { Car } from "@/types";

interface Props {
  car: Car;
  whatsappNumber: string;
}

/**
 * Simulador de financiación propia por vehículo + botón de consulta.
 * El mensaje de WhatsApp incluye el plan (entrega + cuotas) seleccionado.
 * Solo se muestra el simulador si el auto financia, tiene precio visible y está en ARS.
 */
export function FinanciacionAuto({ car, whatsappNumber }: Props) {
  const simulable = !!(car.financing_available && car.show_price && car.price && (car.currency || "ARS") === "ARS");
  const precio = car.price || 0;

  const [meses, setMeses] = useState<number>(12);
  const [entregaPct, setEntregaPct] = useState<number>(ENTREGA_MINIMA * 100);

  const entrega = (precio * entregaPct) / 100;
  const { entregaReal, cuota } = calcularCuota(precio, meses, entrega);

  const mensaje = simulable
    ? `Hola! Me interesa ${car.vehicle_type === "moto" ? "la" : "el"} ${car.brand} ${car.model} ${car.year} (${fmtARS(precio)}) que vi en su web.\nVi el plan de financiación: entrega de ${fmtARS(entregaReal)} y ${meses} cuotas de ${fmtARS(cuota)}.\n¿Está disponible?`
    : car.whatsapp_text ||
      `Hola! Me interesa ${car.vehicle_type === "moto" ? "la" : "el"} ${car.brand} ${car.model} ${car.year} que vi en su web. ¿Está disponible?`;

  const waUrl = buildWhatsAppUrl(whatsappNumber, mensaje);

  return (
    <div>
      {simulable && (
        <div className="mb-4 rounded-none border border-[#173A5E]/15 bg-[#F7F9FB] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-[#173A5E] uppercase tracking-wide">
              Financiación propia
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E6FB6] bg-[#2E6FB6]/10 px-2 py-1">
              Entrega desde 30%
            </span>
          </div>

          {/* Entrega */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="text-[#173A5E]/70">Entrega ({Math.round(entregaPct)}%)</span>
              <span className="font-bold text-[#173A5E]">{fmtARS(entregaReal)}</span>
            </div>
            <input
              type="range"
              min={ENTREGA_MINIMA * 100}
              max={80}
              step={1}
              value={entregaPct}
              onChange={(e) => setEntregaPct(Number(e.target.value))}
              className="w-full accent-brand-red h-1 cursor-pointer"
              aria-label="Porcentaje de entrega"
            />
          </div>

          {/* Planes */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {PLANES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMeses(m)}
                className={`py-2 text-sm font-bold border transition-colors ${
                  meses === m
                    ? "bg-[#173A5E] border-[#173A5E] text-white"
                    : "bg-white border-[#173A5E]/20 text-[#173A5E] hover:border-[#173A5E]"
                }`}
              >
                {m}
                <span className="block text-[9px] font-medium uppercase tracking-wider opacity-70">cuotas</span>
              </button>
            ))}
          </div>

          {/* Cuota resultante */}
          <div className="text-center py-3 bg-white border border-[#173A5E]/10 mb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#173A5E]/50 mb-1">
              {meses} cuotas de
            </p>
            <p className="font-display font-black text-3xl text-brand-red leading-none">
              {fmtARS(cuota)}
            </p>
          </div>

          <p className="text-[10px] text-[#173A5E]/45 text-center">
            Valores orientativos. Sujetos a aprobación crediticia.
          </p>
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c45e] text-white font-bold py-3.5 rounded-none transition-colors"
      >
        <WhatsAppIcon size={20} />
        Consultar por WhatsApp
      </a>
    </div>
  );
}
