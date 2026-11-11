import type { StationEvent } from '../machine/stationMachine';
import { SAMPLE_TASKS } from './tasks';

/**
 * The happy path and every scenario that deviates from it.
 * Each scenario lists the events that reproduce it from a fresh shift, so the
 * scenario map can jump straight to it, and tests can prove it lands there.
 */

export type StepId = 'arrive' | 'pick' | 'put' | 'done';

export interface HappyStep {
  id: StepId;
  label: string;
  hint: string;
  states: string[]; // station states that count as being on this step
}

export const HAPPY_PATH: HappyStep[] = [
  { id: 'arrive', label: 'Robot brings pod', hint: 'Hands clear', states: ['working.podArriving'] },
  { id: 'pick', label: 'Pick and scan', hint: 'From the lit bin', states: ['working.pick'] },
  { id: 'put', label: 'Put in tote', hint: 'Press tote button', states: ['working.put'] },
  { id: 'done', label: 'Task done', hint: 'Next task loads', states: ['working.confirm', 'done'] },
];

export interface Scenario {
  id: string;
  label: string;
  at: StepId | 'any';
  kind: 'exception' | 'safety';
  state: string; // the station state this scenario produces
  outcome: string; // where the worker ends up after recovering
  events: StationEvent[];
}

const good = SAMPLE_TASKS[0].sku;

export const SCENARIOS: Scenario[] = [
  { id: 'podLate', label: 'Pod is late', at: 'arrive', kind: 'exception', state: 'working.exception.podLate',
    outcome: 'Wait, then pick', events: [{ type: 'POD_TIMEOUT' }] },
  { id: 'wrongItem', label: 'Wrong item scanned', at: 'pick', kind: 'exception', state: 'working.exception.wrongItem',
    outcome: 'Back to pick', events: [{ type: 'POD_ARRIVED' }, { type: 'SCAN', sku: 'SKU-99999' }] },
  { id: 'missingItem', label: 'Bin is empty', at: 'pick', kind: 'exception', state: 'working.exception.missingItem',
    outcome: 'Skip to next task', events: [{ type: 'POD_ARRIVED' }, { type: 'REPORT_MISSING' }] },
  { id: 'damagedItem', label: 'Item is damaged', at: 'pick', kind: 'exception', state: 'working.exception.damagedItem',
    outcome: 'Skip to next task', events: [{ type: 'POD_ARRIVED' }, { type: 'REPORT_DAMAGED' }] },
  { id: 'scannerFault', label: 'Scanner fails', at: 'pick', kind: 'exception', state: 'working.exception.scannerFault',
    outcome: 'Verify by hand, then put', events: [{ type: 'POD_ARRIVED' }, { type: 'SCANNER_FAULT' }] },
  { id: 'toteFull', label: 'Tote is full', at: 'put', kind: 'exception', state: 'working.exception.toteFull',
    outcome: 'Swap tote, then put', events: [{ type: 'POD_ARRIVED' }, { type: 'SCAN', sku: good }, { type: 'TOTE_FULL' }] },
  { id: 'safetyStop', label: 'Light curtain broken', at: 'any', kind: 'safety', state: 'safetyStop.halted',
    outcome: 'Confirm clear, hold to resume', events: [{ type: 'POD_ARRIVED' }, { type: 'SCAN', sku: good }, { type: 'LIGHT_CURTAIN_BROKEN' }] },
];

/** Which happy-path step the current state belongs to (exceptions map to the step they branched from). */
export function stepFor(stateKey: string): StepId | null {
  const direct = HAPPY_PATH.find((s) => s.states.includes(stateKey));
  if (direct) return direct.id;
  const sc = SCENARIOS.find((s) => s.state === stateKey);
  if (sc && sc.at !== 'any') return sc.at;
  return null;
}
