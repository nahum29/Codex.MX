import { business, services } from './data.js';

export const ORIENTATION = 'Necesito orientación';
export function visibleQuestions(questions, answers) {
  return questions.filter(q => !q.when || answers[q.when.field] === q.when.value);
}
export function validate(questions, answers) {
  return Object.fromEntries(visibleQuestions(questions, answers).filter(q => q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) ? !answers[q.id].length : !String(answers[q.id]).trim()))).map(q => [q.id, q.type === 'multi' ? 'Selecciona al menos una opción. También puedes pedir orientación.' : q.type === 'select' ? 'Elige una opción para continuar.' : 'Completa este campo para continuar.']));
}
export function toggleOption(current = [], option) {
  if (current.includes(option)) return current.filter(item => item !== option);
  const exclusive = [ORIENTATION, 'Ninguno'];
  if (exclusive.includes(option)) return [option];
  return [...current.filter(item => !exclusive.includes(item)), option];
}
export function updateAnswer(answers, questions, id, value) {
  const next = { ...answers, [id]: value };
  for (const q of questions) if (q.when && next[q.when.field] !== q.when.value) delete next[q.id];
  return next;
}
const list = value => Array.isArray(value) ? value.join(', ') : value;
export function buildSummary(serviceId, a = {}, p = {}) {
  const service = services.find(s => s.id === serviceId);
  if (!service) return [];
  const rows = [];
  const add = (label, value) => { if (value && (!Array.isArray(value) || value.length)) rows.push({ label, value: list(value) }); };
  add('Servicio', service.name);
  if (serviceId === 'web') {
    add('Negocio', a.business);
    add('Objetivo', a.goal === 'Otro' ? a.otherGoal : a.goal);
    const types = { 'Recibir consultas': 'Sitio enfocado en contacto y consultas', 'Presentar servicios': 'Sitio de presentación de servicios', 'Mostrar catálogo': 'Sitio con catálogo', 'Vender en línea': 'Tienda en línea; el proceso de compra y pago requiere definir su alcance', 'Necesito orientación': 'Tipo de sitio por definir juntos' };
    if (a.goal) add('Tipo de sitio sugerido', types[a.goal] || 'Sitio adaptado al objetivo descrito');
    add('Página actual', a.existing);
    add('Secciones', a.sections);
    add('Funciones', a.features);
    if (a.materials) add('Materiales por preparar', a.materials === 'Sí' ? 'Revisar el logo, los textos y las imágenes disponibles para cada sección.' : a.materials === 'Parcialmente' ? 'Identificar qué logo, textos o imágenes faltan y preparar esos materiales.' : 'Definir juntos el apoyo para preparar logo, textos e imágenes.');
    add('Siguiente paso', 'Revisar el objetivo, las secciones y las funciones para concretar el alcance.');
  }
  if (serviceId === 'automation') {
    add('Tarea a simplificar', a.task);
    add('Proceso actual', a.current);
    add('Herramientas', a.tools);
    add('Otras herramientas', a.otherTools);
    add('Frecuencia o volumen', a.volume);
    const trigger = a.trigger === 'Otro' ? a.otherTrigger : a.trigger === ORIENTATION ? 'evento por definir juntos' : a.trigger;
    if (trigger || a.next) add('Flujo conceptual', `Se recibe ${trigger || '[evento por definir]'} → se organiza o procesa la información de ${a.task || '[tarea por definir]'} → ${a.next ? `se realiza: ${a.next}` : '[acción por definir]'} → ${a.responsible ? `se avisa a ${a.responsible}` : 'se avisa a [responsable por definir]'}.`);
    add('Persona a notificar', a.responsible);
    add('Revisión humana', a.review);
    add('Detalles de la revisión', a.reviewDetails);
    add('Conexiones', 'Las conexiones se definen al revisar las herramientas que utiliza tu negocio.');
  }
  if (serviceId === 'app') {
    add('Objetivo de la aplicación', a.goal);
    add('Usuarios previstos', a.users);
    add('Módulos solicitados', a.features);
    add('Información que gestionaría', a.information);
    add('Permisos de acceso', a.permissions);
    add('Información que trasladar', a.migration);
    add('Dispositivo principal', a.device);
    const definitions = ['Detallar el proceso y el funcionamiento de los módulos solicitados'];
    if (a.permissions === 'Sí' || a.permissions === ORIENTATION) definitions.push('definir roles y permisos');
    if (a.migration === 'Sí' || a.migration === ORIENTATION) definitions.push('revisar la información y su formato para el traslado');
    if (!a.information) definitions.push('identificar qué información gestionará la aplicación');
    add('Por definir juntos', definitions.join('; ') + '.');
  }
  if (serviceId === 'social') {
    add('Negocio', a.business);
    add('Objetivo', a.goal);
    add('Plataformas', a.platforms);
    add('Otras plataformas', a.otherPlatforms);
    add('Trabajo solicitado', a.work);
    const deliverables = { 'Configuración de perfiles': 'Perfiles configurados y descripciones', 'Identidad visual': 'Lineamientos visuales para las redes', 'Planificación': 'Calendario de contenido', 'Diseños': 'Piezas gráficas', 'Textos': 'Textos para publicaciones', 'Programación': 'Publicaciones programadas', 'Gestión': 'Plan de gestión y comunicación', [ORIENTATION]: 'Entregables por definir juntos' };
    add('Tipos de entregables', (a.work || []).map(item => deliverables[item]).filter(Boolean));
    add('Material disponible', a.materials);
    if (a.work?.length) {
      const needs = [];
      if (a.work.some(item => ['Configuración de perfiles', 'Programación', 'Gestión'].includes(item))) needs.push('accesos autorizados a las plataformas seleccionadas');
      if (a.work.some(item => ['Identidad visual', 'Diseños'].includes(item))) needs.push(a.materials?.includes('Logo') ? 'revisar el logo y las referencias visuales disponibles' : 'definir el logo y las referencias visuales necesarias');
      if (a.work.some(item => ['Planificación', 'Diseños', 'Textos', 'Gestión'].includes(item))) needs.push('información del negocio y sus servicios', a.materials?.some(item => ['Fotografías', 'Videos'].includes(item)) ? 'revisar las fotografías o videos disponibles' : 'definir las imágenes o videos necesarios para el contenido');
      if (needs.length) add('Materiales necesarios', needs.join('; ') + '.');
    }
    add('Frecuencia preferida por el cliente', a.frequency);
  }
  add('Comentarios', a.comments?.trim());
  add('Fecha ideal de inicio', p.start ? formatDate(p.start) : null);
  add('Descripción adicional', p.details?.trim());
  add('Contacto o negocio', p.contact?.trim());
  return rows;
}
function formatDate(date) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}
export function summaryText(rows) {
  return `Hola, Codex.MX. Me gustaría conversar sobre este proyecto.\n\n${rows.map(row => `${row.label}: ${row.value}`).join('\n\n')}\n\nEsta es una propuesta inicial basada en mis respuestas. Quisiera definir alcance, tiempos y cotización.`;
}
export function whatsappLink(text) {
  const full = `${business.whatsapp}?text=${encodeURIComponent(text)}`;
  const tooLong = full.length > 7000;
  return { tooLong, url: tooLong ? `${business.whatsapp}?text=${encodeURIComponent('Hola, Codex.MX. Planifiqué mi proyecto en su página. Voy a compartir el resumen para definir alcance, tiempos y cotización.')}` : full };
}
