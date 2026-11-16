import type { SupabaseClient } from '@supabase/supabase-js';

export async function getMostrarCapital(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase
    .from('configuracion')
    .select('mostrar_capital')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data?.mostrar_capital ?? false;
}

export async function setMostrarCapital(supabase: SupabaseClient, value: boolean): Promise<void> {
  const { error } = await supabase
    .from('configuracion')
    .update({ mostrar_capital: value, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw error;
}
