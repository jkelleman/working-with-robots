# Contextual inquiry and shadowing guide

**Goal:** understand how people actually work at a robotic pick station across a full shift, especially during exceptions, before changing any guidance.

**Format:** 2–3 hour shadowing blocks per participant, across start, mid, and end of shift. Observe first, ask second. Never interrupt a pick in progress or stand inside a marked robot zone.

## Before you go

- Get site safety training and required PPE. Walk the floor with the site safety lead first.
- Agree with the operations manager that observation will not affect anyone's rate metrics.
- Recruit across tenure (first week, 3–12 months, 1+ year), shift (day, night, weekend), and dominant hand.
- Prepare consent forms; no video of faces without explicit consent.

## Observation checklist

**Body and environment**

- [ ] Posture during pick: reaching, bending, twisting; which bin rows cause the most reach
- [ ] Repetitive motion: wrist and shoulder movements per pick
- [ ] Gloves: can associates use the station screen, handheld scanner, and put-to-light buttons while wearing them?
- [ ] Noise: can tones be heard over conveyors and neighboring stations? Are earplugs worn?
- [ ] Glare and lighting: can the screen and pick-to-light be read from where the associate stands?
- [ ] Line of sight: where do eyes go between screen, pod, and totes?

**Work and signals**

- [ ] What triggers a glance at the screen versus relying on lights alone
- [ ] Which signals are ignored, and why
- [ ] Workarounds: sticky notes, verbal shortcuts, skipping steps
- [ ] Every exception: what happened, how it was noticed, how long to recover, whether help was needed
- [ ] Every safety stop: cause, how the associate reacted, how they knew it was safe to resume

**People**

- [ ] When and how the andon is pulled; how long until Problem Solve arrives
- [ ] How knowledge passes between experienced and new associates

## Questions to ask (after the pick, not during)

1. "Walk me through what just happened there."
2. "How did you know what to do next?"
3. "What's the most annoying part of this station?"
4. "When something goes wrong, what do you do first?"
5. "What do you wish a new person knew on their first day?"
6. "If you could change one thing about the screen or the lights, what would it be?"

## After each session

Write up within 24 hours: top 3 observations, quotes (paraphrased unless consented), exception log with timings, and one surprise. Tag each observation with the station state it relates to so it maps onto the [state machine](../src/machine/stationMachine.ts).
