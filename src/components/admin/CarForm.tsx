"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { buildSlug } from "@/lib/utils";
import { BRANDS, BODY_TYPES, FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
import { X, Plus, Upload, ImageIcon, Star, Video } from "lucide-react";
import type { Car } from "@/types";

interface Props {
  car?: Car;
  defaultVehicleType?: "car" | "moto";
}

export function CarForm({ car, defaultVehicleType = "car" }: Props) {
  const router = useRouter();
  const isEditing = !!car;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    vehicle_type: car?.vehicle_type || defaultVehicleType,
    brand: car?.brand || "",
    model: car?.model || "",
    version: car?.version || "",
    year: car?.year || new Date().getFullYear(),
    condition: car?.condition || "used",
    body_type: car?.body_type || "",
    mileage: car?.mileage || 0,
    color: car?.color || "",
    fuel_type: car?.fuel_type || "",
    transmission: car?.transmission || "",
    doors: car?.doors || 4,
    engine_cc: car?.engine_cc || 0,
    description: car?.description || "",
    price: car?.price || 0,
    show_price: car?.show_price ?? true,
    financing_available: car?.financing_available || false,
    financing_details: car?.financing_details || "",
    whatsapp_text: car?.whatsapp_text || "",
    video_url: car?.video_url || "",
    is_active: car?.is_active ?? true,
    is_featured: car?.is_featured || false,
  });

  const [features, setFeatures] = useState<string[]>(car?.features || []);
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState<string[]>(car?.images || []);

  const f = (field: keyof typeof form, value: unknown) => setForm({ ...form, [field]: value });

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };
  const removeFeature = (feat: string) => setFeatures(features.filter(x => x !== feat));

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("vehiculos")
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("vehiculos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setImages(prev => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (url: string) => setImages(prev => prev.filter(u => u !== url));
  const setMain = (url: string) => setImages(prev => [url, ...prev.filter(u => u !== url)]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const slug = buildSlug(form.brand, form.model, form.version, form.year, form.condition);

      const payload = {
        ...form,
        slug,
        features,
        images,
        mileage: form.condition === "new" ? 0 : form.mileage,
        price: form.price || null,
        video_url: form.video_url || null,
        engine_cc: form.vehicle_type === "moto" && form.engine_cc ? form.engine_cc : null,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase.from("cars").update(payload).eq("id", car!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cars").insert({ ...payload, views: 0 });
        if (error) throw error;
      }

      const backPath = form.vehicle_type === "moto" ? "/admin/motos" : "/admin/autos";
      router.push(backPath);
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || "Error al guardar");
      setLoading(false);
    }
  };

  const isMotos = form.vehicle_type === "moto";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

      {/* Tipo de vehículo */}
      <section className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
        <h2 className="font-display font-bold text-xl text-brand-dark uppercase mb-4">Tipo de vehículo</h2>
        <div className="flex gap-3">
          {[
            { value: "car", label: "🚗 Auto" },
            { value: "moto", label: "🏍️ Moto" },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => f("vehicle_type", opt.value)}
              className={`flex-1 py-3 rounded-none font-bold text-sm border-2 transition-colors ${
                form.vehicle_type === opt.value
                  ? "bg-brand-red border-brand-red text-white"
                  : "border-gray-200 text-brand-dark hover:border-brand-red"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Fotos y video */}
      <section className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
        <h2 className="font-display font-bold text-xl text-brand-dark uppercase mb-1">Fotos y video</h2>
        <p className="text-brand-gray text-xs mb-5">La primera foto es la imagen principal. Podés marcar cualquiera como principal.</p>

        {/* Grid de fotos */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-video rounded-none overflow-hidden border-2 border-gray-100">
                <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="160px" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10 flex items-center gap-1">
                    <Star size={8} /> Principal
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => setMain(url)}
                      title="Establecer como principal"
                      className="bg-brand-red text-white p-1.5 rounded-none"
                    >
                      <Star size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    title="Eliminar foto"
                    className="bg-red-500 text-white p-1.5 rounded-none"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón de carga */}
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-none py-4 cursor-pointer transition-colors ${
          uploading ? "border-brand-red bg-blue-50 text-brand-red" : "border-gray-200 hover:border-brand-red text-brand-gray hover:text-brand-red"
        }`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Subiendo fotos...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span className="text-sm font-medium">
                {images.length === 0 ? "Subir fotos" : "Agregar más fotos"}
              </span>
              <span className="text-xs text-gray-400">(JPG, PNG, WEBP)</span>
            </>
          )}
        </label>

        {images.length === 0 && (
          <div className="mt-3 flex items-center gap-2 text-brand-gray text-xs">
            <ImageIcon size={13} />
            <span>Sin fotos cargadas. {isMotos ? "La moto" : "El auto"} no mostrará imagen.</span>
          </div>
        )}

        {/* URL de video */}
        <div className="mt-5">
          <label className="label flex items-center gap-1.5">
            <Video size={14} className="text-brand-red" /> URL de video (YouTube, etc.) — opcional
          </label>
          <input
            type="url"
            value={form.video_url}
            onChange={e => f("video_url", e.target.value)}
            className="input"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </section>

      {/* Información básica */}
      <section className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
        <h2 className="font-display font-bold text-xl text-brand-dark uppercase mb-5">Información básica</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Marca *</label>
            <select required value={form.brand} onChange={e => f("brand", e.target.value)} className="input">
              <option value="">Seleccionar</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Modelo *</label>
            <input required type="text" value={form.model} onChange={e => f("model", e.target.value)} className="input" placeholder={isMotos ? "MT-07" : "Corolla"} />
          </div>
          <div>
            <label className="label">Versión</label>
            <input type="text" value={form.version} onChange={e => f("version", e.target.value)} className="input" placeholder={isMotos ? "ABS" : "XEI AT"} />
          </div>
          <div>
            <label className="label">Año *</label>
            <input required type="number" value={form.year} onChange={e => f("year", Number(e.target.value))} className="input" min={1990} max={2030} />
          </div>
          <div>
            <label className="label">Condición *</label>
            <select value={form.condition} onChange={e => f("condition", e.target.value)} className="input">
              <option value="used">Usado</option>
              <option value="new">0km</option>
            </select>
          </div>
          {!isMotos && (
            <div>
              <label className="label">Tipo de carrocería</label>
              <select value={form.body_type} onChange={e => f("body_type", e.target.value)} className="input">
                <option value="">Seleccionar</option>
                {BODY_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Detalles técnicos */}
      <section className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
        <h2 className="font-display font-bold text-xl text-brand-dark uppercase mb-5">Detalles técnicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Kilometraje</label>
            <input type="number" value={form.mileage} onChange={e => f("mileage", Number(e.target.value))} disabled={form.condition === "new"} className="input disabled:opacity-50" />
          </div>
          <div>
            <label className="label">Color</label>
            <input type="text" value={form.color} onChange={e => f("color", e.target.value)} className="input" placeholder="Blanco" />
          </div>
          <div>
            <label className="label">Combustible</label>
            <select value={form.fuel_type} onChange={e => f("fuel_type", e.target.value)} className="input">
              <option value="">Seleccionar</option>
              {FUEL_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Transmisión</label>
            <select value={form.transmission} onChange={e => f("transmission", e.target.value)} className="input">
              <option value="">Seleccionar</option>
              {TRANSMISSIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {!isMotos && (
            <div>
              <label className="label">Puertas</label>
              <input type="number" value={form.doors} onChange={e => f("doors", Number(e.target.value))} className="input" min={2} max={6} />
            </div>
          )}
          {isMotos && (
            <div>
              <label className="label">Cilindrada (cc)</label>
              <input type="number" value={form.engine_cc} onChange={e => f("engine_cc", Number(e.target.value))} className="input" placeholder="300" min={0} />
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="label">Descripción</label>
          <textarea rows={4} value={form.description} onChange={e => f("description", e.target.value)} className="input resize-none" placeholder={`Descripción del ${isMotos ? "moto" : "auto"}...`} />
        </div>

        <div className="mt-4">
          <label className="label">Equipamiento / Características</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="input flex-1"
              placeholder='Ej: "Aire acondicionado" + Enter'
            />
            <button type="button" onClick={addFeature} className="p-2.5 bg-brand-red text-white rounded-none hover:bg-brand-red-dark">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map(feat => (
              <span key={feat} className="flex items-center gap-1.5 bg-brand-red/10 text-brand-red text-xs font-semibold px-3 py-1.5 rounded-full">
                {feat}
                <button type="button" onClick={() => removeFeature(feat)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Precio y financiación */}
      <section className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
        <h2 className="font-display font-bold text-xl text-brand-dark uppercase mb-5">Precio y financiación</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Precio (ARS)</label>
            <input type="number" value={form.price} onChange={e => f("price", Number(e.target.value))} className="input" placeholder="0 = consultar precio" />
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.show_price} onChange={e => f("show_price", e.target.checked)} className="w-4 h-4 accent-brand-red" />
              <span className="text-sm font-medium text-brand-dark">Mostrar precio</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.financing_available} onChange={e => f("financing_available", e.target.checked)} className="w-4 h-4 accent-brand-red" />
              <span className="text-sm font-medium text-brand-dark">Ofrece financiación</span>
            </label>
          </div>
        </div>
        {form.financing_available && (
          <div className="mt-4">
            <label className="label">Detalle del plan de financiación</label>
            <textarea rows={2} value={form.financing_details} onChange={e => f("financing_details", e.target.value)} className="input resize-none" placeholder="30 cuotas fijas, sin anticipo..." />
          </div>
        )}
        <div className="mt-4">
          <label className="label">Mensaje personalizado de WhatsApp (opcional)</label>
          <textarea rows={2} value={form.whatsapp_text} onChange={e => f("whatsapp_text", e.target.value)} className="input resize-none" placeholder="Hola! Me interesa el Toyota Corolla 2020..." />
        </div>
      </section>

      {/* Publicación */}
      <section className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
        <h2 className="font-display font-bold text-xl text-brand-dark uppercase mb-5">Publicación</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => f("is_active", e.target.checked)} className="w-4 h-4 accent-brand-red" />
            <span className="text-sm font-medium text-brand-dark">
              {isMotos ? "Moto publicada" : "Auto publicado"} (visible en el sitio)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => f("is_featured", e.target.checked)} className="w-4 h-4 accent-brand-red" />
            <span className="text-sm font-medium text-brand-dark">
              Destacar (aparece en el inicio)
            </span>
          </label>
        </div>
      </section>

      {error && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-none">{error}</p>}

      <div className="flex gap-4 pb-8">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-10 py-3 rounded-none transition-colors disabled:opacity-60"
        >
          {loading ? "Guardando..." : isEditing ? "Guardar cambios" : `Publicar ${isMotos ? "moto" : "auto"}`}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border-2 border-gray-200 text-brand-dark hover:border-brand-red font-bold px-6 py-3 rounded-none transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
