"use client";
import { useState } from "react";
import { Phone, MapPin, Mail, Instagram, Clock, Star, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { createClient } from "@/lib/supabase/client";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317";
const ADDRESS = "Av. Coronel Felipe Varela 1776, La Rioja, Argentina";
const GOOGLE_MAPS = "https://www.google.com/maps/search/Norte+Automotores+La+Rioja";
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ46OBG9TXlpkRrYUqNwcnggY";

export function ContactoContent() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        message: form.message || null,
        type: "form",
      });
      if (error) throw error;
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola! Quisiera hacer una consulta.")}`;

  return (
    <div className="min-h-screen bg-[#060E1C]">

      {/* ── Hero ── */}
      <section className="relative bg-[#060E1C] py-14 overflow-hidden border-b border-brand-red/20">
        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(80deg, transparent, transparent 80px, rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[3px] bg-brand-red" />
            <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.45em] font-mono">Contacto</span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white uppercase leading-[0.85] mb-3">
            CONTACTO
          </h1>
          <p className="text-white/40 text-base font-mono tracking-wider">
            Estamos para ayudarte — Escribinos o llamanos
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Formulario ── */}
          <div className="relative bg-[#0C1B32] border border-white/[0.07] p-8"
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
          >
            {/* Red stripe top */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-red" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[3px] bg-brand-red" />
              <h2 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                Envianos tu consulta
              </h2>
            </div>

            {status === "success" ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mx-auto mb-5"
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase mb-2 tracking-wider">¡Consulta enviada!</h3>
                <p className="text-white/40 font-mono text-sm mb-6">Te respondemos a la brevedad.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-brand-red font-black uppercase tracking-widest text-sm hover:underline font-mono"
                >
                  Enviar otra consulta →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-mono block mb-2">
                      Nombre *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full bg-[#081426] border border-white/10 focus:border-brand-red text-white px-4 py-3 text-sm focus:outline-none transition-colors placeholder:text-white/20 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-mono block mb-2">
                      Teléfono *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+54 380..."
                      className="w-full bg-[#081426] border border-white/10 focus:border-brand-red text-white px-4 py-3 text-sm focus:outline-none transition-colors placeholder:text-white/20 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-mono block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full bg-[#081426] border border-white/10 focus:border-brand-red text-white px-4 py-3 text-sm focus:outline-none transition-colors placeholder:text-white/20 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-mono block mb-2">Mensaje</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="¿En qué auto estás interesado? ¿Qué querés saber?"
                    className="w-full bg-[#081426] border border-white/10 focus:border-brand-red text-white px-4 py-3 text-sm focus:outline-none transition-colors placeholder:text-white/20 resize-none font-mono"
                  />
                </div>

                {status === "error" && (
                  <p className="text-brand-red text-sm font-mono">Error al enviar. Intentá de nuevo.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-black py-4 uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                >
                  {status === "loading" ? "Enviando..." : <>Enviar consulta <ArrowRight size={16} /></>}
                </button>
              </form>
            )}
          </div>

          {/* ── Info ── */}
          <div className="space-y-5">

            {/* Quick contact buttons */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20c45e] text-white p-5 transition-colors group"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                <WhatsAppIcon size={22} />
                <div>
                  <p className="font-black uppercase tracking-wider text-sm">WhatsApp</p>
                  <p className="text-white/70 text-xs font-mono">Respuesta inmediata</p>
                </div>
              </a>
              <a
                href="tel:+543804796317"
                className="flex items-center gap-3 bg-brand-red hover:bg-brand-red-dark text-white p-5 transition-colors group"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                <Phone size={22} />
                <div>
                  <p className="font-black uppercase tracking-wider text-sm">Llamar</p>
                  <p className="text-white/70 text-xs font-mono">+54 380 479-6317</p>
                </div>
              </a>
            </div>

            {/* Horarios */}
            <div className="relative bg-[#0C1B32] border border-white/[0.07] p-6 overflow-hidden"
              style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-red" />
              <div className="flex items-center gap-2.5 mb-5 pl-3">
                <Clock size={14} className="text-brand-red shrink-0" />
                <h3 className="font-display font-black text-white uppercase tracking-[0.3em] text-sm">Horarios</h3>
              </div>
              <div className="space-y-0 pl-3">
                <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                  <p className="text-white/70 font-mono text-sm uppercase tracking-wider">Lun – Vie</p>
                  <div className="text-right">
                    <p className="text-brand-red font-black text-sm font-mono">09:00 – 13:00</p>
                    <p className="text-brand-red font-black text-sm font-mono">18:00 – 22:00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                  <p className="text-white/70 font-mono text-sm uppercase tracking-wider">Sábado</p>
                  <p className="text-brand-red font-black text-sm font-mono">09:00 – 13:00</p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-white/30 font-mono text-sm uppercase tracking-wider">Domingo</p>
                  <p className="text-white/20 text-sm font-mono">Cerrado</p>
                </div>
              </div>
            </div>

            {/* Info detalles */}
            <div className="relative bg-[#0C1B32] border border-white/[0.07] p-6 space-y-5 overflow-hidden"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-red/80 to-transparent" />
              <div className="pl-3 flex items-start gap-3">
                <MapPin size={16} className="text-brand-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono mb-1">Dirección</p>
                  <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer"
                    className="text-white/70 text-sm font-mono hover:text-brand-red transition-colors"
                  >
                    {ADDRESS}
                  </a>
                </div>
              </div>
              <div className="pl-3 flex items-start gap-3">
                <Mail size={16} className="text-brand-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono mb-1">Email</p>
                  <a href="mailto:ventas@norteautomotores.com.ar"
                    className="text-white/70 text-sm font-mono hover:text-brand-red transition-colors"
                  >
                    ventas@norteautomotores.com.ar
                  </a>
                </div>
              </div>
              <div className="pl-3 flex items-start gap-3">
                <Instagram size={16} className="text-brand-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-mono mb-1">Instagram</p>
                  <a href="https://instagram.com/norte.automotores" target="_blank" rel="noopener noreferrer"
                    className="text-white/70 text-sm font-mono hover:text-brand-red transition-colors"
                  >
                    @norte.automotores
                  </a>
                </div>
              </div>

              {/* Google review */}
              <div className="pl-3 pt-2 border-t border-white/[0.05]">
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#081426] border border-brand-red/20 hover:border-brand-red/50 px-4 py-3.5 transition-colors group"
                  style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div>
                      <p className="font-black text-white text-xs uppercase tracking-wider">Dejanos tu reseña en Google</p>
                      <p className="text-white/30 text-[10px] font-mono">Tu opinión nos ayuda a crecer</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-brand-red group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Mapa */}
            <div className="overflow-hidden h-52 border border-white/[0.07]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.7!2d-66.8736842!3d-29.4405611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9427d9341be393e3%3A0x60782707373aa5ad!2sNorte%20Automotores!5e0!3m2!1ses!2sar!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.7)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
