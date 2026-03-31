import { CarForm } from "@/components/admin/CarForm";

export default function NuevaMotoPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark uppercase mb-5">Publicar nueva moto</h1>
      <CarForm defaultVehicleType="moto" />
    </div>
  );
}
