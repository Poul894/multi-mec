import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de Supabase para el navegador. Comparte sesión con el server
 * (mismas cookies), así que las subidas a Storage desde el panel quedan
 * autenticadas sin pasar el archivo por una función serverless.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Crea el cliente y espera a que termine de leer la sesión guardada en las
 * cookies antes de devolverlo. Sin este `await` previo, un insert/upload
 * disparado justo después de `createSupabaseBrowserClient()` puede salir
 * sin el token todavía cargado — el request se manda como anónimo y
 * Supabase lo rechaza con "new row violates row-level security policy",
 * aunque el usuario esté bien logueado.
 */
export async function requireBrowserSession() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error('Tu sesión expiró. Cerrá sesión y volvé a entrar.');
  }
  return supabase;
}
