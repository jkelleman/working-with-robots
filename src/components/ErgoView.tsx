import { BIN_ROWS, rowZone, type BodyZone, type PickTask } from '../data/tasks';

/**
 * Side view of the associate at the pod. The band is the power zone
 * (mid-thigh to mid-chest). The current pick's row is highlighted and
 * labeled in zone, reach, or bend.
 */

const ROW_Y: Record<string, number> = { A: 34, B: 72, C: 110, D: 148 }; // top of each pod row
const ROW_H = 36;
const ZONE_LABEL: Record<BodyZone, string> = { reach: 'Reach', zone: 'In zone', bend: 'Bend' };
const ZONE_TEXT: Record<BodyZone, string> = {
  reach: 'above the power zone, so she has to reach up',
  zone: 'inside the power zone: no reaching or bending',
  bend: 'below the power zone, so she has to bend down',
};

export default function ErgoView({ task, active }: { task?: PickTask; active: boolean }) {
  const row = active && task ? task.bin[0] : null;
  const zone = row ? rowZone(task!.bin) : null;
  const targetY = row ? ROW_Y[row] + ROW_H / 2 : 0;

  return (
    <section className="ergo" aria-labelledby="ergo-title">
      <div className="ergo-copy">
        <h3 id="ergo-title">Body and reach</h3>
        <p className="ergo-lede">
          The <strong>power zone</strong> runs from mid-thigh to mid-chest. Picks there need no reaching or bending,
          the moves that add strain over a 10-hour shift.
        </p>
        {zone ? (
          <p className={`ergo-status ergo-${zone}`}>
            <span className="ergo-pill">{ZONE_LABEL[zone]}</span>
            Bin {task!.bin} is in row {row}, {ZONE_TEXT[zone]}.
          </p>
        ) : (
          <p className="ergo-status ergo-idle"><span className="ergo-pill">No pick</span>Start a pick to see where it lands on the body.</p>
        )}
        <p className="ergo-idea">
          <strong>Design response:</strong> the WES can favor the pod face that puts the item in the power zone. When it
          can’t, the screen adds a posture tip for the top and bottom rows.
        </p>
      </div>

      <svg className="ergo-art" viewBox="0 0 300 210" role="img"
        aria-label={zone ? `Side view: the associate picks from row ${row}, ${ZONE_TEXT[zone]}.` : 'Side view of an associate standing at a pod, with the power zone marked.'}>
        {/* floor */}
        <rect x="0" y="196" width="300" height="3" rx="1.5" fill="#c3ccd5" />
        {/* power zone band */}
        <rect x="20" y="76" width="262" height="70" rx="6" fill="#1f9d55" opacity=".12" />
        <line x1="20" y1="76" x2="282" y2="76" stroke="#1f9d55" strokeWidth="1.5" strokeDasharray="4 4" opacity=".7" />
        <line x1="20" y1="146" x2="282" y2="146" stroke="#1f9d55" strokeWidth="1.5" strokeDasharray="4 4" opacity=".7" />
        <text x="24" y="90" fontSize="10" fontWeight="700" fill="#1f9d55">POWER ZONE</text>

        {/* pod, side view: four rows */}
        {BIN_ROWS.map((r) => {
          const z = rowZone(`${r}1`);
          const lit = row === r;
          return (
            <g key={r}>
              <rect x="196" y={ROW_Y[r]} width="56" height={ROW_H - 3} rx="2"
                fill={lit ? (z === 'zone' ? '#1f9d55' : '#e8a317') : '#e6eaee'} stroke="#9aa5b0" strokeWidth="1.5" />
              <text x="224" y={ROW_Y[r] + 21} fontSize="11" fontWeight="700" textAnchor="middle" fill={lit ? '#fff' : '#5b636b'}>{r}</text>
              <text x="258" y={ROW_Y[r] + 21} fontSize="9" fill="#5b636b">{z === 'zone' ? '✓' : z === 'reach' ? '↑' : '↓'}</text>
            </g>
          );
        })}
        <rect x="200" y="182" width="6" height="14" fill="#8a96a3" />
        <rect x="242" y="182" width="6" height="14" fill="#8a96a3" />

        {/* associate, side view, facing the pod */}
        <g fill="#8a96a3">
          <circle cx="96" cy="26" r="13" fill="#c3ccd5" />
          <rect x="82" y="42" width="30" height="62" rx="12" />
          <rect x="84" y="102" width="12" height="94" rx="5" fill="#5b636b" />
          <rect x="100" y="102" width="12" height="94" rx="5" fill="#5b636b" />
          <rect x="80" y="192" width="22" height="6" rx="3" fill="#323b44" />
          <rect x="98" y="192" width="22" height="6" rx="3" fill="#323b44" />
        </g>
        {/* arm reaching toward the target row */}
        {row ? (
          <g>
            <line x1="104" y1="54" x2="192" y2={targetY} stroke="#8a96a3" strokeWidth="9" strokeLinecap="round" />
            <circle cx="194" cy={targetY} r="5.5" fill="#c3ccd5" />
          </g>
        ) : (
          <line x1="104" y1="54" x2="112" y2="104" stroke="#8a96a3" strokeWidth="9" strokeLinecap="round" />
        )}
      </svg>
    </section>
  );
}
