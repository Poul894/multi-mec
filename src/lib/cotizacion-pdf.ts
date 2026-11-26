import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calcularTotales, itemSubtotal, type CotizacionItem } from './cotizaciones';
import { LETTERHEAD } from './letterhead';

export interface CotizacionPdfCliente {
  nombre: string;
  cuit: string;
  direccion: string;
  localidad: string;
  telefono: string;
  email: string;
}

export interface CotizacionPdfEntrega {
  nombre: string;
  documento: string;
  direccion: string;
  localidad: string;
  provincia: string;
  cp: string;
  telefono: string;
}

export interface CotizacionPdfCondiciones {
  validezDias: number;
  plazoEntrega: string;
  formaPago: string;
  comprobante: string;
  observaciones: string;
}

export interface CotizacionPdfData {
  numero: string;
  /** Fecha en formato ISO yyyy-mm-dd. */
  fecha: string;
  tagline: string;
  cliente: CotizacionPdfCliente;
  items: CotizacionItem[];
  descuentoPct: number;
  aplicaIva: boolean;
  ivaPct: number;
  condiciones: CotizacionPdfCondiciones;
  entrega?: CotizacionPdfEntrega | null;
  logoDataUrl?: string | null;
}

type RGB = [number, number, number];

const COLOR = {
  bg: [21, 23, 26] as RGB,
  bg2: [28, 31, 35] as RGB,
  bgAlt: [24, 27, 31] as RGB,
  orange: [255, 106, 26] as RGB,
  text: [240, 238, 232] as RGB,
  muted: [152, 160, 168] as RGB,
  line: [70, 75, 82] as RGB,
};

function money(n: number): string {
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });
}

/** Arma el PDF de cotización: fondo negro grafito, detalles en naranja, membrete Multi Mec. */
export function buildCotizacionPdf(data: CotizacionPdfData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const headerHeight = 34;
  const footerHeight = 20;

  const fechaLegible = new Date(`${data.fecha}T00:00:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  function paintBackground() {
    doc.setFillColor(...COLOR.bg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  function drawHeader() {
    paintBackground();

    if (data.logoDataUrl) {
      try {
        doc.addImage(data.logoDataUrl, 'PNG', margin, 8, 15, 15);
      } catch {
        // Si el logo no se pudo decodificar, seguimos sin él.
      }
    }
    const textX = data.logoDataUrl ? margin + 19 : margin;

    doc.setTextColor(...COLOR.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('MULTI MEC', textX, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR.muted);
    doc.text(data.tagline, textX, 20.5);

    doc.setTextColor(...COLOR.orange);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text('COTIZACIÓN', pageWidth - margin, 14, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR.text);
    doc.text(`N°: ${data.numero}`, pageWidth - margin, 20, { align: 'right' });
    doc.text(`Fecha: ${fechaLegible}`, pageWidth - margin, 25, { align: 'right' });

    doc.setDrawColor(...COLOR.orange);
    doc.setLineWidth(0.6);
    doc.line(margin, headerHeight - 2, pageWidth - margin, headerHeight - 2);
  }

  function drawFooter(pageNumber: number, pageCount: number) {
    const y = pageHeight - footerHeight + 5;
    doc.setDrawColor(...COLOR.line);
    doc.setLineWidth(0.3);
    doc.line(margin, y - 5, pageWidth - margin, y - 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(...COLOR.muted);
    const linea1 = `${LETTERHEAD.responsable} · ${LETTERHEAD.rubro}`;
    const linea2 = `WhatsApp ${LETTERHEAD.whatsapp} · ${LETTERHEAD.direccion}`;
    doc.text(linea1, margin, y);
    doc.text(linea2, margin, y + 3.8);
    doc.text(`Página ${pageNumber} de ${pageCount}`, pageWidth - margin, y, { align: 'right' });
  }

  // ---- Página 1: encabezado + datos del cliente ----
  drawHeader();
  let y = headerHeight + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR.orange);
  doc.text('Señor(es)', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.3);
  doc.setTextColor(...COLOR.text);

  const clienteLineas = [
    data.cliente.nombre || '-',
    [data.cliente.cuit && `CUIT/DNI: ${data.cliente.cuit}`, data.cliente.telefono && `Tel: ${data.cliente.telefono}`]
      .filter(Boolean)
      .join('   '),
    [data.cliente.direccion, data.cliente.localidad].filter(Boolean).join(', '),
    data.cliente.email || '',
  ].filter((l): l is string => Boolean(l));

  for (const linea of clienteLineas) {
    doc.text(linea, margin, y);
    y += 4.6;
  }

  const startY = y + 4;
  const totales = calcularTotales(data.items, data.descuentoPct, data.aplicaIva, data.ivaPct);

  autoTable(doc, {
    startY,
    margin: { top: headerHeight + 4, bottom: footerHeight + 6, left: margin, right: margin },
    head: [['Ítem', 'Descripción del trabajo', 'Cant.', 'Tiempo est.', 'P. Unitario', 'P. Total']],
    body: data.items.map((item, i) => [
      String(i + 1),
      item.descripcion || '-',
      String(item.cantidad ?? 0),
      item.tiempo_estimado || '-',
      money(item.precio_unitario ?? 0),
      money(itemSubtotal(item)),
    ]),
    theme: 'plain',
    styles: {
      fillColor: COLOR.bg2,
      textColor: COLOR.text,
      lineColor: COLOR.line,
      lineWidth: 0.2,
      fontSize: 8.6,
      cellPadding: 2.6,
      valign: 'middle',
    },
    headStyles: {
      fillColor: COLOR.bg2,
      textColor: COLOR.orange,
      fontStyle: 'bold',
      lineColor: COLOR.orange,
      lineWidth: 0.3,
    },
    alternateRowStyles: { fillColor: COLOR.bgAlt },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 24, halign: 'center' },
      4: { cellWidth: 26, halign: 'right' },
      5: { cellWidth: 26, halign: 'right' },
    },
    willDrawPage: (hookData) => {
      if (hookData.pageNumber > 1) drawHeader();
    },
  });

  let cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  function ensureSpace(neededHeight: number) {
    if (cursorY + neededHeight > pageHeight - footerHeight) {
      doc.addPage();
      drawHeader();
      cursorY = headerHeight + 10;
    }
  }

  // ---- Totales ----
  ensureSpace(32);
  const totalsX = pageWidth - margin;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR.text);
  doc.text(`Subtotal: ${money(totales.subtotal)}`, totalsX, cursorY, { align: 'right' });
  cursorY += 5;
  if (data.descuentoPct > 0) {
    doc.text(`Descuento (${data.descuentoPct}%): -${money(totales.descuentoMonto)}`, totalsX, cursorY, {
      align: 'right',
    });
    cursorY += 5;
  }
  if (data.aplicaIva) {
    doc.text(`IVA (${data.ivaPct}%): ${money(totales.ivaMonto)}`, totalsX, cursorY, { align: 'right' });
    cursorY += 5;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR.orange);
  doc.text(`TOTAL: ${money(totales.total)}`, totalsX, cursorY + 2, { align: 'right' });
  cursorY += 13;

  // ---- Condiciones comerciales ----
  ensureSpace(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR.orange);
  doc.text('Condiciones comerciales', margin, cursorY);
  cursorY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.text);
  const condicionesLineas = [
    `Validez de la cotización: ${data.condiciones.validezDias} días`,
    `Plazo de entrega: ${data.condiciones.plazoEntrega}`,
    `Forma de pago: ${data.condiciones.formaPago}`,
    `Comprobante: ${data.condiciones.comprobante}`,
  ];
  for (const linea of condicionesLineas) {
    doc.text(linea, margin, cursorY);
    cursorY += 4.6;
  }
  if (data.condiciones.observaciones) {
    cursorY += 1;
    const obsLineas = doc.splitTextToSize(
      `Observaciones: ${data.condiciones.observaciones}`,
      pageWidth - margin * 2,
    ) as string[];
    ensureSpace(obsLineas.length * 4.4 + 4);
    doc.text(obsLineas, margin, cursorY);
    cursorY += obsLineas.length * 4.4 + 4;
  }

  // ---- Datos de entrega (opcional) ----
  if (data.entrega && (data.entrega.nombre || data.entrega.direccion)) {
    ensureSpace(32);
    cursorY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR.orange);
    doc.text('Datos de entrega', margin, cursorY);
    cursorY += 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR.text);
    const entregaLineas = [
      data.entrega.nombre,
      data.entrega.documento && `DNI/CUIT: ${data.entrega.documento}`,
      [data.entrega.direccion, data.entrega.localidad, data.entrega.provincia].filter(Boolean).join(', '),
      data.entrega.cp && `CP: ${data.entrega.cp}`,
      data.entrega.telefono && `Tel: ${data.entrega.telefono}`,
    ].filter((l): l is string => Boolean(l));
    for (const linea of entregaLineas) {
      doc.text(linea, margin, cursorY);
      cursorY += 4.6;
    }
  }

  // ---- Firma ----
  ensureSpace(20);
  cursorY += 8;
  const firmaWidth = 60;
  doc.setDrawColor(...COLOR.line);
  doc.setLineWidth(0.3);
  doc.line(margin, cursorY, margin + firmaWidth, cursorY);
  doc.line(pageWidth - margin - firmaWidth, cursorY, pageWidth - margin, cursorY);
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.muted);
  doc.text('Firma', margin, cursorY + 4);
  doc.text('Aclaración', pageWidth - margin - firmaWidth, cursorY + 4);

  // ---- Pie de página en todas las páginas ----
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    drawFooter(i, totalPaginas);
  }

  return doc;
}
