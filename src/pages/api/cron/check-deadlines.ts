export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServiceClient } from '../../../lib/supabase/server';
import { getTrabajosUrgentes, buildResumenDiario, sendPushToAll } from '../../../lib/push';

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createSupabaseServiceClient();

  const [urgentes, { data: subscriptions, error: subsError }] = await Promise.all([
    getTrabajosUrgentes(supabase),
    supabase.from('push_subscriptions').select('id, endpoint, p256dh, auth'),
  ]);

  if (subsError) {
    return new Response(JSON.stringify({ error: subsError.message }), { status: 500 });
  }

  const resumen = buildResumenDiario(urgentes);
  if (!resumen || !subscriptions || subscriptions.length === 0) {
    return new Response(JSON.stringify({ enviados: 0, motivo: !resumen ? 'sin urgentes' : 'sin suscripciones' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const resultado = await sendPushToAll(supabase, subscriptions, resumen);
  return new Response(JSON.stringify(resultado), { status: 200, headers: { 'content-type': 'application/json' } });
};
