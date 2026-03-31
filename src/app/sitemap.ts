import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://norteautomotores.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/catalogo`, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/motos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/financiacion`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/contacto`, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const supabase = await createClient();
    const { data: cars } = await supabase
      .from("cars")
      .select("slug, updated_at")
      .eq("is_active", true);

    const carPages: MetadataRoute.Sitemap = (cars || []).map((car) => ({
      url: `${BASE}/auto/${car.slug}`,
      lastModified: car.updated_at,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...carPages];
  } catch {
    return staticPages;
  }
}
