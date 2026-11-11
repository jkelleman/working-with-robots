import { useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { stationMachine, currentTask, type EscalationReason } from '../machine/stationMachine';
import { signalFor, stateKey } from '../machine/signals';
import { LightTower, PodBins, ToteWall, WhatsWhat } from '../components/Physical';
import { playTone, speak, vibrate } from '../audio';
import ScenarioMap from '../components/ScenarioMap';
import ScenarioDock from '../components/ScenarioDock';
import ConceptBanner from '../components/ConceptBanner';
import HowItWorks from '../components/HowItWorks';
import { ItemIcon } from '../components/Illustrations';
import { TOTE_ORDERS } from '../data/tasks';
import { SAMPLE_TASKS } from '../data/tasks';
import type { Scenario } from '../data/scenarios';

export interface A11yPrefs {
  highContrast: boolean;
  largeText: boolean;
  audioGuidance: boolean;
  colorSafe: boolean;
  leftHanded: boolean;
  reducedSound: boolean;
}

const REASONS: EscalationReason[] = [
  'Item not in bin after recount',
  'Damage needs inspection',
  'Equipment fault',
  'Safety concern',
  'Other',
];

/** Press-and-hold button: prevents an accidental resume after a safety stop. */
function HoldButton({ label, onComplete, ms = 1500 }: { label: string; onComplete: () => void; ms?: number }) {
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);
  const startAt = useRef(0);
  const stop = () => {
    if (timer.current) cancelAnimationFrame(timer.current);
    timer.current = null;
    setProgress(0);
  };
  // Timing uses the frame timestamp rAF passes in; the first frame sets the start.
  const tick = (now: number) => {
    if (startAt.current === 0) startAt.current = now;
    const p = Math.min(1, (now - startAt.current) / ms);
    setProgress(p);
    if (p >= 1) { stop(); onComplete(); return; }
    timer.current = requestAnimationFrame(tick);
  };
  const begin = () => { startAt.current = 0; timer.current = requestAnimationFrame(tick); };
  return (
    <button
      type="button"
      className="btn btn-primary btn-hold"
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !timer.current) begin(); }}
      onKeyUp={stop}
      aria-label={`${label}. Press and hold.`}
    >
      <span className="hold-fill" style={{ width: `${progress * 100}%` }} />
      <span className="hold-label">{label} (hold)</span>
    </button>
  );
}

export default function Station({ prefs }: { prefs: A11yPrefs }) {
  const [snapshot, send] = useMachine(stationMachine);
  const [escalating, setEscalating] = useState(false);
  const ctx = snapshot.context;
  const task = currentTask(ctx);
  const key = stateKey(snapshot.value);
  const signal = signalFor(key, task);
  const isStop = key.startsWith('safetyStop');
  const inException = key.startsWith('working.exception');

  // Fire sound, haptics and speech once per state change.
  // Scenario map: jump to a scenario from a fresh shift, or auto-play the happy path.
  const timers = useRef<number[]>([]);
  const clearTimers = () => { timers.current.forEach((t) => clearTimeout(t)); timers.current = []; };
  useEffect(() => clearTimers, []);
  // On narrow screens the station sits below the map, so bring it into view.
  const screenRef = useRef<HTMLElement>(null);
  const showStation = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      screenRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };
  const runScenario = (s: Scenario) => {
    clearTimers();
    send({ type: 'RESET' });
    send({ type: 'START' });
    s.events.forEach((e) => send(e));
    showStation();
  };
  const playHappyPath = () => {
    clearTimers();
    send({ type: 'RESET' });
    send({ type: 'START' });
    const steps = [
      () => send({ type: 'POD_ARRIVED' }),
      () => send({ type: 'SCAN', sku: SAMPLE_TASKS[0].sku }),
      () => send({ type: 'PUT_CONFIRMED' }),
    ];
    steps.forEach((fn, i) => timers.current.push(window.setTimeout(fn, 1600 * (i + 1))));
    showStation();
  };

  const lastKey = useRef<string>('');
  useEffect(() => {
    if (lastKey.current === key) return;
    lastKey.current = key;
    setEscalating(false);
    playTone(signal.tone, { reduced: prefs.reducedSound });
    vibrate(signal.vibrate);
    if (prefs.audioGuidance) speak(`${signal.headline}. ${signal.instruction}`);
  }, [key, signal, prefs.reducedSound, prefs.audioGuidance]);

  const progress = `${Math.min(ctx.index + (key === 'done' ? 0 : 1), ctx.tasks.length)} of ${ctx.tasks.length}`;

  const actions = (() => {
    switch (key) {
      case 'idle':
        return <button className="btn btn-primary" onClick={() => send({ type: 'START' })}>Start shift</button>;
      case 'working.pick':
        return (
          <>
            <button className="btn btn-primary" onClick={() => send({ type: 'SCAN', sku: task!.sku })}>Scan item</button>
            <button className="btn" onClick={() => send({ type: 'REPORT_MISSING' })}>Short pick</button>
            <button className="btn" onClick={() => send({ type: 'REPORT_DAMAGED' })}>Damaged item</button>
          </>
        );
      case 'working.put':
        return (
          <>
            <button className="btn btn-primary" onClick={() => send({ type: 'PUT_CONFIRMED' })}>Press tote {task?.tote} button</button>
            <button className="btn" onClick={() => send({ type: 'TOTE_FULL' })}>Tote is full</button>
          </>
        );
      case 'working.confirm':
        return <button className="btn btn-primary" onClick={() => send({ type: 'NEXT' })} autoFocus>Next task</button>;
      case 'working.exception.wrongItem':
        return <button className="btn btn-primary" onClick={() => send({ type: 'RESOLVE' })}>Item returned to bin</button>;
      case 'working.exception.missingItem':
        return <button className="btn btn-primary" onClick={() => send({ type: 'RESOLVE' })}>Flag bin</button>;
      case 'working.exception.damagedItem':
        return <button className="btn btn-primary" onClick={() => send({ type: 'RESOLVE' })}>Done, in damage tote</button>;
      case 'working.exception.scannerFault':
        return <button className="btn btn-primary" onClick={() => send({ type: 'MANUAL_VERIFY' })}>Key in item</button>;
      case 'working.exception.toteFull':
        return <button className="btn btn-primary" onClick={() => send({ type: 'RESOLVE' })}>Tote swapped</button>;
      case 'working.exception.podLate':
        return null;
      case 'working.escalated':
        return <p className="muted">Reason sent: {ctx.escalationReason}</p>;
      case 'safetyStop.halted':
        return <button className="btn btn-primary" onClick={() => send({ type: 'AREA_CLEAR_CONFIRMED' })}>I've checked, area is clear</button>;
      case 'safetyStop.readyToResume':
        return <HoldButton label="Resume" onComplete={() => send({ type: 'RESUME' })} />;
      case 'done':
        return <button className="btn" onClick={() => send({ type: 'RESET' })}>Start a new wave</button>;
      default:
        return null;
    }
  })();

  return (
    <>
    <ConceptBanner />
    <div className={`station ${prefs.leftHanded ? 'left-handed' : ''}`}>
      <aside className="rail" aria-label="Scenario map">
        <ScenarioMap stateKey={key} onHappyPath={playHappyPath} onScenario={runScenario} />
      </aside>
      <ScenarioDock stateKey={key} onHappyPath={playHappyPath} onScenario={runScenario} />

      {/* Workstation touchscreen (1280×800 target) */}
      <section ref={screenRef} className={`screen sev-${signal.severity} ${isStop ? 'screen-stop' : ''}`} aria-live="assertive" aria-atomic="true">
        <header className="screen-top">
          <span>Station 14 · Maya · Night shift</span>
          <span>Task {progress} · Done {ctx.completed} · Skipped {ctx.skipped}</span>
        </header>

        <div className="screen-body">
          {isStop && <div className="stop-badge" aria-hidden="true">STOP</div>}
          <h2 className="headline">{signal.headline}</h2>
          <p className="instruction">{signal.instruction}</p>

          {task && (key === 'working.pick' || key === 'working.put' || inException) && (
            <dl className="task-card">
              <div className="task-item">
                <ItemIcon kind={task.icon} className="task-item-img" />
                <span><dt>Item</dt><dd>{task.itemName}</dd><dd className="task-sku">{task.sku}</dd></span>
              </div>
              <div><dt>Qty</dt><dd className="big">{task.quantity}</dd></div>
              <div><dt>From bin</dt><dd className="big">{task.bin}</dd></div>
              <div><dt>To tote</dt><dd className="big">{task.tote}</dd><dd className="task-sku">Order {TOTE_ORDERS[task.tote]}</dd></div>
            </dl>
          )}

          <div className="actions">{actions}</div>

          {inException && !escalating && (
            <button className="btn btn-link" onClick={() => setEscalating(true)}>Still stuck? Pull the andon</button>
          )}
          {inException && escalating && (
            <fieldset className="escalate">
              <legend>Andon: what's the problem?</legend>
              {REASONS.map((r) => (
                <button key={r} className="btn" onClick={() => send({ type: 'ESCALATE', reason: r })}>{r}</button>
              ))}
            </fieldset>
          )}
        </div>
      </section>

      {/* Physical touchpoints */}
      <section className="physical" aria-label="Physical touchpoints">
        <LightTower signal={signal} colorSafe={prefs.colorSafe} />
        <PodBins signal={signal} />
        <ToteWall
          signal={signal}
          task={task}
          justPut={key === 'working.confirm'}
          onPress={(slot) => { if (key === 'working.put' && slot === task?.tote) send({ type: 'PUT_CONFIRMED' }); }}
        />
        <WhatsWhat />
      </section>

      {/* Simulation controls: things that happen on the floor, not worker actions */}
      <section className="sim" aria-label="Simulate floor events">
        <h3>Simulate floor events</h3>
        <div className="sim-grid">
          <button className="btn btn-sm" disabled={key !== 'working.podArriving' && key !== 'working.exception.podLate'} onClick={() => send({ type: 'POD_ARRIVED' })}>Pod arrives</button>
          <button className="btn btn-sm" disabled={key !== 'working.podArriving'} onClick={() => send({ type: 'POD_TIMEOUT' })}>Pod runs late</button>
          <button className="btn btn-sm" disabled={key !== 'working.pick'} onClick={() => send({ type: 'SCAN', sku: 'SKU-99999' })}>Scan wrong item</button>
          <button className="btn btn-sm" disabled={key !== 'working.pick'} onClick={() => send({ type: 'SCANNER_FAULT' })}>Scanner fault</button>
          <button className="btn btn-sm" disabled={key !== 'working.escalated'} onClick={() => send({ type: 'LEAD_CLEARED' })}>Problem Solve clears task</button>
          <button className="btn btn-sm btn-danger" disabled={!key.startsWith('working')} onClick={() => send({ type: 'LIGHT_CURTAIN_BROKEN' })}>Trip light curtain</button>
        </div>
        <details>
          <summary>Exception log ({ctx.log.length})</summary>
          <ol className="log">
            {ctx.log.map((l, i) => (
              <li key={i}><code>{l.taskId}</code> {l.type}{l.detail ? ` · ${l.detail}` : ''}</li>
            ))}
          </ol>
        </details>
        <p className="muted small">State: <code>{key}</code></p>
      </section>
      <HowItWorks />
    </div>
    </>
  );
}
