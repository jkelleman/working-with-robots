import { useEffect, useRef } from 'react';

/**
 * Welcome dialog shown on a visitor's first entry. Uses the native <dialog>
 * element: showModal() traps focus, Esc closes it, and focus returns to
 * the element that opened it.
 */

const TERMS: Array<[string, string]> = [
  ['Goods-to-person station', 'A workstation where robots bring shelves of items to a person, instead of the person walking the aisles.'],
  ['Pod', 'The mobile shelf a robot carries to the station. Its face is a grid of bins (A1–D4 here).'],
  ['Pick-to-light', 'A light on the pod that marks which bin to take the item from.'],
  ['Tote and put-to-light', 'Totes are the containers orders go into. A light marks which tote to put the item in, and pressing its button confirms the put.'],
  ['Light tower', 'The stacked beacon above the station. Its color, blink rate, and shape show the station’s status from across the floor.'],
  ['Light curtain', 'An invisible safety beam across the pod opening. Breaking it stops the robots immediately.'],
  ['Exception', 'Anything that interrupts a normal pick: a wrong item, an empty bin, damage, a scanner fault, a full tote, or a late pod.'],
  ['Escalation', 'Calling a lead to the station, with a reason, when the worker can’t recover on their own.'],
  ['State machine', 'A model of every state the station can be in and every allowed move between them. It is the single source of truth for all signals.'],
  ['UPH and cycle time', 'Units picked per hour, and seconds per task. Common measures of station throughput.'],
];

const BUILT_WITH: Array<[string, string]> = [
  ['One state machine', 'Built in XState. Every screen message, light, sound, and vibration is derived from the current state, so the channels can’t disagree.'],
  ['Real multimodal output', 'Tones use the Web Audio API, vibration uses the Vibration API, and spoken guidance uses the Web Speech API.'],
  ['Tested design rules', '14 automated tests (Vitest) check every exception path, that a safety stop overrides every step, and that only the stop uses red.'],
  ['Stack', 'React, TypeScript, and Vite, with Recharts for the metrics. Tests run and the site deploys through GitHub Actions on every change.'],
];

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
          <button type="button" className="intro-x" onClick={onClose} aria-label="Close">×</button>
        </header>

        <section>
          <h3>What this is</h3>
          <p>
            In a robotic fulfillment center, robots carry shelves of products to a person at a station. The person
            picks each item from a lit bin and places it in a lit tote. It’s fast, repetitive work on a loud floor,
            and the hard moments are when something goes wrong.
          </p>
          <p>
            This prototype designs the guidance for that person across the <strong>screen, lights, sound, and
            vibration</strong>, and tests four claims: there is always <strong>one clear next step</strong>, every
            signal <strong>agrees</strong>, <strong>safety overrides everything</strong>, and <strong>color is never
            the only cue</strong>.
          </p>
          <p className="intro-note">Fictional station and synthetic data. Not affiliated with any company.</p>
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
          <h3>How it was built</h3>
          <ul className="intro-built">
            {BUILT_WITH.map(([t, d]) => (
              <li key={t}><strong>{t}.</strong> {d}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>How to explore</h3>
          <ol className="intro-steps">
            <li><strong>Station:</strong> tap Start shift, then Pod arrives. Use “Simulate floor events” to break things.</li>
            <li><strong>Patterns:</strong> the 8 reusable patterns behind the station.</li>
            <li><strong>Metrics:</strong> how you’d measure whether the design works.</li>
          </ol>
        </section>

        <footer className="intro-foot">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>Start exploring</button>
          <span className="muted small">Reopen anytime with About in the header.</span>
        </footer>
      </div>
    </dialog>
  );
}
