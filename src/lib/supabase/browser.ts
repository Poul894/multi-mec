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
