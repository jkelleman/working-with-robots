import { ClaimIcon, StationScene } from './Illustrations';
import More from './More';

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
          <p className="concept-lede">
            Robots bring shelves to Maya, three weeks into night shift. This prototype designs what her station shows,
            lights, and sounds at every step, especially when something goes wrong.
          </p>

          <ul className="concept-claims">
            {CLAIMS.map((c) => (
              <li key={c.text}><ClaimIcon kind={c.icon} /><span>{c.text}</span></li>
            ))}
          </ul>

          <More label="Use case, scenario, and proof" className="more-dark">
            <dl className="concept-story">
              <div>
                <dt>Use case</dt>
                <dd>Goods-to-person picking. Drive units carry pods (mobile shelves) to Maya’s pick station. She picks each item and puts it to the customer’s order tote.</dd>
              </div>
              <div>
                <dt>Scenario</dt>
                <dd>Maya, an associate three weeks in, works nights. Tonight: a short pick, a full tote, and a light curtain trip.</dd>
              </div>
              <div>
                <dt>Proof</dt>
                <dd>Each claim is enforced in code and checked by 23 tests. <a href="https://github.com/jkelleman/workstation-guidance-system#readme">View code →</a></dd>
              </div>
            </dl>
          </More>
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
