import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogContent } from "./CatalogContent";

export const metadata: Metadata = {
  title: "Autos Usados y 0km en La Rioja | Catálogo Completo",
  description: "Catálogo completo de autos usados y 0km en La Rioja, Argentina. Filtrá por marca, modelo, año y precio. SUVs, sedanes, pickups y más con financiación disponible.",
  alternates: { canonical: "/catalogo" },
  keywords: [
    "autos usados La Rioja",
    "catálogo autos La Rioja",
    "comprar auto usado La Rioja",
    "autos en venta La Rioja",
    "SUV usada La Rioja",
    "pickup usada La Rioja",
    "sedan usado La Rioja",
    "0km La Rioja",
    "autos con financiación La Rioja",
    "usados La Rioja capital",
    "autos baratos La Rioja",
  ],
  openGraph: {
    title: "Catálogo de Autos Usados y 0km — Norte Automotores La Rioja",
    description: "Explorá nuestro stock de autos usados y 0km en La Rioja. Financiación propia disponible.",
    images: [{ url: "/local.jpg", width: 1200, height: 630, alt: "Catálogo de autos — Norte Automotores La Rioja" }],
  },
};

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-[#060E1C]">
      <div className="bg-[#060E1C] border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-extrabold text-4xl text-white uppercase">
            Catálogo de Autos
          </h1>
          <p className="text-white/50 mt-2">Encontrá el auto perfecto para vos</p>
        </div>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-white/40">Cargando...</div>}>
        <CatalogContent searchParams={params} />
      </Suspense>
    </div>
  );
}
