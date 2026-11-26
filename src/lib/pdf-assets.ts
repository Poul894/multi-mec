import type { jsPDF } from 'jspdf';

/** Carga un archivo público como data URL (para incrustarlo en un PDF con jsPDF) y cachea el resultado. */
const cache = new Map<string, Promise<string | null>>();

export function loadImageDataUrl(path: string): Promise<string | null> {
  if (!cache.has(path)) {
    cache.set(
      path,
      (async () => {
        try {
          const res = await fetch(path);
          if (!res.ok) return null;
          const blob = await res.blob();
          return await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      })(),
    );
  }
  return cache.get(path)!;
}

/** Dibuja el logo de Multi Mec como marca de agua tenue, centrada en la página actual. */
export function drawWatermark(doc: jsPDF, logoDataUrl: string | null, sizeMm = 150, opacity = 0.12): void {
  if (!logoDataUrl) return;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const x = (pageWidth - sizeMm) / 2;
  const y = (pageHeight - sizeMm) / 2;
  try {
    doc.saveGraphicsState();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.setGState(new (doc as any).GState({ opacity }));
    doc.addImage(logoDataUrl, 'PNG', x, y, sizeMm, sizeMm);
    doc.restoreGraphicsState();
  } catch {
    // Si falla (formato inesperado), seguimos sin marca de agua.
  }
}
