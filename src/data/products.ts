import type { UnitId } from './units';

export type DrawingType =
  | 'shaft'
  | 'bushing'
  | 'pulley'
  | 'wheel'
  | 'roller'
  | 'spacer'
  | 'bar'
  | 'gear'
  | 'flange'
  | 'plate'
  | 'custom';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  code: string;
  name: string;
  unit: UnitId;
  category: string;
  categorySlug: string;
  short: string;
  description: string;
  applications: string[];
  specs: ProductSpec[];
  drawing: DrawingType;
  featured?: boolean;
  /** Ruta a la fotografía real. Si está vacía se muestra el esquema técnico. */
  image?: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  unit: UnitId;
  description: string;
}

export const productCategories: ProductCategory[] = [
  {
    slug: 'piezas-a-medida',
    name: 'Piezas a medida',
    unit: 'industrial',
    description: 'Desarrollo y mecanizado de piezas según plano, muestra o requerimiento funcional.',
  },
  {
    slug: 'repuestos',
    name: 'Repuestos industriales',
    unit: 'industrial',
    description: 'Reposición de componentes críticos para máquinas, equipos y líneas de producción.',
  },
  {
    slug: 'transmision',
    name: 'Transmisión',
    unit: 'industrial',
    description: 'Componentes para movimiento y transmisión: poleas, engranajes, ejes y acoplamientos.',
  },
  {
    slug: 'mecanizado',
    name: 'Mecanizado general',
    unit: 'industrial',
    description: 'Torneado, fresado, perforado y terminaciones sobre distintos materiales.',
  },
  {
    slug: 'bujes',
    name: 'Bujes',
    unit: 'fitness',
    description: 'Bujes de desgaste para articulaciones, guías y puntos de rotación.',
  },
  {
    slug: 'poleas',
    name: 'Poleas',
    unit: 'fitness',
    description: 'Poleas para sistemas de cables, correas y transmisión de equipos.',
  },
  {
    slug: 'ruedas-rodillos',
    name: 'Ruedas y rodillos',
    unit: 'fitness',
    description: 'Ruedas, rodillos y guías para el desplazamiento y funcionamiento del equipo.',
  },
  {
    slug: 'ejes-separadores',
    name: 'Ejes y separadores',
    unit: 'fitness',
    description: 'Ejes, distanciadores y separadores para el armado de máquinas y estructuras.',
  },
  {
    slug: 'barras-manijares',
    name: 'Barras y manijares',
    unit: 'fitness',
    description: 'Barras, manijas y manijares mecanizados para equipamiento de fuerza.',
  },
  {
    slug: 'especiales',
    name: 'Piezas especiales',
    unit: 'fitness',
    description: 'Fabricación de piezas fuera de catálogo para fabricantes y desarrollos a medida.',
  },
];

export const products: Product[] = [
  {
    slug: 'eje-escalonado',
    code: 'MM-IND-001',
    name: 'Eje escalonado',
    unit: 'industrial',
    category: 'Repuestos industriales',
    categorySlug: 'repuestos',
    short: 'Ejes de transmisión y soporte mecanizados según plano o muestra.',
    description:
      'Fabricación de ejes escalonados para transmisión, soporte y montaje de componentes. Se mecanizan diámetros, ajustes, roscas y alojamientos según el plano o la pieza original, cuidando concentricidad y terminación en las zonas de apoyo.',
    applications: [
      'Transmisión de movimiento',
      'Soporte de poleas y rodamientos',
      'Reposición de ejes desgastados',
      'Equipos y máquinas en general',
    ],
    specs: [
      { label: 'Material', value: 'Acero, inoxidable o aluminio' },
      { label: 'Configuración', value: 'Según plano o muestra' },
      { label: 'Ajustes', value: 'A definir según funcionamiento' },
      { label: 'Cantidad', value: 'Pieza única, serie corta o producción' },
      { label: 'Terminación', value: 'Mecanizada / a definir' },
    ],
    drawing: 'shaft',
    featured: true,
  },
  {
    slug: 'buje-industrial',
    code: 'MM-IND-002',
    name: 'Buje mecanizado',
    unit: 'industrial',
    category: 'Piezas a medida',
    categorySlug: 'piezas-a-medida',
    short: 'Bujes de bronce, acero o plástico técnico para desgaste y guiado.',
    description:
      'Bujes para puntos de rotación, guiado y desgaste en máquinas y equipos. Se fabrican en distintas geometrías —con o sin brida, ranurados o con alojamiento de lubricación— de acuerdo con la aplicación y el material indicado.',
    applications: [
      'Puntos de rotación',
      'Guiado de ejes',
      'Repuestos de desgaste',
      'Máquinas y equipos industriales',
    ],
    specs: [
      { label: 'Material', value: 'Bronce, acero, nylon, POM u otro' },
      { label: 'Geometría', value: 'Con brida, liso o ranurado' },
      { label: 'Medidas', value: 'Según plano o muestra' },
      { label: 'Cantidad', value: 'Desde una pieza' },
      { label: 'Terminación', value: 'Mecanizada / a definir' },
    ],
    drawing: 'bushing',
    featured: true,
  },
  {
    slug: 'polea-industrial',
    code: 'MM-IND-003',
    name: 'Polea para transmisión',
    unit: 'industrial',
    category: 'Transmisión',
    categorySlug: 'transmision',
    short: 'Poleas mecanizadas con canales, chaveteros y alojamientos a medida.',
    description:
      'Poleas para transmisión por correa o cable, fabricadas según diámetro, cantidad de canales y tipo de montaje requerido. Se mecanizan el canal, el alojamiento del eje y el chavetero para lograr un ajuste preciso con el resto del conjunto.',
    applications: [
      'Transmisión por correa',
      'Sistemas de cables y guías',
      'Reposición de poleas dañadas',
      'Equipos de movimiento',
    ],
    specs: [
      { label: 'Material', value: 'Acero, aluminio o bronce' },
      { label: 'Canal', value: 'Según correa o cable' },
      { label: 'Montaje', value: 'Eje, chavetero o fijación a definir' },
      { label: 'Medidas', value: 'Según plano o muestra' },
      { label: 'Cantidad', value: 'Piezas únicas o series' },
    ],
    drawing: 'pulley',
  },
  {
    slug: 'engranaje-industrial',
    code: 'MM-IND-004',
    name: 'Engranaje / piñón',
    unit: 'industrial',
    category: 'Transmisión',
    categorySlug: 'transmision',
    short: 'Engranajes y piñones para reposición o desarrollo de conjuntos.',
    description:
      'Fabricación de engranajes y piñones para reposición o desarrollo de mecanismos. La pieza se produce a partir de la muestra, el plano o los datos del conjunto: cantidad de dientes, módulo, espesor, alojamiento y fijación.',
    applications: [
      'Mecanismos de transmisión',
      'Repuestos de maquinaria',
      'Equipos dosificadores y transportadores',
      'Desarrollos a medida',
    ],
    specs: [
      { label: 'Material', value: 'Acero, bronce o aluminio' },
      { label: 'Datos', value: 'Muestra, plano o conjunto a replicar' },
      { label: 'Montaje', value: 'Eje, chavetero o brida' },
      { label: 'Cantidad', value: 'Pieza única o serie' },
      { label: 'Terminación', value: 'Mecanizada / tratamiento a definir' },
    ],
    drawing: 'gear',
  },
  {
    slug: 'brida-industrial',
    code: 'MM-IND-005',
    name: 'Brida / flange',
    unit: 'industrial',
    category: 'Piezas a medida',
    categorySlug: 'piezas-a-medida',
    short: 'Bridas y piezas de fijación con perforaciones y alojamientos precisos.',
    description:
      'Bridas, placas de montaje y piezas de fijación con distribución de agujeros, alojamientos y ajustes definidos por el conjunto. Se mecanizan caras, diámetros y perforaciones para asegurar un montaje alineado.',
    applications: [
      'Fijación de componentes',
      'Conexión de cañerías y equipos',
      'Soportes y montajes',
      'Repuestos de máquinas',
    ],
    specs: [
      { label: 'Material', value: 'Acero, inoxidable o aluminio' },
      { label: 'Perforaciones', value: 'Según plano o muestra' },
      { label: 'Medidas', value: 'A medida' },
      { label: 'Cantidad', value: 'Pieza única o serie' },
      { label: 'Terminación', value: 'Mecanizada / a definir' },
    ],
    drawing: 'flange',
  },
  {
    slug: 'placa-mecanizada',
    code: 'MM-IND-006',
    name: 'Placa mecanizada',
    unit: 'industrial',
    category: 'Mecanizado general',
    categorySlug: 'mecanizado',
    short: 'Placas con mecanizado de caras, ranuras, cajeados y perforaciones.',
    description:
      'Placas y bloques mecanizados para soportes, guías, bases y estructuras. El trabajo incluye planeado, perforado, ranurado y cajeado según las cotas y tolerancias del plano, con verificación de medidas antes de la entrega.',
    applications: [
      'Bases y soportes',
      'Guías y topes',
      'Estructuras de máquinas',
      'Montajes especiales',
    ],
    specs: [
      { label: 'Material', value: 'Acero, aluminio o plástico técnico' },
      { label: 'Operaciones', value: 'Planeado, perforado, ranurado, cajeado' },
      { label: 'Medidas', value: 'Según plano' },
      { label: 'Cantidad', value: 'Pieza única o serie' },
      { label: 'Terminación', value: 'Mecanizada / a definir' },
    ],
    drawing: 'plate',
  },
  {
    slug: 'repuesto-a-muestra',
    code: 'MM-IND-007',
    name: 'Repuesto según muestra',
    unit: 'industrial',
    category: 'Repuestos industriales',
    categorySlug: 'repuestos',
    short: 'Replicamos la pieza original a partir de una muestra física.',
    description:
      'Cuando no existe plano, la pieza original funciona como referencia. Se toman las medidas, se interpretan los ajustes y se fabrica el repuesto para recuperar el funcionamiento del equipo. Si la pieza está desgastada, se evalúa con el cliente qué medidas deben mantenerse o corregirse.',
    applications: [
      'Máquinas fuera de línea',
      'Repuestos sin plano',
      'Piezas discontinuadas',
      'Mantenimiento correctivo',
    ],
    specs: [
      { label: 'Referencia', value: 'Muestra física o plano' },
      { label: 'Evaluación', value: 'Medición y relevamiento previo' },
      { label: 'Material', value: 'Según pieza original o alternativa' },
      { label: 'Cantidad', value: 'Una o varias piezas' },
      { label: 'Entrega', value: 'A coordinar según complejidad' },
    ],
    drawing: 'custom',
    featured: true,
  },
  {
    slug: 'rodillo-industrial',
    code: 'MM-IND-008',
    name: 'Rodillo industrial',
    unit: 'industrial',
    category: 'Repuestos industriales',
    categorySlug: 'repuestos',
    short: 'Rodillos y cilindros mecanizados para transporte y proceso.',
    description:
      'Rodillos para transporte, guiado o proceso, con superficies mecanizadas, ejes montados y terminaciones según la aplicación. Se define el material y el acabado en función del producto que circula y de las condiciones de trabajo.',
    applications: [
      'Transporte de materiales',
      'Guías de banda o cable',
      'Líneas de proceso',
      'Repuestos de equipos',
    ],
    specs: [
      { label: 'Material', value: 'Acero, inoxidable o aluminio' },
      { label: 'Superficie', value: 'Lisa, ranurada o recubierta' },
      { label: 'Montaje', value: 'Eje, rulemanes o soportes' },
      { label: 'Medidas', value: 'Según plano o muestra' },
      { label: 'Cantidad', value: 'Pieza única o serie' },
    ],
    drawing: 'roller',
  },
  {
    slug: 'buje-fitness',
    code: 'MM-FIT-001',
    name: 'Buje para máquina de gimnasio',
    unit: 'fitness',
    category: 'Bujes',
    categorySlug: 'bujes',
    short: 'Bujes de baja fricción para articulaciones y puntos de giro.',
    description:
      'Bujes para articulaciones, placas de apoyo y ejes de máquinas de fuerza y musculación. Se fabrican en nylon, POM, bronce o acero según la carga y el movimiento, con medidas compatibles con el equipo original o adaptadas a un nuevo desarrollo.',
    applications: [
      'Articulaciones de palancas',
      'Puntos de giro de brazos',
      'Guías de ejes y pasadores',
      'Reposición de bujes desgastados',
    ],
    specs: [
      { label: 'Material', value: 'Nylon, POM, bronce o acero' },
      { label: 'Medidas', value: 'Según muestra o plano' },
      { label: 'Ajuste', value: 'A definir según eje y carga' },
      { label: 'Escala', value: 'Reposición, prototipo o producción' },
      { label: 'Terminación', value: 'Mecanizada / a definir' },
    ],
    drawing: 'bushing',
    featured: true,
  },
  {
    slug: 'polea-fitness',
    code: 'MM-FIT-002',
    name: 'Polea para equipamiento fitness',
    unit: 'fitness',
    category: 'Poleas',
    categorySlug: 'poleas',
    short: 'Poleas para sistemas de cable, correa y poleas de reenvío.',
    description:
      'Poleas para máquinas de cables, poleas de reenvío y sistemas de transmisión de equipamiento fitness. Se mecanizan el canal, el alojamiento del rodamiento o buje y el sistema de fijación según el modelo del equipo.',
    applications: [
      'Sistemas de poleas y cables',
      'Máquinas de poleas altas y bajas',
      'Equipos de fuerza',
      'Reposición de poleas',
    ],
    specs: [
      { label: 'Material', value: 'Aluminio, acero, nylon o POM' },
      { label: 'Canal', value: 'Según cable o correa' },
      { label: 'Alojamiento', value: 'Rodamiento, buje o eje' },
      { label: 'Medidas', value: 'Según muestra o plano' },
      { label: 'Escala', value: 'Reposición o producción mayorista' },
    ],
    drawing: 'pulley',
    featured: true,
  },
  {
    slug: 'rueda-fitness',
    code: 'MM-FIT-003',
    name: 'Rueda y rodillo de guía',
    unit: 'fitness',
    category: 'Ruedas y rodillos',
    categorySlug: 'ruedas-rodillos',
    short: 'Ruedas y rodillos para guías, desplazamiento y apoyo.',
    description:
      'Ruedas y rodillos para el desplazamiento de carros, guías y mecanismos de máquinas de gimnasio. Se definen diámetro, ancho, tipo de apoyo y recubrimiento según la superficie de contacto y la carga de trabajo.',
    applications: [
      'Guías de carros y asientos',
      'Desplazamiento de estructuras',
      'Rodillos de apoyo',
      'Repuestos de máquinas',
    ],
    specs: [
      { label: 'Material', value: 'Acero, aluminio, nylon o POM' },
      { label: 'Superficie', value: 'Mecanizada, lisa o recubierta' },
      { label: 'Montaje', value: 'Rodamiento, buje o eje' },
      { label: 'Medidas', value: 'Según muestra o plano' },
      { label: 'Escala', value: 'Reposición o serie' },
    ],
    drawing: 'wheel',
    featured: true,
  },
  {
    slug: 'separador-fitness',
    code: 'MM-FIT-004',
    name: 'Separador / distanciador',
    unit: 'fitness',
    category: 'Ejes y separadores',
    categorySlug: 'ejes-separadores',
    short: 'Separadores mecanizados para montaje, ajuste y distancia entre piezas.',
    description:
      'Separadores y distanciadores para el armado de estructuras, ejes y conjuntos de máquinas fitness. Se fabrican en la longitud y el diámetro requeridos, con caras paralelas y alojamiento central para el pasaje del eje o bulón.',
    applications: [
      'Montaje de estructuras',
      'Separación de placas y poleas',
      'Ejes y pasadores',
      'Kits de armado',
    ],
    specs: [
      { label: 'Material', value: 'Acero, aluminio, nylon o POM' },
      { label: 'Medidas', value: 'A medida según conjunto' },
      { label: 'Alojamiento', value: 'Pasante o roscado' },
      { label: 'Cantidad', value: 'Desde una pieza' },
      { label: 'Escala', value: 'Reposición o producción mayorista' },
    ],
    drawing: 'spacer',
  },
  {
    slug: 'eje-fitness',
    code: 'MM-FIT-005',
    name: 'Eje para equipamiento',
    unit: 'fitness',
    category: 'Ejes y separadores',
    categorySlug: 'ejes-separadores',
    short: 'Ejes mecanizados para articulaciones, poleas y apoyos.',
    description:
      'Ejes para articulaciones, poleas y puntos de apoyo de equipamiento fitness. Se mecanizan escalones, roscas, alojamientos y sistemas de fijación según el modelo, priorizando el ajuste con bujes y rodamientos.',
    applications: [
      'Articulaciones de máquinas',
      'Montaje de poleas',
      'Apoyo de ruedas y rodillos',
      'Desarrollos especiales',
    ],
    specs: [
      { label: 'Material', value: 'Acero, inoxidable o aluminio' },
      { label: 'Configuración', value: 'Según muestra o plano' },
      { label: 'Fijación', value: 'Roscas, chavetero o seguros' },
      { label: 'Medidas', value: 'A medida' },
      { label: 'Escala', value: 'Reposición o serie' },
    ],
    drawing: 'shaft',
  },
  {
    slug: 'barra-manijar',
    code: 'MM-FIT-006',
    name: 'Barra con manijar',
    unit: 'fitness',
    category: 'Barras y manijares',
    categorySlug: 'barras-manijares',
    short: 'Barras y manijares mecanizados para equipos de fuerza.',
    description:
      'Barras y manijares para máquinas de fuerza y musculación, con extremos mecanizados, roscas y terminaciones según el diseño del equipo. Se puede trabajar sobre una muestra existente o desarrollar la pieza junto con el fabricante.',
    applications: [
      'Máquinas de fuerza',
      'Manijas y agarres',
      'Estructuras de empuje y tracción',
      'Repuestos de equipos',
    ],
    specs: [
      { label: 'Material', value: 'Acero, inoxidable o aluminio' },
      { label: 'Extremos', value: 'Roscados, mecanizados o con alojamiento' },
      { label: 'Terminación', value: 'Mecanizada / a definir' },
      { label: 'Medidas', value: 'Según muestra o plano' },
      { label: 'Escala', value: 'Reposición o producción mayorista' },
    ],
    drawing: 'bar',
  },
  {
    slug: 'pieza-especial-fitness',
    code: 'MM-FIT-007',
    name: 'Pieza especial para fitness',
    unit: 'fitness',
    category: 'Piezas especiales',
    categorySlug: 'especiales',
    short: 'Desarrollo de piezas fuera de catálogo para fabricantes de equipos.',
    description:
      'Piezas especiales que no forman parte del catálogo: soportes, adaptadores, componentes de ajuste o piezas de un nuevo desarrollo. Trabajamos a partir de un croquis, un plano, una muestra o una necesidad concreta del equipo.',
    applications: [
      'Nuevos desarrollos',
      'Adaptaciones de máquinas',
      'Piezas discontinuadas',
      'Series para fabricantes',
    ],
    specs: [
      { label: 'Punto de partida', value: 'Plano, croquis, muestra o idea' },
      { label: 'Material', value: 'A definir según función' },
      { label: 'Cantidad', value: 'Prototipo, serie corta o producción' },
      { label: 'Terminación', value: 'Según especificación' },
      { label: 'Asesoramiento', value: 'Revisión técnica de la pieza' },
    ],
    drawing: 'custom',
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((category) => category.slug === slug);
}

export const featuredProducts = products.filter((product) => product.featured);

export const categoriesByUnit = (unit: UnitId): ProductCategory[] =>
  productCategories.filter((category) => category.unit === unit);

export const productsByUnit = (unit: UnitId): Product[] =>
  products.filter((product) => product.unit === unit);
