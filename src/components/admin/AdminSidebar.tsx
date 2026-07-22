"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, Bike, MessageSquare, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/admin/autos", label: "Autos", icon: Car },
  { href: "/admin/motos", label: "Motos", icon: Bike },
  { href: "/admin/consultas", label: "Consultas", icon: MessageSquare },
  { href: "/admin/configuracion", label: "Config", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 bg-brand-dark min-h-screen flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-red flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-white uppercase text-sm tracking-wide">
              Panel Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-red text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-brand-dark border-b border-white/10 flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-red flex items-center justify-center">
            <LayoutDashboard size={12} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-xs uppercase tracking-wider">Panel Admin</span>
        </div>
        <Link href="/catalogo" target="_blank" className="text-white/40 hover:text-white text-xs transition-colors">
          Ver sitio →
        </Link>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-dark border-t border-white/10 flex">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors",
                active ? "text-brand-red" : "text-white/40"
              )}
            >
              <link.icon size={18} />
              <span className="text-[9px] font-medium">{link.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-white/30 hover:text-white/60 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-[9px] font-medium">Salir</span>
        </button>
      </nav>
    </>
  );
}
