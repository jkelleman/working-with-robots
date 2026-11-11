# Usability test plan: exception recovery

**Goal:** find out whether associates can recover from each exception on their own, quickly and safely, using only the station's guidance.

**Method:** moderated sessions on the prototype at a mock station (screen + stack light + put wall), 8 participants per round, mixing tenure and including at least 2 participants who use accessibility modes. Two rounds, with fixes between.

## Tasks and success criteria

| # | Scenario | Success | Target |
| --- | --- | --- | --- |
| 1 | Normal pick and put | Completes without help | 100%, under 15 sec |
| 2 | Mispick | Returns item, picks correct one | 90%, under 20 sec |
| 3 | Short pick (bin empty) | Recounts once, flags the bin | 90%, under 30 sec |
| 4 | Damaged item | Puts it in the damage tote, continues | 90%, under 30 sec |
| 5 | Scanner fault | Keys in the item, completes put | 80%, under 45 sec |
| 6 | Tote full | Does a tote swap, completes put | 90%, under 30 sec |
| 7 | Light curtain trip mid-put | Stops, confirms clear, resumes deliberately | 100%, no accidental resume |
| 8 | Problem they can't fix | Pulls the andon with the right reason | 90% |

Run tasks 2–8 in a randomized order after task 1.

## Measures

- Task success (unassisted / assisted / failed)
- Time to recover, from exception to next productive action
- Errors, including any attempt to resume a safety stop with one tap
- Where eyes go first (moderator notes; eye tracking optional)
- Post-task confidence (1–5) and a short debrief

## Severity scale

| Level | Definition |
| --- | --- |
| **4, Critical** | Safety risk, or the associate cannot continue without help. Fix before any pilot. |
| **3, Serious** | Significant delay or confusion; most participants affected. Fix before rollout. |
| **2, Moderate** | Slows some participants; workaround exists. Fix in the next iteration. |
| **1, Minor** | Cosmetic or preference. Backlog. |

## Ergonomics validation

Before building hardware, compare station layouts in virtual reality with motion tracking (the approach described in Amazon Science's ErgoReality paper, HFES 2024). Measure reach, trunk bend, and wrist angle for top-, middle-, and bottom-row picks, and check how often picks land in the power zone (mid-thigh to mid-chest).
