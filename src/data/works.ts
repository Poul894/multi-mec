import type { DrawingType } from './products';
import type { UnitId } from './units';

export type Texture = 'rings' | 'hatch' | 'grid' | 'knurl';

export interface WorkItem {
  id: string;
  title: string;
  unit: UnitId;
  kind: string;
  description: string;
  drawing: DrawingType;
  texture: Texture;
  size: 'wide' | 'half' | 'third' | 'tall';
  /** Ruta a la fotografía real. Si está vacía se muestra el registro técnico. */
  image?: string;
}

export const works: WorkItem[] = [
  {
    id: 'MM-GAL-001',
    title: 'Eje escalonado a plano',
    unit: 'industrial',
    kind: 'Mecanizado a medida',
    description:
      'Eje con escalones, ajustes y roscas mecanizado a partir de plano para reposición de un conjunto industrial.',
    drawing: 'shaft',
    texture: 'grid',
    size: 'wide',
  },
  {
    id: 'MM-GAL-002',
    title: 'Buje de bronce',
    unit: 'industrial',
    kind: 'Serie corta',
    description:
      'Bujes de desgaste con alojamiento de lubricación, fabricados en bronce para un punto de rotación.',
    drawing: 'bushing',
    texture: 'rings',
    size: 'half',
  },
  {
    id: 'MM-GAL-003',
    title: 'Polea de aluminio',
    unit: 'industrial',
    kind: 'Prototipo',
    description:
      'Polea mecanizada con canal para correa y alojamiento de eje, desarrollada a partir de muestra.',
    drawing: 'pulley',
    texture: 'hatch',
    size: 'half',
  },
  {
    id: 'MM-GAL-004',
    title: 'Rueda para equipamiento',
    unit: 'fitness',
    kind: 'Producción',
    description:
      'Rueda de guía con alojamiento central para rodamiento, producida para un fabricante de equipos fitness.',
    drawing: 'wheel',
    texture: 'rings',
    size: 'wide',
  },
  {
    id: 'MM-GAL-005',
    title: 'Separadores mecanizados',
    unit: 'fitness',
    kind: 'Lote de piezas',
    description:
      'Separadores de acero con caras paralelas y alojamiento pasante para el armado de estructuras.',
    drawing: 'spacer',
    texture: 'knurl',
    size: 'third',
  },
  {
    id: 'MM-GAL-006',
    title: 'Barra con manijar',
    unit: 'fitness',
    kind: 'Desarrollo',
    description:
      'Barra mecanizada con extremos roscados y terminación para equipo de fuerza, según muestra del cliente.',
    drawing: 'bar',
    texture: 'hatch',
    size: 'third',
  },
  {
    id: 'MM-GAL-007',
    title: 'Repuesto industrial a muestra',
    unit: 'industrial',
    kind: 'Reposición',
    description:
      'Pieza fuera de catálogo reconstruida a partir de la muestra original para recuperar un equipo en producción.',
    drawing: 'custom',
    texture: 'grid',
    size: 'third',
  },
  {
    id: 'MM-GAL-008',
    title: 'Polea para máquina de poleas',
    unit: 'fitness',
    kind: 'Reposición',
    description:
      'Polea de reenvío con alojamiento para buje, mecanizada para un modelo específico de máquina de gimnasio.',
    drawing: 'pulley',
    texture: 'grid',
    size: 'wide',
  },
  {
    id: 'MM-GAL-009',
    title: 'Placa de montaje',
    unit: 'industrial',
    kind: 'Mecanizado general',
    description:
      'Placa de soporte con perforaciones y cajeado, mecanizada según plano para el montaje de un componente.',
    drawing: 'plate',
    texture: 'hatch',
    size: 'half',
  },
];

export const worksByUnit = (unit: UnitId): WorkItem[] =>
  works.filter((work) => work.unit === unit);
