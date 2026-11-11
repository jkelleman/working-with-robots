import { TOTE_ORDERS, ZONE_TIP, itemPhrase, rowZone, type PickTask } from '../data/tasks';

export type VerifyMode = 'scan' | 'camera';

/**
 * Multimodal signal map. Every state resolves to exactly one signal set,
 * so the screen, light tower, bin lights, tote wall, sound, and haptics
 * always say the same thing.
 *
 * Principle: every signal has a second channel. Color is always paired
 * with a blink pattern, a shape, and a text label.
 */

export type TowerColor = 'green' | 'amber' | 'red' | 'blue' | 'off';
export type BlinkPattern = 'steady' | 'slow' | 'fast';
export type Tone = 'none' | 'confirm' | 'attention' | 'stop';
export type Severity = 'info' | 'success' | 'warning' | 'stop';

export interface SignalSet {
  key: string;
  severity: Severity;
  tower: TowerColor;
  pattern: BlinkPattern;
  shape: 'circle' | 'triangle' | 'octagon' | 'square';
  towerLabel: string;
  tone: Tone;
  vibrate?: number[];
  headline: string;
  instruction: string;
  litBin?: string;
  litTote?: string;
  binColor?: TowerColor;
}

/** Flatten an XState state value like {working: {exception: 'toteFull'}} to "working.exception.toteFull". */
export function stateKey(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const [k, v] = Object.entries(value as Record<string, unknown>)[0];
    return `${k}.${stateKey(v)}`;
  }
  return '';
}

export function signalFor(key: string, task?: PickTask, verify: VerifyMode = 'scan'): SignalSet {
  const tip = task ? ZONE_TIP[rowZone(task.bin)] : '';
  const confirmHow = verify === 'camera' ? 'Lift it out. The camera confirms the pick.' : 'Scan it when it’s in your hand.';
  const qty = task ? itemPhrase(task) : '';
  const one = task ? task.short[0] : 'item';
  const order = task ? TOTE_ORDERS[task.tote] : '';
  switch (key) {
    case 'idle':
      return { key, severity: 'info', tower: 'off', pattern: 'steady', shape: 'square', towerLabel: 'Ready', tone: 'none',
        headline: 'Station ready', instruction: 'Check your area is clear, then tap Start shift.' };
    case 'working.podArriving':
      return { key, severity: 'info', tower: 'blue', pattern: 'slow', shape: 'circle', towerLabel: 'Pod inbound', tone: 'none',
        headline: 'Pod inbound', instruction: 'A drive unit is bringing the next pod. Keep hands clear of the opening.' };
    case 'working.pick':
      return { key, severity: 'info', tower: 'green', pattern: 'steady', shape: 'circle', towerLabel: 'Pick', tone: 'attention',
        headline: `Pick ${qty}`, instruction: `From bin ${task?.bin}, where the pick-to-light is on. ${confirmHow}${tip ? ` ${tip}` : ''}`, litBin: task?.bin, binColor: 'green' };
    case 'working.put':
      return { key, severity: 'info', tower: 'green', pattern: 'steady', shape: 'circle', towerLabel: 'Put', tone: 'confirm',
        headline: `Put to tote ${task?.tote}`, instruction: `Put-to-light is on at tote ${task?.tote}, order ${order}. Press the light once it’s in.`, litTote: task?.tote };
    case 'working.confirm':
      return { key, severity: 'success', tower: 'green', pattern: 'slow', shape: 'circle', towerLabel: 'Done', tone: 'confirm', vibrate: [40],
        headline: 'Pick complete', instruction: `The ${one} is in order ${order}. The drive unit takes this pod away. The next one is queued.` };
    case 'working.exception.wrongItem':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Mispick', tone: 'attention', vibrate: [80, 60, 80],
        headline: verify === 'camera' ? 'Mispick: wrong bin' : 'Mispick: wrong item', instruction: verify === 'camera' ? `The camera saw your hand in another bin. Return the item and pick from bin ${task?.bin}.` : `Return it to bin ${task?.bin} and pick the ${one} instead.`, litBin: task?.bin, binColor: 'amber' };
    case 'working.exception.missingItem':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Short pick', tone: 'attention', vibrate: [80, 60, 80],
        headline: `Short pick: bin ${task?.bin} looks empty`, instruction: 'Recount once. Still short? Tap Flag bin. Inventory control will do a cycle count.', litBin: task?.bin, binColor: 'amber' };
    case 'working.exception.damagedItem':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Damaged item', tone: 'attention', vibrate: [80, 60, 80],
        headline: 'Damaged item', instruction: 'Place it in the damage tote, then tap Done. It won’t ship.' };
    case 'working.exception.scannerFault':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Scanner fault', tone: 'attention', vibrate: [80, 60, 80],
        headline: verify === 'camera' ? 'Camera can’t confirm the pick' : 'Scanner fault', instruction: `Check the label matches ${task?.sku}, then tap Key in item.` };
    case 'working.exception.toteFull':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Tote full', tone: 'attention', vibrate: [80, 60, 80],
        headline: `Tote ${task?.tote} is full`, instruction: 'Push the full tote out to the conveyor, slide in an empty one, then tap Tote swapped.', litTote: task?.tote };
    case 'working.exception.podLate':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Starved', tone: 'none',
        headline: 'Station starved: pod is late', instruction: 'Nothing to do. Stay at the station. The drive unit is on its way.' };
    case 'working.escalated':
      return { key, severity: 'warning', tower: 'blue', pattern: 'fast', shape: 'square', towerLabel: 'Andon', tone: 'attention',
        headline: 'Andon pulled: Problem Solve is coming', instruction: 'Stay at the station. Problem Solve will clear it.' };
    case 'safetyStop.halted':
      return { key, severity: 'stop', tower: 'red', pattern: 'fast', shape: 'octagon', towerLabel: 'STOP', tone: 'stop', vibrate: [300, 100, 300],
        headline: 'STOP. Light curtain tripped', instruction: 'Drive units in this zone have stopped. Step back and check nothing is in the pod opening.' };
    case 'safetyStop.readyToResume':
      return { key, severity: 'stop', tower: 'red', pattern: 'steady', shape: 'octagon', towerLabel: 'Stopped', tone: 'none',
        headline: 'Area confirmed clear', instruction: 'When you are ready, press and hold Resume. Work picks up where it stopped.' };
    case 'done':
      return { key, severity: 'success', tower: 'green', pattern: 'steady', shape: 'circle', towerLabel: 'Complete', tone: 'confirm',
        headline: 'Wave complete', instruction: 'Great work. The station is ready for the next wave of orders.' };
    default:
      return { key, severity: 'info', tower: 'off', pattern: 'steady', shape: 'square', towerLabel: '', tone: 'none', headline: '', instruction: '' };
  }
}
