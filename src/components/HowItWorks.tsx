import { DriveUnit, ItemIcon, Pod } from './Illustrations';

/**
 * Explains the control loop: robots don't decide on their own. A warehouse
 * control system dispatches them, and the station reports each step back.
 */

function OrderIcon() {
  return (
    <svg viewBox="0 0 60 50" aria-hidden="true">
      <rect x="14" y="4" width="32" height="42" rx="3" fill="#e6eaee" stroke="#8a96a3" strokeWidth="2" />
      <rect x="20" y="12" width="20" height="3" rx="1.5" fill="#8a96a3" />
      <rect x="20" y="20" width="14" height="3" rx="1.5" fill="#c3ccd5" />
      <rect x="20" y="28" width="17" height="3" rx="1.5" fill="#c3ccd5" />
      <circle cx="42" cy="38" r="8" fill="#1f9d55" />
      <path d="M38 38 l3 3 l5 -6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 60 50" aria-hidden="true">
      <rect x="6" y="14" width="24" height="24" rx="3" fill="#e6eaee" stroke="#8a96a3" strokeWidth="2" />
      <g transform="translate(8 15) scale(.5)"><ItemIcon kind="bottle" /></g>
      <path d="M30 26 h8" stroke="#1f9d55" strokeWidth="2" strokeDasharray="2 2" />
      <path d="M40 18 h12 v16 h-12z" fill="#5b636b" />
      <rect x="43" y="34" width="6" height="10" rx="1" fill="#5b636b" />
      <rect x="40" y="24" width="12" height="3" fill="#1f9d55" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 60 50" aria-hidden="true">
      <g transform="translate(6 2)"><Pod x={8} y={0} w={28} lit={null} /><DriveUnit x={8} y={30} w={28} /></g>
      <path d="M50 14 a12 12 0 1 1 -6 -6" fill="none" stroke="#8a96a3" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 2 l1 7 l-7 0" fill="none" stroke="#8a96a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FetchIcon() {
  return (
    <svg viewBox="0 0 60 50" aria-hidden="true">
      <g opacity=".5" stroke="#8a96a3" strokeWidth="2.5" strokeLinecap="round"><path d="M2 36 h8" /><path d="M4 43 h8" /></g>
      <Pod x={16} y={2} w={30} lit={null} />
      <DriveUnit x={16} y={34} w={30} />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg viewBox="0 0 60 50" aria-hidden="true">
      <Pod x={14} y={4} w={32} lit={[1, 2]} />
      <path d="M41 12 l8 -6 M42 18 h9 M41 24 l8 6" stroke="#1f9d55" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const STEPS = [
  { icon: <OrderIcon />, title: 'Order comes in', text: 'The warehouse system finds a shelf holding the item.' },
  { icon: <FetchIcon />, title: 'Robot is dispatched', text: 'It drives under that shelf, lifts it, and brings it here.' },
  { icon: <LightIcon />, title: 'Robot docks', text: 'Docking is the cue: the station lights the right bin.' },
  { icon: <ScanIcon />, title: 'Worker confirms', text: 'The scan and the tote button tell the system each step is done.' },
  { icon: <ReturnIcon />, title: 'Shelf goes back', text: 'The robot returns it. The next robot is already queued.' },
];

export default function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-title">
      <h3 id="how-title">How do the robots know what to do?</h3>
      <p className="how-lede">
        They don’t decide on their own. A warehouse control system gives each robot its job, and the station reports
        every step back.
      </p>
      <ol className="how-loop">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <div className="how-icon">{s.icon}</div>
            <strong><span className="how-num">{i + 1}</span>{s.title}</strong>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
      <p className="how-safety">
        <span className="how-oct" aria-hidden="true" />
        <span><strong>Safety is separate:</strong> breaking the light curtain stops every robot in the zone instantly, whatever the system was doing.</span>
      </p>
      <p className="how-note">In this prototype, the “Simulate floor events” buttons stand in for the robots and the warehouse system.</p>
    </section>
  );
}
