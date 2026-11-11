import { useEffect, useRef, useState } from 'react';
import ScenarioMap from './ScenarioMap';
import { HAPPY_PATH, SCENARIOS, stepFor, type Scenario } from '../data/scenarios';

/**
 * Phone view: a slim sticky progress bar that stays visible while you watch
 * the station, plus a bottom sheet with the full scenario map.
 */
export default function ScenarioDock({
  stateKey,
  onHappyPath,
  onScenario,
  suggested = null,
  exploredCount = 0,
  explored,
}: {
  stateKey: string;
  onHappyPath: () => void;
  onScenario: (s: Scenario) => void;
  suggested?: string | null;
  exploredCount?: number;
  explored?: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = sheet.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const step = stepFor(stateKey);
  const idx = HAPPY_PATH.findIndex((s) => s.id === step);
  const active = SCENARIOS.find((s) => s.state === stateKey || (s.kind === 'safety' && stateKey.startsWith('safetyStop')));
  const done = stateKey === 'done';
  const label = done ? 'Wave complete'
    : stateKey.startsWith('safetyStop') ? 'E-stop: work paused'
    : idx >= 0 ? HAPPY_PATH[idx].label
    : stateKey === 'idle' ? 'Ready to start'
    : stateKey === 'working.escalated' ? 'Andon: Problem Solve coming' : '';

  return (
    <>
      <div className="dock">
        <div className="dock-main" role="status" aria-live="polite">
          <div className="dock-bar" aria-hidden="true">
            {HAPPY_PATH.map((s, i) => (
              <span key={s.id} className={`dock-seg ${done || i < idx ? 'past' : i === idx ? (active ? 'branched' : 'current') : ''}`} />
            ))}
          </div>
          <p className="dock-text">
            <span className="dock-step">{stateKey.startsWith('safetyStop') ? 'Safety' : stateKey === 'working.escalated' ? 'Exception' : 'Each pick'}</span>
            <strong>{label}</strong>
          </p>
          {active && (
            <p className={`dock-chip ${active.kind === 'safety' ? 'dock-chip-stop' : ''}`}>
              <span aria-hidden="true" className={active.kind === 'safety' ? 'sm-oct' : 'sm-tri'} />
              <span className="dock-chip-text">{active.label} → {active.outcome}</span>
            </p>
          )}
        </div>
        <button type="button" className="dock-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">Scenarios</button>
        {suggested && (
          <button
            type="button"
            className="dock-next"
            onClick={() => { if (suggested === 'happy') onHappyPath(); else { const s = SCENARIOS.find((x) => x.id === suggested); if (s) onScenario(s); } }}
          >
            <span className="try-tag">{suggested === 'happy' ? 'Start here' : 'Try next'}</span>
            {suggested === 'happy' ? 'Play the happy path' : SCENARIOS.find((x) => x.id === suggested)?.label}
            <span className="dock-next-count">{exploredCount}/{SCENARIOS.length}</span>
          </button>
        )}
      </div>

      <dialog
        ref={sheet}
        className="sheet"
        aria-label="Scenario map"
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === sheet.current) setOpen(false); }}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <button type="button" className="intro-x sheet-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
        <ScenarioMap
          stateKey={stateKey}
          suggested={suggested}
          exploredCount={exploredCount}
          explored={explored}
          onHappyPath={() => { setOpen(false); onHappyPath(); }}
          onScenario={(s) => { setOpen(false); onScenario(s); }}
        />
      </dialog>
    </>
  );
}
