import { useEffect, useRef } from 'react';
import { StepIcon } from './Illustrations';
import More from './More';

/**
 * Welcome dialog shown on a visitor's first entry. Native <dialog>:
 * showModal() traps focus, Esc closes it, focus returns to the opener.
 */

const STEPS = [
  { kind: 'deliver', title: 'A robot brings the products', text: 'A drive unit delivers a pod of bins. No walking the aisles.' },
  { kind: 'pick', title: 'She takes the item', text: 'Pick-to-light marks the bin. She scans to confirm.' },
  { kind: 'put', title: 'She puts it in the order', text: 'Put-to-light marks the order tote. She presses the light.' },
] as const;

const TERMS: Array<[string, string]> = [
  ['Goods-to-person (GTP)', 'Drive units bring inventory to the associate, so no one walks the aisles.'],
  ['Pod', 'A rolling storage tower of fabric bins holding inventory. It never ships. It goes back to the storage field.'],
  ['Bin', 'One fabric compartment in a pod, labeled by row and column (bin B3).'],
  ['Drive unit', 'The low robot that slides under a pod, lifts it, and carries it. A type of AMR (autonomous mobile robot).'],
  ['Pick station', 'Where the associate works: screen, handheld scanner, stack light, put wall.'],
  ['Pick-to-light / put-to-light', 'A light at the bin shows where to pick. A light at the put wall location shows where to put, and pressing it confirms the put.'],
  ['Put wall', 'A wall of locations, each holding one order tote. Each tote is one customer order.'],
  ['Stack light', 'The tower of colored lights showing station status from across the floor.'],
  ['Light curtain', 'An invisible safety beam across the pod opening. A trip stops nearby drive units (an E-stop).'],
  ['Short pick / mispick', 'Short: the bin doesn’t have the item. Mispick: the wrong item was picked.'],
  ['Starved station', 'The associate is ready but the next pod hasn’t arrived.'],
  ['Power zone', 'Mid-thigh to mid-chest: where picks need no reaching or bending.'],
  ['Safety cover', 'A cover that closes over the pod opening while the pod moves.'],
  ['Andon / Problem Solve', 'Andon is the call for help. Problem Solve is the team that answers it.'],
  ['WES and fleet manager', 'Software that decides which pod goes to which station and dispatches the drive units.'],
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
          <p className="intro-eyebrow">Design concept</p>
          <h2 id="intro-title">Workstation Guidance System</h2>
          <p className="intro-sub">A day in the life of a robotic fulfillment center: robots bring products to a person, who picks each customer order by hand. When something goes wrong, what should her station tell her?</p>
          <button type="button" className="intro-x" onClick={onClose} aria-label="Close">×</button>
        </header>

        <section>
          <h3>The story</h3>
          <dl className="intro-story">
            <div><dt>Who</dt><dd>Maya, three weeks into the job, on a 10-hour night shift.</dd></div>
            <div><dt>Her job</dt><dd>Pick products for customer orders, one item at a time, while robots bring the products to her.</dd></div>
            <div><dt>Tonight</dt><dd>An empty bin, a full box, a scanner that won’t read, and a safety stop.</dd></div>
            <div><dt>The test</dt><dd>Does her station always tell her what to do next, safely?</dd></div>
          </dl>
          <p className="intro-lingo">
            <strong>Here’s how that plays out in a fulfillment center:</strong> Maya is a pick associate at a
            goods-to-person (GTP) station. Tonight brings a short pick, a full tote, a scanner fault, and a light curtain trip.
          </p>
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
          <p className="intro-callout">Seven pain points can break Maya’s flow. The scenario map frames each one as a design challenge, and the prototype tests a recovery path for each.</p>
        </section>

        <More label={`Key terms (${TERMS.length})`} hint="Floor vocabulary, in plain words">
          <dl className="intro-terms">
            {TERMS.map(([t, d]) => (
              <div key={t}><dt>{t}</dt><dd>{d}</dd></div>
            ))}
          </dl>
        </More>
        <More label="How it was built">
          <ul className="intro-built">
            {BUILT.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </More>

        <footer className="intro-foot">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>Start exploring</button>
          <span className="muted small">Fictional station, synthetic data. Reopen with About.</span>
        </footer>
      </div>
    </dialog>
  );
}
