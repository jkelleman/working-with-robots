import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { stationMachine } from '../machine/stationMachine';
import { stateKey } from '../machine/signals';
import { HAPPY_PATH, SCENARIOS, stepFor } from './scenarios';

describe('scenario map', () => {
  it.each(SCENARIOS)('"$label" lands in $state', (s) => {
    const a = createActor(stationMachine).start();
    a.send({ type: 'START' });
    s.events.forEach((e) => a.send(e));
    expect(stateKey(a.getSnapshot().value)).toBe(s.state);
  });

  it('every exception branches from a real happy-path step', () => {
    const ids = HAPPY_PATH.map((h) => h.id);
    for (const s of SCENARIOS) {
      if (s.kind === 'exception') expect(ids).toContain(s.at);
      else expect(s.at).toBe('any');
    }
  });

  it('maps exceptions back to the step they came from', () => {
    expect(stepFor('working.exception.toteFull')).toBe('put');
    expect(stepFor('working.exception.wrongItem')).toBe('pick');
    expect(stepFor('working.pick')).toBe('pick');
    expect(stepFor('safetyStop.halted')).toBeNull();
  });
});
