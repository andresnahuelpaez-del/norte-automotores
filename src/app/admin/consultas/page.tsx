import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/types";

type InquiryWithCar = Inquiry & { cars: { brand: string; model: string; year: number } | null };

export default async function ConsultasPage() {
  let inquiries: InquiryWithCar[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("inquiries")
      .select("*, cars(brand, model, year)")
      .order("created_at", { ascending: false });
    inquiries = data || [];
  } catch {}

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark uppercase">Consultas</h1>
          <p className="text-brand-gray text-sm">{inquiries.length} recibidas</p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-none p-10 text-center shadow-sm border border-gray-100">
          <p className="text-brand-gray">No hay consultas todavía.</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-brand-dark text-sm">{inq.name}</p>
                    <p className="text-brand-gray text-xs">{new Date(inq.created_at).toLocaleDateString("es-AR")}</p>
                  </div>
                  <a
                    href={`https://wa.me/${inq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${inq.name}! Recibimos tu consulta.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white bg-[#25D366] px-3 py-1.5 shrink-0"
                  >
                    Responder
                  </a>
                </div>
                <p className="text-sm text-brand-dark font-mono">{inq.phone}</p>
                {inq.cars && <p className="text-xs text-brand-red font-medium">{inq.cars.brand} {inq.cars.model} {inq.cars.year}</p>}
                {inq.message && <p className="text-xs text-brand-gray line-clamp-2">{inq.message}</p>}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray-light border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Fecha</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Nombre</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Teléfono</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Auto</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Mensaje</th>
                    <th className="text-left px-4 py-3 font-semibold text-brand-dark">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-brand-gray whitespace-nowrap">{new Date(inq.created_at).toLocaleDateString("es-AR")}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark">{inq.name}</td>
                      <td className="px-4 py-3 text-brand-dark">{inq.phone}</td>
                      <td className="px-4 py-3 text-brand-gray">{inq.cars ? `${inq.cars.brand} ${inq.cars.model} ${inq.cars.year}` : "—"}</td>
                      <td className="px-4 py-3 text-brand-gray max-w-xs truncate">{inq.message || "—"}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${inq.name}! Recibimos tu consulta.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-green-600 hover:underline whitespace-nowrap"
                        >
                          Responder WA
                        </a>
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
