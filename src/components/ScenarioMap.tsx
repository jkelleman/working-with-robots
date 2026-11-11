import { HAPPY_PATH, SCENARIOS, stepFor, type Scenario } from '../data/scenarios';

/**
 * The happy path as four steps, with each deviation hanging off the step
 * where it can happen. Tapping a scenario jumps the station straight to it.
 */
export default function ScenarioMap({
  stateKey,
  onHappyPath,
  onScenario,
  suggested = null,
  exploredCount = 0,
  explored = new Set<string>(),
}: {
  stateKey: string;
  onHappyPath: () => void;
  onScenario: (s: Scenario) => void;
  suggested?: string | null;
  exploredCount?: number;
  explored?: Set<string>;
}) {
  const currentStep = stepFor(stateKey);
  const currentIdx = HAPPY_PATH.findIndex((s) => s.id === currentStep);
  const activeScenario = SCENARIOS.find((s) => s.state === stateKey || (s.kind === 'safety' && stateKey.startsWith('safetyStop')));
  const offPath = Boolean(activeScenario) || stateKey === 'working.escalated';
  const safety = SCENARIOS.find((s) => s.kind === 'safety')!;

  return (
    <section className="scenario-map" aria-labelledby="scenario-map-title">
      <div className="sm-head">
        <h2 id="scenario-map-title">Scenario map <span className="sm-sub">the 4 steps of every pick</span></h2>
        <p className="sm-legend">
          <span className="sm-key sm-key-happy">Happy path</span>
          <span className="sm-key sm-key-exc">Goes wrong here</span>
          <span className="sm-key sm-key-stop">Safety, anytime</span>
        </p>
        <button type="button" className={`btn btn-sm ${suggested === 'happy' ? 'is-suggested' : ''}`} onClick={onHappyPath}>
          ▶ Play happy path{suggested === 'happy' && <span className="try-tag">Start here</span>}
        </button>
        <p className="sm-progress" aria-live="polite">Explored {exploredCount} of {SCENARIOS.length} exceptions</p>
      </div>

      <ol className="sm-track">
        {HAPPY_PATH.map((step, i) => {
          const status =
            stateKey === 'done' || (currentIdx > i) ? 'past'
            : currentIdx === i ? (offPath ? 'branched' : 'current')
            : 'future';
          const branches = SCENARIOS.filter((s) => s.at === step.id);
          return (
            <li key={step.id} className={`sm-step sm-${status}`}>
              <div className="sm-node" aria-current={status === 'current' ? 'step' : undefined}>
                <span className="sm-dot" aria-hidden="true">{status === 'past' ? '✓' : i + 1}</span>
                <span className="sm-label">
                  <strong>{step.label}</strong>
                  <span>{step.hint}</span>
                </span>
              </div>
              {branches.length > 0 && (
                <ul className="sm-branches" aria-label={`What can go wrong at: ${step.label}`}>
                  {branches.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        className={`sm-branch ${activeScenario?.id === b.id ? 'is-active' : ''} ${suggested === b.id ? 'is-suggested' : ''} ${explored.has(b.id) ? 'is-explored' : ''}`}
                        onClick={() => onScenario(b)}
                        aria-pressed={activeScenario?.id === b.id}
                      >
                        <span className="sm-tri" aria-hidden="true" />
                        <span className="sm-branch-text">
                          <strong>{b.label}{explored.has(b.id) && <span className="seen" aria-label="explored"> ✓</span>}{suggested === b.id && <span className="try-tag">Try next</span>}</strong>
                          <span>→ {b.outcome}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        className={`sm-safety ${activeScenario?.id === safety.id ? 'is-active' : ''} ${suggested === safety.id ? 'is-suggested' : ''}`}
        onClick={() => onScenario(safety)}
        aria-pressed={activeScenario?.id === safety.id}
      >
        <span className="sm-oct" aria-hidden="true" />
        <strong>{safety.label}{explored.has(safety.id) && <span className="seen" aria-label="explored"> ✓</span>}{suggested === safety.id && <span className="try-tag">Try next</span>}</strong>
        <span>Can happen at any step → {safety.outcome}</span>
      </button>
    </section>
  );
}
