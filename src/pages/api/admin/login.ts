export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const next = String(form.get('next') ?? '/admin');
  const safeNext = next.startsWith('/admin') ? next : '/admin';

  if (!email || !password) {
    return redirect('/admin/login?error=1');
  }

  const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect('/admin/login?error=1');
  }

  return redirect(safeNext);
};
