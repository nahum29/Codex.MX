import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { business, faq, featuredProjects, pricing } from '../src/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const robots = readFileSync(join(root, 'public', 'robots.txt'), 'utf8');
const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');
const origin = 'https://codexmx.netlify.app';

const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));
const findBlock = (type) => jsonLd.find((block) => block['@type'] === type);

test('cada bloque JSON-LD del index.html es JSON válido', () => {
  assert.ok(jsonLd.length >= 3, `se esperaban al menos 3 bloques, hay ${jsonLd.length}`);
  assert.ok(findBlock('ProfessionalService'), 'falta ProfessionalService');
  assert.ok(findBlock('WebSite'), 'falta WebSite');
  assert.ok(findBlock('FAQPage'), 'falta FAQPage');
});

test('las preguntas frecuentes del JSON-LD coinciden con las de data.js', () => {
  const declared = findBlock('FAQPage').mainEntity.map((item) => ({
    q: item.name,
    a: item.acceptedAnswer.text,
  }));
  assert.deepEqual(declared, faq, 'el FAQ publicado y el JSON-LD deben decir exactamente lo mismo');
});

test('el teléfono y el correo del negocio son los mismos que en data.js', () => {
  const service = findBlock('ProfessionalService');
  const digits = (value) => value.replace(/\D/g, '');
  assert.ok(digits(service.telephone).endsWith(digits(business.phone)), 'el teléfono debe coincidir con el de data.js');
  assert.equal(digits(service.telephone).slice(0, 2), '52', 'el teléfono debe incluir el prefijo de México');
  assert.equal(service.email, business.email);
  assert.equal(service.url, `${origin}/`);
  assert.equal(service.address.addressLocality, 'Guadalajara');
});

test('los precios mínimos del catálogo coinciden con los rangos publicados', () => {
  const catalog = findBlock('ProfessionalService').hasOfferCatalog.itemListElement;
  for (const item of pricing) {
    const offer = catalog.find((entry) => entry.itemOffered.serviceType === item.service);
    assert.ok(offer, `falta la oferta de ${item.service}`);
    assert.equal(String(offer.price), item.range.split('–')[0].replace(/\D/g, ''));
    assert.equal(offer.priceCurrency, 'MXN');
  }
  assert.equal(catalog.length, pricing.length);
});

test('las etiquetas de compartir apuntan a un recurso que existe', () => {
  const meta = (attribute, name) => {
    const match = html.match(new RegExp(`<meta\\s+${attribute}="${name}"\\s+content="([^"]+)"`, 's'));
    return match ? match[1] : null;
  };
  for (const [attribute, name] of [['property', 'og:url'], ['property', 'og:image'], ['name', 'twitter:image']]) {
    const url = meta(attribute, name);
    assert.ok(url, `falta ${name}`);
    assert.ok(url.startsWith(`${origin}/`), `${name} debe apuntar al dominio publicado: ${url}`);
    if (name.endsWith('image')) assert.ok(existsSync(join(root, 'public', url.replace(origin, ''))), `${url} no existe en public/`);
  }
  assert.match(html, /<link rel="canonical" href="https:\/\/codexmx\.netlify\.app\/" \/>/);
  assert.match(html, /<title>[^<]{10,70}<\/title>/);
  assert.ok(meta('name', 'description')?.length >= 60, 'la meta descripción debe tener al menos 60 caracteres');
});

test('robots.txt y sitemap.xml apuntan al mismo dominio', () => {
  assert.match(robots, new RegExp(`Sitemap: ${origin}/sitemap\\.xml`));
  assert.match(sitemap, new RegExp(`<loc>${origin}/</loc>`));
});

test('cada trabajo destacado enlaza a un sitio y a una captura que existen', () => {
  for (const project of featuredProjects) {
    assert.match(project.url, /^https:\/\/[^ "]+$/, `${project.id}: el enlace debe ser absoluto`);
    assert.ok(existsSync(join(root, 'public', project.image)), `${project.id}: falta la captura ${project.image}`);
    assert.ok(project.alt.length > 10, `${project.id}: la descripción de la imagen es demasiado corta`);
  }
  assert.equal(new Set(featuredProjects.map((project) => project.id)).size, featuredProjects.length);
});
