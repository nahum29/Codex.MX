// Contacto y contenido comercial. El logo original está en public/logo.jpg.
export const business = {
  name: 'Codex.MX',
  logo: '/logo.jpg',
  whatsapp: 'https://wa.me/523343749886',
  phone: '33 4374 9886',
  email: 'codexmx.dev@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61574724486481',
  portfolio: 'https://portafolio-nahum.netlify.app/',
  location: 'Guadalajara, Jalisco · Atención a distancia',
};

export const content = {
  headline: { lead: 'Tu próximo proyecto digital', emphasis: 'empieza aquí.' },
  description: 'Páginas web, aplicaciones, automatizaciones y redes sociales para conectar tu negocio con sus clientes y simplificar su operación.',
};

const field = (id, label, type = 'text', extra = {}) => ({ id, label, type, ...extra });
const options = (id, label, values, extra = {}) => field(id, label, 'select', { options: values, ...extra });
const multi = (id, label, values, extra = {}) => field(id, label, 'multi', { options: values, ...extra });
const comments = field('comments', 'Comentarios', 'textarea', { optional: true, placeholder: '¿Hay algo más que debamos considerar?' });

export const services = [
  {
    id: 'web', name: 'Páginas web', short: 'Un lugar para tu negocio', icon: 'web',
    description: 'Presenta tu negocio, muestra tus servicios y facilita que tus clientes te contacten.',
    detail: 'De una presentación clara a un catálogo o una tienda: definimos una web alrededor de lo que necesitas.',
    questions: [
      field('business', 'Nombre o giro del negocio', 'text', { required: true, placeholder: 'Ej. Estudio de arquitectura' }),
      options('goal', '¿Cuál es el objetivo principal?', ['Recibir consultas', 'Presentar servicios', 'Mostrar catálogo', 'Vender en línea', 'Otro', 'Necesito orientación'], { required: true }),
      field('otherGoal', 'Cuéntanos tu objetivo', 'textarea', { required: true, when: { field: 'goal', value: 'Otro' } }),
      options('existing', '¿Ya tienes una página web?', ['Sí', 'No', 'Necesito orientación'], { required: true }),
      multi('sections', '¿Qué secciones te gustaría incluir?', ['Inicio', 'Servicios', 'Nosotros', 'Catálogo', 'Preguntas frecuentes', 'Contacto', 'Necesito orientación']),
      multi('features', '¿Qué funciones necesitas?', ['WhatsApp', 'Formulario', 'Reservas', 'Pagos', 'Blog', 'Varios idiomas', 'Necesito orientación']),
      options('materials', '¿Cuentas con logo, textos e imágenes?', ['Sí', 'Parcialmente', 'Necesito apoyo', 'Necesito orientación'], { required: true }),
      comments,
    ],
  },
  {
    id: 'automation', name: 'Automatizaciones', short: 'Menos tareas repetitivas', icon: 'flow',
    description: 'Conecta tus herramientas y simplifica tareas como registros, avisos y seguimiento.',
    detail: 'Partimos de tu proceso actual para identificar qué pasos se pueden conectar y dónde necesitas control.',
    questions: [
      field('task', '¿Qué tarea quieres simplificar?', 'textarea', { required: true, placeholder: 'Ej. Organizar solicitudes y avisar a quien las atiende' }),
      field('current', '¿Cómo la realizas actualmente?', 'textarea', { required: true, placeholder: 'Describe los pasos con tus propias palabras' }),
      multi('tools', '¿Qué herramientas utilizas?', ['WhatsApp', 'Correo electrónico', 'Excel', 'Google Sheets', 'Google Forms', 'Calendario', 'CRM', 'Necesito orientación']),
      field('otherTools', 'Otras herramientas o detalles', 'text', { optional: true, placeholder: 'Escribe los nombres que utilizas' }),
      options('volume', 'Frecuencia o volumen aproximado', ['Varias veces al día', 'Diariamente', 'Semanalmente', 'Mensualmente', 'Variable', 'No lo sé'], { required: true }),
      options('trigger', '¿Qué inicia el proceso?', ['Formulario', 'Mensaje', 'Cambio de estado', 'Fecha', 'Otro', 'Necesito orientación'], { required: true }),
      field('otherTrigger', '¿Qué evento lo inicia?', 'text', { required: true, when: { field: 'trigger', value: 'Otro' } }),
      field('next', '¿Qué debería ocurrir después?', 'textarea', { required: true, placeholder: 'Ej. Registrar la solicitud y notificar a la persona encargada' }),
      options('review', '¿Cuándo necesitas revisión de una persona?', ['Antes de realizar la acción', 'Al finalizar el proceso', 'Solo en casos específicos', 'Necesito orientación'], { required: true }),
      field('reviewDetails', 'Detalles de la revisión o persona responsable', 'text', { optional: true, placeholder: 'Ej. El equipo de ventas revisa cada solicitud' }),
      field('responsible', '¿A quién se debería avisar?', 'text', { optional: true, placeholder: 'Ej. A la persona encargada de ventas; podemos definirlo juntos' }),
      comments,
    ],
  },
  {
    id: 'app', name: 'Aplicaciones web', short: 'Tu operación, organizada', icon: 'app',
    description: 'Organiza información y procesos con una aplicación adaptada a tu operación.',
    detail: 'Herramientas accesibles desde el navegador, con las funciones y permisos que tu operación requiere.',
    questions: [
      field('goal', '¿Qué proceso o necesidad quieres resolver?', 'textarea', { required: true, placeholder: 'Ej. Llevar el seguimiento de solicitudes de mi equipo' }),
      options('users', '¿Quién utilizará la aplicación?', ['Equipo interno', 'Clientes', 'Ambos', 'Necesito orientación'], { required: true }),
      multi('features', '¿Qué funciones necesitas?', ['Usuarios', 'Panel de control', 'Registros', 'Búsqueda', 'Reportes', 'Archivos', 'Notificaciones', 'Reservas', 'Pagos', 'Necesito orientación']),
      options('permissions', '¿Necesitas distintos permisos de acceso?', ['Sí', 'No', 'Necesito orientación'], { required: true }),
      options('migration', '¿Tienes información que deba trasladarse?', ['Sí', 'No', 'Necesito orientación'], { required: true }),
      field('information', '¿Qué información gestionaría?', 'textarea', { optional: true, placeholder: 'Ej. Solicitudes, archivos o registros de clientes' }),
      options('device', '¿En qué dispositivo se usará principalmente?', ['Celular', 'Computadora', 'Ambos', 'Necesito orientación'], { required: true }),
      comments,
    ],
  },
  {
    id: 'social', name: 'Redes sociales', short: 'Una presencia coherente', icon: 'social',
    description: 'Construye una presencia coherente con perfiles profesionales, contenido y una comunicación clara.',
    detail: 'Presencia profesional y gestión de redes sociales, desde tus perfiles hasta la planificación de contenido.',
    questions: [
      field('business', 'Giro y nombre del negocio', 'text', { required: true, placeholder: 'Ej. Florería Magnolia' }),
      multi('platforms', '¿Qué plataformas tienes o quieres utilizar?', ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Necesito orientación'], { required: true }),
      field('otherPlatforms', 'Otras plataformas', 'text', { optional: true }),
      options('goal', '¿Cuál es tu objetivo principal?', ['Presentación profesional', 'Consultas', 'Promoción de servicios', 'Constancia de publicaciones', 'Necesito orientación'], { required: true }),
      multi('work', '¿Qué necesitas?', ['Configuración de perfiles', 'Identidad visual', 'Planificación', 'Diseños', 'Textos', 'Programación', 'Gestión', 'Necesito orientación'], { required: true }),
      multi('materials', '¿Qué material tienes disponible?', ['Logo', 'Fotografías', 'Videos', 'Ninguno']),
      options('frequency', '¿Con qué frecuencia te gustaría publicar?', ['Una vez por semana', 'Dos o tres veces por semana', 'Diariamente', 'Necesito orientación'], { required: true }),
      comments,
    ],
  },
];

export const preferenceQuestions = [
  field('start', 'Fecha ideal de inicio', 'date', { optional: true, help: 'Es una preferencia; confirmaremos la disponibilidad al conversar.' }),
  field('details', 'Descripción adicional', 'textarea', { optional: true, placeholder: 'Contexto, ideas o referencias que quieras compartir' }),
  field('contact', 'Nombre del negocio o persona de contacto', 'text', { optional: true }),
];

// Proceso de trabajo. Describe cómo se lleva a cabo realmente un proyecto:
// no promete plazos ni condiciones de pago que no dependan del alcance.
export const process = [
  { step: '01', title: 'Cuéntanos tu idea', text: 'Responde el planificador o escríbenos por WhatsApp. No necesitas nada preparado ni conocimientos técnicos.' },
  { step: '02', title: 'Definimos alcance y presupuesto', text: 'Revisamos contigo qué debe incluir, cuándo lo necesitas y en qué rango de inversión se mueve. Recibes una propuesta clara antes de empezar.' },
  { step: '03', title: 'Construimos y publicamos', text: 'Desarrollamos, tú la revisas y ajustamos lo que haga falta. Después publicamos y te entregamos el sitio con sus accesos.' },
];

// Rangos de inversión acordados con el titular del negocio, en pesos mexicanos.
export const pricing = [
  { id: 'web', service: 'Páginas web', range: '$9,000 – $30,000', note: 'Desde una presentación hasta un catálogo o una tienda.' },
  { id: 'automation', service: 'Automatizaciones', range: '$7,000 – $25,000', note: 'Desde conectar dos herramientas hasta un flujo completo.' },
  { id: 'app', service: 'Aplicaciones web', range: '$30,000 – $90,000', note: 'Panel interno o herramienta de uso diario para tu operación.' },
  { id: 'social', service: 'Redes sociales', range: '$4,000 – $15,000', note: 'Identidad, plan de contenido y diseños para publicar.' },
];
export const pricingNote = 'Precios en pesos mexicanos de referencia. El presupuesto final se define después de revisar alcance, tiempos y revisiones.';

// Trabajos publicados en línea. Cada enlace y su captura se verificaron
// antes de publicarlos; no se muestran proyectos sin sitio activo.
export const featuredProjects = [
  {
    id: 'alaia', name: 'ALAIA Mi Bienestar', group: 'Sitios', category: 'Plataforma de cursos',
    description: 'Sitio de cursos con acceso de usuarios, formularios y pasarela de pagos, construido con WordPress y Elementor Pro.',
    result: 'Proyecto entregado a un cliente y publicado en línea.',
    tags: ['WordPress', 'Elementor', 'Pagos'],
    image: '/projects/alaia.jpg', alt: 'Captura del sitio ALAIA Mi Bienestar',
    url: 'https://alaiamibienestar.com/',
  },
  {
    id: 'guitarla', name: 'GuitarLA', group: 'Tiendas', category: 'Tienda en línea',
    description: 'Tienda con catálogo de productos, carrito de compras y diseño adaptable a celular.',
    result: 'Los visitantes pueden explorar instrumentos y gestionar su carrito sin ayuda.',
    tags: ['React', 'Carrito', 'Responsive'],
    image: '/projects/guitarla.jpg', alt: 'Captura de la tienda GuitarLA',
    url: 'https://ngguitarla.netlify.app/',
  },
  {
    id: 'cmyk', name: 'Separador de color CMYK', group: 'Herramientas', category: 'Herramienta web',
    description: 'Aplicación que separa una imagen en canales de color CMYK para prepararla antes de imprimir.',
    result: 'Resuelve en el navegador una tarea que normalmente exige software de edición.',
    tags: ['Canvas API', 'JavaScript'],
    image: '/projects/cmyk.jpg', alt: 'Captura de la herramienta Separador de color CMYK',
    url: 'https://separador-de-color-nahum.netlify.app/',
  },
  {
    id: 'festival', name: 'Festival de Música', group: 'Sitios', category: 'Landing page',
    description: 'Página de un solo scroll con artistas, galería e información de boletos.',
    result: 'Toda la información del evento reunida en una experiencia rápida y adaptable.',
    tags: ['HTML/CSS', 'SASS'],
    image: '/projects/festival.jpg', alt: 'Captura de la landing del Festival de Música',
    url: 'https://festival-de-musicaa.netlify.app/',
  },
];
export const projectGroups = ['Todos', 'Sitios', 'Tiendas', 'Herramientas'];

// Razones de trabajo verificables: no incluyen cifras de clientes ni
// plazos que no dependan del alcance de cada proyecto.
export const advantages = [
  { title: 'Trato directo', text: 'Hablas con la persona que diseña y programa tu proyecto: sin intermediarios ni cadenas de correos.' },
  { title: 'Atención a distancia', text: 'Desde Guadalajara, Jalisco, con negocios de todo México por WhatsApp o videollamada.' },
  { title: 'Todo en español', text: 'Cada decisión se te explica sin tecnicismos y tú apruebas antes de que se publique.' },
];

// Preguntas frecuentes. Se publican igual en index.html (JSON-LD FAQPage);
// el test seo.test.js comprueba que ambas versiones coinciden.
export const faq = [
  { q: '¿Cuánto cuesta una página web?', a: 'Depende de las secciones y las funciones que necesites. En Páginas web el rango habitual va de $9,000 a $30,000 MXN. El planificador te ayuda a definir el alcance y con eso preparamos una propuesta concreta.' },
  { q: '¿Cuánto tarda un proyecto?', a: 'El plazo depende del alcance y de la fecha en que lo necesites. Tras definir qué incluye el proyecto te comprometemos un calendario con fechas, no una estimación vaga.' },
  { q: '¿Trabajas fuera de Guadalajara?', a: 'Sí. La atención es a distancia: coordinamos por WhatsApp o videollamada con negocios de cualquier parte de México.' },
  { q: '¿Necesito conocimientos técnicos?', a: 'No. Tú defines qué quieres lograr y nos encargamos del resto. Cada paso se te explica en español y sin tecnicismos.' },
  { q: '¿Qué necesito para empezar?', a: 'Una idea de lo que quieres lograr. Si aún no la tienes clara, el planificador te ayuda a ordenarla. Si ya tienes logo, textos e imágenes, mejor; si no, también podemos apoyarte con eso.' },
  { q: '¿Cómo empezamos?', a: 'Elige un servicio en el planificador, responde unas preguntas y envía tu resumen por WhatsApp. Con eso preparamos la primera propuesta.' },
];
