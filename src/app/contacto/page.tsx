import type { Metadata } from "next";
import { ContactoContent } from "./ContactoContent";

export const metadata: Metadata = {
  title: "Contacto — Norte Automotores La Rioja",
  description: "Contactá a Norte Automotores en La Rioja. Envianos tu consulta, llamanos o escribinos por WhatsApp. Av. Coronel Felipe Varela 1776, La Rioja.",
  alternates: { canonical: "/contacto" },
  keywords: [
    "contacto Norte Automotores",
    "concesionaria La Rioja contacto",
    "autos La Rioja WhatsApp",
    "comprar auto La Rioja contacto",
    "dirección concesionaria La Rioja",
  ],
  openGraph: {
    title: "Contacto — Norte Automotores La Rioja",
    description: "Estamos en La Rioja capital. Escribinos o llamanos. Respondemos al instante.",
    images: [{ url: "/local.jpg", width: 1200, height: 630, alt: "Norte Automotores — La Rioja" }],
  },
};

export default function ContactoPage() {
  return <ContactoContent />;
}
