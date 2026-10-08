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
