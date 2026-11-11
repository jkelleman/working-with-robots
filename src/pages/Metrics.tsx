import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DESIGN_LEVERS, generateMetrics } from '../data/metrics';
import PageHeader, { MetricsArt } from '../components/PageHeader';
import More from '../components/More';

const { days, recovery, mix } = generateMetrics();
const avg = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / xs.length);
const before = days.filter((d) => d.phase === 'Baseline');
const after = days.filter((d) => d.phase !== 'Baseline');

function Stat({ label, b, a, unit, betterLow }: { label: string; b: number; a: number; unit: string; betterLow?: boolean }) {
  const delta = ((a - b) / b) * 100;
  const good = betterLow ? delta < 0 : delta > 0;
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{a.toFixed(1)}<span className="stat-unit"> {unit}</span></div>
      <div className={`stat-delta ${good ? 'good' : 'bad'}`}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}% vs. baseline</div>
    </div>
  );
}

const AXIS = { fill: '#7a838b', fontSize: 12 };
// SVG presentation attributes don't resolve CSS variables, so chart colors are literal.
const C = { primary: '#2f6fe0', secondary: '#d0811a', baseline: '#9aa3ab', grid: '#c9cec7', ref: '#7a838b' };

export default function Metrics() {
  const stops = { b: before.reduce((s, d) => s + d.safetyStops, 0), a: after.reduce((s, d) => s + d.safetyStops, 0) };
  return (
    <>
    <PageHeader
      accent="green"
      eyebrow="Measuring success"
      title="Ops metrics"
      sub="How you’d know the design works on the floor: the new recovery flows ship on day 15. Synthetic data."
      art={<MetricsArt />}
    />
    <div className="page">

      <div className="stats">
        <Stat label="Units per hour" b={avg(before.map((d) => d.unitsPerHour))} a={avg(after.map((d) => d.unitsPerHour))} unit="UPH" />
        <Stat label="Task cycle time" b={avg(before.map((d) => d.cycleTimeSec))} a={avg(after.map((d) => d.cycleTimeSec))} unit="sec" betterLow />
        <Stat label="Exception rate" b={avg(before.map((d) => d.exceptionRate))} a={avg(after.map((d) => d.exceptionRate))} unit="/100 tasks" betterLow />
        <Stat label="Avg time to recover" b={avg(recovery.map((r) => r.before))} a={avg(recovery.map((r) => r.after))} unit="sec" betterLow />
      </div>

      <section className="chart-card">
        <h3>Units per hour and cycle time</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={days} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid stroke={C.grid} strokeOpacity={0.6} vertical={false} />
            <XAxis dataKey="day" tick={AXIS} interval={3} />
            <YAxis yAxisId="l" tick={AXIS} domain={[260, 340]} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS} domain={[9, 14]} />
            <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)' }} />
            <Legend />
            <ReferenceLine yAxisId="l" x="D15" stroke={C.ref} strokeDasharray="4 4" label={{ value: 'New flows ship', fill: C.ref, fontSize: 12, position: 'insideTopRight' }} />
            <Line yAxisId="l" type="monotone" dataKey="unitsPerHour" name="Units per hour" stroke={C.primary} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="r" type="monotone" dataKey="cycleTimeSec" name="Cycle time (sec)" stroke={C.secondary} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-card">
        <h3>Time to recover, by exception (seconds)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={recovery} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid stroke={C.grid} strokeOpacity={0.6} vertical={false} />
            <XAxis dataKey="type" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)' }} />
            <Legend />
            <Bar dataKey="before" name="Baseline" fill={C.baseline} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="after" name="New flows" fill={C.primary} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
        <More className="more-compact" label="Why starved station barely moves"><p className="muted small">The associate can’t fix a late pod, so the design goal there is a calm wait, not a faster one.</p></More>
      </section>

      <div className="acc-group">
        <More label="Exception mix" hint="Share of each exception type">
          <div className="chart-card chart-flat">
                <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mix} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 24 }}>
            <CartesianGrid stroke={C.grid} strokeOpacity={0.6} horizontal={false} />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="type" tick={AXIS} width={100} />
            <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)' }} />
            <Bar dataKey="share" name="Share %" fill={C.secondary} radius={[0, 3, 3, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
        </More>
        <More label="Safety stops" hint="Before and after">
          <div className="chart-card chart-flat">
        <p>{stops.b} in the 14-day baseline, {stops.a} in the 14 days after. Every stop is logged with the task ID so shift leads and safety can review patterns by station.</p>
      </div>
        </More>
        <More label="Which design changes move each metric" hint="The lever behind each number">
          <div className="chart-card chart-flat">
        <dl className="levers">
          {Object.entries(DESIGN_LEVERS).map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
        </More>
      </div>
    </div>
    </>
  );
}
