import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function start(page, name) {
  await page.goto('/');
  await page.locator('.service-shortcuts').getByRole('button', { name: new RegExp(name) }).click();
  await expect(page.locator('.step-content h3')).toBeFocused();
}
async function next(page) { await page.getByRole('button', { name: 'Continuar', exact: true }).click(); }
async function finish(page) { await next(page); await page.getByRole('button', { name: 'Ver mi resumen' }).click(); }

test('Four real journeys, back navigation, service reset, encoding, copy and fallback', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await start(page, 'Páginas web');
  await next(page);
  await expect(page.getByText('Completa este campo para continuar.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Nombre o giro del negocio')).toBeFocused();
  await page.getByLabel('Nombre o giro del negocio').fill('Café & té <b>auténtico</b>');
  await page.getByLabel('¿Cuál es el objetivo principal?').selectOption('Mostrar catálogo');
  await page.getByLabel('¿Ya tienes una página web?').selectOption('No');
  await page.getByRole('checkbox', { name: 'Catálogo', exact: true }).check();
  await page.getByRole('checkbox', { name: 'WhatsApp', exact: true }).check();
  await page.getByLabel('¿Cuentas con logo, textos e imágenes?').selectOption('Parcialmente');
  await next(page);
  await page.getByRole('button', { name: '← Atrás', exact: true }).click();
  await expect(page.getByLabel('Nombre o giro del negocio')).toHaveValue('Café & té <b>auténtico</b>');
  await expect(page.getByRole('checkbox', { name: 'Catálogo', exact: true })).toBeChecked();
  await next(page);
  await page.getByLabel('Nombre del negocio o persona de contacto').fill('José');
  await page.getByRole('button', { name: 'Ver mi resumen' }).click();
  await expect(page.getByText('Sitio con catálogo', { exact: true })).toBeVisible();
  await expect(page.locator('.summary-list dd').filter({ hasText: 'Café & té <b>auténtico</b>' })).toBeVisible();
  const href = await page.getByRole('link', { name: 'Enviar mi proyecto por WhatsApp' }).getAttribute('href');
  expect(new URL(href).searchParams.get('text')).toContain('José');
  expect(new URL(href).searchParams.get('text')).toContain('Café & té <b>auténtico</b>');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copiar resumen', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Resumen copiado');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Café & té');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await page.getByRole('button', { name: 'Copiar resumen', exact: true }).click();
  await expect(page.getByLabel('Resumen para copiar manualmente')).toBeFocused();
  await expect(page.getByLabel('Resumen para copiar manualmente')).toHaveValue(/Café & té/);
  await page.getByRole('button', { name: 'Seleccionar todo el resumen' }).click();
  expect(await page.getByLabel('Resumen para copiar manualmente').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(100);
  await page.locator('.service-shortcuts').getByRole('button', { name: /Automatizaciones/ }).click();
  await page.getByLabel('¿Qué tarea quieres simplificar?').fill('Registrar pedidos');
  await page.getByLabel('¿Cómo la realizas actualmente?').fill('Los anoto manualmente');
  await page.getByRole('checkbox', { name: 'Excel', exact: true }).check();
  await page.getByLabel('Frecuencia o volumen aproximado').selectOption('No lo sé');
  await page.getByLabel('¿Qué inicia el proceso?').selectOption('Mensaje');
  await page.getByLabel('¿Qué debería ocurrir después?').fill('Guardar pedido y avisar a ventas');
  await page.getByLabel('¿Cuándo necesitas revisión de una persona?').selectOption('Antes de realizar la acción');
  await finish(page);
  await expect(page.locator('.final-summary')).toContainText('Se recibe Mensaje');
  await expect(page.locator('.final-summary')).not.toContainText('Café & té');
  await expect(page.locator('.final-summary')).not.toContainText('Catálogo');
  await page.locator('.service-shortcuts').getByRole('button', { name: /Aplicaciones web/ }).click();
  await page.getByLabel('¿Qué proceso o necesidad quieres resolver?').fill('Control de solicitudes');
  await page.getByLabel('¿Quién utilizará la aplicación?').selectOption('Ambos');
  await page.getByRole('checkbox', { name: 'Registros', exact: true }).check();
  await page.getByLabel('¿Necesitas distintos permisos de acceso?').selectOption('Sí');
  await page.getByLabel('¿Tienes información que deba trasladarse?').selectOption('No');
  await page.getByLabel('¿En qué dispositivo se usará principalmente?').selectOption('Celular');
  await finish(page);
  await expect(page.locator('.final-summary')).toContainText('definir roles y permisos');
  await expect(page.locator('.final-summary')).not.toContainText('Registrar pedidos');
  await page.locator('.service-shortcuts').getByRole('button', { name: /Redes sociales/ }).click();
  await page.getByLabel('Giro y nombre del negocio').fill('Estudio creativo');
  await page.getByRole('checkbox', { name: 'Instagram', exact: true }).check();
  await page.getByLabel('¿Cuál es tu objetivo principal?').selectOption('Presentación profesional');
  await page.getByRole('checkbox', { name: 'Textos', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Ninguno', exact: true }).check();
  await page.getByLabel('¿Con qué frecuencia te gustaría publicar?').selectOption('Necesito orientación');
  await finish(page);
  await expect(page.locator('.final-summary')).toContainText('Textos para publicaciones');
  await expect(page.locator('.final-summary')).not.toContainText('Publicaciones programadas');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(errors).toEqual([]);
});

test('Conditional questions, orientation, lengthy WhatsApp message and accessibility', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page, 'Páginas web');
  await page.getByLabel('Nombre o giro del negocio').fill('Proyecto accesible');
  await page.getByLabel('¿Cuál es el objetivo principal?').selectOption('Otro');
  await next(page);
  await expect(page.getByLabel('Cuéntanos tu objetivo')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Cuéntanos tu objetivo').fill('Objetivo que se debe descartar');
  await page.getByLabel('¿Cuál es el objetivo principal?').selectOption('Necesito orientación');
  await expect(page.getByLabel('Cuéntanos tu objetivo')).toHaveCount(0);
  await page.getByLabel('¿Ya tienes una página web?').selectOption('No');
  const sections = page.getByRole('group', { name: '¿Qué secciones te gustaría incluir?' });
  await sections.getByRole('checkbox', { name: 'Inicio', exact: true }).check();
  await sections.getByRole('checkbox', { name: 'Necesito orientación', exact: true }).check();
  await expect(sections.getByRole('checkbox', { name: 'Inicio', exact: true })).not.toBeChecked();
  await page.getByLabel('¿Cuentas con logo, textos e imágenes?').selectOption('Necesito apoyo');
  await page.getByLabel('Comentarios').fill('Información & detalles con acentos: áéíóú. '.repeat(40));
  await next(page);
  await page.getByLabel('Descripción adicional').fill('Otras ideas: diseño, operación y comunicación. '.repeat(35));
  await page.getByRole('button', { name: 'Ver mi resumen' }).click();
  await expect(page.getByText('Tu resumen es extenso.', { exact: true })).toBeVisible();
  await expect(page.locator('.final-summary')).not.toContainText('Objetivo que se debe descartar');
  const href = await page.getByRole('link', { name: 'Enviar mi proyecto por WhatsApp' }).getAttribute('href');
  expect(href.length).toBeLessThan(1000);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('button', { name: /Activar tema/ }).click();
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('Keyboard service choice, mobile menu, system theme, saved choice and responsive layouts', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await expect(page.locator('#main-nav a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.locator('#main-nav').getByRole('link', { name: 'Servicios', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Activar tema claro' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('.hero-actions').getByRole('button', { name: 'Planificar mi proyecto' }).click();
  await page.getByRole('radio', { name: /Páginas web/ }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: /Automatizaciones/ })).toBeChecked();
  await next(page);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('button', { name: /Activar tema/ }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
      await page.screenshot({ path: `test-results/layout-${width}-${theme}.png`, fullPage: true });
    }
  }
});
