# Persona: Maya

> **Proto-persona.** Built from public sources and stated assumptions, before field research. Use it to align the team, then replace assumptions with evidence from the [contextual inquiry](contextual-inquiry-guide.md). Fictional person.

_Generated from [`src/data/persona.ts`](../src/data/persona.ts) by `npm run persona`. Edit the data file, not this one._

## At a glance

| | |
| --- | --- |
| **Role** | Pick associate, goods-to-person station |
| **Tenure** | 3 weeks on the job |
| **Shift** | Nights, four 10-hour shifts a week |
| **Before this job** | Line cook for four years |

> “Just tell me what to do next, and whether I messed up.”

Maya is fast, careful, and still learning the floor. She came from a kitchen, so noise and speed don’t faze her. What does is not knowing whether a problem is her fault, and not knowing how long she’ll wait for help.

## Goals

- Hit her rate without mistakes before her training period ends
- Fix problems herself without flagging someone down
- Finish the shift without a sore back or shoulders

## Frustrations

- Can’t tell if a problem is her error or the system’s
- Waits for help with no idea how long it will take
- Training terms she hasn’t memorized yet show up on the screen

## What she needs from the station

- One clear next step, every time
- A plain answer to “was that me?”
- A wait time whenever she has to wait
- Signals that work through gloves, earplugs, and glare
- Picks that land between her thighs and chest

## Her work environment

- Stands at one station for 10 hours with short breaks
- Wears gloves and hearing protection the whole shift
- Works under bright overhead light, with drive units moving nearby
- Has no phone on the floor and relies on the screen and lights

## How she works

- Glances at the screen, then works from the lights
- Learns by doing and copies what the associate next to her does
- Hesitates to pull the andon because she doesn’t want to look slow
- Rechecks a bin twice before she reports it empty

## A night in her shift

| Time | What happens |
| --- | --- |
| 6:30 pm | Clocks in, stretches, gets her station assignment |
| 7:00 pm | Starts her first wave. Steady and fast. |
| 9:40 pm | A bin looks empty. She recounts and isn’t sure what to tap. |
| 11:15 pm | First break. Asks a coworker what “short pick” means. |
| 1:30 am | A light curtain trips when she reaches in early. Everything stops. |
| 3:00 am | Top-row picks start to wear on her shoulders. |
| 5:00 am | Clocks out. Her rate was close, with two exceptions she couldn’t resolve. |

## Design for more people than Maya

One persona can hide whole groups. These associates face the same station with different limits.

| Type | Associate |
| --- | --- |
| Permanent | Color-blind associate who can’t rely on the stack light’s colors |
| Temporary | Associate with a wrist injury, working one-handed or left-handed |
| Situational | Any associate wearing earplugs and gloves on a loud floor |
| Language | Associate whose first language isn’t English |

## Other people at the station

| Role | What they need |
| --- | --- |
| Problem Solve associate | Answers the andon. Needs the reason and the context before walking over. |
| Shift lead | Watches station status across the floor. Needs the stack light readable from far away. |

## Assumptions to validate

| Assumption | How to test it |
| --- | --- |
| Newer associates hesitate to pull the andon | Shadowing, plus andon timing in the logs |
| Associates can’t tell their errors from system errors | Think-aloud during exception tasks |
| Waiting without an ETA causes more stress than the wait itself | Post-task interviews after a starved station |
| Hearing protection masks most station tones | Tone tests on the floor, with earplugs in |
| Top- and bottom-row picks cause most of the strain | Reach observation and VR ergonomics study |
