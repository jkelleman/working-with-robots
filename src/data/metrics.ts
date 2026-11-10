// Synthetic metrics. Generated with a seeded random number generator so
// charts are stable between builds. Not real operational data.

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DayMetrics {
  day: string;
  unitsPerHour: number;
  cycleTimeSec: number;
  exceptionRate: number; // per 100 tasks
  safetyStops: number;
  phase: 'Baseline' | 'New exception flows';
}

export const EXCEPTION_TYPES = ['Wrong item', 'Missing item', 'Damaged', 'Scanner fault', 'Tote full', 'Pod late'] as const;

export function generateMetrics(seed = 14) {
  const rand = mulberry32(seed);
  const days: DayMetrics[] = [];
  for (let d = 1; d <= 28; d++) {
    const after = d > 14; // redesigned recovery flows ship on day 15
    days.push({
      day: `D${d}`,
      unitsPerHour: Math.round((after ? 318 : 292) + rand() * 24 - 12),
      cycleTimeSec: +((after ? 10.9 : 12.1) + rand() * 1.2 - 0.6).toFixed(1),
      exceptionRate: +((after ? 3.1 : 4.2) + rand() * 0.8 - 0.4).toFixed(2),
      safetyStops: Math.floor(rand() * (after ? 1.3 : 3)),
      phase: after ? 'New exception flows' : 'Baseline',
    });
  }

  const recoverBefore = [38, 64, 52, 71, 29, 90];
  const recoverAfter = [14, 33, 27, 41, 18, 88];
  const recovery = EXCEPTION_TYPES.map((type, i) => ({
    type,
    before: recoverBefore[i] + Math.round(rand() * 6 - 3),
    after: recoverAfter[i] + Math.round(rand() * 6 - 3),
  }));

  const mix = EXCEPTION_TYPES.map((type, i) => ({
    type,
    share: [24, 21, 9, 12, 19, 15][i],
  }));

  return { days, recovery, mix };
}

export const DESIGN_LEVERS: Record<string, string> = {
  'Units per hour': 'Fewer screen reads per task: put the bin and tote IDs in the light, not only on the screen.',
  'Task cycle time': 'Pre-stage the next task during the put so the screen is ready when the pod lands.',
  'Exception rate': 'Show item photos at pick to cut wrong-item scans, the largest exception type.',
  'Time to recover': 'One clear next step per exception; self-serve recovery before escalation.',
  'Safety stops': 'Pod-opening light curtain plus a hold-to-resume control prevents rushed restarts.',
};
