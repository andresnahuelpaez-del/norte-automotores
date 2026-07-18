// Fórmula oficial de financiación de la concesionaria:
// interés simple, 5% mensual flat sobre el saldo. Entrega mínima 30%.
export const TASA_MENSUAL = 0.05;      // 5% mensual flat
export const ENTREGA_MINIMA = 0.30;    // 30%
export const PLANES = [6, 12, 18, 24] as const;

export function calcularCuota(precio: number, meses: number, entrega?: number) {
  const entregaMin = precio * ENTREGA_MINIMA;
  const entregaReal = Math.max(entrega ?? entregaMin, entregaMin);
  const saldo = precio - entregaReal;
  const cuota = saldo / meses + TASA_MENSUAL * saldo;
  const total = entregaReal + cuota * meses;
  return { entregaReal, saldo, cuota, total };
}

export const fmtARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

// Inversa: dado lo que el cliente puede pagar por mes y su entrega,
// cuánto es el precio máximo de vehículo al que llega.
// cuota = saldo/meses + 0.05*saldo  =>  saldo = cuota / (1/meses + 0.05)
// La entrega además debe cubrir el 30% del precio.
export function precioMaximo(cuotaMensual: number, meses: number, entrega: number) {
  const saldoMax = cuotaMensual / (1 / meses + TASA_MENSUAL);
  const porSaldo = saldoMax + entrega;
  const porEntrega = entrega / ENTREGA_MINIMA;
  return Math.min(porSaldo, porEntrega);
}
