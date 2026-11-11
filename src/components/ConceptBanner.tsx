import { useLocation } from 'react-router-dom';

/**
 * Shown at the top of every page so anyone landing anywhere knows
 * what this concept is, what it claims, and how to check the claims.
 */

const PROOFS = [
  {
    title: 'One clear next step, always',
    body: 'Every exception, from a wrong item to a jammed scanner, has a single recovery action. No dead ends.',
  },
  {
    title: 'Every signal agrees',
    body: 'One state machine drives the screen, lights, sound, and haptics, so they can never contradict each other.',
  },
  {
    title: 'Safety overrides everything',
    body: 'A safety stop interrupts any step. Restarting takes two deliberate actions and resumes exactly where work stopped.',
  },
  {
    title: 'Color is never the only cue',
    body: 'Every light pairs color with a shape, blink rate, and label, with modes for low vision, hearing, and handedness.',
  },
];

const PAGE_NOTES: Record<string, { label: string; text: string }> = {
  '/': {
    label: 'Try it',
    text: 'Tap Start shift, then Pod arrives. Then break something: scan a wrong item, report a full tote, or break the light curtain.',
  },
  '/patterns': {
    label: 'On this page',
    text: 'The 8 reusable patterns behind the station, each mapped across screen, light, sound, and haptics.',
  },
  '/metrics': {
    label: 'On this page',
    text: 'How you would measure whether the design works on the floor. The data is synthetic.',
  },
};

export default function ConceptBanner() {
  const { pathname } = useLocation();
  const note = PAGE_NOTES[pathname] ?? PAGE_NOTES['/'];

  return (
    <section className="concept" aria-labelledby="concept-title">
      <div className="concept-inner">
        <p className="concept-eyebrow">Design concept · Robotic fulfillment</p>
        <h1 id="concept-title" className="concept-title">
          When a robot brings the work to a person, how do you keep them safe, fast, and confident, especially when
          something goes wrong?
        </h1>
        <p className="concept-lede">
          This is a working prototype of the guidance for a goods-to-person pick station. A robot delivers a shelf
          of bins; the worker picks from a lit bin into a lit tote. The prototype tests four design claims:
        </p>

        <ol className="concept-proofs">
          {PROOFS.map((p, i) => (
            <li key={p.title}>
              <span className="proof-num" aria-hidden="true">{i + 1}</span>
              <div>
                <strong>{p.title}</strong>
                <span>{p.body}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="concept-evidence">
          <strong>How it's proven:</strong> each claim is a rule in the code, checked by 14 automated tests on every
          change. <a href="https://github.com/jkelleman/workstation-guidance-system#readme">See the code and tests</a>
        </p>

        <p className="concept-page">
          <span className="concept-page-label">{note.label}</span>
          {note.text}
        </p>
      </div>
    </section>
  );
}
