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

const LOG_LABELS: Record<string, string> = {
  wrongItem: 'Mispick', missingItem: 'Short pick', damagedItem: 'Damaged item', scannerFault: 'Scanner fault',
  toteFull: 'Tote full', podLate: 'Starved station', safetyStop: 'Light curtain trip (E-stop)', escalation: 'Andon pulled',
};

const REASONS: EscalationReason[] = [
  'Short pick after recount',
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
    // Run the whole wave: every pick goes pod arrives → pick → put → complete.
    const steps = SAMPLE_TASKS.flatMap((t) => [
      () => send({ type: 'POD_ARRIVED' }),
      () => send({ type: 'SCAN', sku: t.sku }),
      () => send({ type: 'PUT_CONFIRMED' }),
      () => send({ type: 'NEXT' }),
    ]);
    steps.forEach((fn, i) => timers.current.push(window.setTimeout(fn, 1300 * (i + 1))));
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

  const pickNo = Math.min(ctx.index + 1, ctx.tasks.length);
  const skippedIds = new Set(ctx.log.filter((l) => ['missingItem', 'damagedItem', 'escalation'].includes(l.type)).map((l) => l.taskId));
  const taskStatus = (i: number) =>
    key === 'done' || i < ctx.index ? (skippedIds.has(ctx.tasks[i].id) ? 'skipped' : 'done')
    : i === ctx.index && key !== 'idle' ? 'current' : 'todo';

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
          <span>{key === 'done' ? `Wave complete · ${ctx.completed} picked · ${ctx.skipped} skipped` : `Pick ${pickNo} of ${ctx.tasks.length} in this wave`}</span>
        </header>
        <ol className="wave" aria-label="Picks in this wave">
          {ctx.tasks.map((t, i) => {
            const st = taskStatus(i);
            return (
              <li key={t.id} className={`wave-item wave-${st}`} aria-current={st === 'current' ? 'step' : undefined}>
                <ItemIcon kind={t.icon} className="wave-icon" />
                <span className="wave-name">{t.short[t.quantity === 1 ? 0 : 1]}{t.quantity > 1 ? ` ×${t.quantity}` : ''}</span>
                <span className="wave-mark" aria-label={st}>{st === 'done' ? '✓' : st === 'skipped' ? '–' : ''}</span>
              </li>
            );
          })}
        </ol>

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

      {/* Simulation controls: events outside the associate's control */}
      <section className="sim" aria-labelledby="sim-title">
        <h3 id="sim-title">Simulate the floor</h3>
        <p className="sim-lede">These stand in for everything the associate doesn’t control: the drive units, the WES, equipment, and Problem Solve. Trigger one to see how the station responds.</p>
        <div className="sim-groups">
          <div className="sim-group">
            <span className="sim-group-label">Drive units &amp; WES</span>
            <button className="btn btn-sm" disabled={key !== 'working.podArriving' && key !== 'working.exception.podLate'} onClick={() => send({ type: 'POD_ARRIVED' })}>Pod arrives</button>
            <button className="btn btn-sm" disabled={key !== 'working.podArriving'} onClick={() => send({ type: 'POD_TIMEOUT' })}>Pod runs late</button>
          </div>
          <div className="sim-group">
            <span className="sim-group-label">Associate error</span>
            <button className="btn btn-sm" disabled={key !== 'working.pick'} onClick={() => send({ type: 'SCAN', sku: 'SKU-99999' })}>Mispick (wrong scan)</button>
          </div>
          <div className="sim-group">
            <span className="sim-group-label">Equipment</span>
            <button className="btn btn-sm" disabled={key !== 'working.pick'} onClick={() => send({ type: 'SCANNER_FAULT' })}>Scanner fault</button>
          </div>
          <div className="sim-group">
            <span className="sim-group-label">Problem Solve</span>
            <button className="btn btn-sm" disabled={key !== 'working.escalated'} onClick={() => send({ type: 'LEAD_CLEARED' })}>Clears andon task</button>
          </div>
          <div className="sim-group">
            <span className="sim-group-label">Safety</span>
            <button className="btn btn-sm btn-danger" disabled={!key.startsWith('working')} onClick={() => send({ type: 'LIGHT_CURTAIN_BROKEN' })}>Trip light curtain</button>
          </div>
        </div>
        <p className="sim-hint muted small">Buttons are grey when that event can’t happen in the current step.</p>
        <details>
          <summary>Exception log ({ctx.log.length}) <span className="muted small">what the WES would record</span></summary>
          <ol className="log">
            {ctx.log.map((l, i) => (
              <li key={i}><code>{l.taskId}</code> {LOG_LABELS[l.type] ?? l.type}{l.detail ? ` · ${l.detail}` : ''}</li>
            ))}
          </ol>
        </details>
        <p className="muted small">Machine state, for engineers: <code>{key}</code></p>
      </section>
      <HowItWorks />
    </div>
    </>
  );
}
