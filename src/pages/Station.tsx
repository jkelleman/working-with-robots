import { useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { stationMachine, currentTask, type EscalationReason, type StationEvent } from '../machine/stationMachine';
import { signalFor, stateKey, type VerifyMode } from '../machine/signals';
import ErgoView from '../components/ErgoView';
import { LightTower, PodBins, ToteWall } from '../components/Physical';
import { playTone, speak, vibrate } from '../audio';
import More from '../components/More';
import ConceptBanner from '../components/ConceptBanner';
import HowItWorks from '../components/HowItWorks';
import { ItemIcon } from '../components/Illustrations';
import { TOTE_ORDERS } from '../data/tasks';
import { SAMPLE_TASKS } from '../data/tasks';
import { HAPPY_PATH, SCENARIOS, stepFor, type Scenario, type StepId } from '../data/scenarios';
import { NARRATION, WHAT_IF } from '../data/narration';

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
  // Timing uses the frame timestamp rAF passes in. The first frame sets the start.
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
  const [snapshot, send, actorRef] = useMachine(stationMachine);
  const [escalating, setEscalating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [verify, setVerifyState] = useState<VerifyMode>(() => {
    try { return localStorage.getItem('wgs-verify') === 'camera' ? 'camera' : 'scan'; } catch { return 'scan'; }
  });
  const setVerify = (v: VerifyMode) => { setVerifyState(v); try { localStorage.setItem('wgs-verify', v); } catch { /* storage unavailable */ } };
  const ctx = snapshot.context;
  const task = currentTask(ctx);
  const key = stateKey(snapshot.value);
  const signal = signalFor(key, task, verify);
  const isStop = key.startsWith('safetyStop');
  const inException = key.startsWith('working.exception');
  const offPath = inException || isStop || key === 'working.escalated';
  const step = stepFor(key);
  const stepIdx = step ? HAPPY_PATH.findIndex((h) => h.id === step) : -1;
  const n = NARRATION[key] ?? NARRATION.idle;

  // ---- Navigation: rebuild any point in the wave from a fresh shift.
  const STEP_EVENTS: Record<StepId, (sku: string) => StationEvent[]> = {
    arrive: () => [],
    pick: () => [{ type: 'POD_ARRIVED' }],
    put: (sku) => [{ type: 'POD_ARRIVED' }, { type: 'SCAN', sku }],
    done: (sku) => [{ type: 'POD_ARRIVED' }, { type: 'SCAN', sku }, { type: 'PUT_CONFIRMED' }],
  };
  const replayTo = (taskIdx: number, to: StepId) => {
    send({ type: 'RESET' });
    send({ type: 'START' });
    SAMPLE_TASKS.slice(0, taskIdx).forEach((t) => {
      [...STEP_EVENTS.done(t.sku), { type: 'NEXT' } as StationEvent].forEach((e) => send(e));
    });
    STEP_EVENTS[to](SAMPLE_TASKS[taskIdx].sku).forEach((e) => send(e));
  };
  const taskIdx = Math.min(ctx.index, SAMPLE_TASKS.length - 1);

  /** The one expected action from here: the happy path, or the primary recovery. */
  const nextAction: { label: string; run: () => void } | null = (() => {
    switch (key) {
      case 'idle': return { label: 'Start shift', run: () => send({ type: 'START' }) };
      case 'working.podArriving': return { label: 'Pod docks', run: () => send({ type: 'POD_ARRIVED' }) };
      case 'working.pick': return { label: 'Pick the item', run: () => send({ type: 'SCAN', sku: task!.sku }) };
      case 'working.put': return { label: 'Put to the tote', run: () => send({ type: 'PUT_CONFIRMED' }) };
      case 'working.confirm': return { label: 'Next pick', run: () => send({ type: 'NEXT' }) };
      case 'done': return { label: 'New wave', run: () => send({ type: 'RESET' }) };
      case 'working.exception.podLate': return { label: 'Pod arrives', run: () => send({ type: 'POD_ARRIVED' }) };
      case 'working.exception.scannerFault': return { label: 'Key in item', run: () => send({ type: 'MANUAL_VERIFY' }) };
      case 'working.escalated': return { label: 'Problem Solve clears it', run: () => send({ type: 'LEAD_CLEARED' }) };
      case 'safetyStop.halted': return { label: 'Area is clear', run: () => send({ type: 'AREA_CLEAR_CONFIRMED' }) };
      case 'safetyStop.readyToResume': return null; // resuming is a deliberate press-and-hold on the screen
      default: return inException ? { label: 'Recover', run: () => send({ type: 'RESOLVE' }) } : null;
    }
  })();

  const goBack = () => {
    setPlaying(false);
    if (offPath && step) return replayTo(taskIdx, step);
    if (offPath) return replayTo(taskIdx, 'pick');
    if (key === 'done') return replayTo(SAMPLE_TASKS.length - 1, 'done');
    if (stepIdx > 0) return replayTo(taskIdx, HAPPY_PATH[stepIdx - 1].id);
    if (stepIdx === 0 && taskIdx > 0) return replayTo(taskIdx - 1, 'done');
    send({ type: 'RESET' });
  };
  const restart = () => { setPlaying(false); send({ type: 'RESET' }); };
  const jumpToStep = (id: StepId) => { setPlaying(false); replayTo(key === 'done' ? 0 : taskIdx, id); };
  const runScenario = (s: Scenario) => {
    setPlaying(false);
    const trigger = s.events[s.events.length - 1];
    if (s.kind === 'safety' && key.startsWith('working') && !inException) { send(trigger); return; }
    const at: StepId = s.at === 'any' ? 'put' : s.at;
    replayTo(key === 'done' ? 0 : taskIdx, at);
    send(trigger);
  };

  // ---- Play: the user sets the pace, and play stops at anything off the happy path.
  const nextRef = useRef(nextAction);
  useEffect(() => { nextRef.current = nextAction; });
  const isPlaying = playing && !offPath && key !== 'done';
  const lastPick = ctx.index >= SAMPLE_TASKS.length - 1;
  useEffect(() => {
    if (!isPlaying) return;
    const t = window.setTimeout(() => {
      if (key === 'working.confirm' && lastPick) setPlaying(false);
      nextRef.current?.run();
    }, key === 'idle' ? 300 : 1700);
    return () => clearTimeout(t);
  }, [isPlaying, key, lastPick]);

  // ---- Guided exploration: remember what's been seen, then suggest what to try next.
  const [explored, setExplored] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const sub = actorRef.subscribe((snap) => {
      const k = stateKey(snap.value);
      const hit = SCENARIOS.find((s) => s.state === k || (s.kind === 'safety' && k.startsWith('safetyStop')));
      if (hit) setExplored((prev) => (prev.has(hit.id) ? prev : new Set(prev).add(hit.id)));
    });
    return () => sub.unsubscribe();
  }, [actorRef]);
  const activeId = SCENARIOS.find((s) => s.state === key || (s.kind === 'safety' && isStop))?.id;
  const suggested = SCENARIOS.find((s) => !explored.has(s.id) && s.id !== activeId && (s.at === step || s.at === 'any'))?.id
    ?? SCENARIOS.find((s) => !explored.has(s.id) && s.id !== activeId)?.id;
  const exploredCount = SCENARIOS.filter((s) => explored.has(s.id)).length;

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
            <button className="btn btn-primary" onClick={() => send({ type: 'SCAN', sku: task!.sku })}>{verify === 'camera' ? 'Lift item (camera confirms)' : 'Scan item'}</button>
            <button className="btn" onClick={() => send({ type: 'REPORT_MISSING' })}>Short pick</button>
            <button className="btn" onClick={() => send({ type: 'REPORT_DAMAGED' })}>Damaged item</button>
          </>
        );
      case 'working.put':
        return (
          <>
            <button className="btn btn-primary" onClick={() => send({ type: 'PUT_CONFIRMED' })}>Press tote {task?.tote} light</button>
            <button className="btn" onClick={() => send({ type: 'TOTE_FULL' })}>Tote is full</button>
          </>
        );
      case 'working.confirm':
        return <button className="btn btn-primary" onClick={() => send({ type: 'NEXT' })}>Next pick</button>;
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
        return <button className="btn btn-primary" onClick={() => send({ type: 'AREA_CLEAR_CONFIRMED' })}>I’ve checked, area is clear</button>;
      case 'safetyStop.readyToResume':
        return <HoldButton label="Resume" onComplete={() => send({ type: 'RESUME' })} />;
      case 'done':
        return <button className="btn" onClick={() => send({ type: 'RESET' })}>Start a new wave</button>;
      default:
        return null;
    }
  })();

  const TONE: Record<string, string> = { none: 'Silent', confirm: 'Two rising notes', attention: 'Two even tones', stop: 'Three low pulses' };
  const pulses = signal.vibrate ? signal.vibrate.filter((_, i) => i % 2 === 0).length : 0;
  const channels: Array<[string, string]> = [
    ['Screen', signal.headline || 'Blank'],
    ['Stack light', signal.towerLabel ? `${signal.towerLabel}, ${signal.pattern === 'steady' ? 'steady' : `${signal.pattern} blink`}` : 'Off'],
    ['Pick-to-light', signal.litBin ? `Bin ${signal.litBin}` : 'Off'],
    ['Put-to-light', signal.litTote ? `Tote ${signal.litTote}` : 'Off'],
    ['Sound', TONE[signal.tone] ?? 'Silent'],
    ['Vibration', pulses ? `${pulses} pulse${pulses > 1 ? 's' : ''}` : 'None'],
  ];

  const hint = key === 'working.pick' ? 'Tap the lit bin to pick, or use the screen.'
    : key === 'working.put' ? 'Tap the lit tote to put, or use the screen.'
    : key === 'idle' ? 'Press Play, or start the shift on the screen.'
    : offPath ? 'Recover on the screen, or press Next.'
    : 'Press Next, or let it play.';

  const coverClosed = key === 'idle' || key === 'working.podArriving' || key === 'working.exception.podLate' || key === 'working.confirm' || key === 'done' || isStop;
  const scenarioFor = (s: Scenario) => (s.at === 'any' ? 'Any step' : HAPPY_PATH.find((h) => h.id === s.at)!.label);

  return (
    <>
    <ConceptBanner />
    <div className={`stage-wrap ${prefs.leftHanded ? 'left-handed' : ''}`}>
      <div className="stage">
        {/* One station: everything Maya sees, in one place */}
        <section className="scene" aria-label="Pick station">
          <div className="scene-toolbar">
            <span className="scene-label">Station 14 · Night shift</span>
            <div className="seg" role="radiogroup" aria-label="Confirm picks by">
              <button type="button" role="radio" aria-checked={verify === 'scan'} className={verify === 'scan' ? 'on' : ''} onClick={() => setVerify('scan')}>Handheld scan</button>
              <button type="button" role="radio" aria-checked={verify === 'camera'} className={verify === 'camera' ? 'on' : ''} onClick={() => setVerify('camera')}>Overhead camera</button>
            </div>
          </div>

          <div className="rig">
            <div className="rig-light"><LightTower signal={signal} colorSafe={prefs.colorSafe} /></div>

            {/* Pick station screen (1280×800 target) */}
            <section className={`screen rig-screen sev-${signal.severity} ${isStop ? 'screen-stop' : ''}`} aria-live="assertive" aria-atomic="true">
              <header className="screen-top">
                <span>Maya · Night shift</span>
                <span>{key === 'done' ? `Wave complete · ${ctx.completed} picked · ${ctx.skipped} skipped` : `Pick ${pickNo} of ${ctx.tasks.length}`}</span>
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
                    <legend>Andon: what’s the problem?</legend>
                    {REASONS.map((r) => (
                      <button key={r} className="btn" onClick={() => send({ type: 'ESCALATE', reason: r })}>{r}</button>
                    ))}
                  </fieldset>
                )}
              </div>
            </section>

            <div className="rig-pod">
              <PodBins
                signal={signal}
                camera={verify === 'camera'}
                coverClosed={coverClosed}
                onBinPress={key === 'working.pick' ? (bin) => send({ type: 'SCAN', sku: bin === task?.bin ? task!.sku : 'SKU-99999' }) : undefined}
              />
            </div>
            <div className="rig-totes">
              <ToteWall
                signal={signal}
                task={task}
                justPut={key === 'working.confirm'}
                onPress={(slot) => { if (key === 'working.put' && slot === task?.tote) send({ type: 'PUT_CONFIRMED' }); }}
              />
            </div>
          </div>
          <p className="scene-hint">{hint}</p>
        </section>

        {/* Narration: what's happening, and why it's designed this way */}
        <aside className={`narrate ${offPath ? 'narrate-off' : ''} ${isStop ? 'narrate-stop' : ''}`} aria-live="polite">
          <p className="narrate-step">
            {offPath ? `What if · ${SCENARIOS.find((s) => s.id === activeId)?.label ?? 'Andon'}` : step ? `Step ${stepIdx + 1} of 4` : key === 'done' ? 'Done' : 'Ready'}
          </p>
          <h2 className="narrate-title">{n.title}</h2>
          <p className="narrate-happening">{n.happening}</p>
          <div className="narrate-why">
            <h3>Why I designed it this way</h3>
            <p>{n.why}</p>
          </div>
          <More label="What every channel is doing" hint="Screen, lights, sound, vibration" className="more-compact">
            <dl className="channels">
              {channels.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </More>
          {offPath && step && (
            <button className="btn btn-sm narrate-back" onClick={() => { setPlaying(false); replayTo(taskIdx, step); }}>← Back to the happy path</button>
          )}
        </aside>
      </div>

      {/* Timeline: the user sets the pace */}
      <div className="timeline" role="group" aria-label="Timeline controls">
        <div className="tl-controls">
          <button className="tl-btn" onClick={restart} aria-label="Restart" title="Restart">⟲</button>
          <button className="tl-btn" onClick={goBack} disabled={key === 'idle'} aria-label="Back" title="Back">◀</button>
          <button className="tl-btn tl-play" onClick={() => setPlaying(!isPlaying)} disabled={offPath || key === 'done'} aria-label={isPlaying ? 'Pause' : 'Play'} aria-pressed={isPlaying}>
            {isPlaying ? '❚❚' : '▶'}<span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button className="tl-btn tl-next" onClick={() => { setPlaying(false); nextAction?.run(); }} disabled={!nextAction}>
            <span>Next</span><span className="tl-next-what">{nextAction?.label ?? 'Hold Resume on screen'}</span>
          </button>
        </div>
        <ol className="tl-track" aria-label="The four steps of every pick">
          {HAPPY_PATH.map((h, i) => {
            const st = key === 'done' || (stepIdx > i) ? 'past' : stepIdx === i ? (offPath ? 'branched' : 'current') : 'todo';
            return (
              <li key={h.id} className={`tl-step tl-${st}`}>
                <button onClick={() => jumpToStep(h.id)} aria-current={st === 'current' ? 'step' : undefined}>
                  <span className="tl-dot" aria-hidden="true">{st === 'past' ? '✓' : i + 1}</span>
                  <span className="tl-label">{h.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <section className="whatif" aria-labelledby="whatif-h">
        <div className="whatif-head">
          <h2 id="whatif-h">What if…</h2>
          <span className="whatif-progress" aria-live="polite">{exploredCount} of {SCENARIOS.length} explored</span>
        </div>
        <ul className="whatif-list">
          {SCENARIOS.map((s) => {
            const here = s.at === step || s.at === 'any';
            return (
              <li key={s.id}>
                <button
                  className={`wi-chip wi-${s.kind} ${activeId === s.id ? 'is-active' : ''} ${explored.has(s.id) ? 'is-explored' : ''} ${suggested === s.id ? 'is-suggested' : ''} ${here ? 'is-here' : ''}`}
                  onClick={() => runScenario(s)}
                  aria-pressed={activeId === s.id}
                >
                  <span className={s.kind === 'safety' ? 'sm-oct' : 'sm-tri'} aria-hidden="true" />
                  <span className="wi-text">
                    <strong>…{WHAT_IF[s.id]}</strong>
                    <span>{s.label} · {scenarioFor(s)}</span>
                  </span>
                  {explored.has(s.id) && <span className="wi-done" aria-label="explored">✓</span>}
                  {suggested === s.id && !explored.has(s.id) && <span className="try-tag">Try</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="stage-more">
        <More label="Body and reach" hint="Where each pick lands on Maya’s body">
          <ErgoView task={task} active={key === 'working.pick' || key === 'working.put' || (key.startsWith('working.exception') && key !== 'working.exception.podLate')} />
        </More>
        <More label="Free play: simulate the floor" hint="Trigger events Maya doesn’t control">
          <div className="sim-groups">
            <div className="sim-group">
              <span className="sim-group-label">Drive units &amp; WES</span>
              <button className="btn btn-sm" disabled={key !== 'working.podArriving' && key !== 'working.exception.podLate'} onClick={() => send({ type: 'POD_ARRIVED' })}>Pod arrives</button>
              <button className="btn btn-sm" disabled={key !== 'working.podArriving'} onClick={() => send({ type: 'POD_TIMEOUT' })}>Pod runs late</button>
            </div>
            <div className="sim-group">
              <span className="sim-group-label">Associate error</span>
              <button className="btn btn-sm" disabled={key !== 'working.pick'} onClick={() => send({ type: 'SCAN', sku: 'SKU-99999' })}>{verify === 'camera' ? 'Mispick (hand in wrong bin)' : 'Mispick (wrong scan)'}</button>
            </div>
            <div className="sim-group">
              <span className="sim-group-label">Equipment</span>
              <button className="btn btn-sm" disabled={key !== 'working.pick'} onClick={() => send({ type: 'SCANNER_FAULT' })}>{verify === 'camera' ? 'Camera can’t see item' : 'Scanner fault'}</button>
            </div>
            <div className="sim-group">
              <span className="sim-group-label">Problem Solve</span>
              <button className="btn btn-sm" disabled={key !== 'working.escalated'} onClick={() => send({ type: 'LEAD_CLEARED' })}>Clears the andon</button>
            </div>
            <div className="sim-group">
              <span className="sim-group-label">Safety</span>
              <button className="btn btn-sm btn-danger" disabled={!key.startsWith('working')} onClick={() => send({ type: 'LIGHT_CURTAIN_BROKEN' })}>Trip light curtain</button>
            </div>
          </div>
          <p className="muted small">Grey means that event can’t happen in the current step.</p>
        </More>
        <More label={`Exception log (${ctx.log.length})`} hint="What the WES would record">
          <ol className="log">
            {ctx.log.map((l, i) => (
              <li key={i}><code>{l.taskId}</code> {LOG_LABELS[l.type] ?? l.type}{l.detail ? ` · ${l.detail}` : ''}</li>
            ))}
          </ol>
          <p className="muted small">Machine state, for engineers: <code>{key}</code></p>
        </More>
        <HowItWorks />
      </div>
    </div>
    </>
  );
}
