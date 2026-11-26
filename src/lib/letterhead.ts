/** Datos del membrete que va impreso en los PDF de presupuesto y remito. */
export const LETTERHEAD = {
  marca: 'MULTI-MEC',
  responsable: 'De Daniel Fausto Rossi',
  rubro: 'Tornería · Matricería · Rectificación en general',
  actividad: 'Fábrica de repuestos de maquinaria industrial y reparaciones',
  nota: 'Trabajamos sobre planos y/o muestras.',
  whatsapp: '11-6103-8152',
  direccion: 'Colectora Calchaqui 2626, Berazategui (CP 1884)',
} as const;

const SEQ_STORAGE_PREFIX = 'mm_doc_seq_';
const SEQ_PREFIX: Record<'presupuesto' | 'remito', string> = {
  presupuesto: 'P',
  remito: 'R',
};

function formatNumero(tipo: 'presupuesto' | 'remito', n: number): string {
  return `${SEQ_PREFIX[tipo]}-${String(n).padStart(6, '0')}`;
}

/** Siguiente número sugerido para el tipo de documento (correlativo guardado en este dispositivo). */
export function siguienteNumeroDocumento(tipo: 'presupuesto' | 'remito'): string {
  const key = `${SEQ_STORAGE_PREFIX}${tipo}`;
  const actual = Number(localStorage.getItem(key) ?? '0') || 0;
  return formatNumero(tipo, actual + 1);
}

/** Avanza el correlativo guardado para que la próxima sugerencia no se repita. */
export function registrarNumeroUsado(tipo: 'presupuesto' | 'remito'): void {
  const key = `${SEQ_STORAGE_PREFIX}${tipo}`;
  const actual = Number(localStorage.getItem(key) ?? '0') || 0;
  localStorage.setItem(key, String(actual + 1));
}
