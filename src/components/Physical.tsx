import { BIN_COLS, BIN_ROWS, BIN_STOCK, TOTE_ORDERS, TOTE_SLOTS, type PickTask } from '../data/tasks';
import type { SignalSet, TowerColor } from '../machine/signals';
import { DriveUnit, ItemIcon, Pod } from './Illustrations';

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
    <figure className="tower" aria-label={`Stack light: ${signal.towerLabel || 'off'}`}>
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
        <span className="tower-kind">Stack light · </span>
        <span className={`tower-label sev-${signal.severity}`}>{signal.towerLabel || 'Off'}</span>
        <span className="muted"> · {signal.pattern === 'fast' ? 'fast blink' : signal.pattern === 'slow' ? 'slow blink' : 'steady'}</span>
      </figcaption>
    </figure>
  );
}

/** The robot-carried shelf. The lit bin is where the item is. */
export function PodBins({ signal, coverClosed, camera }: { signal: SignalSet; coverClosed?: boolean; camera?: boolean }) {
  const motion = signal.key === 'working.podArriving' ? 'arriving' : signal.key === 'working.exception.podLate' ? 'stalled' : 'docked';
  return (
    <figure className={`pod pod-${motion}`} aria-label={`Pod${signal.litBin ? `, bin ${signal.litBin} lit` : ''}. ${motion === 'docked' ? 'Docked at the station' : motion === 'arriving' ? 'Drive unit arriving' : 'Pod is late, station starved'}.`}>
      <p className="touch-title">Pod <span>mobile storage shelf, never shipped</span></p>
      {camera && signal.litBin && (
        <p className="cam-chip"><span className="cam-dot" aria-hidden="true" />Camera watching bin {signal.litBin}</p>
      )}
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
        <div className={`pod-cover ${coverClosed ? 'closed' : ''}`} aria-hidden="true"><span>Safety cover closed</span></div>
      </div>
      <svg className="pod-robot" viewBox="0 0 120 40" aria-hidden="true"><DriveUnit x={4} y={2} w={112} /></svg>
      </div>
      <figcaption>{motion === 'arriving' ? 'Drive unit bringing the pod…' : motion === 'stalled' ? 'Pod is late: station starved' : signal.litBin ? `Pick-to-light: bin ${signal.litBin}` : 'Pod docked'}</figcaption>
    </figure>
  );
}

/** Customer order totes. The lit tote is where the item goes; its button confirms the put. */
export function ToteWall({ signal, task, justPut, onPress }: { signal: SignalSet; task?: PickTask; justPut?: boolean; onPress?: (slot: string) => void }) {
  return (
    <figure className="totes" aria-label="Put wall of customer order totes">
      <p className="touch-title">Put wall <span>order totes that ship</span></p>
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
      <figcaption>{signal.litTote ? `Put-to-light: tote ${signal.litTote}. Press its button to confirm.` : 'Waiting for the next pick'}</figcaption>
    </figure>
  );
}

/** Plain-language key: what moves, what ships, what stays. */
export function WhatsWhat() {
  return (
    <ul className="whats" aria-label="What's what">
      <li>
        <svg viewBox="0 0 44 40" aria-hidden="true"><Pod x={8} y={0} w={28} lit={null} /><DriveUnit x={8} y={28} w={28} /></svg>
        <span><strong>Pod + drive unit</strong> A mobile shelf of bins and the AMR that carries it. Returns to storage.</span>
      </li>
      <li>
        <svg viewBox="0 0 40 40" aria-hidden="true"><ItemIcon kind="bottle" /></svg>
        <span><strong>Item (SKU)</strong> The product you pick. This is what ships.</span>
      </li>
      <li>
        <svg viewBox="0 0 44 40" aria-hidden="true"><path d="M2 12 h40 l-4 24 h-32z" fill="#5b636b" /><rect x="14" y="5" width="16" height="4" rx="2" fill="#1f9d55" /></svg>
        <span><strong>Order tote</strong> One customer order. Goes to packing when complete.</span>
      </li>
      <li>
        <svg viewBox="0 0 44 40" aria-hidden="true"><rect x="8" y="4" width="28" height="30" rx="2" fill="#e6eaee" stroke="#9aa5b0" strokeWidth="1.5" /><rect x="8" y="4" width="28" height="18" rx="2" fill="#5b6670" opacity=".55" /><path d="M8 22 h28" stroke="#323b44" strokeWidth="2" /></svg>
        <span><strong>Safety cover</strong> Slides shut over the pod opening while the pod moves or the station is stopped.</span>
      </li>
    </ul>
  );
}
