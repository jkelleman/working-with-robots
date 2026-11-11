/**
 * Narration for the stage: what's happening in plain words, then the design
 * decision behind it. Keyed by station state.
 */

export interface Narration {
  title: string;
  happening: string;
  why: string;
}

export const NARRATION: Record<string, Narration> = {
  idle: {
    title: 'Start of shift',
    happening: 'Maya checks that her area is clear, then starts her shift.',
    why: 'Starting takes one deliberate tap after an area check, so no robot heads toward a station that isn’t ready.',
  },
  'working.podArriving': {
    title: 'A robot brings the products',
    happening: 'A drive unit carries a pod, a rolling tower of bins, to her station.',
    why: 'The safety cover closes while the pod moves, and the screen tells her to keep hands clear. She always knows why she’s waiting.',
  },
  'working.pick': {
    title: 'She takes the item',
    happening: 'A light marks the bin. She takes the item and scans it.',
    why: 'The light and the screen show the same bin ID, so her eyes can stay on the pod. The quantity is the biggest text because a wrong count is easy to miss.',
  },
  'working.put': {
    title: 'She puts it in the order',
    happening: 'A light marks the customer’s tote. She drops the item in and presses the light.',
    why: 'Pressing the light confirms the put, with no screen tap. The hand holding the item finishes the job.',
  },
  'working.confirm': {
    title: 'Pick complete',
    happening: 'The item is in the order. The pod leaves and the next one is on its way.',
    why: 'A short tone and a green light close the loop in under a second, then get out of the way.',
  },
  done: {
    title: 'Wave complete',
    happening: 'Every order in this wave is filled.',
    why: 'The summary counts skipped picks separately, so exceptions stay visible to the shift lead.',
  },
  'working.exception.wrongItem': {
    title: 'Wrong item',
    happening: 'The scan didn’t match the order. Maya picked the item next to it.',
    why: 'The headline says what happened and the bin stays lit. She can tell it was a mix-up she can fix, with no error code.',
  },
  'working.exception.missingItem': {
    title: 'The bin looks empty',
    happening: 'The system says the item is here, but Maya can’t find it.',
    why: 'She recounts once, then flags the bin. The station moves her to the next pick so one empty bin can’t stall her shift.',
  },
  'working.exception.damagedItem': {
    title: 'Damaged item',
    happening: 'The item is broken or the box is crushed.',
    why: 'One action: put it in the damage tote. It won’t ship, and she moves on.',
  },
  'working.exception.scannerFault': {
    title: 'The scanner won’t read',
    happening: 'The label won’t scan, or the camera can’t see the item.',
    why: 'A fallback is always on the screen: key in the item. Broken equipment never blocks the pick.',
  },
  'working.exception.toteFull': {
    title: 'The order tote is full',
    happening: 'There’s no room left in the customer’s tote.',
    why: 'The tote light turns amber, and the screen lists the swap steps in order.',
  },
  'working.exception.podLate': {
    title: 'The robot is late',
    happening: 'Maya is ready, but the next pod hasn’t arrived.',
    why: 'She can’t fix a late robot, so the screen says “Nothing to do” and keeps her calm. No red, no alarm.',
  },
  'working.escalated': {
    title: 'Help is on the way',
    happening: 'Maya pulled the andon, the call for help. Problem Solve is coming.',
    why: 'The call carries the reason, so help arrives knowing the problem. She stays at her station.',
  },
  'safetyStop.halted': {
    title: 'Safety stop',
    happening: 'Her hand broke the safety beam across the pod opening. Every robot nearby stops.',
    why: 'Red is used only here. Restarting takes two deliberate steps so no one resumes by accident.',
  },
  'safetyStop.readyToResume': {
    title: 'Ready to resume',
    happening: 'Maya confirmed the area is clear.',
    why: 'Resume takes a press and hold. Work picks up exactly where it stopped.',
  },
};

/** Plain-language prompts for each branch. */
export const WHAT_IF: Record<string, string> = {
  podLate: 'the robot is late?',
  wrongItem: 'she takes the wrong item?',
  missingItem: 'the bin is empty?',
  damagedItem: 'the item is damaged?',
  scannerFault: 'the scanner won’t read?',
  toteFull: 'the order tote is full?',
  safetyStop: 'her hand breaks the safety beam?',
};
