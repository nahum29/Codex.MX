# Codex.MX

Sitio comercial de Codex.MX, construido con React + Vite. Publicado en **https://codexmx.netlify.app/** y con el código en **https://github.com/nahum29/Codex.MX**.

Incluye cuatro servicios con precios de referencia, un planificador guiado que genera un resumen local, trabajos publicados con captura y enlace vivo, proceso de trabajo, preguntas frecuentes, contacto por WhatsApp y temas claro/oscuro.

## Secciones

| Sección | Qué aporta |
| --- | --- |
| Portada | Titular, llamada a planificar y acceso directo a los cuatro servicios |
| Cómo trabajamos | Tres razones verificables: trato directo, atención a distancia y explicaciones en español |
| Servicios | Páginas web, automatizaciones, aplicaciones web y redes sociales |
| Planificador | Preguntas guiadas por servicio y resumen con reglas locales |
| Trabajos | Cuatro proyectos publicados, con filtro por tipo, captura y enlace al sitio en vivo |
| Proceso | Tres pasos, sin prometer plazos que dependan del alcance |
| Inversión | Rangos en pesos mexicanos y nota sobre el presupuesto final |
| Preguntas frecuentes | Seis dudas habituales, también publicadas como `FAQPage` en los datos estructurados |
| Contacto | WhatsApp, correo, teléfono, Facebook y ubicación |

En móvil aparece una barra fija de WhatsApp que no tapa el contenido del pie.

## Ejecutar en tu computadora

Desde esta carpeta, abre una terminal y ejecuta:

```sh
npm install
npm run dev
```

Abre la dirección que indica Vite, normalmente **http://localhost:5173**. Para revisar desde un celular conectado a la misma red, usa la dirección `Network` que muestra Vite. El firewall de Windows puede requerir permitir el servidor en la red privada.

## Logo original

El archivo original se conserva en `Logo.jpg`. La web utiliza una copia idéntica en `public/logo.jpg`, configurada mediante `business.logo` en `src/data.js`.

El logo aparece en el encabezado, la portada y el pie. Se conservan sus proporciones y colores. Un recorte circular mediante CSS (`border-radius: 50%`) oculta las esquinas blancas, sin modificar el archivo original ni aplicar filtros. Para actualizarlo, reemplaza la copia en `public/` o configura una nueva ruta en `src/data.js`.

Los iconos `favicon.png`, `apple-touch-icon.png` e `icon-512.png` se generaron recortando ese mismo logo a círculo, con las esquinas transparentes y, en el caso de iOS, sobre el fondo `#0c1220` para que no aparezcan esquinas negras.

## Posicionamiento en buscadores y al compartir

`index.html` incluye etiquetas `og:*` y `twitter:*`, enlace canónico, `robots.txt`, `sitemap.xml`, `site.webmanifest` y tres bloques de datos estructurados: `ProfessionalService` (con teléfono, correo, ubicación y catálogo de servicios), `WebSite` y `FAQPage`.

La imagen `public/og-image.png` (1200 × 630) se usa al compartir el enlace en WhatsApp, Facebook o LinkedIn.

El FAQ publicado en pantalla y el bloque `FAQPage` deben decir exactamente lo mismo. La prueba `tests/seo.test.js` los compara y falla si alguien cambia uno sin cambiar el otro. También comprueba que el teléfono, el correo, los precios mínimos del catálogo, el dominio de las etiquetas de compartir y que cada captura y cada enlace de los trabajos existan.

## Dónde editar

| Archivo | Contenido |
| --- | --- |
| `src/data.js` | Contacto, enlaces reales, logo, servicios, preguntas, trabajos, proceso, inversión y FAQ |
| `src/planner.js` | Reglas del resumen, validación, opciones excluyentes y mensaje de WhatsApp |
| `src/Planner.jsx` | Interacción del formulario, progreso, copia y resultado |
| `src/App.jsx` | Estructura de la web, navegación, textos de secciones y selector de tema |
| `src/styles.css` | Variables de color, tipografía, ambos temas y diseño responsive |
| `index.html` | Título, datos estructurados, etiquetas para compartir y elección inicial del tema antes de cargar React |

### Actualizar un trabajo

Los trabajos viven en `featuredProjects` (`src/data.js`). Cada entrada necesita `url` (enlace absoluto al sitio publicado) e `image` (ruta en `public/`). La prueba de SEO comprueba que ambos existan, así que un enlace roto o una captura que falte detiene la compilación de las pruebas antes de publicar.

Las respuestas del planificador se mantienen en el estado de React y se eliminan al recargar o cerrar la página. Cambiar de servicio borra sus respuestas específicas, conservando las preferencias comunes. Solo la elección de tema se guarda en `localStorage`. No hay backend, analítica, formularios externos ni llamadas a IA.

### Preguntas

Cada pregunta tiene un `id`, `label`, `type` y, cuando corresponde, `options`, `required`, `optional`, `placeholder` o `help`. Los tipos disponibles son `text`, `textarea`, `select`, `multi` y `date`. Para preguntas condicionales, usa `when: { field: 'idDeLaPregunta', value: 'Opción' }`. Si cambias los identificadores, actualiza las reglas correspondientes en `src/planner.js`.

### WhatsApp

El enlace se prepara con `encodeURIComponent`; el visitante decide si envía el mensaje. Si el enlace supera 7,000 caracteres, el resultado indica que copie el resumen y abre WhatsApp con una introducción breve. Si falla el portapapeles, aparece un campo de texto seleccionable y un botón para seleccionar todo.

## Verificar y compilar

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

`npm test` ejecuta las reglas del planificador y las comprobaciones de SEO. `npm run test:e2e` comprueba los cuatro recorridos, la accesibilidad con axe-core en ambos temas, el menú, el teclado, la persistencia del tema y la ausencia de desbordes a 360, 390, 768 y 1440 px; además genera capturas en `test-results/`.

Para revisar la compilación:

```sh
npm run preview
```

## Publicar

El sitio ya está publicado en **https://codexmx.netlify.app/**. La configuración de Netlify está en `netlify.toml`: compilación `npm run build` y publicación desde `dist`.

**Desde el repositorio (recomendado):** conéctalo en la interfaz de Netlify a `github.com/nahum29/Codex.MX`, rama `main`. Cada `git push` publica automáticamente.

**Publicación manual:** ejecuta `npm run build` y carga la carpeta `dist` en la opción de publicación manual de Netlify. Sube `dist`, no la carpeta del código ni `node_modules`.

No necesita claves API, base de datos ni servicios adicionales. Netlify puede asignar una dirección `*.netlify.app`; no se asume la propiedad de `codex.mx`.

## Pasos que quedan en tu parte

- Conectar el repositorio a Netlify (o volver a subir `dist`) para publicar los cambios.
- En Google Search Console, añadir el sitio y enviar `https://codexmx.netlify.app/sitemap.xml`.
