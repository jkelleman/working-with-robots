import { PATTERNS } from '../data/patterns';
import PageHeader, { PatternsArt } from '../components/PageHeader';
import More from '../components/More';

const slug = (name: string) => name.toLowerCase().replace(/\W+/g, '-');

const WHY = [
  { title: 'Safety depends on it', text: 'An associate who learns that red means stop at one station has to see the same thing at every station. Inconsistency on a robotic floor isn’t cosmetic.' },
  { title: 'Many teams build stations', text: 'Hardware, software, and operations teams each touch the experience. Shared patterns let them decide once, instead of re-deciding per program.' },
  { title: 'New people ramp faster', text: 'Designers, engineers, and site trainers get one reference for what each signal means and when to use it.' },
];

const HOW = [
  { title: 'Map every state', text: 'Start from the station’s state machine: 15 states, from ready to safety stop.' },
  { title: 'Ask what the associate needs', text: 'For each state: what happened, what to do next, and how urgent it is.' },
  { title: 'Group the repeats', text: 'Six exceptions turned out to need the same thing: one problem, one next step. That became the Exception card.' },
  { title: 'Map every channel', text: 'Give each pattern one meaning on the screen, stack light, sound, and vibration, so no channel says something different.' },
  { title: 'Lock rules into code', text: 'Rules like “only the safety stop uses red” are automated tests, so a future change can’t quietly break them.' },
];

const SCALE = [
  { title: 'New robotic programs', text: 'A new station type adds its own states, then maps them to existing patterns. A new exception reuses the Exception card instead of inventing a screen.' },
  { title: 'New sites', text: 'The patterns ship with the rollout playbook and a printed standard work card, so every site trains to the same signals.' },
  { title: 'New patterns', text: 'Propose with evidence from the floor, review with design, safety, and engineering, test with associates, then publish and version it.' },
];

export default function Patterns() {
  return (
    <>
    <PageHeader
      accent="blue"
      eyebrow="Design system"
      title="Pattern library"
      sub="8 reusable patterns behind the station. Each carries one meaning across screen, light, sound, and vibration."
      art={<PatternsArt />}
    />
    <div className="page">
      <section className="story" aria-labelledby="library">
        <h2 id="library" className="story-h">The patterns</h2>
        <p className="proc-key">Each pattern gives one meaning to the screen, stack light, sound, and vibration, so no channel says something different.</p>
        <div className="acc-group">
          <More label="Why document patterns?" hint="Safety, many teams, faster ramp-up">
            <ul className="story-cards">
              {WHY.map((w) => <li key={w.title}><strong>{w.title}</strong><span>{w.text}</span></li>)}
            </ul>
          </More>
          <More label="How the patterns were made" hint="5 steps from the state machine">
            <ol className="story-flow">
              {HOW.map((h, i) => (
                <li key={h.title}>
                  <span className="flow-num" aria-hidden="true">{i + 1}</span>
                  <strong>{h.title}</strong>
                  <span>{h.text}</span>
                </li>
              ))}
            </ol>
          </More>
          <More label="How this scales" hint="Programs, sites, new patterns">
            <ul className="story-cards">
              {SCALE.map((x) => <li key={x.title}><strong>{x.title}</strong><span>{x.text}</span></li>)}
            </ul>
          </More>
        </div>
      </section>

      <section className="story" aria-label="Jump to a pattern">
        <nav className="pattern-index" aria-label="Jump to a pattern">
          {PATTERNS.map((p) => <a key={p.name} href={`#/patterns`} onClick={(e) => { e.preventDefault(); document.getElementById(slug(p.name))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{p.name}</a>)}
        </nav>
      </section>

      {PATTERNS.map((p) => (
        <article key={p.name} className="pattern" id={slug(p.name)}>
          <h3>{p.name}</h3>
          <p>{p.purpose}</p>
          <div className="table-wrap">
            <table className="mapping">
              <thead><tr><th>Screen</th><th>Light</th><th>Sound</th><th>Haptic</th></tr></thead>
              <tbody><tr><td data-label="Screen">{p.mapping.screen}</td><td data-label="Light">{p.mapping.light}</td><td data-label="Sound">{p.mapping.sound}</td><td data-label="Haptic">{p.mapping.haptic}</td></tr></tbody>
            </table>
          </div>
          <More label="When to use, do and don’t">
            <p className="muted"><strong>When to use:</strong> {p.whenToUse}</p>
            <p className="muted"><strong>States:</strong> {p.states.join(' · ')}</p>
            <div className="dodont">
              <div><h4 className="do">Do</h4><ul>{p.do.map((d) => <li key={d}>{d}</li>)}</ul></div>
              <div><h4 className="dont">Don’t</h4><ul>{p.dont.map((d) => <li key={d}>{d}</li>)}</ul></div>
            </div>
          </More>
        </article>
      ))}

      <p className="story-note">Concept work: these patterns come from designing this prototype. On a real program they would be validated through field research and usability testing with associates before rollout.</p>
    </div>
    </>
  );
}
