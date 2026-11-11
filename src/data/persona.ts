/**
 * Proto-persona: built from public sources and stated assumptions, before
 * field research. Every assumption below is listed with how to test it.
 */

export const PERSONA = {
  name: 'Maya',
  role: 'Pick associate, goods-to-person station',
  tenure: '3 weeks on the job',
  shift: 'Nights, four 10-hour shifts a week',
  before: 'Line cook for four years',
  quote: 'Just tell me what to do next, and whether I messed up.',
  summary:
    'Maya is fast, careful, and still learning the floor. She came from a kitchen, so noise and speed don’t faze her. What does is not knowing whether a problem is her fault, and not knowing how long she’ll wait for help.',
  goals: [
    'Hit her rate without mistakes before her training period ends',
    'Fix problems herself without flagging someone down',
    'Finish the shift without a sore back or shoulders',
  ],
  frustrations: [
    'Can’t tell if a problem is her error or the system’s',
    'Waits for help with no idea how long it will take',
    'Training terms she hasn’t memorized yet show up on the screen',
  ],
  context: [
    'Stands at one station for 10 hours with short breaks',
    'Wears gloves and hearing protection the whole shift',
    'Works under bright overhead light, with drive units moving nearby',
    'Has no phone on the floor and relies on the screen and lights',
  ],
  behaviors: [
    'Glances at the screen, then works from the lights',
    'Learns by doing and copies what the associate next to her does',
    'Hesitates to pull the andon because she doesn’t want to look slow',
    'Rechecks a bin twice before she reports it empty',
  ],
  needs: [
    'One clear next step, every time',
    'A plain answer to “was that me?”',
    'A wait time whenever she has to wait',
    'Signals that work through gloves, earplugs, and glare',
    'Picks that land between her thighs and chest',
  ],
  day: [
    ['6:30 pm', 'Clocks in, stretches, gets her station assignment'],
    ['7:00 pm', 'Starts her first wave. Steady and fast.'],
    ['9:40 pm', 'A bin looks empty. She recounts and isn’t sure what to tap.'],
    ['11:15 pm', 'First break. Asks a coworker what “short pick” means.'],
    ['1:30 am', 'A light curtain trips when she reaches in early. Everything stops.'],
    ['3:00 am', 'Top-row picks start to wear on her shoulders.'],
    ['5:00 am', 'Clocks out. Her rate was close, with two exceptions she couldn’t resolve.'],
  ] as Array<[string, string]>,
  spectrum: [
    ['Permanent', 'Color-blind associate who can’t rely on the stack light’s colors'],
    ['Temporary', 'Associate with a wrist injury, working one-handed or left-handed'],
    ['Situational', 'Any associate wearing earplugs and gloves on a loud floor'],
    ['Language', 'Associate whose first language isn’t English'],
  ] as Array<[string, string]>,
  assumptions: [
    ['Newer associates hesitate to pull the andon', 'Shadowing, plus andon timing in the logs'],
    ['Associates can’t tell their errors from system errors', 'Think-aloud during exception tasks'],
    ['Waiting without an ETA causes more stress than the wait itself', 'Post-task interviews after a starved station'],
    ['Hearing protection masks most station tones', 'Tone tests on the floor, with earplugs in'],
    ['Top- and bottom-row picks cause most of the strain', 'Reach observation and VR ergonomics study'],
  ] as Array<[string, string]>,
  secondary: [
    ['Problem Solve associate', 'Answers the andon. Needs the reason and the context before walking over.'],
    ['Shift lead', 'Watches station status across the floor. Needs the stack light readable from far away.'],
  ] as Array<[string, string]>,
};
