export const BRANDS = [
  "Alfa Romeo", "Audi", "BAIC", "Bajaj", "Beta", "BMW", "BMW Motorrad",
  "BYD", "Chery", "Chevrolet", "Citroën", "Dodge", "Ducati",
  "Fiat", "Ford", "Gilera", "GWM / Haval", "Harley-Davidson",
  "Honda", "Hyundai", "Jeep", "Kawasaki", "Kia", "KTM",
  "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG",
  "Mitsubishi", "Motomel", "Nissan", "Peugeot", "RAM",
  "Renault", "Royal Enfield", "Subaru", "Suzuki", "Toyota",
  "Triumph", "Volkswagen", "Volvo", "Yamaha", "Zanella", "Otra",
];

export const BODY_TYPES = [
  { value: "suv", label: "SUV" },
  { value: "sedan", label: "Sedán" },
  { value: "hatchback", label: "Hatchback" },
  { value: "pickup", label: "Pickup / Camioneta" },
  { value: "coupe", label: "Coupé" },
  { value: "convertible", label: "Descapotable" },
  { value: "minivan", label: "Minivan / Monovolumen" },
  { value: "van", label: "Van / Furgón" },
  { value: "rural", label: "Rural / Familiar" },
  { value: "camion", label: "Camión / Utilitario" },
  { value: "otro", label: "Otro" },
];

export const FUEL_TYPES = [
  { value: "nafta", label: "Nafta" },
  { value: "diesel", label: "Diesel" },
  { value: "gnc", label: "Nafta + GNC" },
  { value: "electrico", label: "Eléctrico" },
  { value: "hibrido", label: "Híbrido" },
  { value: "hibrido_enchufable", label: "Híbrido enchufable" },
];

export const TRANSMISSIONS = [
  { value: "manual", label: "Manual" },
  { value: "automatico", label: "Automático" },
  { value: "cvt", label: "CVT" },
  { value: "dct", label: "Doble embrague (DCT)" },
];

export const CONDITIONS = [
  { value: "used", label: "Usado" },
  { value: "new", label: "0km" },
];

export const DEFAULT_WHATSAPP = "3804796317";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://norteautomotores.com.ar";
