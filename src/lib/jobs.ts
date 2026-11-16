import type { SupabaseClient } from '@supabase/supabase-js';

export type JobStatus = 'pendiente' | 'en_curso' | 'terminado' | 'entregado';

export interface Job {
  id: string;
  titulo: string;
  descripcion: string | null;
  observaciones: string | null;
  fotos: string[];
  estado: JobStatus;
  fecha_ingreso: string;
  fecha_entrega: string;
  fecha_entregado: string | null;
  monto: number | null;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  presupuesto_id: string | null;
  created_at: string;
  updated_at: string;
}

export type Urgencia = 'entregado' | 'urgente' | 'en-plazo';

const ESTADO_ORDEN: JobStatus[] = ['pendiente', 'en_curso', 'terminado', 'entregado'];

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  pendiente: 'Pendiente',
  en_curso: 'En proceso',
  terminado: 'Terminado',
  entregado: 'Entregado',
};

/** Color de estado (fijo, reservado) — única fuente de verdad para tags y calendario. */
export const JOB_STATUS_VARIANT: Record<JobStatus, 'orange' | 'blue' | 'amber' | 'green'> = {
  pendiente: 'orange',
  en_curso: 'blue',
  terminado: 'amber',
  entregado: 'green',
};

/** Siguiente estado en la cadena pendiente → en proceso → terminado → entregado (null si ya está entregado). */
export function nextEstado(actual: JobStatus): JobStatus | null {
  const index = ESTADO_ORDEN.indexOf(actual);
  return index === -1 || index === ESTADO_ORDEN.length - 1 ? null : ESTADO_ORDEN[index + 1];
}

/** Días que faltan hasta `fechaEntrega` (negativo si ya venció). */
export function diasRestantes(fechaEntrega: string, hoy: Date = new Date()): number {
  const entrega = new Date(`${fechaEntrega}T00:00:00`);
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round((entrega.getTime() - base.getTime()) / 86_400_000);
}

/** Verde si falta más de 2 días, rojo si faltan 2 días o menos, aparte si ya se entregó. */
export function urgenciaDe(job: Pick<Job, 'estado' | 'fecha_entrega'>, hoy: Date = new Date()): Urgencia {
  if (job.estado === 'entregado') return 'entregado';
  return diasRestantes(job.fecha_entrega, hoy) <= 2 ? 'urgente' : 'en-plazo';
}

export async function listJobs(
  supabase: SupabaseClient,
  options: { estado?: JobStatus; orderBy?: 'fecha_entrega' | 'updated_at' } = {},
): Promise<Job[]> {
  const orderBy = options.orderBy ?? 'fecha_entrega';
  let query = supabase.from('trabajos').select('*').order(orderBy, { ascending: orderBy === 'fecha_entrega' });
  if (options.estado) query = query.eq('estado', options.estado);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Job[]) ?? [];
}

export async function getJob(supabase: SupabaseClient, id: string): Promise<Job | null> {
  const { data, error } = await supabase.from('trabajos').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Job | null;
}

export interface JobInput {
  titulo: string;
  descripcion: string;
  observaciones: string;
  fotos: string[];
  estado: JobStatus;
  fecha_ingreso: string;
  fecha_entrega: string;
  monto: number | null;
  cliente_nombre: string;
  cliente_telefono: string;
}

/**
 * `fecha_entregado` solo se estampa en la TRANSICIÓN hacia 'entregado' (no
 * en cada guardado posterior, para no corromper los gráficos de
 * "entregados por período"); si el estado deja de ser 'entregado' se limpia.
 */
function entregaPatch(estado: JobStatus, previousEstado: JobStatus | null): Record<string, unknown> {
  if (estado === 'entregado' && previousEstado !== 'entregado') {
    return { fecha_entregado: new Date().toISOString() };
  }
  if (estado !== 'entregado' && previousEstado === 'entregado') {
    return { fecha_entregado: null };
  }
  return {};
}

export async function createJob(supabase: SupabaseClient, id: string, input: JobInput): Promise<void> {
  const { error } = await supabase
    .from('trabajos')
    .insert({ id, ...input, ...entregaPatch(input.estado, null) });
  if (error) throw error;
}

export async function updateJob(
  supabase: SupabaseClient,
  id: string,
  input: JobInput,
  previousEstado: JobStatus | null = null,
): Promise<void> {
  const { error } = await supabase
    .from('trabajos')
    .update({ ...input, ...entregaPatch(input.estado, previousEstado) })
    .eq('id', id);
  if (error) throw error;
}

export async function setJobEstado(supabase: SupabaseClient, id: string, estado: JobStatus): Promise<void> {
  const patch: Record<string, unknown> = { estado };
  if (estado === 'entregado') patch.fecha_entregado = new Date().toISOString();
  const { error } = await supabase.from('trabajos').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteJob(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('trabajos').delete().eq('id', id);
  if (error) throw error;
}
