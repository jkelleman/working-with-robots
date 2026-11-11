import { ClaimIcon, StationScene } from './Illustrations';

/** Station page hero: the use case, the scenario, and the claims being tested. */

const CLAIMS = [
  { icon: 'step', text: 'One clear next step' },
  { icon: 'sync', text: 'Every signal agrees' },
  { icon: 'stop', text: 'Safety overrides all' },
  { icon: 'shape', text: 'Never color alone' },
] as const;

export default function ConceptBanner() {
  return (
    <section className="concept" aria-labelledby="concept-title">
      <div className="concept-inner">
        <div className="concept-copy">
          <p className="concept-eyebrow">Design concept · Goods-to-person (GTP) picking</p>
          <h1 id="concept-title" className="concept-title">Guiding associates at a robotic pick station</h1>
          <dl className="concept-story">
            <div>
              <dt>Use case</dt>
              <dd>Goods-to-person picking. Drive units carry pods (mobile shelves) to Maya’s pick station; she picks each item and puts it to the customer’s order tote.</dd>
            </div>
            <div>
              <dt>Scenario</dt>
              <dd>Maya, an associate three weeks in, works nights. Tonight: a short pick, a full tote, and a light curtain trip.</dd>
            </div>
          </dl>

          <p className="concept-lede">This prototype designs what her pick station shows, lights, and sounds at every step. It tests four claims:</p>

          <ul className="concept-claims">
            {CLAIMS.map((c) => (
              <li key={c.text}><ClaimIcon kind={c.icon} /><span>{c.text}</span></li>
            ))}
          </ul>

          <p className="concept-evidence">
            Enforced in code, checked by 23 tests.{' '}
            <a href="https://github.com/jkelleman/workstation-guidance-system#readme">View code →</a>
          </p>
        </div>

        <StationScene className="concept-art" />

        <p className="concept-page">
          <span className="concept-page-label">Try it</span>
          Play the happy path, then tap any scenario to see what happens when it goes wrong.
        </p>
      </div>
    </section>
  );
}
