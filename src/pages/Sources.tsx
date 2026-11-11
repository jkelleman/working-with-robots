import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

interface Source {
  name: string;
  by: string;
  url?: string;
  borrowed: string;
  why: string;
  where: string;
  notBorrowed?: string;
}

const RESEARCH: Source[] = [
  {
    name: 'Sequoia robotics announcement (Oct 2023)',
    by: 'Amazon, About Amazon',
    url: 'https://www.aboutamazon.com/news/operations/amazon-introduces-new-robotics-solutions',
    borrowed: 'The “power zone”: designing so associates pick between mid-thigh and mid-chest, without reaching overhead or squatting.',
    why: 'Reaching and bending add up over a 10-hour shift. The first version of this concept said nothing about the body.',
    where: 'Body and reach view on the Station page, plus posture tips on top- and bottom-row picks.',
  },
  {
    name: 'ErgoReality (HFES 2024)',
    by: 'Amazon Science; Morse, Esfahani, Krishnan',
    url: 'https://www.amazon.science/publications/ergoreality-a-virtual-reality-simulations-software-for-ergonomic-analysis-of-workstation-design',
    borrowed: 'Testing workstation ergonomics in virtual reality with motion tracking before building hardware.',
    why: 'It’s a cheaper, faster way to compare station layouts with real bodies.',
    where: 'Proposed as the ergonomics validation step in the research kit.',
  },
  {
    name: 'Intuitive Picking Assistant',
    by: 'Kardex (product page)',
    url: 'https://www.kardex.com/en-us/products/autostore/intuitive-picking-assistant',
    borrowed: 'Camera-verified picks: a camera watches the hand and flags a mispick the moment it happens.',
    why: 'It removes a scan from every pick and catches mispicks at the source instead of at the scanner.',
    where: 'Station setup toggle on the Station page: “Overhead camera” changes the instructions, buttons, and mispick wording.',
    notBorrowed: 'Projecting instructions onto the work surface. Noted as a future idea.',
  },
  {
    name: 'FusionPort',
    by: 'Element Logic (product announcement)',
    url: 'https://www.elementlogic.net/blog/launch-of-fusionport-and-fusionport-staging',
    borrowed: 'A physical safety cover that closes while storage is being swapped and opens when it’s time to pick.',
    why: 'A physical barrier is a second safety channel next to the light curtain, and it shows the station state at a glance.',
    where: 'The safety cover on the pod, which slides shut while the pod moves and during an E-stop.',
    notBorrowed: 'Tilted bins and dual source bins. Both are worth testing for reach and waiting time.',
  },
];

const PRACTICES: Source[] = [
  {
    name: 'Industrial signal color conventions (IEC 60073)',
    by: 'International Electrotechnical Commission',
    borrowed: 'Standard color meanings: red for emergency and stop, amber for abnormal, green for normal.',
    why: 'Associates already know these from other equipment. Inventing new meanings would be a safety risk.',
    where: 'Stack light, screen status bands, and the rule (enforced by a test) that only the safety stop uses red.',
  },
  {
    name: 'Andon',
    by: 'Lean manufacturing (Toyota Production System)',
    borrowed: 'A one-touch call for help that stops the problem from being worked around.',
    why: 'It’s the established floor term and behavior, so associates and Problem Solve already understand it.',
    where: 'The andon flow from any exception, with a short list of reasons.',
  },
  {
    name: 'Pick-to-light and put-to-light',
    by: 'Common warehouse practice',
    borrowed: 'Lights that mark the bin to pick from and the tote to put to, with a button to confirm the put.',
    why: 'It keeps eyes on the work instead of the screen.',
    where: 'Lit bins on the pod and lit totes on the put wall.',
  },
  {
    name: 'Web Content Accessibility Guidelines (WCAG 2.2)',
    by: 'W3C',
    url: 'https://www.w3.org/TR/WCAG22/',
    borrowed: 'Contrast, visible focus, and never using color as the only cue.',
    why: 'Associates vary in vision, hearing, and handedness, and the floor is loud and bright.',
    where: 'Accessibility modes, shapes on the stack light, and labeled tones.',
  },
];

const TOOLS: Array<[string, string, string]> = [
  ['XState', 'https://stately.ai/docs/xstate', 'The state machine that drives every signal'],
  ['React and TypeScript', 'https://react.dev', 'The interface'],
  ['Vite', 'https://vite.dev', 'Build tooling'],
  ['Recharts', 'https://recharts.org', 'Metrics charts'],
  ['Vitest', 'https://vitest.dev', 'Automated tests for the design rules'],
];

const ORIGINAL = [
  'The scenario: Maya, her wave, and the seven exceptions',
  'The state machine, exception flows, and two-step safety resume',
  'The 8-pattern library and its rules',
  'All illustrations and icons, drawn for this project',
  'All copy and the synthetic data',
];

function SourceCard({ s }: { s: Source }) {
  return (
    <li className="src-card">
      <div className="src-head">
        <h4>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.name} ↗</a> : s.name}</h4>
        <span className="src-by">{s.by}</span>
      </div>
      <dl>
        <div><dt>Borrowed</dt><dd>{s.borrowed}</dd></div>
        <div><dt>Why</dt><dd>{s.why}</dd></div>
        <div><dt>Where it shows up</dt><dd>{s.where}</dd></div>
        {s.notBorrowed && <div><dt>Not borrowed (yet)</dt><dd>{s.notBorrowed}</dd></div>}
      </dl>
    </li>
  );
}

export default function Sources() {
  return (
    <>
      <PageHeader
        accent="slate"
        eyebrow="Credits"
        title="Sources & inspiration"
        sub="What this concept borrows from industry, research, and established practice, why, and where it shows up."
        art={<SourcesArt />}
      />
      <div className="page">
        <section className="story">
          <h2 className="story-h">From industry and research</h2>
          <ul className="src-list">{RESEARCH.map((s) => <SourceCard key={s.name} s={s} />)}</ul>
        </section>

        <section className="story">
          <h2 className="story-h">Established practices</h2>
          <ul className="src-list">{PRACTICES.map((s) => <SourceCard key={s.name} s={s} />)}</ul>
        </section>

        <section className="story">
          <h2 className="story-h">What’s original</h2>
          <ul className="src-original">{ORIGINAL.map((o) => <li key={o}>{o}</li>)}</ul>
        </section>

        <section className="story">
          <h2 className="story-h">Built with</h2>
          <ul className="src-tools">
            {TOOLS.map(([n, u, d]) => <li key={n}><a href={u} target="_blank" rel="noreferrer">{n}</a><span>{d}</span></li>)}
          </ul>
        </section>

        <p className="story-note">
          Company names are used only to credit public sources. No proprietary or confidential information was used, and
          this concept isn’t affiliated with any company. See the <Link to="/">station</Link> to try the ideas above.
        </p>
      </div>
    </>
  );
}

function SourcesArt() {
  return (
    <svg viewBox="0 0 220 90">
      <rect x="30" y="18" width="70" height="56" rx="6" fill="#e6eaee" stroke="#9aa5b0" strokeWidth="2" />
      <rect x="40" y="30" width="44" height="5" rx="2.5" fill="#8a96a3" />
      <rect x="40" y="42" width="36" height="5" rx="2.5" fill="#c3ccd5" />
      <rect x="40" y="54" width="40" height="5" rx="2.5" fill="#c3ccd5" />
      <rect x="120" y="10" width="70" height="56" rx="6" fill="#fff" stroke="#5b6670" strokeWidth="2" />
      <rect x="130" y="22" width="44" height="5" rx="2.5" fill="#5b6670" />
      <rect x="130" y="34" width="36" height="5" rx="2.5" fill="#c3ccd5" />
      <rect x="130" y="46" width="40" height="5" rx="2.5" fill="#c3ccd5" />
      <path d="M100 46 C 108 46, 112 38, 120 38" fill="none" stroke="#5b6670" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M115 33 l6 5 l-6 5" fill="none" stroke="#5b6670" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 82 H212" stroke="#c3ccd5" strokeWidth="2" strokeDasharray="3 5" />
    </svg>
  );
}
