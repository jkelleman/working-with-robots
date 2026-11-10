import { PATTERNS } from '../data/patterns';

export default function Patterns() {
  return (
    <div className="page">
      <h1>Pattern library</h1>
      <p className="note">Reusable patterns for robotic workstations. Each one maps a single meaning across screen, light, sound, and haptics.</p>
      {PATTERNS.map((p) => (
        <article key={p.name} className="pattern" id={p.name.toLowerCase().replace(/\W+/g, '-')}>
          <h2>{p.name}</h2>
          <p>{p.purpose}</p>
          <p className="muted"><strong>When to use:</strong> {p.whenToUse}</p>
          <p className="muted"><strong>States:</strong> {p.states.join(' · ')}</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Screen</th><th>Light</th><th>Sound</th><th>Haptic</th></tr></thead>
              <tbody><tr><td>{p.mapping.screen}</td><td>{p.mapping.light}</td><td>{p.mapping.sound}</td><td>{p.mapping.haptic}</td></tr></tbody>
            </table>
          </div>
          <div className="dodont">
            <div><h3 className="do">Do</h3><ul>{p.do.map((d) => <li key={d}>{d}</li>)}</ul></div>
            <div><h3 className="dont">Don’t</h3><ul>{p.dont.map((d) => <li key={d}>{d}</li>)}</ul></div>
          </div>
        </article>
      ))}
    </div>
  );
}
