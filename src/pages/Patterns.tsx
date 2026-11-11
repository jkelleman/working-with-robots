import { PATTERNS } from '../data/patterns';

export default function Patterns() {
  return (
    <div className="page">
      <h2 className="page-title">Pattern library</h2>
      <p className="note">Reusable patterns for robotic workstations. Each one maps a single meaning across screen, light, sound, and haptics.</p>
      {PATTERNS.map((p) => (
        <article key={p.name} className="pattern" id={p.name.toLowerCase().replace(/\W+/g, '-')}>
          <h3>{p.name}</h3>
          <p>{p.purpose}</p>
          <p className="muted"><strong>When to use:</strong> {p.whenToUse}</p>
          <p className="muted"><strong>States:</strong> {p.states.join(' · ')}</p>
          <div className="table-wrap">
            <table className="mapping">
              <thead><tr><th>Screen</th><th>Light</th><th>Sound</th><th>Haptic</th></tr></thead>
              <tbody><tr><td data-label="Screen">{p.mapping.screen}</td><td data-label="Light">{p.mapping.light}</td><td data-label="Sound">{p.mapping.sound}</td><td data-label="Haptic">{p.mapping.haptic}</td></tr></tbody>
            </table>
          </div>
          <div className="dodont">
            <div><h4 className="do">Do</h4><ul>{p.do.map((d) => <li key={d}>{d}</li>)}</ul></div>
            <div><h4 className="dont">Don’t</h4><ul>{p.dont.map((d) => <li key={d}>{d}</li>)}</ul></div>
          </div>
        </article>
      ))}
    </div>
  );
}
