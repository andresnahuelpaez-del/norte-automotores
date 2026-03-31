"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, ExternalLink, Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Car } from "@/types";

export function AdminCarActions({ car }: { car: Car }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async (field: "is_active" | "is_featured", current: boolean) => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("cars").update({ [field]: !current }).eq("id", car.id);
    router.refresh();
    setLoading(false);
  };

  const deleteCar = async () => {
    if (!confirm(`¿Eliminar ${car.brand} ${car.model}? Esta acción no se puede deshacer.`)) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("cars").delete().eq("id", car.id);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Link
        href={`/admin/autos/${car.id}`}
        className="p-1.5 text-brand-gray hover:text-brand-red hover:bg-brand-red/10 rounded-none transition-colors"
        title="Editar"
      >
        <Pencil size={15} />
      </Link>
      <Link
        href={`/auto/${car.slug}`}
        target="_blank"
        className="p-1.5 text-brand-gray hover:text-brand-red hover:bg-brand-red/10 rounded-none transition-colors"
        title="Ver en sitio"
      >
        <ExternalLink size={15} />
      </Link>
      <button
        onClick={() => toggle("is_featured", car.is_featured)}
        disabled={loading}
        className={`p-1.5 rounded-none transition-colors ${
          car.is_featured ? "text-yellow-500 hover:bg-yellow-50" : "text-brand-gray hover:text-yellow-500 hover:bg-yellow-50"
        }`}
        title={car.is_featured ? "Quitar destacado" : "Destacar"}
      >
        <Star size={15} />
      </button>
      <button
        onClick={() => toggle("is_active", car.is_active)}
        disabled={loading}
        className={`p-1.5 rounded-none transition-colors ${
          car.is_active ? "text-green-500 hover:bg-green-50" : "text-brand-gray hover:text-green-500 hover:bg-green-50"
        }`}
        title={car.is_active ? "Ocultar" : "Publicar"}
      >
        {car.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <button
        onClick={deleteCar}
        disabled={loading}
        className="p-1.5 text-brand-gray hover:text-red-500 hover:bg-red-50 rounded-none transition-colors"
        title="Eliminar"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
