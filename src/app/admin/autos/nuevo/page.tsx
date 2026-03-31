import { CarForm } from "@/components/admin/CarForm";

export default function NuevoAutoPage() {
  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-3xl text-brand-dark uppercase mb-6">Publicar nuevo auto</h1>
      <CarForm />
    </div>
  );
}
