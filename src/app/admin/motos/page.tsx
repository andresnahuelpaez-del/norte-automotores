import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { AdminCarActions } from "@/components/admin/AdminCarActions";
import type { Car } from "@/types";

export default async function AdminMotosPage() {
  let motos: Car[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("vehicle_type", "moto")
      .order("created_at", { ascending: false });
    motos = (data as Car[]) || [];
  } catch {}

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark uppercase">Motos</h1>
          <p className="text-brand-gray text-sm">{motos.length} motos en total</p>
        </div>
        <Link
          href="/admin/motos/nuevo"
          className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-4 py-2 rounded-none transition-colors text-sm"
        >
          + Nueva
        </Link>
      </div>

      {motos.length === 0 ? (
        <div className="bg-white rounded-none p-12 text-center shadow-sm border border-gray-100">
          <p className="text-brand-gray mb-4">No hay motos cargadas todavía.</p>
          <Link href="/admin/motos/nuevo" className="text-brand-red font-semibold hover:underline">
            Publicar la primera moto →
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {motos.map((moto) => (
              <div key={moto.id} className="bg-white border border-gray-100 shadow-sm p-3 flex gap-3">
                <div className="relative w-20 h-14 rounded-none overflow-hidden bg-brand-gray-light shrink-0">
                  {moto.images?.[0] ? (
                    <Image src={moto.images[0]} alt={`${moto.brand} ${moto.model}`} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-gray text-xs">N/A</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-dark text-sm truncate">{moto.brand} {moto.model} <span className="text-brand-gray font-normal">{moto.year}</span></p>
                  {moto.version && <p className="text-brand-gray text-xs truncate">{moto.version}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${moto.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {moto.is_active ? "Publicado" : "Oculto"}
                    </span>
                    {moto.is_featured && <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Destacado</span>}
                    {moto.show_price && moto.price ? (
                      <span className="text-brand-red font-semibold text-xs">{formatPrice(moto.price)}</span>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <AdminCarActions car={moto} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray-light border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Moto</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Año</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Precio</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Estado</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {motos.map((moto) => (
                    <tr key={moto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-none overflow-hidden bg-brand-gray-light shrink-0">
                            {moto.images?.[0] ? (
                              <Image src={moto.images[0]} alt={`${moto.brand} ${moto.model}`} fill className="object-cover" sizes="56px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-gray text-xs">N/A</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-brand-dark">{moto.brand} {moto.model}</p>
                            {moto.version && <p className="text-brand-gray text-xs">{moto.version}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brand-dark">{moto.year}</td>
                      <td className="px-4 py-3">
                        {moto.show_price && moto.price ? (
                          <span className="text-brand-red font-semibold">{formatPrice(moto.price)}</span>
                        ) : (
                          <span className="text-brand-gray">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block text-xs font-bold uppercase px-2 py-0.5 rounded-full w-fit ${
                            moto.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {moto.is_active ? "Publicado" : "Oculto"}
                          </span>
                          {moto.is_featured && (
                            <span className="inline-block text-xs font-bold uppercase px-2 py-0.5 rounded-full w-fit bg-yellow-100 text-yellow-700">
                              Destacado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AdminCarActions car={moto} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
