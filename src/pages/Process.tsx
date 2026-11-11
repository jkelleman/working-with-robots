import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import type { A11yPrefs } from './Station';

const PREF_LABELS: Record<keyof A11yPrefs, string> = {
  highContrast: 'High contrast',
  largeText: 'Large text',
  audioGuidance: 'Spoken guidance',
  colorSafe: 'Shapes on lights (color-blind safe)',
  leftHanded: 'Left-hand layout',
  reducedSound: 'Reduced sound (safety tones stay audible)',
};

const STEPS = [
  {
    phase: 'Empathize',
    did: 'Studied public sources on robotic pick stations and learned the floor’s vocabulary. Wrote Maya, a newer night-shift associate, and a shadowing guide for real floor visits.',
    out: 'Maya, her shift, and where it goes wrong',
  },
  {
    phase: 'Define',
    did: 'Mapped the happy path as four steps, then the seven pain points that break it. Framed one question: How might we help Maya recover from any exception in seconds, without guessing, while safety stays absolute?',
    out: '1 happy path, 7 pain points, 1 how-might-we',
  },
  {
    phase: 'Ideate',
    did: 'Sketched what each state should say on the screen, light, sound, and vibration. Borrowed proven ideas: the power zone, camera checks, a safety cover, the andon.',
    out: 'One signal map: every channel says the same thing',
  },
  {
    phase: 'Prototype',
    did: 'Built the station as working code. A state machine drives every signal, so the prototype behaves like a real station, not a slideshow.',
    out: 'A clickable station with every exception',
  },
  {
    phase: 'Test',
    did: 'Turned the design rules into automated tests, checked every screen size, and wrote the usability test and VR ergonomics study to run with associates.',
    out: '23 passing tests and a plan to test with real associates',
  },
];

const PRINCIPLES = [
  ['Safety overrides everything', 'A light curtain trip stops all work. Resuming takes two deliberate steps.'],
  ['One meaning, every channel', 'Screen, light, sound, and vibration never disagree.'],
  ['Design the way back', 'Every pain point has a recovery path and an andon.'],
  ['Color only for meaning', 'Neutral by default. Green means do, amber means problem, red means stop.'],
  ['Floor words, plain glosses', 'The station uses the terms associates hear on shift, defined in plain language.'],
  ['Design for the body', 'Picks aim for the power zone. When they can’t, the station says how to reach.'],
];

const A11Y = [
  ['Never color alone', 'Every color also has a shape, a word, and a tone, so color-blind associates get the same message.'],
  ['Loud floor', 'Every sound also shows on the screen and vibrates. Safety tones can’t be turned down.'],
  ['Bright floor, quick glances', 'High contrast and large text make the screen readable from a step back.'],
  ['Reading and language', 'Short, plain instructions. Spoken guidance reads each step aloud.'],
  ['Either hand', 'A left-hand layout mirrors the station.'],
  ['Motion', 'Animations play once and stop, and turn off for people who ask their device for reduced motion.'],
  ['Keyboard and screen readers', 'A skip link, visible focus, labeled controls, and live status updates that are announced.'],
  ['No accidental taps', 'Resuming after a safety stop takes a press-and-hold, not a single tap.'],
];

const OUTCOME = [
  ['1 + 7 + 1', 'Happy path, pain points, safety stop: all designed and clickable'],
  ['8', 'Reusable patterns, documented for other teams'],
  ['23', 'Automated tests that protect the design rules'],
  ['3', 'Ready-to-run kits: research, usability test, multi-site rollout'],
];

export default function Process({ prefs, setPrefs }: { prefs: A11yPrefs; setPrefs: (p: A11yPrefs) => void }) {
  return (
    <>
      <PageHeader
        accent="slate"
        eyebrow="Case study"
        title="How I designed it"
        sub="Why I built this, the design thinking steps I followed, and where it landed."
        art={<ProcessArt />}
      />
      <div className="page">
        <section className="story" aria-labelledby="why-built">
          <h2 id="why-built" className="story-h">Why I built it</h2>
          <div className="proc-why">
            <p>
              Goods-to-person stations bring the work to the associate. The happy path is fast. But when something goes
              wrong, like a mispick, a late pod, or a light curtain trip, the guidance is split across a screen, a light,
              and a sound. A newer associate is left guessing.
            </p>
            <p>
              I’m a design engineer. I wanted to show how I design the moments that break the flow, not just the flow,
              and to build it as working code so the design can be tried, not just described.
            </p>
          </div>
        </section>

        <section className="story" aria-labelledby="steps">
          <h2 id="steps" className="story-h">The design thinking steps I followed</h2>
          <ol className="proc-steps">
            {STEPS.map((s, i) => (
              <li key={s.phase}>
                <span className="proc-num" aria-hidden="true">{i + 1}</span>
                <strong>{s.phase}</strong>
                <span className="proc-did">{s.did}</span>
                <span className="proc-out"><b>Result:</b> {s.out}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="story" aria-labelledby="principles">
          <h2 id="principles" className="story-h">Principles I held to</h2>
          <ul className="story-cards">
            {PRINCIPLES.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ul>
        </section>

        <section className="story" aria-labelledby="a11y-h">
          <h2 id="a11y-h" className="story-h">Accessibility considerations</h2>
          <p className="proc-lede">
            Associates differ in vision, hearing, reading, and handedness, and the floor is loud and bright. I designed for
            that from the start, following WCAG 2.2.
          </p>
          <ul className="proc-a11y">
            {A11Y.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ul>
          <fieldset className="proc-try">
            <legend>Try the accessibility modes. They change the <Link to="/">station</Link>.</legend>
            {(Object.keys(PREF_LABELS) as (keyof A11yPrefs)[]).map((k) => (
              <label key={k} className="toggle">
                <input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} />
                {PREF_LABELS[k]}
              </label>
            ))}
          </fieldset>
        </section>

        <section className="story" aria-labelledby="outcome">
          <h2 id="outcome" className="story-h">The outcome</h2>
          <ul className="proc-outcome">
            {OUTCOME.map(([n, d]) => <li key={d}><span className="proc-big">{n}</span><span>{d}</span></li>)}
          </ul>
          <p className="proc-lede">
            The <Link to="/metrics">metrics</Link> show the result I expect: faster recovery from exceptions and fewer
            mispicks. The numbers are synthetic, a hypothesis to prove. Next I’d shadow associates on real shifts, run the
            usability test, test reach in VR, and pilot at one site before scaling.
          </p>
        </section>

        <p className="story-note">
          This is a self-initiated concept with a fictional station and synthetic data. What I borrowed is credited on the{' '}
          <Link to="/sources">Sources</Link> page.
        </p>
      </div>
    </>
  );
}

function ProcessArt() {
  const c = ['#c3ccd5', '#c3ccd5', '#c3ccd5', '#8a96a3', '#5b6670'];
  return (
    <svg viewBox="0 0 220 90">
      <path d="M22 45 H198" stroke="#c3ccd5" strokeWidth="2" strokeDasharray="3 5" />
      {c.map((f, i) => (
        <g key={i}>
          <circle cx={22 + i * 44} cy="45" r={i === 4 ? 15 : 11} fill={f} />
          <text x={22 + i * 44} y="49" fontSize="11" fontWeight="700" textAnchor="middle" fill="#fff">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
