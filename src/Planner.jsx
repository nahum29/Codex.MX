import { useEffect, useRef, useState } from 'react';
import { business, preferenceQuestions, services } from './data.js';
import { buildSummary, summaryText, toggleOption, updateAnswer, validate, visibleQuestions, whatsappLink } from './planner.js';
import Icon from './Icons.jsx';

const steps = ['Servicio', 'Necesidades', 'Preferencias', 'Resumen'];

function Question({ question: q, value, onChange, error }) {
  const id = `field-${q.id}`;
  const hint = `${id}-hint`;
  const errorId = `${id}-error`;
  const described = [q.help ? hint : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const text = <>{q.label} {q.optional && <span className="optional">(opcional)</span>}{q.required && <span className="required-marker" aria-label="obligatorio"> *</span>}</>;
  const common = { id, 'aria-describedby': described, 'aria-invalid': !!error, required: !!q.required };
  return <div className={`field ${error ? 'field-error' : ''}`}>
    {q.type === 'multi' ? <fieldset aria-describedby={described} aria-invalid={!!error}>
      <legend>{text}</legend>
      <div className="choices">
        {q.options.map(option => <label className={`choice ${value?.includes(option) ? 'selected' : ''}`} key={option}>
          <input type="checkbox" checked={value?.includes(option) || false} onChange={() => onChange(toggleOption(value, option))} />
          <span className="choice-mark"><Icon name="check" size={13} /></span>{option}
        </label>)}
      </div>
    </fieldset> : <>
      <label htmlFor={id}>{text}</label>
      {q.type === 'select' ? <select {...common} value={value || ''} onChange={event => onChange(event.target.value)}>
        <option value="" disabled>Selecciona una opción</option>{q.options.map(option => <option key={option}>{option}</option>)}
      </select> : q.type === 'textarea' ? <textarea {...common} rows={3} maxLength={1800} placeholder={q.placeholder} value={value || ''} onChange={event => onChange(event.target.value)} /> : <input {...common} type={q.type} maxLength={q.type === 'date' ? undefined : 300} placeholder={q.placeholder} value={value || ''} onChange={event => onChange(event.target.value)} />}
    </>}
    {q.help && <p className="field-hint" id={hint}>{q.help}</p>}
    {error && <p className="error-message" id={errorId}>{error}</p>}
  </div>;
}

export default function Planner({ request }) {
  const [serviceId, setServiceId] = useState('');
  const [answers, setAnswers] = useState({});
  const [preferences, setPreferences] = useState({});
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const heading = useRef(null);
  const manual = useRef(null);
  const previousStep = useRef(0);
  const service = services.find(item => item.id === serviceId);
  const rows = buildSummary(serviceId, answers, preferences);
  const text = summaryText(rows);
  const whatsapp = whatsappLink(text);

  function chooseService(id) {
    if (id !== serviceId) { setServiceId(id); setAnswers({}); }
    setErrors({}); setStatus(''); setManualCopy(false);
  }

  useEffect(() => {
    if (!request?.nonce) return;
    if (request.service) {
      if (request.service !== serviceId) { setServiceId(request.service); setAnswers({}); }
      setStep(1);
    } else setStep(0);
    setErrors({}); setStatus(''); setManualCopy(false);
    // Each request is an explicit action from a service link or call to action.
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }, [request]);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => { if (manualCopy) { manual.current?.focus(); manual.current?.select(); } }, [manualCopy]);

  function move(next) {
    setStep(next); setErrors({}); setStatus(''); setManualCopy(false);
    document.getElementById('planifica').scrollIntoView({ block: 'start' });
  }
  function continueStep(event) {
    event.preventDefault();
    const problems = step === 0 ? (!serviceId ? { service: 'Selecciona un servicio para continuar.' } : {}) : step === 1 ? validate(service.questions, answers) : {};
    setErrors(problems);
    if (Object.keys(problems).length) {
      requestAnimationFrame(() => document.querySelector('#planifica [aria-invalid="true"] input, #planifica input[aria-invalid="true"], #planifica select[aria-invalid="true"], #planifica textarea[aria-invalid="true"]')?.focus());
      return;
    }
    move(step + 1);
  }
  function changeAnswer(q, value) {
    setAnswers(previous => updateAnswer(previous, service.questions, q.id, value));
    setErrors(previous => ({ ...previous, [q.id]: undefined }));
  }
  async function copySummary() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setStatus('Resumen copiado. Puedes pegarlo en tu conversación.'); setManualCopy(false);
    } catch {
      setManualCopy(true);
      setStatus('Selecciona el texto y cópialo con el menú de tu dispositivo o con Ctrl+C / ⌘C.');
    }
  }

  return <section id="planifica" className="section planner-section" aria-labelledby="planner-title">
    <div className="section-heading"><div><p className="eyebrow">DE LA IDEA AL SIGUIENTE PASO</p><h2 id="planner-title">Dale forma a tu proyecto.</h2></div><p>Cuéntanos qué necesitas. Te ayudamos a ordenar la idea antes de conversar.</p></div>
    <div className={`planner-layout ${step === 3 ? 'is-final' : ''}`}>
      <div className="planner-main">
        <ol className="progress" aria-label="Etapas del planificador">{steps.map((label, index) => <li key={label} className={index === step ? 'current' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}><span className="step-number">{index < step ? <Icon name="check" size={15} /> : index + 1}</span><span>{label}</span></li>)}</ol>
        <div className="step-content" key={step}>
          <p className="eyebrow">PASO {step + 1} DE 4</p>
          <h3 ref={heading} tabIndex={-1}>{['¿Qué tienes en mente?', 'Hablemos de tus necesidades.', 'Los detalles también cuentan.', 'Así podría ser tu proyecto'][step]}</h3>
          <p className="step-intro">{['Elige el servicio que más se acerca a tu idea. Si aún no lo tienes claro, empieza por el que te interesa y selecciona “Necesito orientación” en las preguntas.', 'No necesitas conocimientos técnicos. Los campos con * nos ayudan a preparar un resumen útil.', 'Estos datos son opcionales. Puedes ver tu resumen sin compartir correo ni teléfono.', 'Esta es una propuesta inicial basada en tus respuestas. Contáctanos para definir alcance, tiempos y cotización.'][step]}</p>
          {step < 3 ? <form onSubmit={continueStep} noValidate>
            {step === 0 ? <fieldset className="service-picker" aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined}>
              <legend className="sr-only">Servicio que quieres planificar</legend>
              {services.map(item => <label className={`service-option ${serviceId === item.id ? 'selected' : ''}`} key={item.id}>
                <input type="radio" name="service" value={item.id} checked={serviceId === item.id} onChange={() => chooseService(item.id)} />
                <span className="service-icon"><Icon name={item.icon} /></span><span><strong>{item.name}</strong><small>{item.short}</small></span><span className="radio-mark" />
              </label>)}
              {errors.service && <p id="service-error" className="error-message">{errors.service}</p>}
            </fieldset> : <div className="questions">{visibleQuestions(step === 1 ? service.questions : preferenceQuestions, step === 1 ? answers : preferences).map(q => <Question key={q.id} question={q} value={(step === 1 ? answers : preferences)[q.id]} error={errors[q.id]} onChange={value => step === 1 ? changeAnswer(q, value) : setPreferences(previous => ({ ...previous, [q.id]: value }))} />)}</div>}
            <div className="form-actions">{step > 0 ? <button className="button quiet" type="button" onClick={() => move(step - 1)}>← Atrás</button> : <span className="form-note">Sin precios ni plazos automáticos.</span>}<button className="button primary" type="submit">{step === 2 ? 'Ver mi resumen' : 'Continuar'}<Icon name="arrow" size={18} /></button></div>
          </form> : <div className="final-summary">
            <Summary rows={rows} />
            <div className="summary-note"><Icon name="check" size={19} /><p>Revisaremos contigo el alcance, los tiempos y la cotización.</p></div>
            {whatsapp.tooLong && <div className="long-message"><strong>Tu resumen es extenso.</strong><p>Cópialo primero. WhatsApp se abrirá con una introducción breve; pega allí el resumen antes de enviarlo.</p></div>}
            <div className="final-actions"><a className="button primary" href={whatsapp.url} target="_blank" rel="noopener noreferrer">Enviar mi proyecto por WhatsApp<Icon name="external" size={18} /></a><button className="button secondary" type="button" onClick={copySummary}><Icon name="copy" size={18} />Copiar resumen</button><button className="text-button" type="button" onClick={() => move(1)}>Editar respuestas</button></div>
            <p className="field-hint">Se abrirá WhatsApp con tu resumen listo para enviar.{whatsapp.tooLong && ' En este caso, pega el texto completo que copiaste.'}</p>
            <p role="status" className="copy-status">{status}</p>
            {manualCopy && <div className="manual-copy"><label htmlFor="manual-summary">Resumen para copiar manualmente</label><textarea id="manual-summary" ref={manual} value={text} readOnly rows={10} /><button type="button" className="button secondary" onClick={() => { manual.current.focus(); manual.current.select(); }}>Seleccionar todo el resumen</button></div>}
            <button type="button" className="text-button back-preferences" onClick={() => move(2)}>← Volver a preferencias</button>
          </div>}
        </div>
      </div>
      {step < 3 && <aside className="live-summary" aria-label="Resumen de tus selecciones"><p className="eyebrow">TU PROYECTO, EN CLARO</p><h3>Vamos construyendo<br />la idea.</h3>{service ? <><div className="summary-service"><Icon name={service.icon} /><strong>{service.name}</strong></div><Summary rows={rows.filter(row => !['Servicio', 'Siguiente paso', 'Conexiones', 'Por definir juntos'].includes(row.label))} compact /><p className="live-summary-foot">Puedes retroceder y ajustar tus respuestas en cualquier momento.</p></> : <><p>Selecciona un servicio para empezar. Aquí verás cómo tus respuestas dan forma al proyecto.</p><div className="empty-lines" aria-hidden="true"><span /><span /><span /></div></>}<div className="privacy-note">Tus respuestas solo permanecen mientras esta página esté abierta.</div></aside>}
    </div>
  </section>;
}

function Summary({ rows, compact = false }) {
  return <dl className={`summary-list ${compact ? 'compact' : ''}`}>{rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>;
}
