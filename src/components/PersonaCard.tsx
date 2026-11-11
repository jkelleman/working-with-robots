import { PERSONA as P } from '../data/persona';
import More from './More';

/** Proto-persona card: the essentials up front, the research detail in accordions. */
export default function PersonaCard() {
  return (
    <article className="persona" aria-labelledby="persona-name">
      <header className="persona-head">
        <svg className="persona-avatar" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="32" fill="#e6eaee" />
          <circle cx="32" cy="25" r="11" fill="#8a96a3" />
          <path d="M12 56 c2-12 10-18 20-18 s18 6 20 18" fill="#5b6670" />
          <rect x="20" y="14" width="24" height="5" rx="2.5" fill="#5b6670" />
        </svg>
        <div>
          <p className="persona-tag">Proto-persona</p>
          <h3 id="persona-name">{P.name}</h3>
          <p className="persona-role">{P.role}</p>
          <ul className="persona-facts">
            <li>{P.tenure}</li>
            <li>{P.shift}</li>
            <li>Before: {P.before}</li>
          </ul>
        </div>
      </header>

      <blockquote className="persona-quote">“{P.quote}”</blockquote>
      <p className="persona-summary">{P.summary}</p>

      <div className="persona-cols">
        <section>
          <h4>Goals</h4>
          <ul>{P.goals.map((g) => <li key={g}>{g}</li>)}</ul>
        </section>
        <section>
          <h4>Frustrations</h4>
          <ul>{P.frustrations.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
      </div>

      <div className="acc-group">
        <More label="What she needs from the station" hint={`${P.needs.length} needs that shaped the design`}>
          <ul className="persona-list">{P.needs.map((n) => <li key={n}>{n}</li>)}</ul>
        </More>
        <More label="Her work environment" hint="Gloves, earplugs, glare, 10 hours standing">
          <ul className="persona-list">{P.context.map((c) => <li key={c}>{c}</li>)}</ul>
        </More>
        <More label="How she works" hint="Behaviors to design around">
          <ul className="persona-list">{P.behaviors.map((b) => <li key={b}>{b}</li>)}</ul>
        </More>
        <More label="A night in her shift" hint="6:30 pm to 5:00 am">
          <ol className="persona-day">
            {P.day.map(([t, d]) => <li key={t}><span>{t}</span>{d}</li>)}
          </ol>
        </More>
        <More label="Design for more people than Maya" hint="Persona spectrum">
          <p>One persona can hide whole groups. These associates face the same station with different limits.</p>
          <dl className="persona-dl">
            {P.spectrum.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </More>
        <More label="Other people at the station" hint="Secondary users">
          <dl className="persona-dl">
            {P.secondary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </More>
        <More label="Assumptions to validate" hint={`${P.assumptions.length} to test in field research`}>
          <p>Maya is built from public sources and assumptions. Each one needs evidence from the floor.</p>
          <table className="persona-table">
            <thead><tr><th>Assumption</th><th>How to test it</th></tr></thead>
            <tbody>{P.assumptions.map(([a, h]) => <tr key={a}><td>{a}</td><td>{h}</td></tr>)}</tbody>
          </table>
        </More>
      </div>
    </article>
  );
}
