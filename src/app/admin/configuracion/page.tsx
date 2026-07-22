"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const TEXT_KEYS = [
  { key: "whatsapp_number", label: "Número de WhatsApp", placeholder: "5493804796317", hint: "Con código de país y sin espacios ni signos. Argentina: 549 + característica + número. Ej: 5493804796317" },
  { key: "phone", label: "Teléfono", placeholder: "+54 380 479-6317", hint: "Como querés que se vea en el sitio. Este es el que abre al tocar 'Llamar'." },
  { key: "address", label: "Dirección", placeholder: "Av. Coronel Felipe Varela y Senador Rodolfo Blanco, La Rioja Capital", hint: "Aparece en el footer, contacto y en el mapa de cada vehículo." },
  { key: "email", label: "Email", placeholder: "ventas@norteautomotores.com.ar", hint: "Mail de contacto que se muestra en el footer y en la página de contacto." },
  { key: "hero_title", label: "Título principal (inicio)", placeholder: "Tu próximo auto te espera", hint: "Título grande de la portada. Si lo dejás vacío, se usa el título por defecto 'TU AUTO IDEAL ESTÁ EN NORTE'." },
  { key: "hero_subtitle", label: "Subtítulo (inicio)", placeholder: "Autos · Motos · Financiación propia — La Rioja", hint: "Frase corta debajo del título en la portada." },
  { key: "instagram", label: "Instagram (usuario)", placeholder: "norte.automotores", hint: "Solo el nombre de usuario, sin @ ni el link completo." },
  { key: "facebook", label: "Facebook (link)", placeholder: "https://facebook.com/share/...", hint: "El link completo de la página de Facebook." },
];


const TOGGLE_KEYS = [
  { key: "show_prices_globally", label: "Mostrar precios en todo el sitio", description: "Si lo desactivás, TODOS los vehículos muestran 'Consultar precio' (sin importar lo cargado en cada uno)." },
  { key: "show_financing_globally", label: "Mostrar financiación en todo el sitio", description: "Si lo desactivás, se ocultan el simulador de cuotas y el cartel 'Financia' de todos los vehículos." },
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
    <div className="p-4 md:p-8">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark uppercase mb-1">Configuración</h1>
      <p className="text-brand-gray text-sm mb-6">Datos de contacto, textos de la portada y opciones del sitio. Acordate de tocar <strong>Guardar cambios</strong> al final.</p>

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
          <h2 className="font-display font-bold text-lg text-brand-dark uppercase mb-1">Información del negocio</h2>
          <p className="text-xs text-brand-gray mb-4">Estos datos se muestran en el sitio (footer, contacto, botones de WhatsApp y llamada).</p>
          <div className="space-y-5">
            {TEXT_KEYS.map(({ key, label, placeholder, hint }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-brand-dark block mb-1">{label}</label>
                <input
                  type="text"
                  value={values[key] || ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
                {hint && <p className="text-[11px] text-brand-gray mt-1 leading-snug">{hint}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Cotizador ── */}
        <div className="bg-white rounded-none shadow-sm border border-gray-100 p-6">
          <h2 className="font-display font-bold text-lg text-brand-dark uppercase mb-1">Simulador de financiación</h2>
          <p className="text-xs text-brand-gray mb-4">
            Ajustá los topes de los sliders del simulador de la portada. La fórmula de las cuotas es fija (ver abajo).
          </p>

          {/* Fórmula fija (solo informativo) */}
          <div className="bg-brand-gray-light border border-gray-100 rounded-none p-4 mb-5">
            <p className="text-xs font-semibold text-brand-dark mb-1">Cómo se calcula la cuota (financiación propia)</p>
            <ul className="text-[11px] text-brand-gray space-y-0.5 leading-relaxed">
              <li>• Interés: <strong>5% mensual</strong> sobre el saldo · Entrega mínima: <strong>30%</strong> del precio</li>
              <li>• Planes disponibles: <strong>6, 12, 18 y 24 cuotas</strong></li>
              <li>• Ejemplo (auto de $10.000.000, entrega 30%): 12 cuotas de <strong>$933.000</strong></li>
            </ul>
            <p className="text-[10px] text-gray-400 mt-2">Estos valores son fijos en el sistema. Si necesitás cambiar la tasa o la entrega, avisá al desarrollador.</p>
          </div>

          <div className="space-y-5">

            {/* Rangos de sliders */}
            <div>
              <p className="text-sm font-semibold text-brand-dark mb-1">Rangos de los sliders del simulador</p>
              <p className="text-[11px] text-brand-gray mb-3">Controlan hasta cuánto puede mover el cliente cada barra en el cotizador de la portada.</p>
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
