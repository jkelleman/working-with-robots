import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { stationMachine } from './stationMachine';
import { signalFor, stateKey } from './signals';
import { SAMPLE_TASKS } from '../data/tasks';

const start = () => {
  const actor = createActor(stationMachine).start();
  actor.send({ type: 'START' });
  return actor;
};
const key = (a: ReturnType<typeof start>) => stateKey(a.getSnapshot().value);
const toPick = (a: ReturnType<typeof start>) => a.send({ type: 'POD_ARRIVED' });
const goodScan = (a: ReturnType<typeof start>) =>
  a.send({ type: 'SCAN', sku: SAMPLE_TASKS[a.getSnapshot().context.index].sku });

describe('happy path', () => {
  it('runs every pick in the wave to done', () => {
    const a = start();
    for (let i = 0; i < SAMPLE_TASKS.length; i++) {
      expect(key(a)).toBe('working.podArriving');
      toPick(a);
      goodScan(a);
      expect(key(a)).toBe('working.put');
      a.send({ type: 'PUT_CONFIRMED' });
      expect(key(a)).toBe('working.confirm');
      a.send({ type: 'NEXT' });
    }
    expect(key(a)).toBe('done');
    expect(a.getSnapshot().context.completed).toBe(SAMPLE_TASKS.length);
  });
});

describe('exceptions', () => {
  it('wrong item returns to pick and logs', () => {
    const a = start();
    toPick(a);
    a.send({ type: 'SCAN', sku: 'SKU-00000' });
    expect(key(a)).toBe('working.exception.wrongItem');
    a.send({ type: 'RESOLVE' });
    expect(key(a)).toBe('working.pick');
    expect(a.getSnapshot().context.log[0].type).toBe('wrongItem');
  });

  it('short pick skips to the next pick', () => {
    const a = start();
    toPick(a);
    a.send({ type: 'REPORT_MISSING' });
    expect(key(a)).toBe('working.exception.missingItem');
    a.send({ type: 'RESOLVE' });
    expect(key(a)).toBe('working.podArriving');
    expect(a.getSnapshot().context.index).toBe(1);
    expect(a.getSnapshot().context.skipped).toBe(1);
  });

  it('damaged item skips to the next pick', () => {
    const a = start();
    toPick(a);
    a.send({ type: 'REPORT_DAMAGED' });
    expect(key(a)).toBe('working.exception.damagedItem');
    a.send({ type: 'RESOLVE' });
    expect(key(a)).toBe('working.podArriving');
  });

  it('scanner fault allows manual verify, then put', () => {
    const a = start();
    toPick(a);
    a.send({ type: 'SCANNER_FAULT' });
    expect(key(a)).toBe('working.exception.scannerFault');
    a.send({ type: 'RESOLVE' }); // not a valid way out
    expect(key(a)).toBe('working.exception.scannerFault');
    a.send({ type: 'MANUAL_VERIFY' });
    expect(key(a)).toBe('working.put');
  });

  it('tote full returns to put after a swap', () => {
    const a = start();
    toPick(a);
    goodScan(a);
    a.send({ type: 'TOTE_FULL' });
    expect(key(a)).toBe('working.exception.toteFull');
    a.send({ type: 'RESOLVE' });
    expect(key(a)).toBe('working.put');
  });

  it('late pod waits, then goes to pick on arrival', () => {
    const a = start();
    a.send({ type: 'POD_TIMEOUT' });
    expect(key(a)).toBe('working.exception.podLate');
    a.send({ type: 'POD_ARRIVED' });
    expect(key(a)).toBe('working.pick');
  });

  it('andon records the reason and Problem Solve clears it', () => {
    const a = start();
    toPick(a);
    a.send({ type: 'REPORT_DAMAGED' });
    a.send({ type: 'ESCALATE', reason: 'Damage needs inspection' });
    expect(key(a)).toBe('working.escalated');
    expect(a.getSnapshot().context.escalationReason).toBe('Damage needs inspection');
    a.send({ type: 'LEAD_CLEARED' });
    expect(key(a)).toBe('working.podArriving');
    expect(a.getSnapshot().context.escalationReason).toBeUndefined();
  });
});

describe('safety stop', () => {
  it('overrides any working state', () => {
    const states: Array<(a: ReturnType<typeof start>) => void> = [
      () => {},
      (a) => toPick(a),
      (a) => { toPick(a); goodScan(a); },
      (a) => { toPick(a); a.send({ type: 'REPORT_MISSING' }); },
    ];
    for (const setupState of states) {
      const a = start();
      setupState(a);
      a.send({ type: 'LIGHT_CURTAIN_BROKEN' });
      expect(key(a)).toBe('safetyStop.halted');
    }
  });

  it('requires two deliberate steps to resume, and resumes where it stopped', () => {
    const a = start();
    toPick(a);
    goodScan(a);
    expect(key(a)).toBe('working.put');
    a.send({ type: 'LIGHT_CURTAIN_BROKEN' });
    a.send({ type: 'RESUME' }); // ignored until the area is confirmed clear
    expect(key(a)).toBe('safetyStop.halted');
    a.send({ type: 'AREA_CLEAR_CONFIRMED' });
    expect(key(a)).toBe('safetyStop.readyToResume');
    a.send({ type: 'RESUME' });
    expect(key(a)).toBe('working.put');
  });

  it('resumes into the same exception it interrupted', () => {
    const a = start();
    toPick(a);
    goodScan(a);
    a.send({ type: 'TOTE_FULL' });
    a.send({ type: 'LIGHT_CURTAIN_BROKEN' });
    a.send({ type: 'AREA_CLEAR_CONFIRMED' });
    a.send({ type: 'RESUME' });
    expect(key(a)).toBe('working.exception.toteFull');
  });

  it('ignores associate events while stopped', () => {
    const a = start();
    toPick(a);
    a.send({ type: 'LIGHT_CURTAIN_BROKEN' });
    goodScan(a);
    a.send({ type: 'PUT_CONFIRMED' });
    expect(key(a)).toBe('safetyStop.halted');
  });
});

describe('signals', () => {
  const allKeys = [
    'idle', 'working.podArriving', 'working.pick', 'working.put', 'working.confirm',
    'working.exception.wrongItem', 'working.exception.missingItem', 'working.exception.damagedItem',
    'working.exception.scannerFault', 'working.exception.toteFull', 'working.exception.podLate',
    'working.escalated', 'safetyStop.halted', 'safetyStop.readyToResume', 'done',
  ];

  it('gives every state a headline, instruction and a non-color channel', () => {
    for (const k of allKeys) {
      const s = signalFor(k, SAMPLE_TASKS[0]);
      expect(s.headline, k).not.toBe('');
      expect(s.instruction, k).not.toBe('');
      expect(s.shape, k).toBeTruthy();
      if (k !== 'idle') expect(s.towerLabel, k).not.toBe('');
    }
  });

  it('only the safety stop uses red and the octagon', () => {
    for (const k of allKeys) {
      const s = signalFor(k, SAMPLE_TASKS[0]);
      const isStop = k.startsWith('safetyStop');
      expect(s.tower === 'red', k).toBe(isStop);
      expect(s.shape === 'octagon', k).toBe(isStop);
    }
  });
});
