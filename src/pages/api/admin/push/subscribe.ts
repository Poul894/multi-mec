export const prerender = false;

import type { APIRoute } from 'astro';
import { saveSubscription } from '../../../../lib/push';

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json();

  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    return new Response(JSON.stringify({ error: 'Suscripción inválida' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    await saveSubscription(locals.supabase, body);
    return new Response(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar la suscripción';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
