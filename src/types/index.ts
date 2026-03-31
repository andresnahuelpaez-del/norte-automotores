export interface Car {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  mileage?: number;
  color?: string;
  fuel_type?: string;
  transmission?: string;
  doors?: number;
  body_type?: string;
  condition: "used" | "new";
  price?: number;
  show_price: boolean;
  description?: string;
  features?: string[];
  images?: string[];
  video_url?: string;
  is_featured: boolean;
  is_active: boolean;
  financing_available: boolean;
  financing_details?: string;
  whatsapp_text?: string;
  views: number;
  vehicle_type: 'car' | 'moto';
  currency: 'USD' | 'ARS';
  engine_cc?: number;
}

export interface Inquiry {
  id: string;
  created_at: string;
  car_id?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  type: "whatsapp" | "form" | "call";
}

export interface SiteConfig {
  whatsapp_number: string;
  show_prices_globally: string;
  show_financing_globally: string;
  hero_title: string;
  hero_subtitle: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  financing_coef_12?: string;
  financing_coef_24?: string;
  financing_coef_36?: string;
  financing_coef_48?: string;
  financing_coef_60?: string;
  financing_anticipo_min?: string;
  financing_anticipo_max?: string;
  financing_cuota_slider_max?: string;
}
