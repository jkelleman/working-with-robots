import { BIN_COLS, BIN_ROWS, TOTE_SLOTS } from '../data/tasks';
import type { SignalSet, TowerColor } from '../machine/signals';

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

/** Pick-to-light grid on the face of the robot-delivered pod. */
export function PodBins({ signal }: { signal: SignalSet }) {
  return (
    <figure className="pod" aria-label="Storage pod, pick-to-light">
      <div className="pod-grid">
        {BIN_ROWS.map((r) =>
          BIN_COLS.map((c) => {
            const id = `${r}${c}`;
            const lit = signal.litBin === id;
            return (
              <div key={id} className={`bin ${lit ? `lit lit-${signal.binColor ?? 'green'}` : ''}`}>
                {lit && <span className="bin-arrow" aria-hidden="true">▼</span>}
                <span className="bin-id">{id}</span>
              </div>
            );
          }),
        )}
      </div>
      <figcaption>Pod · pick-to-light</figcaption>
    </figure>
  );
}

/** Put-to-light tote wall with a confirm button per slot. */
export function ToteWall({ signal, onPress }: { signal: SignalSet; onPress?: (slot: string) => void }) {
  return (
    <figure className="totes" aria-label="Tote wall, put-to-light">
      <div className="tote-grid">
        {TOTE_SLOTS.map((t) => {
          const lit = signal.litTote === t;
          return (
            <button
              key={t}
              type="button"
              className={`tote ${lit ? 'lit' : ''} ${lit && signal.severity === 'warning' ? 'lit-amber' : ''}`}
              onClick={() => onPress?.(t)}
              aria-label={`Tote ${t}${lit ? ', lit' : ''}`}
            >
              <span className="tote-light" />
              {t}
            </button>
          );
        })}
      </div>
      <figcaption>Tote wall · put-to-light</figcaption>
    </figure>
  );
}
