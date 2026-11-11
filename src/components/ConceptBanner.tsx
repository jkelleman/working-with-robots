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
          <p className="concept-eyebrow">Design concept · Robotic fulfillment</p>
          <h1 id="concept-title" className="concept-title">Guiding people who work alongside robots</h1>
          <dl className="concept-story">
            <div>
              <dt>Use case</dt>
              <dd>Filling customer orders at a station where robots bring the shelves to the worker.</dd>
            </div>
            <div>
              <dt>Scenario</dt>
              <dd>Maya, three weeks in, works the night shift. Tonight she’ll hit an empty bin, a full tote, and a safety stop.</dd>
            </div>
          </dl>

          <p className="concept-lede">This prototype designs what her station shows, lights, and sounds at every step. It tests four claims:</p>

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
