import type { SupabaseClient } from '@supabase/supabase-js';

export type CotizacionEstado = 'borrador' | 'enviado' | 'aprobado' | 'rechazado';

export const COTIZACION_ESTADO_LABEL: Record<CotizacionEstado, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

export interface CotizacionItem {
  descripcion: string;
  cantidad: number;
  tiempo_estimado: string;
  precio_unitario: number;
}

export interface Cotizacion {
  id: string;
  numero: string;
  fecha: string;

  cliente_nombre: string;
  cliente_cuit: string;
  cliente_direccion: string;
  cliente_localidad: string;
  cliente_telefono: string;
  cliente_email: string;

  items: CotizacionItem[];

  subtotal: number;
  descuento_pct: number;
  aplica_iva: boolean;
  iva_pct: number;
  total: number;

  validez_dias: number;
  plazo_entrega: string;
  forma_pago: string;
  comprobante: string;
  observaciones: string;

  entrega_nombre: string;
  entrega_documento: string;
  entrega_direccion: string;
  entrega_localidad: string;
  entrega_provincia: string;
  entrega_cp: string;
  entrega_telefono: string;

  estado: CotizacionEstado;

  created_at: string;
  updated_at: string;
}

export type CotizacionInput = Omit<Cotizacion, 'id' | 'created_at' | 'updated_at'>;

export function itemSubtotal(item: Pick<CotizacionItem, 'cantidad' | 'precio_unitario'>): number {
  const cantidad = Number.isFinite(item.cantidad) ? item.cantidad : 0;
  const precio = Number.isFinite(item.precio_unitario) ? item.precio_unitario : 0;
  return cantidad * precio;
}

export interface Totales {
  subtotal: number;
  descuentoMonto: number;
  baseImponible: number;
  ivaMonto: number;
  total: number;
}

export function calcularTotales(
  items: CotizacionItem[],
  descuentoPct: number,
  aplicaIva: boolean,
  ivaPct: number,
): Totales {
  const subtotal = items.reduce((acc, item) => acc + itemSubtotal(item), 0);
  const descuentoMonto = subtotal * (Math.max(0, descuentoPct) / 100);
  const baseImponible = Math.max(0, subtotal - descuentoMonto);
  const ivaMonto = aplicaIva ? baseImponible * (Math.max(0, ivaPct) / 100) : 0;
  const total = baseImponible + ivaMonto;
  return { subtotal, descuentoMonto, baseImponible, ivaMonto, total };
}

/** Reserva el próximo número correlativo (atómico vía secuencia de Postgres). */
export async function siguienteNumeroCotizacion(supabase: SupabaseClient): Promise<string> {
  const { data, error } = await supabase.rpc('siguiente_numero_cotizacion');
  if (error) throw error;
  return data as string;
}

export async function listCotizaciones(supabase: SupabaseClient): Promise<Cotizacion[]> {
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Cotizacion[]) ?? [];
}

export async function getCotizacion(supabase: SupabaseClient, id: string): Promise<Cotizacion | null> {
  const { data, error } = await supabase.from('cotizaciones').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Cotizacion | null;
}

export async function createCotizacion(
  supabase: SupabaseClient,
  id: string,
  input: CotizacionInput,
): Promise<void> {
  const { error } = await supabase.from('cotizaciones').insert({ id, ...input });
  if (error) throw error;
}

export async function updateCotizacion(
  supabase: SupabaseClient,
  id: string,
  input: CotizacionInput,
): Promise<void> {
  const { error } = await supabase.from('cotizaciones').update(input).eq('id', id);
  if (error) throw error;
}

export async function setCotizacionEstado(
  supabase: SupabaseClient,
  id: string,
  estado: CotizacionEstado,
): Promise<void> {
  const { error } = await supabase.from('cotizaciones').update({ estado }).eq('id', id);
  if (error) throw error;
}

/** Inserta si el id no existe todavía, o actualiza si ya fue guardado antes. */
export async function upsertCotizacion(
  supabase: SupabaseClient,
  id: string,
  input: CotizacionInput,
): Promise<void> {
  const { error } = await supabase.from('cotizaciones').upsert({ id, ...input });
  if (error) throw error;
}
