import { setVapidDetails, sendNotification } from 'web-push';
import type { SupabaseClient } from '@supabase/supabase-js';
import { diasRestantes, urgenciaDe, listJobs } from './jobs';

export interface PushSubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

function configureWebPush(): void {
  setVapidDetails(
    'mailto:multimec31@gmail.com',
    import.meta.env.PUBLIC_VAPID_KEY,
    import.meta.env.VAPID_PRIVATE_KEY,
  );
}

export async function saveSubscription(
  supabase: SupabaseClient,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
): Promise<void> {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
      { onConflict: 'endpoint' },
    );
  if (error) throw error;
}

/** Trabajos a 2 días o menos de la entrega (o ya vencidos) y no entregados. */
export async function getTrabajosUrgentes(supabase: SupabaseClient) {
  const jobs = await listJobs(supabase);
  return jobs
    .filter((job) => urgenciaDe(job) === 'urgente')
    .sort((a, b) => diasRestantes(a.fecha_entrega) - diasRestantes(b.fecha_entrega));
}

export function buildResumenDiario(urgentes: Awaited<ReturnType<typeof getTrabajosUrgentes>>) {
  if (urgentes.length === 0) return null;

  const title = `Multi Mec · ${urgentes.length} ${urgentes.length === 1 ? 'entrega' : 'entregas'} por preparar`;
  const body = urgentes
    .slice(0, 3)
    .map((job) => {
      const dias = diasRestantes(job.fecha_entrega);
      const cuando = dias >= 0 ? `en ${dias} día${dias === 1 ? '' : 's'}` : `vencido hace ${Math.abs(dias)} día${Math.abs(dias) === 1 ? '' : 's'}`;
      return `${job.titulo} (${cuando})`;
    })
    .join(' · ');

  return { title, body, url: '/admin/calendario' };
}

/**
 * Manda el push a cada suscripción guardada. Si una suscripción ya no es
 * válida (410/404 — el usuario desinstaló, borró datos, etc.), se borra de
 * la tabla para no seguir intentando contra un endpoint muerto.
 */
export async function sendPushToAll(
  supabase: SupabaseClient,
  subscriptions: PushSubscriptionRow[],
  payload: { title: string; body: string; url?: string },
): Promise<{ enviados: number; eliminados: number }> {
  configureWebPush();

  let enviados = 0;
  let eliminados = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        enviados += 1;
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          eliminados += 1;
        }
      }
    }),
  );

  return { enviados, eliminados };
}
