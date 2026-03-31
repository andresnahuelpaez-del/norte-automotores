import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: 'USD' | 'ARS' = 'ARS'): string {
  const number = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return currency === 'USD' ? `US$ ${number}` : `$ ${number}`;
}

export function formatMileage(km: number): string {
  return new Intl.NumberFormat("es-AR").format(km) + " km";
}

export function buildSlug(brand: string, model: string, version: string | undefined, year: number, condition: string): string {
  const parts = [brand, model, version, String(year), condition === "new" ? "0km" : "usado"]
    .filter(Boolean)
    .join(" ");
  return parts
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const number = phone.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function buildCarWhatsAppUrl(
  car: { brand: string; model: string; year: number; whatsapp_text?: string },
  whatsappNumber: string
): string {
  const text =
    car.whatsapp_text ||
    `Hola! Me interesa el ${car.brand} ${car.model} ${car.year} que vi en su web. ¿Está disponible?`;
  return buildWhatsAppUrl(whatsappNumber, text);
}
