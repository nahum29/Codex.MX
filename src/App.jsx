import { useEffect, useRef, useState } from 'react';
import { advantages, business, content, faq, featuredProjects, pricing, pricingNote, process, projectGroups, services } from './data.js';
import Icon from './Icons.jsx';
import Planner from './Planner.jsx';

/** Enlace de contacto con el saludo inicial ya escrito. */
const waLink = (message) => `https://wa.me/${business.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
const generalWhatsApp = waLink('Hola Codex.MX, vengo de tu página y quiero cotizar un proyecto.');
const externalA11y = ' (se abre en una pestaña nueva)';

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'footer-brand' : ''}`} href="#inicio" aria-label="Codex.MX, inicio">{business.logo && <img src={business.logo} alt="" width="46" height="46" />}<span>Codex<span className="brand-extension">.MX</span></span></a>;
}

/**
 * Muestra los elementos marcados con [data-reveal] cuando entran en pantalla.
 * Con `prefers-reduced-motion` el contenido se muestra sin animación, de modo
 * que nunca depende del desplazamiento para leerse.
 */
function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return undefined;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver !== 'function') {
      nodes.forEach((node) => node.classList.add('revealed'));
      return undefined;
    }
    // Solo a partir de aquí el CSS puede ocultar el contenido: si el script
    // fallara, la página se quedaría visible.
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
      // Si quedara algo sin revelar (por ejemplo, imágenes que cambian el
      // alto de la página al cargar), se muestra todo lo que ya sea visible.
      if (document.querySelectorAll('[data-reveal]:not(.revealed)').length === 0) observer.disconnect();
    }, { threshold: 0.1, rootMargin: '0px 0px 15% 0px' });
    nodes.forEach((node) => observer.observe(node));
    // Seguro final: nada se queda oculto si la página termina de cargar.
    const safety = () => nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add('revealed');
    });
    window.addEventListener('load', safety);
    return () => { observer.disconnect(); window.removeEventListener('load', safety); };
  }, []);
}

/** Reduce la altura de la barra superior apenas se empieza a desplazar. */
function useShrinkingHeader() {
  const [shrunk, setShrunk] = useState(false);
  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return shrunk;
}

/** Marca en la navegación la sección que ocupa la pantalla. */
function useActiveSection(sectionIds) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return undefined;
    const nodes = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sectionIds]);
  return active;
}

/** Trabajos publicados, con captura y enlace vivo. */
function Works() {
  const [group, setGroup] = useState('Todos');
  const shown = group === 'Todos' ? featuredProjects : featuredProjects.filter((project) => project.group === group);
  return <section className="section container works-section" id="portafolio" aria-labelledby="works-title">
    <div className="section-heading">
      <div><p className="eyebrow">DEL CONCEPTO AL CÓDIGO</p><h2 id="works-title">Trabajos que ya<br />están en línea.</h2></div>
      <p>Cada enlace abre el sitio publicado y se puede revisar desde el navegador.</p>
    </div>
    <div className="works-filters" role="group" aria-label="Filtrar trabajos por tipo">
      {projectGroups.map((option) => <button key={option} type="button" className={`filter-chip ${group === option ? 'active' : ''}`} aria-pressed={group === option} onClick={() => setGroup(option)}>{option}</button>)}
    </div>
    <div className="works-grid">
      {shown.map((project) => <article className="work-card" key={project.id} data-reveal>
        <img className="work-image" src={project.image} alt={project.alt} loading="lazy" width="800" height="520" />
        <div className="work-body">
          <p className="work-category">{project.category}</p>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p className="work-result">{project.result}</p>
          <ul className="work-tags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          <a className="service-link" href={project.url} target="_blank" rel="noopener noreferrer">
            Ver el sitio en vivo<Icon name="external" size={17} /><span className="sr-only">{externalA11y}</span>
          </a>
        </div>
      </article>)}
    </div>
    <p className="works-note">¿Quieres ver el proceso completo? Está en <a className="inline-link" href={business.portfolio} target="_blank" rel="noopener noreferrer">mi portafolio completo<Icon name="external" size={15} /><span className="sr-only">{externalA11y}</span></a>.</p>
  </section>;
}

/** Explica cómo se lleva a cabo un proyecto, sin prometer plazos fijos. */
function Process() {
  return <section className="section container process-section" id="proceso" aria-labelledby="process-title">
    <div className="section-heading">
      <div><p className="eyebrow">CÓMO TRABAJAMOS</p><h2 id="process-title">Tres pasos y<br />sin sorpresas.</h2></div>
      <p>Sabes qué pasa después de escribirnos y qué necesitas decidir en cada momento.</p>
    </div>
    <ol className="process-list">
      {process.map((step) => <li className="process-step" key={step.step} data-reveal>
        <span className="process-number" aria-hidden="true">{step.step}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </li>)}
    </ol>
  </section>;
}

/** Rangos de inversión: evitan perder el tiempo de los dos lados. */
function Pricing() {
  return <section className="section container pricing-section" id="inversion" aria-labelledby="pricing-title">
    <div className="section-heading">
      <div><p className="eyebrow">INVERSIÓN</p><h2 id="pricing-title">Rangos de referencia<br />en pesos mexicanos.</h2></div>
      <p>Conocer el orden de magnitud desde el principio ayuda a decidir si tiene sentido seguir.</p>
    </div>
    <div className="pricing-grid">
      {pricing.map((item) => <article className="price-card" key={item.id} data-reveal>
        <h3>{item.service}</h3>
        <p className="price-range">{item.range}</p>
        <p className="price-note">{item.note}</p>
        <a className="service-link" href={waLink(`Hola Codex.MX, me interesa cotizar ${item.service.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer">
          Cotizar {item.service.toLowerCase()}<Icon name="arrow" size={17} /><span className="sr-only"> por WhatsApp{externalA11y}</span>
        </a>
      </article>)}
    </div>
    <p className="pricing-note">{pricingNote}</p>
  </section>;
}

/** Respuestas a las dudas que aparecen antes de escribir. */
function Faq() {
  return <section className="section container faq-section" id="preguntas" aria-labelledby="faq-title">
    <div className="section-heading">
      <div><p className="eyebrow">PREGUNTAS FRECUENTES</p><h2 id="faq-title">Lo que suelen preguntar<br />antes de escribir.</h2></div>
      <p>Si tu duda no está aquí, responde el planificador o mándanos un mensaje.</p>
    </div>
    <div className="faq-list">
      {faq.map((item) => <details className="faq-item" key={item.q} data-reveal>
        <summary><span>{item.q}</span><Icon name="plus" size={19} /></summary>
        <div className="faq-answer"><p>{item.a}</p></div>
      </details>)}
    </div>
  </section>;
}

/** Barra fija de contacto en móvil: convertir en un solo clic. */
function StickyWhatsapp() {
  return <a className="sticky-whatsapp" href={generalWhatsApp} target="_blank" rel="noopener noreferrer">
    <Icon name="whatsapp" size={19} /><span>Cotizar por WhatsApp<span className="sr-only">{externalA11y}</span></span>
  </a>;
}

const navItems = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#planifica', label: 'Planifica', plain: true },
  { href: '#portafolio', label: 'Trabajos' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#inversion', label: 'Inversión' },
  { href: '#preguntas', label: 'Preguntas' },
  { href: '#contacto', label: 'Contacto' },
];
const navSectionIds = navItems.map((item) => item.href.slice(1));

export default function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [request, setRequest] = useState(null);
  const menuButton = useRef(null);
  const nav = useRef(null);
  const shrunk = useShrinkingHeader();
  const activeSection = useActiveSection(navSectionIds);

  useRevealOnScroll();

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = event => {
      let saved;
      try { saved = localStorage.getItem('codex-theme'); } catch {}
      if (saved !== 'light' && saved !== 'dark') setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0c1220' : '#f7f8fb';
  }, [theme]);
  useEffect(() => {
    if (!menuOpen) return;
    nav.current?.querySelector('a')?.focus();
    const handle = event => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    const outside = event => {
      if (!nav.current?.contains(event.target) && !menuButton.current?.contains(event.target)) setMenuOpen(false);
    };
    const media = matchMedia('(min-width: 1000px)');
    const resize = event => { if (event.matches) setMenuOpen(false); };
    media.addEventListener('change', resize);
    document.addEventListener('keydown', handle);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', handle); document.removeEventListener('pointerdown', outside); media.removeEventListener('change', resize); };
  }, [menuOpen]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('codex-theme', next); } catch {}
  }
  function plan(service) {
    setRequest({ service, nonce: Date.now() }); setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById('planifica').scrollIntoView({ block: 'start' }));
  }
  function closeNavigation(event) {
    setMenuOpen(false);
    const target = document.querySelector(event.currentTarget.getAttribute('href'))?.querySelector('h2');
    if (target) {
      target.setAttribute('tabindex', '-1');
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  }
  return <>
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <header className={`header ${shrunk ? 'shrunk' : ''}`}>
      <div className="header-inner">
        <Brand />
        <nav ref={nav} id="main-nav" className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Navegación principal">
          {navItems.map((item) => <a
            key={item.href}
            href={item.href}
            aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
            onClick={item.plain ? () => plan() : closeNavigation}
          >{item.label}</a>)}
          <a className="nav-whatsapp" href={generalWhatsApp} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Cotizar<span className="sr-only"> por WhatsApp{externalA11y}</span></a>
        </nav>
        <div className="header-actions">
          <button type="button" className="theme-button" onClick={toggleTheme} aria-label={`Activar tema ${theme === 'dark' ? 'claro' : 'oscuro'}`} title={`Activar tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} /></button>
          <button type="button" className="button primary header-cta" onClick={() => plan()}>Planificar mi proyecto<Icon name="arrow" size={16} /></button>
          <button ref={menuButton} type="button" className="menu-button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(previous => !previous)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        </div>
      </div>
    </header>
    <main id="contenido">
      <section className="hero container" id="inicio" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> IDEAS CLARAS. SOLUCIONES DIGITALES.</p><h1 id="hero-title">{content.headline.lead}<br /><span>{content.headline.emphasis}</span></h1><p className="hero-description">{content.description}</p><div className="hero-actions"><button type="button" className="button primary" onClick={() => plan()}>Planificar mi proyecto<Icon name="arrow" size={19} /></button><a href="#portafolio" className="button quiet">Ver trabajos publicados<span aria-hidden="true">↘</span></a></div><p className="hero-location">Guadalajara, Jalisco, México <span aria-hidden="true">/</span> Atención a distancia</p></div>
        <div className="hero-map"><div className="map-heading"><span className="eyebrow">¿POR DÓNDE EMPEZAMOS?</span><span className="map-caption">Tu idea tiene un camino.</span></div><div className="map-brand">{business.logo && <img className="hero-logo" src={business.logo} alt="Logo original de Codex.MX" />}<span className="map-brand-text">Codex<span>.MX</span></span><p>Conectamos ideas<br />con posibilidades.</p></div><div className="service-shortcuts">{services.map((service, i) => <button key={service.id} type="button" onClick={() => plan(service.id)}><span className="shortcut-number">0{i + 1}</span><Icon name={service.icon} size={23} /><span>{service.name}</span><Icon name="arrow" size={18} /></button>)}</div><div className="map-footer"><span className="small-dot" /> Elige un servicio y construye tu resumen.</div></div>
      </section>
      <section className="advantages-section" aria-labelledby="advantages-title">
        <div className="container">
          <h2 id="advantages-title" className="sr-only">Cómo trabajamos</h2>
          <div className="advantages-grid">
            {advantages.map((item) => <article className="advantage" key={item.title} data-reveal>
              <span className="advantage-mark" aria-hidden="true"><Icon name="check" size={17} /></span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>)}
          </div>
        </div>
      </section>
      <section className="section container services-section" id="servicios" aria-labelledby="services-title"><div className="section-heading"><div><p className="eyebrow">SOLUCIONES CON PROPÓSITO</p><h2 id="services-title">Tecnología que se adapta<br />a lo que necesitas.</h2></div><p>Cada proyecto parte de una necesidad real. Elige el punto de partida y definamos juntos el alcance.</p></div><div className="services-grid">{services.map((service, i) => <article className="service-block" key={service.id}><div className="service-block-top"><span className="service-icon"><Icon name={service.icon} size={26} /></span><span className="service-index">0{i + 1}</span></div><h3>{service.name}</h3><p>{service.description}</p><p className="service-detail">{service.detail}</p><button type="button" className="service-link" onClick={() => plan(service.id)}>Planificar este proyecto<Icon name="arrow" size={18} /></button></article>)}</div></section>
      <div className="container"><Planner request={request} /></div>
      <Works />
      <Process />
      <Pricing />
      <Faq />
      <section className="contact-section" id="contacto" aria-labelledby="contact-title"><div className="container contact-inner"><div><p className="eyebrow">HABLEMOS DE TU IDEA</p><h2 id="contact-title">El siguiente paso<br />es una conversación.</h2><p>Con un resumen o una primera idea,<br />podemos empezar a definir tu proyecto.</p><a className="button primary" href={business.whatsapp} target="_blank" rel="noopener noreferrer">Conversar por WhatsApp<Icon name="external" size={18} /></a></div><div className="contact-links"><a href={business.whatsapp} target="_blank" rel="noopener noreferrer"><span>WHATSAPP</span><strong>{business.phone}</strong><Icon name="external" size={18} /></a><a href={`mailto:${business.email}`}><span>CORREO</span><strong>{business.email}</strong><Icon name="mail" size={18} /></a><a href={business.facebook} target="_blank" rel="noopener noreferrer"><span>FACEBOOK</span><strong>Codex.MX</strong><Icon name="external" size={18} /></a><p>{business.location}</p></div></div></section>
    </main>
    <footer className="footer container">
      <div className="footer-top">
        <Brand footer />
        <p>Conectamos ideas<br />con posibilidades.</p>
      </div>
      <nav className="footer-nav" aria-label="Navegación del pie de página">
        {navItems.filter((item) => !item.plain).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <div className="footer-contact">
        <a href={`tel:+52${business.phone.replace(/\D/g, '')}`}>Tel. {business.phone}</a>
        <a href={`mailto:${business.email}`}>{business.email}</a>
        <a href={business.facebook} target="_blank" rel="noopener noreferrer">Facebook<span className="sr-only">{externalA11y}</span></a>
        <a href={business.portfolio} target="_blank" rel="noopener noreferrer">Portafolio<span className="sr-only">{externalA11y}</span></a>
        <p>{business.location}</p>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} Codex.MX. Todos los derechos reservados. <a href="#inicio">Volver al inicio ↑</a></p>
    </footer>
    <StickyWhatsapp />
  </>;
}
