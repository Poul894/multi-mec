import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase/server';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/api/admin/login']);

function isAdminArea(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, locals, url, redirect } = context;

  // El resto del sitio es estático y no necesita Supabase: evitamos crear el
  // cliente (y depender de las env vars) fuera de /admin y /api/admin, tanto
  // en runtime como durante el prerender de las páginas públicas en el build.
  if (!isAdminArea(url.pathname)) {
    return next();
  }

  const supabase = createSupabaseServerClient(request, cookies);
  const { data } = await supabase.auth.getUser();

  locals.supabase = supabase;
  locals.user = data.user ?? null;

  if (!PUBLIC_ADMIN_PATHS.has(url.pathname) && !locals.user) {
    if (url.pathname.startsWith('/api/admin')) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
    return redirect(`/admin/login?next=${encodeURIComponent(url.pathname)}`);
  }

  return next();
});
