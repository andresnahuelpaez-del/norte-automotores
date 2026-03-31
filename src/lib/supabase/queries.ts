import { createClient } from "./server";
import type { Car, SiteConfig } from "@/types";

export async function getCars(filters?: {
  condition?: string;
  brand?: string;
  body_type?: string;
  is_featured?: boolean;
  vehicle_type?: 'car' | 'moto';
  financing_available?: boolean;
  order_by?: 'created_at' | 'price_asc' | 'price_desc';
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("cars")
    .select("*")
    .eq("is_active", true);

  if (filters?.condition) query = query.eq("condition", filters.condition);
  if (filters?.brand) query = query.eq("brand", filters.brand);
  if (filters?.body_type) query = query.eq("body_type", filters.body_type);
  if (filters?.is_featured !== undefined) query = query.eq("is_featured", filters.is_featured);
  if (filters?.financing_available) query = query.eq("financing_available", true);
  if (filters?.vehicle_type !== undefined) {
    query = query.eq("vehicle_type", filters.vehicle_type);
  } else {
    query = query.eq("vehicle_type", "car");
  }

  if (filters?.order_by === 'price_asc') {
    query = query.order("price", { ascending: true });
  } else if (filters?.order_by === 'price_desc') {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data as Car[];
}

export async function getCarBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Car;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_config").select("*");
  if (error || !data) {
    return {
      whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "3804796317",
      show_prices_globally: "true",
      show_financing_globally: "true",
      hero_title: "Tu próximo auto te espera",
      hero_subtitle: "Autos, motos y financiación propia. La Rioja.",
      address: "Av. Coronel Felipe Varela 1776, La Rioja, Argentina",
      phone: "+54 380 479-6317",
      email: "ventas@norteautomotores.com.ar",
      instagram: "norte.automotores",
      facebook: "https://facebook.com/share/177Lw7quNV/?mibextid=wwXlfr",
    };
  }
  return Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])) as unknown as SiteConfig;
}

export async function incrementCarViews(id: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_views", { car_id: id });
}
