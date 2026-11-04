export interface Capability {
  code: string;
  title: string;
  description: string;
  icon: 'turning' | 'milling' | 'custom' | 'parts' | 'series' | 'quality';
}

export const capabilities: Capability[] = [
  {
    code: 'C-01',
    title: 'Torneado',
    description:
      'Piezas cilíndricas, ejes, bujes, roscas y ajustes. Mecanizado de diámetros interiores y exteriores según plano o muestra.',
    icon: 'turning',
  },
  {
    code: 'C-02',
    title: 'Fresado',
    description:
      'Planeado, ranurado, cajeados y mecanizado de formas. Componentes con geometrías y montajes específicos.',
    icon: 'milling',
  },
  {
    code: 'C-03',
    title: 'Fabricación a medida',
    description:
      'Desarrollo de la pieza a partir de un plano, una muestra o una necesidad funcional concreta.',
    icon: 'custom',
  },
  {
    code: 'C-04',
    title: 'Repuestos',
    description:
      'Reposición de piezas críticas para máquinas y equipos, incluyendo componentes discontinuados.',
    icon: 'parts',
  },
  {
    code: 'C-05',
    title: 'Series y producción',
    description:
      'Desde una pieza única o un prototipo hasta lotes de producción y abastecimiento periódico.',
    icon: 'series',
  },
  {
    code: 'C-06',
    title: 'Control dimensional',
    description:
      'Verificación de cotas, ajustes y terminaciones antes de cada entrega, con seguimiento de la pieza.',
    icon: 'quality',
  },
];

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Consulta',
    description:
      'Nos contás qué pieza necesitás, para qué equipo y en qué cantidad. Si tenés plano, muestra o fotos, mejor.',
  },
  {
    index: '02',
    title: 'Análisis y cotización',
    description:
      'Revisamos material, medidas y proceso. Te devolvemos una propuesta con alcance, plazo y condiciones.',
  },
  {
    index: '03',
    title: 'Mecanizado',
    description:
      'Fabricamos la pieza con los ajustes y la terminación acordados, manteniéndote al tanto del avance.',
  },
  {
    index: '04',
    title: 'Control y entrega',
    description:
      'Verificamos dimensiones y terminación. Coordinamos retiro en taller o envío a todo el país.',
  },
];

export const materials = [
  'Acero al carbono',
  'Acero inoxidable',
  'Aluminio',
  'Bronce',
  'Nylon',
  'POM',
  'Plásticos técnicos',
  'Fundición',
];

export const sectors = [
  {
    code: 'S-01',
    title: 'Fábricas y plantas',
    description:
      'Repuestos y piezas para mantener líneas de producción, máquinas y equipos en funcionamiento.',
  },
  {
    code: 'S-02',
    title: 'Talleres y mantenimiento',
    description:
      'Fabricación de componentes para reparaciones, adaptaciones y mantenimiento correctivo.',
  },
  {
    code: 'S-03',
    title: 'Fabricantes de equipamiento',
    description:
      'Producción de piezas y componentes para equipos nuevos, prototipos y series de fabricación.',
  },
  {
    code: 'S-04',
    title: 'Industria y desarrollos',
    description:
      'Soporte para proyectos que requieren una pieza mecanizada específica y trazabilidad de medidas.',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: '¿Cómo solicito un presupuesto?',
    answer:
      'Completá el formulario del sitio o escribinos por WhatsApp. Contanos qué pieza necesitás, la cantidad estimada y, si tenés, adjuntá el plano, una foto o una muestra. Con esos datos podemos analizar el trabajo y responderte.',
  },
  {
    question: '¿Pueden fabricar una pieza sin plano?',
    answer:
      'Sí. Podemos trabajar a partir de una muestra física, un croquis o fotos con medidas. En esos casos revisamos la pieza con vos y definimos qué dimensiones y ajustes son relevantes para que vuelva a funcionar correctamente.',
  },
  {
    question: '¿Hacen piezas únicas o también series?',
    answer:
      'Ambas. Fabricamos desde una pieza de reposición hasta lotes de producción. Para series, coordinamos cantidades, plazos de entrega y reposición periódica según la necesidad del cliente.',
  },
  {
    question: '¿Qué materiales trabajan?',
    answer:
      'Trabajamos acero, acero inoxidable, aluminio, bronce, fundición y plásticos técnicos como nylon y POM, entre otros. Si tu pieza requiere un material específico, indicalo en la consulta y lo evaluamos.',
  },
  {
    question: '¿Envían piezas a todo el país?',
    answer:
      'Sí. Coordinamos el embalaje y el envío a todo el territorio argentino según el destino, el volumen y la urgencia. También podés retirar en el taller si te queda cómodo.',
  },
  {
    question: '¿Abastecen a fabricantes de equipamiento fitness?',
    answer:
      'Sí. Multi Mec Fitness produce bujes, poleas, ruedas, rodillos, ejes, separadores, barras y manijares para fabricantes y armadores de equipamiento. Trabajamos tanto repuestos como piezas para producción y desarrollos especiales.',
  },
];

export const values = [
  {
    index: '01',
    title: 'Precisión',
    description:
      'Cada pieza se fabrica con las medidas y ajustes que el equipo necesita. Verificamos antes de entregar.',
  },
  {
    index: '02',
    title: 'Respuesta',
    description:
      'Consultas claras, cotizaciones concretas y seguimiento del trabajo. Sabés en qué estado está tu pedido.',
  },
  {
    index: '03',
    title: 'Flexibilidad',
    description:
      'Una pieza, una serie corta o producción. Nos adaptamos al volumen y al tipo de necesidad.',
  },
  {
    index: '04',
    title: 'Trato directo',
    description:
      'Hablás con el taller. La consulta técnica se resuelve con quien conoce el proceso de mecanizado.',
  },
];
