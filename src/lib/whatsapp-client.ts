import type { Quote } from './quotes';

/**
 * Variante de `whatsappLink()` (ver `src/data/site.ts`) para mandarle un
 * mensaje al TELÉFONO DEL CLIENTE en vez del número del taller. Misma
 * lógica de construcción de URL (`wa.me/<digits>?text=<mensaje>`).
 */
export function clientWhatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function formatMonto(monto: number): string {
  return monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
}

function formatFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function buildQuoteMessage(
  quote: Pick<Quote, 'cliente_nombre' | 'descripcion' | 'monto' | 'fecha_entrega_propuesta'>,
  link: string,
): string {
  const parts = [
    `Hola ${quote.cliente_nombre}, te paso el presupuesto de Multi Mec:`,
    `*Trabajo:* ${quote.descripcion}`,
    `*Monto:* ${formatMonto(quote.monto)}`,
  ];

  if (quote.fecha_entrega_propuesta) {
    parts.push(`*Fecha estimada de entrega:* ${formatFecha(quote.fecha_entrega_propuesta)}`);
  }

  parts.push(`Podés verlo y confirmarlo acá: ${link}`);
  return parts.join('\n\n');
}
