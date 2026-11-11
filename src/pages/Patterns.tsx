import { PATTERNS } from '../data/patterns';
import PageHeader, { PatternsArt } from '../components/PageHeader';

export default function Patterns() {
  return (
    <>
    <PageHeader
      accent="blue"
      eyebrow="Design system"
      title="Pattern library"
      sub="The 8 reusable patterns behind the station. Each one carries a single meaning across screen, light, sound, and vibration."
      art={<PatternsArt />}
    />
    <div className="page">
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
    </>
  );
}
