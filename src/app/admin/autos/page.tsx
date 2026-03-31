import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { AdminCarActions } from "@/components/admin/AdminCarActions";
import type { Car } from "@/types";

export default async function AdminAutosPage() {
  let cars: Car[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("vehicle_type", "car")
      .order("created_at", { ascending: false });
    cars = (data as Car[]) || [];
  } catch {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-dark uppercase">Mis Autos</h1>
          <p className="text-brand-gray text-sm">{cars.length} autos en total</p>
        </div>
        <Link
          href="/admin/autos/nuevo"
          className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-5 py-2.5 rounded-none transition-colors text-sm"
        >
          + Nuevo auto
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-none p-12 text-center shadow-sm border border-gray-100">
          <p className="text-brand-gray mb-4">No hay autos cargados todavía.</p>
          <Link href="/admin/autos/nuevo" className="text-brand-red font-semibold hover:underline">
            Publicar el primer auto →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray-light border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-brand-dark">Auto</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-dark">Año</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-dark">Precio</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-dark">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-dark">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-none overflow-hidden bg-brand-gray-light shrink-0">
                          {car.images?.[0] ? (
                            <Image
                              src={car.images[0]}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-gray text-xs">N/A</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark">{car.brand} {car.model}</p>
                          {car.version && <p className="text-brand-gray text-xs">{car.version}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-dark">{car.year}</td>
                    <td className="px-4 py-3">
                      {car.show_price && car.price ? (
                        <span className="text-brand-red font-semibold">{formatPrice(car.price)}</span>
                      ) : (
                        <span className="text-brand-gray">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block text-xs font-bold uppercase px-2 py-0.5 rounded-full w-fit ${
                          car.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {car.is_active ? "Publicado" : "Oculto"}
                        </span>
                        {car.is_featured && (
                          <span className="inline-block text-xs font-bold uppercase px-2 py-0.5 rounded-full w-fit bg-yellow-100 text-yellow-700">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AdminCarActions car={car} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
