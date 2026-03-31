import { CarForm } from "@/components/admin/CarForm";

export default function NuevoAutoPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark uppercase mb-5">Publicar nuevo auto</h1>
      <CarForm />
    </div>
  );
}
