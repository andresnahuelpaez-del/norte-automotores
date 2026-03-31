import type { Metadata } from "next";
import { Barlow_Condensed, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { CustomCursor } from "@/components/ui/CustomCursor";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://norteautomotores.com.ar"),
  title: {
    default: "Norte Automotores | Venta de Autos Usados en La Rioja",
    template: "%s | Norte Automotores — La Rioja",
  },
  description:
    "Venta de autos usados seleccionados en excelente estado. Recibimos tu auto o moto. La Rioja, Argentina.",
  keywords: [
    "autos usados La Rioja",
    "autos usados La Rioja capital",
    "usados La Rioja",
    "autos La Rioja",
    "concesionaria La Rioja",
    "autos en venta La Rioja",
    "comprar auto La Rioja",
    "0km La Rioja",
    "autos 0km La Rioja",
    "motos La Rioja",
    "motos usadas La Rioja",
    "la rioja motos",
    "motos 0km La Rioja",
    "financiación autos La Rioja",
    "financiación propia La Rioja",
    "cuotas auto La Rioja",
    "Norte Automotores",
    "concesionaria automotores La Rioja",
    "autos baratos La Rioja",
    "venta autos La Rioja Argentina",
    "gestoría automotor La Rioja",
    "seguros autos La Rioja",
    "usados la rioja argentina",
    "okm la rioja",
  ],
  alternates: {
    canonical: "https://norteautomotores.com.ar",
  },
  openGraph: {
    siteName: "Norte Automotores",
    locale: "es_AR",
    type: "website",
    url: "https://norteautomotores.com.ar",
    title: "Norte Automotores | Venta de Autos Usados en La Rioja",
    description: "Venta de autos usados seleccionados en excelente estado. Recibimos tu auto o moto. La Rioja, Argentina.",
    images: [{ url: "/local.jpg", width: 1200, height: 630, alt: "Norte Automotores — La Rioja, Argentina" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Norte Automotores | Autos Usados en La Rioja",
    description: "Venta de autos usados seleccionados en excelente estado. Recibimos tu auto o moto. La Rioja, Argentina.",
    images: ["/local.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${barlow.variable} ${outfit.variable} antialiased`}>
        {/* Grain / noise overlay global */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[200]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "140px 140px",
            opacity: 0.032,
          }}
        />
        <CustomCursor />
        <Navbar />
        <main className="pt-[108px]">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
