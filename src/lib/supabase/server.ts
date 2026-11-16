import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

function parseCookieHeader(header: string | null): { name: string; value: string }[] {
  if (!header) return [];
  return header
    .split(';')
    .map((pair) => {
      const index = pair.indexOf('=');
      const name = (index > -1 ? pair.slice(0, index) : pair).trim();
      const value = index > -1 ? pair.slice(index + 1).trim() : '';
      return { name, value: decodeURIComponent(value) };
    })
    .filter((cookie) => cookie.name.length > 0);
}

/**
 * Cliente anónimo simple, sin manejo de cookies/sesión, para rutas públicas
 * (p.ej. `/presupuesto/[id]`) que solo leen la vista `presupuestos_publicos`
 * o llaman a la función RPC `decidir_presupuesto` — ambas ya están
 * permitidas a `anon` en la base, no requieren login.
 */
export function createSupabaseAnonClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Cliente con la `service_role` key: bypassa RLS por completo. Usar SOLO en
 * rutas que no tienen sesión de usuario (el cron de notificaciones, que lo
 * dispara Vercel, no un login) y que ya están protegidas por su cuenta
 * (p.ej. verificando `CRON_SECRET`). Nunca exponer esta key al navegador.
 */
export function createSupabaseServiceClient() {
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(SUPABASE_URL, serviceKey);
}

/**
 * Cliente de Supabase para usar en páginas/endpoints server-side (Astro.locals,
 * middleware, API routes). Lee las cookies de la request y, si Supabase
 * necesita refrescar la sesión, las vuelve a escribir vía `Astro.cookies`.
 *
 * Importante: estas cookies NO pueden ser httpOnly. El panel hace las
 * escrituras (crear/editar trabajos, presupuestos, subir fotos) directo
 * desde el navegador con `createSupabaseBrowserClient()`, que necesita leer
 * la sesión desde `document.cookie` para mandar el token en cada request —
 * si la cookie fuera httpOnly, el browser client nunca vería la sesión y
 * todas esas escrituras se harían como `anon`, violando las políticas RLS
 * (exactamente el error "new row violates row-level security policy").
 */
export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie'));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, {
            ...options,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            path: '/',
          });
        }
      },
    },
  });
}
