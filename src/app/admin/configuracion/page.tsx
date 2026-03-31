"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const TEXT_KEYS = [
  { key: "whatsapp_number", label: "Número de WhatsApp", placeholder: "3804796317" },
  { key: "address", label: "Dirección", placeholder: "Av. Coronel Felipe Varela 1776, La Rioja, Argentina" },
  { key: "phone", label: "Teléfono", placeholder: "+54 380 479-6317" },
  { key: "email", label: "Email", placeholder: "ventas@norteautomotores.com.ar" },
  { key: "hero_title", label: "Título del Hero", placeholder: "Tu próximo auto te espera" },
  { key: "hero_subtitle", label: "Subtítulo del Hero", placeholder: "Autos, motos y financiación. La Rioja." },
  { key: "instagram", label: "Instagram (usuario)", placeholder: "norte.automotores" },
  { key: "facebook", label: "Facebook (link)", placeholder: "https://facebook.com/share/177Lw7quNV/?mibextid=wwXlfr" },
];


const TOGGLE_KEYS = [
  { key: "show_prices_globally", label: "Mostrar precios en todo el sitio", description: "Si está desactivado, todos los vehículos muestran 'Consultar precio'" },
  { key: "show_financing_globally", label: "Mostrar sección de financiación", description: "Oculta el badge de financiación y la página /financiacion" },
];

export default function ConfiguracionPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("site_config").select("*");
      if (data) {
        setValues(Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])));
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    const supabase = createClient();
    await Promise.all(
      Object.entries(values).map(([key, value]) =>
        supabase.from("site_config").upsert({ key, value })
      )
    );
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-3xl text-brand-dark uppercase mb-6">Configuración</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Toggles globales */}
        <div className="bg-white rounded-none shadow-sm border border-gray-100 p-6">
          <h2 className="font-display font-bold text-lg text-brand-dark uppercase mb-4">Opciones globales</h2>
          <div className="space-y-4">
            {TOGGLE_KEYS.map(({ key, label, description }) => (
              <div key={key} className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => setValues(v => ({ ...v, [key]: v[key] === "true" ? "false" : "true" }))}
                  className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
                    values[key] !== "false" ? "bg-brand-red" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    values[key] !== "false" ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{label}</p>
                  <p className="text-xs text-brand-gray mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campos de texto */}
        <div className="bg-white rounded-none shadow-sm border border-gray-100 p-6">
          <h2 className="font-display font-bold text-lg text-brand-dark uppercase mb-4">Información del negocio</h2>
          <div className="space-y-5">
            {TEXT_KEYS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-brand-dark block mb-1">{label}</label>
                <input
                  type="text"
                  value={values[key] || ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Cotizador ── */}
        <div className="bg-white rounded-none shadow-sm border border-gray-100 p-6">
          <h2 className="font-display font-bold text-lg text-brand-dark uppercase mb-1">Cotizador de financiación</h2>
          <p className="text-xs text-gray-500 mb-1">
            La cuota se calcula así: <code className="bg-gray-100 px-1 rounded">cuota = monto financiado × coeficiente ÷ cuotas</code>
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Ejemplo: $1.000.000 financiado a 24 cuotas con coeficiente 2.5 → cuota = $1.000.000 × 2.5 ÷ 24 = <strong>$104.167/mes</strong>
          </p>

          <div className="space-y-5">

            {/* Coeficientes */}
            <div>
              <p className="text-sm font-semibold text-brand-dark mb-3">Coeficientes por plazo</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: "financing_coef_12", label: "12 cuotas", default: "1.6" },
                  { key: "financing_coef_24", label: "24 cuotas", default: "2.5" },
                  { key: "financing_coef_36", label: "36 cuotas", default: "3.5" },
                  { key: "financing_coef_48", label: "48 cuotas", default: "4.5" },
                  { key: "financing_coef_60", label: "60 cuotas", default: "5.5" },
                ].map(({ key, label, default: def }) => {
                  const coef = parseFloat(values[key] ?? def);
                  const cuotas = parseInt(label);
                  const ejemploCuota = !isNaN(coef) && coef > 0
                    ? new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format((1000000 * coef) / cuotas)
                    : "—";
                  return (
                    <div key={key} className="border border-gray-100 rounded-none p-3">
                      <label className="text-xs font-semibold text-brand-dark block mb-2">{label}</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        step="0.1"
                        value={values[key] ?? def}
                        onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-none px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-center font-bold"
                      />
                      <p className="text-[10px] text-gray-400 text-center mt-1.5">
                        $1M → <strong>${ejemploCuota}/mes</strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rangos de sliders */}
            <div>
              <p className="text-sm font-semibold text-brand-dark mb-3">Rangos de los sliders</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-gray-100 rounded-none p-3">
                  <label className="text-xs font-semibold text-brand-dark block mb-1">Anticipo mínimo ($)</label>
                  <p className="text-[10px] text-gray-400 mb-2">Valor más bajo que puede ingresar el cliente</p>
                  <input
                    type="number" min="0" step="50000"
                    value={values["financing_anticipo_min"] ?? "100000"}
                    onChange={(e) => setValues({ ...values, financing_anticipo_min: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div className="border border-gray-100 rounded-none p-3">
                  <label className="text-xs font-semibold text-brand-dark block mb-1">Anticipo máximo ($)</label>
                  <p className="text-[10px] text-gray-400 mb-2">Ajustalo al precio de tus autos más caros</p>
                  <input
                    type="number" min="0" step="500000"
                    value={values["financing_anticipo_max"] ?? "10000000"}
                    onChange={(e) => setValues({ ...values, financing_anticipo_max: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
                <div className="border border-gray-100 rounded-none p-3">
                  <label className="text-xs font-semibold text-brand-dark block mb-1">Cuota máxima del slider ($)</label>
                  <p className="text-[10px] text-gray-400 mb-2">Tope de cuota mensual que puede elegir el cliente</p>
                  <input
                    type="number" min="50000" step="50000"
                    value={values["financing_cuota_slider_max"] ?? "1500000"}
                    onChange={(e) => setValues({ ...values, financing_cuota_slider_max: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-8 py-3 rounded-none transition-colors disabled:opacity-60"
          >
            {status === "saving" ? "Guardando..." : "Guardar cambios"}
          </button>
          {status === "saved" && (
            <span className="text-green-600 font-semibold text-sm">✓ Guardado</span>
          )}
        </div>
      </div>
    </div>
  );
}
