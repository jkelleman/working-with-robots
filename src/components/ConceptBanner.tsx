import { useLocation } from 'react-router-dom';
import { ClaimIcon, StationScene } from './Illustrations';

/** Shown at the top of every page: what this is, what it claims, how to check it. */

const CLAIMS = [
  { icon: 'step', text: 'One clear next step' },
  { icon: 'sync', text: 'Every signal agrees' },
  { icon: 'stop', text: 'Safety overrides all' },
  { icon: 'shape', text: 'Never color alone' },
] as const;

const PAGE_NOTES: Record<string, { label: string; text: string }> = {
  '/': { label: 'Try it', text: 'Start shift → Pod arrives → then break something below.' },
  '/patterns': { label: 'On this page', text: '8 reusable patterns behind the station.' },
  '/metrics': { label: 'On this page', text: 'How success is measured (synthetic data).' },
};

export default function ConceptBanner() {
  const { pathname } = useLocation();
  const note = PAGE_NOTES[pathname] ?? PAGE_NOTES['/'];

  return (
    <section className="concept" aria-labelledby="concept-title">
      <div className="concept-inner">
        <div className="concept-copy">
          <p className="concept-eyebrow">Design concept · Robotic fulfillment</p>
          <h1 id="concept-title" className="concept-title">Guiding people who work alongside robots</h1>
          <dl className="concept-story">
            <div>
              <dt>Use case</dt>
              <dd>Filling customer orders at a station where robots bring the shelves to the worker.</dd>
            </div>
            <div>
              <dt>Scenario</dt>
              <dd>Maya, three weeks in, works the night shift. Tonight she’ll hit an empty bin, a full tote, and a safety stop.</dd>
            </div>
          </dl>

          <p className="concept-lede">This prototype designs what her station shows, lights, and sounds at every step. It tests four claims:</p>

          <ul className="concept-claims">
            {CLAIMS.map((c) => (
              <li key={c.text}><ClaimIcon kind={c.icon} /><span>{c.text}</span></li>
            ))}
          </ul>

          <p className="concept-evidence">
            Enforced in code, checked by 14 tests.{' '}
            <a href="https://github.com/jkelleman/workstation-guidance-system#readme">View code →</a>
          </p>
        </div>

        <StationScene className="concept-art" />

        <p className="concept-page">
          <span className="concept-page-label">{note.label}</span>
          {note.text}
        </p>
      </div>
    </section>
  );
}
