import type { PickTask } from '../data/tasks';

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

export function signalFor(key: string, task?: PickTask): SignalSet {
  const qty = task ? `${task.quantity} × ${task.itemName}` : '';
  switch (key) {
    case 'idle':
      return { key, severity: 'info', tower: 'off', pattern: 'steady', shape: 'square', towerLabel: 'Ready', tone: 'none',
        headline: 'Station ready', instruction: 'Check your area is clear, then tap Start shift.' };
    case 'working.podArriving':
      return { key, severity: 'info', tower: 'blue', pattern: 'slow', shape: 'circle', towerLabel: 'Pod moving', tone: 'none',
        headline: 'Pod arriving', instruction: 'Keep hands clear of the pod opening.' };
    case 'working.pick':
      return { key, severity: 'info', tower: 'green', pattern: 'steady', shape: 'circle', towerLabel: 'Pick', tone: 'attention',
        headline: `Pick from bin ${task?.bin}`, instruction: `Take ${qty} and scan it.`, litBin: task?.bin, binColor: 'green' };
    case 'working.put':
      return { key, severity: 'info', tower: 'green', pattern: 'steady', shape: 'circle', towerLabel: 'Put', tone: 'confirm',
        headline: `Put in tote ${task?.tote}`, instruction: 'Place the item in the lit tote, then press the tote button.', litTote: task?.tote };
    case 'working.confirm':
      return { key, severity: 'success', tower: 'green', pattern: 'slow', shape: 'circle', towerLabel: 'Done', tone: 'confirm', vibrate: [40],
        headline: 'Task complete', instruction: 'Next task is ready.' };
    case 'working.exception.wrongItem':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Check item', tone: 'attention', vibrate: [80, 60, 80],
        headline: "That's not the right item", instruction: `Put it back in bin ${task?.bin}, then pick ${qty}.`, litBin: task?.bin, binColor: 'amber' };
    case 'working.exception.missingItem':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Item missing', tone: 'attention', vibrate: [80, 60, 80],
        headline: `Bin ${task?.bin} looks empty`, instruction: 'Recount once. Still missing? Tap Skip and flag bin. Inventory will recount it.', litBin: task?.bin, binColor: 'amber' };
    case 'working.exception.damagedItem':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Damaged item', tone: 'attention', vibrate: [80, 60, 80],
        headline: 'Item damaged', instruction: 'Place it in the red damage tote, then tap Done.' };
    case 'working.exception.scannerFault':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Scanner issue', tone: 'attention', vibrate: [80, 60, 80],
        headline: "Scanner isn't responding", instruction: `Check the item label matches ${task?.sku}, then tap Verify manually.` };
    case 'working.exception.toteFull':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Tote full', tone: 'attention', vibrate: [80, 60, 80],
        headline: `Tote ${task?.tote} is full`, instruction: 'Push the full tote out, slide in an empty one, then tap Tote swapped.', litTote: task?.tote };
    case 'working.exception.podLate':
      return { key, severity: 'warning', tower: 'amber', pattern: 'slow', shape: 'triangle', towerLabel: 'Pod delayed', tone: 'none',
        headline: 'Pod is running late', instruction: 'No action needed. Stay at the station; the pod is on its way.' };
    case 'working.escalated':
      return { key, severity: 'warning', tower: 'blue', pattern: 'fast', shape: 'square', towerLabel: 'Lead called', tone: 'attention',
        headline: 'Your lead is on the way', instruction: 'Stay at the station. Your lead will clear this task.' };
    case 'safetyStop.halted':
      return { key, severity: 'stop', tower: 'red', pattern: 'fast', shape: 'octagon', towerLabel: 'STOP', tone: 'stop', vibrate: [300, 100, 300],
        headline: 'STOP. Light curtain broken', instruction: 'Robots have stopped. Step back from the pod and check nothing is in the opening.' };
    case 'safetyStop.readyToResume':
      return { key, severity: 'stop', tower: 'red', pattern: 'steady', shape: 'octagon', towerLabel: 'Stopped', tone: 'none',
        headline: 'Area confirmed clear', instruction: 'When you are ready, press and hold Resume. Work picks up where it stopped.' };
    case 'done':
      return { key, severity: 'success', tower: 'green', pattern: 'steady', shape: 'circle', towerLabel: 'Complete', tone: 'confirm',
        headline: 'All tasks complete', instruction: 'Great work. Station is ready for the next wave.' };
    default:
      return { key, severity: 'info', tower: 'off', pattern: 'steady', shape: 'square', towerLabel: '', tone: 'none', headline: '', instruction: '' };
  }
}
