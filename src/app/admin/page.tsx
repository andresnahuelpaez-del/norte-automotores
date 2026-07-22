import { createClient } from "@/lib/supabase/server";
import { Car, Bike, MessageSquare, Eye, Star } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  let stats = { autos: 0, motos: 0, active: 0, featured: 0, inquiries: 0 };

  try {
    const supabase = await createClient();
    const [carsRes, inquiriesRes] = await Promise.all([
      supabase.from("cars").select("id, is_active, is_featured, vehicle_type"),
      supabase.from("inquiries").select("id", { count: "exact" }),
    ]);

    if (carsRes.data) {
      stats.autos = carsRes.data.filter((c) => c.vehicle_type !== "moto").length;
      stats.motos = carsRes.data.filter((c) => c.vehicle_type === "moto").length;
      stats.active = carsRes.data.filter((c) => c.is_active).length;
      stats.featured = carsRes.data.filter((c) => c.is_featured).length;
    }
    stats.inquiries = inquiriesRes.count || 0;
  } catch {}

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark uppercase mb-1">Inicio</h1>
      <p className="text-brand-gray text-sm mb-6">Resumen del sitio. Desde el menú de la izquierda cargás autos, motos, revisás consultas y editás la configuración.</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        {[
          { label: "Autos", value: stats.autos, icon: Car, color: "bg-blue-50 text-blue-600", help: "Autos cargados" },
          { label: "Motos", value: stats.motos, icon: Bike, color: "bg-cyan-50 text-cyan-600", help: "Motos cargadas" },
          { label: "Publicados", value: stats.active, icon: Eye, color: "bg-green-50 text-green-600", help: "Visibles en el sitio" },
          { label: "Destacados", value: stats.featured, icon: Star, color: "bg-yellow-50 text-yellow-600", help: "Aparecen en el inicio" },
          { label: "Consultas", value: stats.inquiries, icon: MessageSquare, color: "bg-purple-50 text-purple-600", help: "Mensajes recibidos" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-none p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-none flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-3xl font-bold text-brand-dark">{stat.value}</p>
            <p className="text-brand-dark text-sm mt-1 font-semibold">{stat.label}</p>
            <p className="text-brand-gray text-[11px] mt-0.5">{stat.help}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Acciones rápidas</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/autos/nuevo"
          className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-5 py-2.5 rounded-none transition-colors text-sm"
        >
          + Nuevo auto
        </Link>
        <Link
          href="/admin/motos/nuevo"
          className="bg-brand-dark hover:bg-brand-dark/80 text-white font-bold px-5 py-2.5 rounded-none transition-colors text-sm"
        >
          + Nueva moto
        </Link>
        <Link
          href="/admin/consultas"
          className="bg-white border border-gray-200 text-brand-dark hover:border-brand-red font-bold px-5 py-2.5 rounded-none transition-colors text-sm"
        >
          Ver consultas
        </Link>
        <Link
          href="/"
          target="_blank"
          className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold px-5 py-2.5 rounded-none transition-colors text-sm"
        >
          Ver sitio →
        </Link>
      </div>
    </div>
  );
}
