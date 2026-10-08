import { useEffect, useRef, useState } from 'react';
import { business, content, services } from './data.js';
import Icon from './Icons.jsx';
import Planner from './Planner.jsx';

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'footer-brand' : ''}`} href="#inicio" aria-label="Codex.MX, inicio">{business.logo && <img src={business.logo} alt="" width="46" height="46" />}<span>Codex<span className="brand-extension">.MX</span></span></a>;
}

export default function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [request, setRequest] = useState(null);
  const menuButton = useRef(null);
  const nav = useRef(null);

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
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav ref={nav} id="main-nav" className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Navegación principal">
          <a href="#servicios" onClick={closeNavigation}>Servicios</a>
          <a href="#planifica" onClick={() => plan()}>Planifica tu proyecto</a>
          <a href="#portafolio" onClick={closeNavigation}>Portafolio</a>
          <a href="#contacto" onClick={closeNavigation}>Contacto</a>
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
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> IDEAS CLARAS. SOLUCIONES DIGITALES.</p><h1 id="hero-title">{content.headline.lead}<br /><span>{content.headline.emphasis}</span></h1><p className="hero-description">{content.description}</p><div className="hero-actions"><button type="button" className="button primary" onClick={() => plan()}>Planificar mi proyecto<Icon name="arrow" size={19} /></button><a href="#servicios" className="button quiet">Explorar servicios<span aria-hidden="true">↘</span></a></div><p className="hero-location">Guadalajara, Jalisco, México <span aria-hidden="true">/</span> Atención a distancia</p></div>
        <div className="hero-map"><div className="map-heading"><span className="eyebrow">¿POR DÓNDE EMPEZAMOS?</span><span className="map-caption">Tu idea tiene un camino.</span></div><div className="map-brand">{business.logo && <img className="hero-logo" src={business.logo} alt="Logo original de Codex.MX" />}<span className="map-brand-text">Codex<span>.MX</span></span><p>Conectamos ideas<br />con posibilidades.</p></div><div className="service-shortcuts">{services.map((service, i) => <button key={service.id} type="button" onClick={() => plan(service.id)}><span className="shortcut-number">0{i + 1}</span><Icon name={service.icon} size={23} /><span>{service.name}</span><Icon name="arrow" size={18} /></button>)}</div><div className="map-footer"><span className="small-dot" /> Elige un servicio y construye tu resumen.</div></div>
      </section>
      <section className="section container services-section" id="servicios" aria-labelledby="services-title"><div className="section-heading"><div><p className="eyebrow">SOLUCIONES CON PROPÓSITO</p><h2 id="services-title">Tecnología que se adapta<br />a lo que necesitas.</h2></div><p>Cada proyecto parte de una necesidad real. Elige el punto de partida y definamos juntos el alcance.</p></div><div className="services-grid">{services.map((service, i) => <article className="service-block" key={service.id}><div className="service-block-top"><span className="service-icon"><Icon name={service.icon} size={26} /></span><span className="service-index">0{i + 1}</span></div><h3>{service.name}</h3><p>{service.description}</p><p className="service-detail">{service.detail}</p><button type="button" className="service-link" onClick={() => plan(service.id)}>Planificar este proyecto<Icon name="arrow" size={18} /></button></article>)}</div></section>
      <div className="container"><Planner request={request} /></div>
      <section className="portfolio-section container" id="portafolio" aria-labelledby="portfolio-title"><div><p className="eyebrow">DEL CONCEPTO AL CÓDIGO</p><h2 id="portfolio-title">Conoce mi trabajo<br />de desarrollo web.</h2><p>Explora el portafolio y conoce mi enfoque de desarrollo.</p></div><a className="button secondary" href={business.portfolio} target="_blank" rel="noopener noreferrer">Ver portafolio<Icon name="external" size={19} /></a></section>
      <section className="contact-section" id="contacto" aria-labelledby="contact-title"><div className="container contact-inner"><div><p className="eyebrow">HABLEMOS DE TU IDEA</p><h2 id="contact-title">El siguiente paso<br />es una conversación.</h2><p>Con un resumen o una primera idea,<br />podemos empezar a definir tu proyecto.</p><a className="button primary" href={business.whatsapp} target="_blank" rel="noopener noreferrer">Conversar por WhatsApp<Icon name="external" size={18} /></a></div><div className="contact-links"><a href={business.whatsapp} target="_blank" rel="noopener noreferrer"><span>WHATSAPP</span><strong>{business.phone}</strong><Icon name="external" size={18} /></a><a href={`mailto:${business.email}`}><span>CORREO</span><strong>{business.email}</strong><Icon name="mail" size={18} /></a><a href={business.facebook} target="_blank" rel="noopener noreferrer"><span>FACEBOOK</span><strong>Codex.MX</strong><Icon name="external" size={18} /></a><p>{business.location}</p></div></div></section>
    </main>
    <footer className="footer container"><Brand footer /><p>© {new Date().getFullYear()} Codex.MX</p><a href="#inicio">Volver al inicio ↑</a></footer>
  </>;
}
