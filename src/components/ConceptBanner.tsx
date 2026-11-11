import { StationScene } from './Illustrations';
import More from './More';

/**
 * Station page hero. Plain story first, so anyone can follow it, then the
 * same story in fulfillment-center terms.
 */
export default function ConceptBanner() {
  return (
    <section className="concept" aria-labelledby="concept-title">
      <div className="concept-inner">
        <div className="concept-copy">
          <p className="concept-eyebrow">Design concept</p>
          <h1 id="concept-title" className="concept-title">Robots bring the work. People make every pick.</h1>
          <p className="concept-lede">
            Robots bring products to a person, who picks each customer order by hand. The work is fast and the floor is
            loud. When something goes wrong, she needs to know what to do, in seconds.
          </p>
          <p className="concept-lingo">
            <strong>Here’s how that plays out in a fulfillment center:</strong> drive units carry pods of inventory to
            Maya’s pick station. Pick-to-light marks the bin, put-to-light marks the order tote, and a stack light shows
            her status across the floor. This prototype designs every one of those signals.
          </p>

          <More label="Tonight’s scenario and proof" className="more-dark">
            <dl className="concept-story">
              <div>
                <dt>Scenario</dt>
                <dd>Maya is three weeks in, on nights. Tonight brings an empty bin (a short pick), a full tote, and a safety stop (a light curtain trip).</dd>
              </div>
              <div>
                <dt>Proof</dt>
                <dd>The design rules are enforced in code and checked by 23 tests. <a href="https://github.com/jkelleman/workstation-guidance-system#readme">View code →</a></dd>
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
