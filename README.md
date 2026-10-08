# Codex.MX

Web estática con React + Vite. Incluye cuatro servicios, planificador guiado, resumen basado en reglas locales, enlaces de WhatsApp, copia con alternativa manual, menú móvil y temas claro/oscuro.

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

## Dónde editar

| Archivo | Contenido |
| --- | --- |
| `src/data.js` | Contacto, enlaces reales, logo, portada, servicios, preguntas y preferencias |
| `src/planner.js` | Reglas del resumen, validación, opciones excluyentes y mensaje de WhatsApp |
| `src/Planner.jsx` | Interacción del formulario, progreso, copia y resultado |
| `src/App.jsx` | Estructura de la web, navegación, textos de secciones y selector de tema |
| `src/styles.css` | Variables de color, tipografía, ambos temas y diseño responsive |
| `index.html` | Título, descripción SEO y elección inicial del tema antes de cargar React |

Las respuestas se mantienen en el estado de React y se eliminan al recargar o cerrar la página. Cambiar de servicio borra sus respuestas específicas, conservando las preferencias comunes. Solo la elección de tema se guarda en `localStorage`. No hay backend, analítica, formularios externos ni llamadas a IA.

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

Las pruebas comprueban reglas, preguntas condicionales, los cuatro recorridos, validación, conservación al retroceder, cambio de servicio, caracteres especiales, copia y alternativa, menú, teclado, tema del sistema y persistencia. También generan capturas en `test-results/` a 360, 390, 768 y 1440 px, en ambos temas, y comprueban desbordamientos.

Para revisar la compilación:

```sh
npm run preview
```

## Publicar en Netlify cuando lo decidas

La web **no se ha desplegado**. No necesita un dominio propio, claves API, base de datos ni servicios adicionales.

**Publicación manual:** ejecuta `npm run build` y carga la carpeta `dist` en la opción de publicación manual de Netlify. Sube `dist`, no la carpeta del código ni `node_modules`.

**Desde un repositorio:** sube el código a tu repositorio y conéctalo a Netlify. Usa comando de compilación `npm run build` y directorio de publicación `dist`; `netlify.toml` ya incluye esta configuración. No requiere variables de entorno.

Netlify puede asignar una dirección `*.netlify.app`; no se asume la propiedad de `codex.mx`. Para actualizar una publicación manual, vuelve a compilar y carga el nuevo `dist`.
