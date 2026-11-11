import { BIN_COLS, BIN_ROWS, BIN_STOCK, TOTE_ORDERS, TOTE_SLOTS, type PickTask } from '../data/tasks';
import type { SignalSet, TowerColor } from '../machine/signals';
import { DriveUnit, ItemIcon } from './Illustrations';

const TIERS: TowerColor[] = ['red', 'amber', 'green', 'blue'];

function Shape({ shape }: { shape: SignalSet['shape'] }) {
  const common = { fill: 'currentColor' };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {shape === 'circle' && <circle cx="12" cy="12" r="9" {...common} />}
      {shape === 'triangle' && <polygon points="12,3 22,21 2,21" {...common} />}
      {shape === 'octagon' && <polygon points="8,2 16,2 22,8 22,16 16,22 8,22 2,16 2,8" {...common} />}
      {shape === 'square' && <rect x="4" y="4" width="16" height="16" {...common} />}
    </svg>
  );
}

/** A stacked light tower. The lit tier blinks at a rate that encodes urgency, and carries a shape for color-blind users. */
export function LightTower({ signal, colorSafe }: { signal: SignalSet; colorSafe: boolean }) {
  return (
    <figure className="tower" aria-label={`Light tower: ${signal.towerLabel || 'off'}`}>
      <div className="tower-stack">
        {TIERS.map((t) => {
          const on = signal.tower === t;
          return (
            <div key={t} className={`tier tier-${t} ${on ? `on blink-${signal.pattern}` : ''}`}>
              {on && colorSafe && <Shape shape={signal.shape} />}
            </div>
          );
        })}
        <div className="tower-pole" />
      </div>
      <figcaption>
        <span className={`tower-label sev-${signal.severity}`}>{signal.towerLabel || 'Off'}</span>
        <span className="muted"> · {signal.pattern === 'fast' ? 'fast blink' : signal.pattern === 'slow' ? 'slow blink' : 'steady'}</span>
      </figcaption>
    </figure>
  );
}

/** The robot-carried shelf. The lit bin is where the item is. */
export function PodBins({ signal }: { signal: SignalSet }) {
  const motion = signal.key === 'working.podArriving' ? 'arriving' : signal.key === 'working.exception.podLate' ? 'stalled' : 'docked';
  return (
    <figure className={`pod pod-${motion}`} aria-label={`Shelf brought by robot${signal.litBin ? `, bin ${signal.litBin} lit` : ''}. Robot ${motion === 'docked' ? 'docked at station' : motion === 'arriving' ? 'arriving' : 'delayed'}.`}>
      <p className="touch-title">Shelf <span>brought by robot</span></p>
      <div className="pod-rig">
      <div className="pod-grid">
        {BIN_ROWS.map((r) =>
          BIN_COLS.map((c) => {
            const id = `${r}${c}`;
            const lit = signal.litBin === id;
            return (
              <div key={id} className={`bin ${lit ? `lit lit-${signal.binColor ?? 'green'}` : ''}`}>
                <ItemIcon kind={BIN_STOCK[id]} className="bin-item" />
                <span className="bin-id">{id}</span>
              </div>
            );
          }),
        )}
      </div>
      <svg className="pod-robot" viewBox="0 0 120 40" aria-hidden="true"><DriveUnit x={4} y={2} w={112} /></svg>
      </div>
      <figcaption>{motion === 'arriving' ? 'Robot is bringing the shelf…' : motion === 'stalled' ? 'Robot is running late' : signal.litBin ? `Lit bin ${signal.litBin}: your item is here` : 'Shelf docked'}</figcaption>
    </figure>
  );
}

/** Customer order totes. The lit tote is where the item goes; its button confirms the put. */
export function ToteWall({ signal, task, justPut, onPress }: { signal: SignalSet; task?: PickTask; justPut?: boolean; onPress?: (slot: string) => void }) {
  return (
    <figure className="totes" aria-label="Customer order totes">
      <p className="touch-title">Order totes <span>one per customer</span></p>
      <div className="tote-grid">
        {TOTE_SLOTS.map((t) => {
          const lit = signal.litTote === t;
          return (
            <button
              key={t}
              type="button"
              className={`tote ${lit ? 'lit' : ''} ${lit && signal.severity === 'warning' ? 'lit-amber' : ''}`}
              onClick={() => onPress?.(t)}
              aria-label={`Tote ${t}, order ${TOTE_ORDERS[t]}${lit ? ', lit' : ''}`}
            >
              <span className="tote-light" />
              <span className="tote-id">{t}</span>
              <span className="tote-order">{TOTE_ORDERS[t]}</span>
              {justPut && task?.tote === t && <ItemIcon kind={task.icon} className="tote-item" />}
            </button>
          );
        })}
      </div>
      <figcaption>{signal.litTote ? `Lit tote ${signal.litTote}: put it here, then press its button` : 'Waiting for the next item'}</figcaption>
    </figure>
  );
}
