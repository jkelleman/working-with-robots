/**
 * Original flat illustrations for the concept. All shapes are drawn here;
 * no third-party artwork. Colors come from the app palette.
 */

const C = {
  navy: '#12263f',
  steel: '#8a96a3',
  steelLight: '#c3ccd5',
  robot: '#e8a317',
  robotDark: '#b97c0a',
  pod: '#c8a46a',
  bin: '#e9d6b0',
  green: '#1f9d55',
  red: '#d42e2e',
  blue: '#2f6fe0',
  skin: '#f2c9a0',
  shirt: '#2f6fe0',
  tote: '#5b636b',
};

/** Low, flat drive-unit robot (the kind that slides under a shelf and lifts it). */
export function DriveUnit({ x = 0, y = 0, w = 120 }: { x?: number; y?: number; w?: number }) {
  const h = w * 0.28;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={h * 0.35} fill={C.robot} />
      <rect x={w * 0.06} y={h * 0.18} width={w * 0.88} height={h * 0.22} rx={h * 0.1} fill={C.robotDark} opacity={0.5} />
      <circle cx={w * 0.12} cy={h * 0.62} r={h * 0.12} fill="#fff" />
      <circle cx={w * 0.12} cy={h * 0.62} r={h * 0.06} fill={C.navy} />
      <circle cx={w * 0.22} cy={h} r={h * 0.2} fill={C.navy} />
      <circle cx={w * 0.78} cy={h} r={h * 0.2} fill={C.navy} />
    </g>
  );
}

/** Shelf pod: a grid of bins on legs, optionally with one lit bin. */
export function Pod({ x = 0, y = 0, w = 120, lit = [1, 2] }: { x?: number; y?: number; w?: number; lit?: [number, number] | null }) {
  const cols = 4, rows = 4, pad = w * 0.04;
  const cw = (w - pad * 2) / cols;
  const ch = cw * 0.78;
  const gridH = ch * rows + pad * 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={gridH} rx={3} fill={C.pod} />
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const on = lit && lit[0] === r && lit[1] === c;
        return (
          <rect key={i} x={pad + c * cw + 1.5} y={pad + r * ch + 1.5} width={cw - 3} height={ch - 3} rx={1.5}
            fill={on ? C.green : C.bin} />
        );
      })}
      <rect x={w * 0.08} y={gridH} width={w * 0.06} height={w * 0.1} fill={C.steel} />
      <rect x={w * 0.86} y={gridH} width={w * 0.06} height={w * 0.1} fill={C.steel} />
    </g>
  );
}

function LightTowerArt({ x, y, active = 'green' }: { x: number; y: number; active?: 'green' | 'amber' | 'red' }) {
  const tiers: Array<['red' | 'amber' | 'green' | 'blue', string]> = [['red', C.red], ['amber', '#e8a317'], ['green', C.green], ['blue', C.blue]];
  return (
    <g transform={`translate(${x} ${y})`}>
      {tiers.map(([k, col], i) => (
        <rect key={k} x={0} y={i * 13} width={18} height={11} rx={2} fill={col} opacity={k === active ? 1 : 0.22} />
      ))}
      <rect x={7} y={52} width={4} height={40} fill={C.steel} />
    </g>
  );
}

function Worker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={20} cy={12} r={11} fill={C.skin} />
      <path d="M8 10 a12 12 0 0 1 24 0 v-2 a12 12 0 0 0 -24 0z" fill={C.navy} />
      <path d="M4 30 q16 -8 32 0 v44 h-32z" fill={C.shirt} />
      <path d="M34 34 l22 10" stroke={C.shirt} strokeWidth={9} strokeLinecap="round" />
      <circle cx={58} cy={45} r={4.5} fill={C.skin} />
      <rect x={8} y={74} width={9} height={30} fill={C.navy} />
      <rect x={23} y={74} width={9} height={30} fill={C.navy} />
    </g>
  );
}

function Tote({ x, y, lit = false }: { x: number; y: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 h40 l-4 24 h-32z" fill={C.tote} />
      <rect x={10} y={-6} width={20} height={4} rx={2} fill={lit ? C.green : C.steelLight} />
    </g>
  );
}

/** Hero scene: robot carries a pod to the station, worker picks from the lit bin. */
export function StationScene({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 190" role="img"
      aria-label="Illustration: a robot carries a shelf of bins to a workstation, where a worker picks from a lit bin.">
      <rect x={0} y={170} width={360} height={4} rx={2} fill={C.steel} opacity={0.5} />
      {/* motion trail */}
      <g opacity={0.35} stroke={C.steelLight} strokeWidth={3} strokeLinecap="round">
        <line x1={4} y1={150} x2={30} y2={150} />
        <line x1={14} y1={160} x2={34} y2={160} />
      </g>
      <g className="scene-robot">
        <Pod x={40} y={36} w={110} lit={[1, 2]} />
        <DriveUnit x={44} y={140} w={102} />
      </g>
      {/* station: screen on a stand */}
      <rect x={190} y={70} width={70} height={46} rx={5} fill={C.navy} />
      <rect x={196} y={76} width={58} height={8} rx={2} fill={C.green} />
      <rect x={196} y={90} width={40} height={5} rx={2} fill="#fff" opacity={0.85} />
      <rect x={196} y={100} width={30} height={5} rx={2} fill="#fff" opacity={0.5} />
      <rect x={222} y={116} width={6} height={54} fill={C.steel} />
      <LightTowerArt x={268} y={40} />
      <Tote x={190} y={146} lit />
      <Worker x={290} y={64} />
      {/* attention from bin to worker */}
      <path d="M120 74 C 170 40, 250 40, 300 70" fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="4 5" opacity={0.8} />
    </svg>
  );
}

/** Small step icons for the "how it works" strip. */
export function StepIcon({ kind }: { kind: 'deliver' | 'pick' | 'put' }) {
  return (
    <svg viewBox="0 0 120 90" className="step-icon" aria-hidden="true">
      <rect x={0} y={82} width={120} height={3} rx={1.5} fill={C.steel} opacity={0.4} />
      {kind === 'deliver' && (
        <>
          <g opacity={0.4} stroke={C.steel} strokeWidth={3} strokeLinecap="round">
            <line x1={2} y1={60} x2={18} y2={60} /><line x1={6} y1={70} x2={20} y2={70} />
          </g>
          <Pod x={30} y={8} w={64} lit={null} />
          <DriveUnit x={32} y={64} w={60} />
        </>
      )}
      {kind === 'pick' && (
        <>
          <Pod x={28} y={8} w={64} lit={[1, 2]} />
          <path d="M60 62 v14" stroke={C.green} strokeWidth={3} />
          <path d="M53 70 l7 8 l7 -8" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {kind === 'put' && (
        <>
          <rect x={44} y={22} width={30} height={22} rx={3} fill={C.robot} />
          <path d="M59 46 v10" stroke={C.green} strokeWidth={3} />
          <path d="M52 52 l7 7 l7 -7" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" />
          <g transform="translate(36 64) scale(1.2)"><Tote x={0} y={0} lit /></g>
        </>
      )}
    </svg>
  );
}

/** Icons for the four claims. */
export function ClaimIcon({ kind }: { kind: 'step' | 'sync' | 'stop' | 'shape' }) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" className="claim-icon">
      {kind === 'step' && (<>
        <circle cx={16} cy={16} r={14} fill="#ffcb5c" />
        <path d="M10 16 h11 m-4 -5 l5 5 l-5 5" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </>)}
      {kind === 'sync' && (<>
        <circle cx={16} cy={16} r={14} fill="#ffcb5c" />
        <rect x={8} y={9} width={9} height={7} rx={1.5} fill={C.navy} />
        <circle cx={21.5} cy={12.5} r={3.5} fill={C.green} />
        <path d="M9 21 q2 -3 4 0 t4 0" fill="none" stroke={C.navy} strokeWidth={2} strokeLinecap="round" />
        <rect x={20} y={19} width={4} height={6} rx={1} fill={C.navy} />
      </>)}
      {kind === 'stop' && (<>
        <polygon points="11,2 21,2 30,11 30,21 21,30 11,30 2,21 2,11" fill={C.red} />
        <rect x={9} y={14} width={14} height={4} rx={1} fill="#fff" />
      </>)}
      {kind === 'shape' && (<>
        <circle cx={16} cy={16} r={14} fill="#ffcb5c" />
        <circle cx={10.5} cy={12} r={4} fill={C.green} />
        <polygon points="21.5,7.5 26,15.5 17,15.5" fill="#b97c0a" />
        <rect x={13} y={18} width={7} height={7} fill={C.blue} />
      </>)}
    </svg>
  );
}
