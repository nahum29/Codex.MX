export default function Icon({ name, size = 22, ...props }) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    external: <><path d="M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 018.5 4 8.5 8.5 0 1020 15.5z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M6 6l12 12M6 18L18 6" />,
    check: <path d="M5 12l4 4L19 6" />,
    web: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 13h4m-4 3h7" /></>,
    flow: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h9v9M6 9v9h9M15 3l3 3-3 3" /></>,
    app: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12M13 13h4m-4 4h4" /></>,
    social: <><path d="M21 11a8 8 0 01-8 8H7l-4 3V11a8 8 0 018-8h2a8 8 0 018 8z" /><path d="M7 11h.01M12 11h.01M17 11h.01" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 6l9 7 9-7" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    whatsapp: <><path d="M21 11.5a8.5 8.5 0 01-12.7 7.4L3 20.5l1.7-5.1A8.5 8.5 0 1121 11.5z" /><path d="M9.4 9.2c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.6 1.4c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3-.1.5.3.6 1.4 1.7 2.4 2 .2.1.4 0 .5-.1l.4-.5c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.4v.6c0 .3-.2.6-.6.8-.4.2-1 .3-2.4-.4a8 8 0 01-3.4-3c-.5-.9-.5-1.6-.5-1.9z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.arrow}</svg>;
}
