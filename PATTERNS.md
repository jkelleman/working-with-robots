# Pattern library

Reusable patterns for robotic workstations. Each pattern maps one meaning across screen, light, sound, and haptics, so every signal has a second channel.

_Generated from [`src/data/patterns.ts`](src/data/patterns.ts) by `npm run patterns`. Edit the data file, not this one._

- [Status signal](#status-signal)
- [Task card](#task-card)
- [Exception card](#exception-card)
- [Safety stop](#safety-stop)
- [Andon (escalation)](#andon-escalation)
- [Confirmation](#confirmation)
- [Progress](#progress)
- [Screen-to-light handoff](#screen-to-light-handoff)

## Status signal

Tell the worker, at a glance and from any angle, what the station needs.

**When to use:** Every state. It is the backbone all other patterns sit on.

**States:** Ready · Pod inbound · Pick/Put · Exception · Andon · E-stop

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Colored top band + headline | One stack light tier, color + blink rate + shape | Tone family by severity | Pulse count by severity |

**Do**

- Pair every color with a shape, blink rate and text label
- Reserve red and the octagon for safety only

**Don't**

- Use color alone
- Light more than one tower tier at once

## Task card

Show exactly what to pick and where it goes, readable at arm’s length.

**When to use:** Pick and put steps, and inside exceptions so context is never lost.

**States:** Active · In exception · Completed

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Large bin, tote and quantity; item name secondary | Bin and tote lights repeat the IDs | Attention tone on new task | None |

**Do**

- Make the bin, tote and quantity the largest text
- Keep the card visible during exceptions

**Don't**

- Hide the quantity in a sentence
- Truncate item names without a full-name fallback

## Exception card

Name the problem in plain words and give one next step.

**When to use:** Mispick, short pick, damaged item, scanner fault, tote full, starved station.

**States:** Raised · Self-resolved · Escalated

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Amber band, problem headline, single primary action | Amber, slow blink, triangle | Two equal mid tones | Two short pulses |

**Do**

- Write the headline as what happened, the body as what to do
- Offer escalation as a secondary path, not the first

**Don't**

- Show error codes as the headline
- Offer more than one primary action

## Safety stop

Halt work instantly and make restarting a deliberate act.

**When to use:** Light curtain broken, e-stop pressed, or any robot motion hazard.

**States:** Halted · Area confirmed clear · Resumed

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Full-screen red, STOP badge, one instruction | Red, fast blink, octagon | Three low long pulses, never muted | Long double pulse |

**Do**

- Override every other state
- Require confirm-clear, then press-and-hold to resume
- Resume exactly where work stopped

**Don't**

- Allow a single tap to resume
- Let reduced-sound settings silence it

## Andon (escalation)

Pull the andon: get Problem Solve to the station with the right context, without the associate leaving.

**When to use:** When self-recovery fails or a safety or damage judgment is needed.

**States:** Choosing reason · Andon pulled · Cleared

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Reason picker, then a calm waiting message | Blue, fast blink, square | Attention tone once | None |

**Do**

- Ask for a reason with a short fixed list
- Tell the worker what happens next and that they can stay put

**Don't**

- Make escalation the default action
- Require typing

## Confirmation

Close the loop so the worker knows the system registered the action.

**When to use:** After every put, and after resolving an exception.

**States:** Confirmed

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Brief success state, next task primed | Green, slow blink | Two rising notes | One short pulse |

**Do**

- Confirm within 100 ms of the action
- Keep it brief so it never slows the next task

**Don't**

- Use a modal that needs dismissing

## Progress

Show where the worker is in the wave without adding pressure.

**When to use:** Persistent header on every screen.

**States:** In progress · Complete

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Task X of Y, done and skipped counts | None | None | None |

**Do**

- Count skipped tasks separately so exceptions are not hidden

**Don't**

- Show rate-based pressure metrics to the worker in real time

## Screen-to-light handoff

Move the worker’s attention from the screen to the physical location.

**When to use:** Every pick and put, when the action happens away from the screen.

**States:** Screen leads · Light leads

| Screen | Light | Sound | Haptic |
| --- | --- | --- | --- |
| Headline names the bin or tote | Bin or tote lights with a downward arrow | Tone when the light changes | None |

**Do**

- Repeat the location ID in both places
- Let a tote-button press confirm the put, no screen tap needed

**Don't**

- Make the worker look back at the screen to confirm a physical action
