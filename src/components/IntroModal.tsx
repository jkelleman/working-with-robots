import { useEffect, useRef } from 'react';
import { StepIcon } from './Illustrations';

/**
 * Welcome dialog shown on a visitor's first entry. Native <dialog>:
 * showModal() traps focus, Esc closes it, focus returns to the opener.
 */

const STEPS = [
  { kind: 'deliver', title: 'Robot brings a shelf', text: 'No walking the aisles.' },
  { kind: 'pick', title: 'Pick from the lit bin', text: 'Scan to confirm.' },
  { kind: 'put', title: 'Put in the lit tote', text: 'Press its button. Done.' },
] as const;

const TERMS: Array<[string, string]> = [
  ['Pod', 'The shelf of bins a robot carries.'],
  ['Pick-to-light', 'A light marking which bin to pick from.'],
  ['Put-to-light', 'A light marking which tote to fill.'],
  ['Light tower', 'Stacked beacon showing station status.'],
  ['Light curtain', 'Safety beam; breaking it stops the robots.'],
  ['Exception', 'Anything that interrupts a normal pick.'],
];

const BUILT = ['XState state machine', 'Web Audio · Vibration · Speech APIs', '23 automated tests', 'React + TypeScript', 'GitHub Actions'];

export default function IntroModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="intro"
      aria-labelledby="intro-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="intro-body">
        <header className="intro-head">
          <p className="intro-eyebrow">Design concept · Robotic fulfillment</p>
          <h2 id="intro-title">Workstation Guidance System</h2>
          <p className="intro-sub">How should a station guide someone working alongside robots, especially when something goes wrong?</p>
          <button type="button" className="intro-x" onClick={onClose} aria-label="Close">×</button>
        </header>

        <section>
          <h3>Use case and scenario</h3>
          <dl className="intro-story">
            <div><dt>Use case</dt><dd>Picking customer orders at a robotic fulfillment station.</dd></div>
            <div><dt>Who</dt><dd>Maya, a picker three weeks into the job, on a 10-hour night shift.</dd></div>
            <div><dt>Tonight</dt><dd>An empty bin, a full tote, a jammed scanner, and a hand through the light curtain.</dd></div>
            <div><dt>The test</dt><dd>Does her station always tell her what to do next, safely?</dd></div>
          </dl>
        </section>

        <section>
          <h3>The happy path</h3>
          <ol className="intro-steps">
            {STEPS.map((s, i) => (
              <li key={s.kind}>
                <StepIcon kind={s.kind} />
                <strong><span className="step-num">{i + 1}</span>{s.title}</strong>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
          <p className="intro-callout">Seven things can knock Maya off this path. The scenario map shows each one, and the prototype designs the way back.</p>
        </section>

        <section>
          <h3>Key terms</h3>
          <dl className="intro-terms">
            {TERMS.map(([t, d]) => (
              <div key={t}><dt>{t}</dt><dd>{d}</dd></div>
            ))}
          </dl>
        </section>

        <section>
          <h3>Built with</h3>
          <ul className="intro-built">
            {BUILT.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </section>

        <footer className="intro-foot">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>Start exploring</button>
          <span className="muted small">Fictional station, synthetic data. Reopen with About.</span>
        </footer>
      </div>
    </dialog>
  );
}
