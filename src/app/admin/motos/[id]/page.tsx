import { createClient } from "@/lib/supabase/server";
import { CarForm } from "@/components/admin/CarForm";
import { notFound } from "next/navigation";
import type { Car } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarMotoPage({ params }: Props) {
  const { id } = await params;
  let moto: Car | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("cars").select("*").eq("id", id).single();
    moto = data as Car;
  } catch {
    notFound();
  }

  if (!moto) notFound();

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-3xl text-brand-dark uppercase mb-6">
        Editar: {moto.brand} {moto.model} {moto.year}
      </h1>
      <CarForm car={moto} defaultVehicleType="moto" />
    </div>
  );
}
