import { assign, setup } from 'xstate';
import { SAMPLE_TASKS, type PickTask } from '../data/tasks';

/**
 * Workstation state machine.
 *
 * One source of truth for the screen, the light tower, the bin lights,
 * the tote wall, and the audio cues. Every signal is derived from the
 * current state, so the channels can never disagree.
 */

export type ExceptionType =
  | 'wrongItem'
  | 'missingItem'
  | 'damagedItem'
  | 'scannerFault'
  | 'toteFull'
  | 'podLate';

export type EscalationReason =
  | 'Short pick after recount'
  | 'Damage needs inspection'
  | 'Equipment fault'
  | 'Safety concern'
  | 'Other';

export interface LogEntry {
  type: ExceptionType | 'safetyStop' | 'escalation';
  taskId: string;
  at: number;
  detail?: string;
}

export interface StationContext {
  tasks: PickTask[];
  index: number;
  completed: number;
  skipped: number;
  log: LogEntry[];
  escalationReason?: EscalationReason;
}

export type StationEvent =
  | { type: 'START' }
  | { type: 'POD_ARRIVED' }
  | { type: 'POD_TIMEOUT' }
  | { type: 'SCAN'; sku: string }
  | { type: 'REPORT_MISSING' }
  | { type: 'REPORT_DAMAGED' }
  | { type: 'SCANNER_FAULT' }
  | { type: 'MANUAL_VERIFY' }
  | { type: 'PUT_CONFIRMED' }
  | { type: 'TOTE_FULL' }
  | { type: 'NEXT' }
  | { type: 'RESOLVE' }
  | { type: 'ESCALATE'; reason: EscalationReason }
  | { type: 'LEAD_CLEARED' }
  | { type: 'LIGHT_CURTAIN_BROKEN' }
  | { type: 'AREA_CLEAR_CONFIRMED' }
  | { type: 'RESUME' }
  | { type: 'RESET' };

export const currentTask = (ctx: StationContext): PickTask | undefined =>
  ctx.tasks[ctx.index];

export const stationMachine = setup({
  types: {
    context: {} as StationContext,
    events: {} as StationEvent,
  },
  guards: {
    skuMatches: ({ context, event }) =>
      event.type === 'SCAN' && event.sku === currentTask(context)?.sku,
    skuMismatch: ({ context, event }) =>
      event.type === 'SCAN' && event.sku !== currentTask(context)?.sku,
    hasMoreTasks: ({ context }) => context.index < context.tasks.length,
  },
  actions: {
    markCompleted: assign({ completed: ({ context }) => context.completed + 1 }),
    markSkipped: assign({ skipped: ({ context }) => context.skipped + 1 }),
    advance: assign({ index: ({ context }) => context.index + 1 }),
    setEscalation: assign({
      escalationReason: ({ event }) =>
        event.type === 'ESCALATE' ? event.reason : undefined,
    }),
    clearEscalation: assign({ escalationReason: undefined }),
    logEvent: assign({
      log: ({ context }, params: { kind: LogEntry['type'] }) => [
        ...context.log,
        { type: params.kind, taskId: currentTask(context)?.id ?? '-', at: Date.now() },
      ],
    }),
    logEscalation: assign({
      log: ({ context, event }) => [
        ...context.log,
        {
          type: 'escalation' as const,
          taskId: currentTask(context)?.id ?? '-',
          at: Date.now(),
          detail: event.type === 'ESCALATE' ? event.reason : undefined,
        },
      ],
    }),
  },
}).createMachine({
  id: 'station',
  initial: 'idle',
  context: {
    tasks: SAMPLE_TASKS,
    index: 0,
    completed: 0,
    skipped: 0,
    log: [],
  },
  on: {
    RESET: { target: '.idle', actions: assign({ index: 0, completed: 0, skipped: 0, log: [] }) },
  },
  states: {
    idle: {
      on: { START: 'working' },
    },

    working: {
      initial: 'podArriving',
      on: {
        // Safety overrides everything while work is in progress.
        LIGHT_CURTAIN_BROKEN: { target: 'safetyStop', actions: { type: 'logEvent', params: { kind: 'safetyStop' } } },
      },
      states: {
        hist: { type: 'history', history: 'deep' },

        podArriving: {
          on: {
            POD_ARRIVED: 'pick',
            POD_TIMEOUT: { target: 'exception.podLate', actions: { type: 'logEvent', params: { kind: 'podLate' } } },
          },
        },

        pick: {
          on: {
            SCAN: [
              { guard: 'skuMatches', target: 'put' },
              { guard: 'skuMismatch', target: 'exception.wrongItem', actions: { type: 'logEvent', params: { kind: 'wrongItem' } } },
            ],
            REPORT_MISSING: { target: 'exception.missingItem', actions: { type: 'logEvent', params: { kind: 'missingItem' } } },
            REPORT_DAMAGED: { target: 'exception.damagedItem', actions: { type: 'logEvent', params: { kind: 'damagedItem' } } },
            SCANNER_FAULT: { target: 'exception.scannerFault', actions: { type: 'logEvent', params: { kind: 'scannerFault' } } },
          },
        },

        put: {
          on: {
            PUT_CONFIRMED: { target: 'confirm', actions: 'markCompleted' },
            TOTE_FULL: { target: 'exception.toteFull', actions: { type: 'logEvent', params: { kind: 'toteFull' } } },
          },
        },

        confirm: {
          on: { NEXT: 'advancing' },
        },

        advancing: {
          entry: 'advance',
          always: [
            { guard: 'hasMoreTasks', target: 'podArriving' },
            { target: '#station.done' },
          ],
        },

        exception: {
          // Always entered by targeting a specific child; the initial is required by XState.
          initial: 'wrongItem',
          on: {
            ESCALATE: { target: 'escalated', actions: ['setEscalation', 'logEscalation'] },
          },
          states: {
            // Worker scanned the wrong item: put it back, then rescan.
            wrongItem: { on: { RESOLVE: '#station.working.pick' } },
            // Item not in bin: flag the bin for inventory and move on.
            missingItem: { on: { RESOLVE: { target: '#station.working.advancing', actions: 'markSkipped' } } },
            // Damaged: place in the damage tote and move on.
            damagedItem: { on: { RESOLVE: { target: '#station.working.advancing', actions: 'markSkipped' } } },
            // Scanner down: verify by keying the item ID, then continue to put.
            scannerFault: { on: { MANUAL_VERIFY: '#station.working.put' } },
            // Tote full: swap in an empty tote, then finish the put.
            toteFull: { on: { RESOLVE: '#station.working.put' } },
            // Pod is late: wait, then pick when it arrives.
            podLate: { on: { POD_ARRIVED: '#station.working.pick' } },
          },
        },

        escalated: {
          on: {
            LEAD_CLEARED: {
              target: 'advancing',
              actions: ['clearEscalation', 'markSkipped'],
            },
          },
        },
      },
    },

    // Two-step resume: confirm the area is clear, then deliberately resume.
    safetyStop: {
      initial: 'halted',
      states: {
        halted: { on: { AREA_CLEAR_CONFIRMED: 'readyToResume' } },
        readyToResume: { on: { RESUME: '#station.working.hist' } },
      },
    },

    done: {},
  },
});
