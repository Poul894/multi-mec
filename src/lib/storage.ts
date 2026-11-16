import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'multimec-fotos';

export function fotoPath(prefix: 'trabajos' | 'presupuestos', id: string, file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${prefix}/${id}/${Date.now()}-${safeName}`;
}

/** Sube una foto directo al Storage de Supabase desde el browser y devuelve su URL pública. */
export async function uploadFoto(supabase: SupabaseClient, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
