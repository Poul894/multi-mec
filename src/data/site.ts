/**
 * DATOS EDITABLES DEL SITIO
 * ------------------------------------------------------------------
 * Todo lo que está marcado como PROVISIONAL debe reemplazarse con la
 * información real de Multi Mec antes de publicar el sitio.
 */

export const site = {
  name: 'Multi Mec',
  legalName: 'Multi Mec',
  tagline: 'Tornería y mecanizado de precisión',
  description:
    'Tornería y mecanizado de precisión en Argentina. Fabricación de piezas a medida, repuestos industriales y componentes para equipamiento fitness. Consultá por tu proyecto.',
  url: 'https://www.multimec.com.ar', // PROVISIONAL
  locale: 'es_AR',
  country: 'Argentina',
  contact: {
    // PROVISIONAL: reemplazar por el número real (formato internacional, sin + ni espacios).
    whatsapp: '5490000000000',
    whatsappDisplay: '+54 9 000 000-0000',
    phoneDisplay: '+54 9 000 000-0000',
    email: 'contacto@multimec.com.ar', // PROVISIONAL
    // PROVISIONAL: completar si se desea mostrar la dirección del taller.
    address: '',
    city: '',
    province: '',
    hours: 'Lunes a viernes · 8 a 17 h', // PROVISIONAL
    hoursNote: 'Consultas por WhatsApp dentro y fuera de ese horario.',
  },
  social: {
    instagram: '', // PROVISIONAL: URL completa
    facebook: '',
    linkedin: '',
  },
  shipping: {
    title: 'Envíos a todo el país',
    short: 'Despachamos a todo el territorio argentino. Coordinamos embalaje y logística según destino, volumen y urgencia.',
  },
  seo: {
    defaultTitle: 'Multi Mec · Tornería y mecanizado de precisión',
    titleTemplate: '%s · Multi Mec',
    ogImage: '/og-multimec.png',
  },
} as const;

export const navigation = [
  { label: 'Inicio', href: '/' },
  { label: 'Industrial', href: '/industrial' },
  { label: 'Fitness', href: '/fitness' },
  { label: 'Productos', href: '/productos' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Envíos', href: '/envios' },
] as const;

export const whatsappMessage =
  'Hola Multi Mec, quisiera consultar por la fabricación de una pieza.';

/** Construye un enlace de WhatsApp con mensaje precargado. */
export function whatsappLink(message = whatsappMessage): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject = 'Consulta desde el sitio web', body = ''): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  return `mailto:${site.contact.email}?${params.toString()}`;
}

export const contactDetails = [
  {
    label: 'WhatsApp',
    value: site.contact.whatsappDisplay,
    href: whatsappLink(),
    note: 'Respuesta directa del taller',
    external: true,
  },
  {
    label: 'Email',
    value: site.contact.email,
    href: mailtoLink(),
    note: 'Planos, especificaciones y consultas',
    external: false,
  },
  {
    label: 'Horario',
    value: site.contact.hours,
    href: '',
    note: site.contact.hoursNote,
    external: false,
  },
  {
    label: 'Ubicación',
    value: 'Argentina',
    href: '',
    note: 'Envíos y coordinación a todo el país',
    external: false,
  },
] as const;
