import type { SupabaseClient } from '@supabase/supabase-js';

export type QuoteStatus = 'borrador' | 'enviado' | 'aceptado' | 'rechazado';

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
};

export interface Quote {
  id: string;
  cliente_nombre: string;
  cliente_telefono: string;
  descripcion: string;
  foto_url: string | null;
  monto: number;
  fecha_entrega_propuesta: string | null;
  estado: QuoteStatus;
  decidido_at: string | null;
  created_at: string;
}

/** Proyección pública (vista `presupuestos_publicos`, sin teléfono del cliente). */
export interface PublicQuote {
  id: string;
  cliente_nombre: string;
  descripcion: string;
  foto_url: string | null;
  monto: number;
  fecha_entrega_propuesta: string | null;
  estado: QuoteStatus;
  created_at: string;
}

export interface QuoteInput {
  cliente_nombre: string;
  cliente_telefono: string;
  descripcion: string;
  foto_url: string | null;
  monto: number;
  fecha_entrega_propuesta: string | null;
}

export async function listQuotes(
  supabase: SupabaseClient,
  options: { estado?: QuoteStatus } = {},
): Promise<Quote[]> {
  let query = supabase.from('presupuestos').select('*').order('created_at', { ascending: false });
  if (options.estado) query = query.eq('estado', options.estado);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Quote[]) ?? [];
}

export async function getQuote(supabase: SupabaseClient, id: string): Promise<Quote | null> {
  const { data, error } = await supabase.from('presupuestos').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Quote | null;
}

export async function getPublicQuote(supabase: SupabaseClient, id: string): Promise<PublicQuote | null> {
  const { data, error } = await supabase.from('presupuestos_publicos').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as PublicQuote | null;
}

export async function createQuote(supabase: SupabaseClient, id: string, input: QuoteInput): Promise<void> {
  const { error } = await supabase.from('presupuestos').insert({ id, ...input, estado: 'enviado' });
  if (error) throw error;
}

/** Trabajo creado a partir de un presupuesto aceptado (si existe). */
export async function getJobByQuoteId(supabase: SupabaseClient, quoteId: string) {
  const { data, error } = await supabase.from('trabajos').select('id').eq('presupuesto_id', quoteId).maybeSingle();
  if (error) throw error;
  return data as { id: string } | null;
}

/**
 * Único punto de escritura pública: llama a la función `decidir_presupuesto`
 * (security definer) en vez de actualizar la tabla directamente, así nunca
 * hace falta abrir RLS de escritura a `anon`.
 */
export async function decidirPresupuesto(
  supabase: SupabaseClient,
  id: string,
  aceptar: boolean,
): Promise<QuoteStatus> {
  const { data, error } = await supabase.rpc('decidir_presupuesto', { p_id: id, p_aceptar: aceptar });
  if (error) throw error;
  const estado = Array.isArray(data) ? data[0]?.estado : undefined;
  return (estado ?? (aceptar ? 'aceptado' : 'rechazado')) as QuoteStatus;
}
