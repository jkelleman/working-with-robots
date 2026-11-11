export interface Pattern {
  name: string;
  purpose: string;
  whenToUse: string;
  states: string[];
  mapping: { screen: string; light: string; sound: string; haptic: string };
  do: string[];
  dont: string[];
}

export const PATTERNS: Pattern[] = [
  {
    name: 'Status signal',
    purpose: 'Tell the associate, at a glance and from any angle, what the station needs.',
    whenToUse: 'Every state. It is the backbone all other patterns sit on.',
    states: ['Ready', 'Pod inbound', 'Pick/Put', 'Exception', 'Andon', 'E-stop'],
    mapping: { screen: 'Colored top band + headline', light: 'One stack light tier, color + blink rate + shape', sound: 'Tone family by severity', haptic: 'Pulse count by severity' },
    do: ['Pair every color with a shape, blink rate and text label', 'Reserve red and the octagon for safety only'],
    dont: ['Use color alone', 'Light more than one stack light tier at once'],
  },
  {
    name: 'Pick card',
    purpose: 'Show exactly what to pick and where it goes, readable at arm’s length.',
    whenToUse: 'Pick and put steps, and inside exceptions so context is never lost.',
    states: ['Active', 'In exception', 'Completed'],
    mapping: { screen: 'Large bin, tote and quantity; item name secondary', light: 'Pick-to-light and put-to-light repeat the IDs', sound: 'Attention tone on new pick', haptic: 'None' },
    do: ['Make the bin, tote and quantity the largest text', 'Keep the card visible during exceptions'],
    dont: ['Hide the quantity in a sentence', 'Truncate item names without a full-name fallback'],
  },
  {
    name: 'Exception card',
    purpose: 'Name the problem in plain words and give one next step.',
    whenToUse: 'Mispick, short pick, damaged item, scanner fault, tote full, starved station.',
    states: ['Raised', 'Self-resolved', 'Andon pulled'],
    mapping: { screen: 'Amber band, problem headline, single primary action', light: 'Amber, slow blink, triangle', sound: 'Two equal mid tones', haptic: 'Two short pulses' },
    do: ['Write the headline as what happened, the body as what to do', 'Offer the andon as a secondary path, not the first'],
    dont: ['Show error codes as the headline', 'Offer more than one primary action'],
  },
  {
    name: 'Safety stop',
    purpose: 'Halt work instantly and make restarting a deliberate act.',
    whenToUse: 'Light curtain trip, E-stop pressed, or any drive unit motion hazard.',
    states: ['Halted', 'Area confirmed clear', 'Resumed'],
    mapping: { screen: 'Full-screen red, STOP badge, one instruction', light: 'Red, fast blink, octagon', sound: 'Three low long pulses, never muted', haptic: 'Long double pulse' },
    do: ['Override every other state', 'Require confirm-clear, then press-and-hold to resume', 'Resume exactly where work stopped'],
    dont: ['Allow a single tap to resume', 'Let reduced-sound settings silence it'],
  },
  {
    name: 'Andon',
    purpose: 'Pull the andon: get Problem Solve to the station with the right context, without the associate leaving.',
    whenToUse: 'When self-recovery fails or a safety or damage judgment is needed.',
    states: ['Choosing reason', 'Andon pulled', 'Cleared'],
    mapping: { screen: 'Reason list, then a calm waiting message', light: 'Blue, fast blink, square', sound: 'Attention tone once', haptic: 'None' },
    do: ['Ask for a reason with a short fixed list', 'Tell the associate what happens next and that they can stay put'],
    dont: ['Make the andon the default action', 'Require typing'],
  },
  {
    name: 'Confirmation',
    purpose: 'Close the loop so the associate knows the system registered the action.',
    whenToUse: 'After every put, and after resolving an exception.',
    states: ['Confirmed'],
    mapping: { screen: 'Brief success state, next pick primed', light: 'Green, slow blink', sound: 'Two rising notes', haptic: 'One short pulse' },
    do: ['Confirm within 100 ms of the action', 'Keep it brief so it never slows the next pick'],
    dont: ['Use a modal that needs dismissing'],
  },
  {
    name: 'Progress',
    purpose: 'Show where the associate is in the wave without adding pressure.',
    whenToUse: 'Persistent header on every screen.',
    states: ['In progress', 'Complete'],
    mapping: { screen: 'Pick X of Y in the wave, picked and skipped counts', light: 'None', sound: 'None', haptic: 'None' },
    do: ['Count skipped picks separately so exceptions are not hidden'],
    dont: ['Show rate-based pressure metrics to the associate in real time'],
  },
  {
    name: 'Screen-to-light handoff',
    purpose: 'Move the associate’s attention from the screen to the physical location.',
    whenToUse: 'Every pick and put, when the action happens away from the screen.',
    states: ['Screen leads', 'Light leads'],
    mapping: { screen: 'Headline names the bin or tote', light: 'Bin or tote lights with a downward arrow', sound: 'Tone when the light changes', haptic: 'None' },
    do: ['Repeat the location ID in both places', 'Let a tote-button press confirm the put, no screen tap needed'],
    dont: ['Make the associate look back at the screen to confirm a physical action'],
  },
];
