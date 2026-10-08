import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../src/data.js';
import { buildSummary, summaryText, toggleOption, updateAnswer, validate, whatsappLink } from '../src/planner.js';

test('Website scope follows the goal and contains only chosen features', () => {
  const rows = buildSummary('web', { business: 'Café & té', goal: 'Mostrar catálogo', sections: ['Inicio', 'Catálogo'], features: ['WhatsApp'], materials: 'Parcialmente' });
  assert.match(summaryText(rows), /Sitio con catálogo/);
  assert.equal(rows.find(r => r.label === 'Funciones').value, 'WhatsApp');
  assert.ok(!summaryText(rows).includes('Pagos'));
  assert.match(rows.find(r => r.label === 'Materiales por preparar').value, /faltan/);
});
test('Conditional answers are removed when their controlling answer changes', () => {
  const questions = services[0].questions;
  const changed = updateAnswer({ goal: 'Otro', otherGoal: 'Información especial' }, questions, 'goal', 'Recibir consultas');
  assert.equal(changed.otherGoal, undefined);
  assert.equal(validate(questions, changed).otherGoal, undefined);
  assert.ok(validate(questions, { goal: 'Otro' }).otherGoal);
});
test('Orientation and no-material choices are exclusive', () => {
  assert.deepEqual(toggleOption(['Blog'], 'Necesito orientación'), ['Necesito orientación']);
  assert.deepEqual(toggleOption(['Necesito orientación'], 'Blog'), ['Blog']);
  assert.deepEqual(toggleOption(['Logo'], 'Ninguno'), ['Ninguno']);
  assert.deepEqual(toggleOption(['Ninguno'], 'Videos'), ['Videos']);
});
test('Automation flow uses answers and leaves unknown responsibility explicit', () => {
  const text = summaryText(buildSummary('automation', { task: 'pedidos', current: 'Registro manual', trigger: 'Mensaje', next: 'guardar la solicitud', tools: ['Excel'], review: 'Antes de realizar la acción' }));
  assert.match(text, /Se recibe Mensaje/);
  assert.match(text, /información de pedidos/);
  assert.match(text, /guardar la solicitud/);
  assert.match(text, /responsable por definir/);
  assert.match(text, /Las conexiones se definen/);
  assert.ok(!text.includes('Google Sheets'));
});
test('App scope includes only requested modules and relevant open questions', () => {
  const rows = buildSummary('app', { goal: 'Controlar registros', users: 'Equipo interno', features: ['Registros', 'Búsqueda'], permissions: 'No', migration: 'Sí', device: 'Celular' });
  assert.equal(rows.find(r => r.label === 'Módulos solicitados').value, 'Registros, Búsqueda');
  assert.match(rows.find(r => r.label === 'Por definir juntos').value, /formato para el traslado/);
  assert.ok(!rows.find(r => r.label === 'Por definir juntos').value.includes('roles'));
});
test('Social deliverables are derived from selected work, frequency is a preference', () => {
  const rows = buildSummary('social', { platforms: ['Instagram'], work: ['Textos', 'Planificación'], materials: ['Logo'], frequency: 'Una vez por semana' });
  assert.equal(rows.find(r => r.label === 'Tipos de entregables').value, 'Textos para publicaciones, Calendario de contenido');
  assert.ok(rows.find(r => r.label === 'Frecuencia preferida por el cliente'));
  assert.ok(!summaryText(rows).includes('Publicaciones programadas'));
});
test('WhatsApp encoding preserves accents, symbols, newlines and literal markup', () => {
  const text = summaryText(buildSummary('web', { business: 'Niñez & Café + México <script>', comments: '¿Qué tal? #sí 100%' }, { contact: 'José', start: '2026-12-20' }));
  const link = whatsappLink(text);
  assert.equal(new URL(link.url).searchParams.get('text'), text);
  assert.match(text, /20\/12\/2026/);
  assert.equal(link.tooLong, false);
  const long = whatsappLink('á & '.repeat(2000));
  assert.equal(long.tooLong, true);
  assert.ok(long.url.length < 1000);
});
