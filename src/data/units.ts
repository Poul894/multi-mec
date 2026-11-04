export type UnitId = 'industrial' | 'fitness';

export interface BusinessUnit {
  id: UnitId;
  index: string;
  name: string;
  shortName: string;
  eyebrow: string;
  href: string;
  accent: 'orange' | 'blue';
  headline: string;
  description: string;
  services: string[];
  drawing: 'shaft' | 'wheel';
}

export const units: BusinessUnit[] = [
  {
    id: 'industrial',
    index: '01',
    name: 'Multi Mec Industrial',
    shortName: 'Repuestos y reparaciones',
    eyebrow: 'Tornería y mecanizado',
    href: '/industrial',
    accent: 'orange',
    headline: 'Piezas y repuestos para la industria.',
    description:
      'Fabricación de piezas a medida, repuestos industriales y componentes mecanizados para fábricas, talleres e industrias. Trabajamos según plano, muestra o necesidad funcional.',
    services: [
      'Torneado',
      'Fresado',
      'Fabricación de piezas a medida',
      'Repuestos industriales',
      'Mecanizado según plano o muestra',
      'Series cortas y reposición',
    ],
    drawing: 'shaft',
  },
  {
    id: 'fitness',
    index: '02',
    name: 'Multi Mec Fitness',
    shortName: 'Fitness',
    eyebrow: 'Componentes para equipamiento',
    href: '/fitness',
    accent: 'blue',
    headline: 'Componentes para equipamiento fitness.',
    description:
      'Repuestos y piezas especiales para máquinas de gimnasio: bujes, poleas, ruedas, rodillos, ejes, separadores, barras y manijares. Abastecemos a fabricantes y armadores de equipamiento.',
    services: [
      'Bujes, poleas y rodillos',
      'Ruedas y separadores',
      'Barras y manijares',
      'Venta mayorista a fabricantes',
    ],
    drawing: 'wheel',
  },
];

export function getUnit(id: UnitId): BusinessUnit {
  const unit = units.find((item) => item.id === id);
  if (!unit) throw new Error(`Unidad desconocida: ${id}`);
  return unit;
}
