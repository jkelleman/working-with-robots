import More from './More';

/**
 * Compact intro for the station page. Plain story first, the fulfillment-center
 * terms behind an accordion, so the station itself sits on the first screen.
 */
export default function ConceptBanner() {
  return (
    <section className="concept concept-compact" aria-labelledby="concept-title">
      <div className="concept-inner">
        <div className="concept-copy">
          <p className="concept-eyebrow">Design concept</p>
          <h1 id="concept-title" className="concept-title">Working With Robots</h1>
          <p className="concept-subtitle">Designing a Fulfillment Pick Station</p>
        </div>
        <div className="concept-side">
          <p className="concept-lede">
            Robots bring products to Maya, who picks each customer order by hand. When something goes wrong, her station
            has seconds to tell her what to do. Step through her shift below, then try what happens when it breaks.
          </p>
          <More label="In fulfillment-center terms" className="more-dark">
            <p className="concept-lingo">
              Drive units carry pods of inventory to Maya’s pick station. Pick-to-light marks the bin, put-to-light marks
              the order tote, and a stack light shows her status across the floor. This prototype designs every one of
              those signals, and 23 tests check the design rules.{' '}
              <a href="https://github.com/jkelleman/working-with-robots#readme">View code →</a>
            </p>
          </More>
        </div>
      </div>
    </section>
  );
}
