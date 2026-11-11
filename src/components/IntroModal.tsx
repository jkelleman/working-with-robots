import { useEffect, useRef } from 'react';
import { StepIcon } from './Illustrations';

/**
 * Welcome dialog shown on a visitor's first entry. Native <dialog>:
 * showModal() traps focus, Esc closes it, focus returns to the opener.
 */

const STEPS = [
  { kind: 'deliver', title: 'A drive unit brings a pod', text: 'Goods-to-person: no walking aisles.' },
  { kind: 'pick', title: 'Pick from the lit bin', text: 'Pick-to-light. Scan to confirm.' },
  { kind: 'put', title: 'Put to the lit tote', text: 'Put-to-light. The tote ships.' },
] as const;

const TERMS: Array<[string, string]> = [
  ['Goods-to-person (GTP)', 'Robots bring storage to the associate instead of the associate walking the aisles.'],
  ['Pod', 'A mobile shelf of fabric bins holding items. Never shipped.'],
  ['Drive unit (AMR)', 'The low robot that lifts a pod and carries it. AMR = autonomous mobile robot.'],
  ['Pick station', 'Where the associate works: screen, scanner, stack light, put wall.'],
  ['Pick-to-light / put-to-light', 'A light marks which bin to pick from, and which tote to put to.'],
  ['Put wall', 'The rack of order totes. Each tote is one customer order.'],
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
          <p className="intro-eyebrow">Design concept · Goods-to-person (GTP) picking</p>
          <h2 id="intro-title">Workstation Guidance System</h2>
          <p className="intro-sub">How should a pick station guide an associate working alongside drive units, especially when something goes wrong?</p>
          <button type="button" className="intro-x" onClick={onClose} aria-label="Close">×</button>
        </header>

        <section>
          <h3>Use case and scenario</h3>
          <dl className="intro-story">
            <div><dt>Use case</dt><dd>Goods-to-person picking at a robotic pick station.</dd></div>
            <div><dt>Who</dt><dd>Maya, an associate (picker) three weeks into the job, on a 10-hour night shift.</dd></div>
            <div><dt>Tonight</dt><dd>A short pick, a full tote, a scanner fault, and a light curtain trip.</dd></div>
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
          <p className="intro-callout">Seven pain points break Maya’s journey. The scenario map frames each one as a design challenge, and the prototype tests a recovery path for every one.</p>
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
