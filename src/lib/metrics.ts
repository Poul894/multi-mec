import type { SupabaseClient } from '@supabase/supabase-js';

export type Granularidad = 'dia' | 'semana' | 'quincena' | 'mes';

export interface PuntoMetrica {
  key: string;
  label: string;
  cantidad: number;
  monto: number;
}

export const GRANULARIDAD_LABEL: Record<Granularidad, string> = {
  dia: 'Día',
  semana: 'Semana',
  quincena: 'Quincena',
  mes: 'Mes',
};

const PERIODOS_POR_DEFECTO: Record<Granularidad, number> = {
  dia: 14,
  semana: 8,
  quincena: 6,
  mes: 6,
};

function startOfWeek(fecha: Date): Date {
  const date = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const offset = (date.getDay() + 6) % 7; // semana arranca lunes
  date.setDate(date.getDate() - offset);
  return date;
}

function bucketStart(fecha: Date, granularidad: Granularidad): Date {
  const y = fecha.getFullYear();
  const m = fecha.getMonth();
  const d = fecha.getDate();
  if (granularidad === 'dia') return new Date(y, m, d);
  if (granularidad === 'semana') return startOfWeek(fecha);
  if (granularidad === 'quincena') return d <= 15 ? new Date(y, m, 1) : new Date(y, m, 16);
  return new Date(y, m, 1);
}

function previousBucketStart(start: Date, granularidad: Granularidad): Date {
  if (granularidad === 'dia') return new Date(start.getFullYear(), start.getMonth(), start.getDate() - 1);
  if (granularidad === 'semana') return new Date(start.getFullYear(), start.getMonth(), start.getDate() - 7);
  if (granularidad === 'quincena') {
    return start.getDate() === 1
      ? new Date(start.getFullYear(), start.getMonth() - 1, 16)
      : new Date(start.getFullYear(), start.getMonth(), 1);
  }
  return new Date(start.getFullYear(), start.getMonth() - 1, 1);
}

function bucketEnd(start: Date, granularidad: Granularidad): Date {
  if (granularidad === 'dia') return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  if (granularidad === 'semana') return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
  if (granularidad === 'quincena') {
    return start.getDate() === 1
      ? new Date(start.getFullYear(), start.getMonth(), 16)
      : new Date(start.getFullYear(), start.getMonth() + 1, 1);
  }
  return new Date(start.getFullYear(), start.getMonth() + 1, 1);
}

function bucketKey(start: Date, granularidad: Granularidad): string {
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  if (granularidad === 'mes') return `${y}-${m}`;
  if (granularidad === 'quincena') return `${y}-${m}-${start.getDate() === 1 ? 'Q1' : 'Q2'}`;
  return `${y}-${m}-${d}`;
}

function bucketLabel(start: Date, granularidad: Granularidad): string {
  if (granularidad === 'mes') return start.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
  if (granularidad === 'quincena') {
    const mes = start.toLocaleDateString('es-AR', { month: 'short' });
    return `${start.getDate() === 1 ? '1ª' : '2ª'} Q ${mes}`;
  }
  return start.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

/**
 * Trabajos entregados agrupados por período, con buckets vacíos rellenados
 * en cero (para que el gráfico de barras sea continuo, no solo los
 * períodos con actividad). La agregación se hace en JS sobre las filas
 * `entregado` del rango: para el volumen de un taller chico no justifica
 * una vista materializada en Postgres.
 */
export async function getEntregasPorPeriodo(
  supabase: SupabaseClient,
  granularidad: Granularidad,
  periodos: number = PERIODOS_POR_DEFECTO[granularidad],
): Promise<PuntoMetrica[]> {
  const hoy = new Date();
  let start = bucketStart(hoy, granularidad);
  const starts: Date[] = [start];
  for (let i = 1; i < periodos; i += 1) {
    start = previousBucketStart(start, granularidad);
    starts.push(start);
  }
  starts.reverse();

  const desde = starts[0];
  const hasta = bucketEnd(starts[starts.length - 1], granularidad);

  const { data, error } = await supabase
    .from('trabajos')
    .select('fecha_entregado, monto')
    .eq('estado', 'entregado')
    .gte('fecha_entregado', desde.toISOString())
    .lt('fecha_entregado', hasta.toISOString());
  if (error) throw error;

  const puntos: PuntoMetrica[] = starts.map((s) => ({
    key: bucketKey(s, granularidad),
    label: bucketLabel(s, granularidad),
    cantidad: 0,
    monto: 0,
  }));
  const puntoPorClave = new Map(puntos.map((p) => [p.key, p]));

  for (const row of data ?? []) {
    if (!row.fecha_entregado) continue;
    const key = bucketKey(bucketStart(new Date(row.fecha_entregado), granularidad), granularidad);
    const punto = puntoPorClave.get(key);
    if (punto) {
      punto.cantidad += 1;
      punto.monto += Number(row.monto ?? 0);
    }
  }

  return puntos;
}
