import { createClient } from "@/lib/supabase/server";
import { Car, MessageSquare, Eye, Star } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  let stats = { total: 0, active: 0, featured: 0, inquiries: 0 };

  try {
    const supabase = await createClient();
    const [carsRes, inquiriesRes] = await Promise.all([
      supabase.from("cars").select("id, is_active, is_featured"),
      supabase.from("inquiries").select("id", { count: "exact" }),
    ]);

    if (carsRes.data) {
      stats.total = carsRes.data.length;
      stats.active = carsRes.data.filter((c) => c.is_active).length;
      stats.featured = carsRes.data.filter((c) => c.is_featured).length;
    }
    stats.inquiries = inquiriesRes.count || 0;
  } catch {}

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-3xl text-brand-dark uppercase mb-2">Dashboard</h1>
      <p className="text-brand-gray text-sm mb-8">Resumen general del sitio</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: "Total autos", value: stats.total, icon: Car, color: "bg-blue-50 text-blue-600" },
          { label: "Publicados", value: stats.active, icon: Eye, color: "bg-green-50 text-green-600" },
          { label: "Destacados", value: stats.featured, icon: Star, color: "bg-yellow-50 text-yellow-600" },
          { label: "Consultas", value: stats.inquiries, icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-none p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-none flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-3xl font-bold text-brand-dark">{stat.value}</p>
            <p className="text-brand-gray text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/autos/nuevo"
          className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-6 py-3 rounded-none transition-colors"
        >
          + Publicar nuevo auto
        </Link>
        <Link
          href="/catalogo"
          target="_blank"
          className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold px-6 py-3 rounded-none transition-colors"
        >
          Ver sitio →
        </Link>
      </div>
    </div>
  );
}
