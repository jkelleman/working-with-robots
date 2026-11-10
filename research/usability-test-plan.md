# Usability test plan: exception recovery

**Goal:** find out whether workers can recover from each exception on their own, quickly and safely, using only the station's guidance.

**Method:** moderated sessions on the prototype at a mock station (screen + light tower + tote wall), 8 participants per round, mixing tenure and including at least 2 participants who use accessibility modes. Two rounds, with fixes between.

## Tasks and success criteria

| # | Scenario | Success | Target |
| --- | --- | --- | --- |
| 1 | Normal pick and put | Completes without help | 100%, under 15 sec |
| 2 | Wrong item scanned | Returns item, picks correct one | 90%, under 20 sec |
| 3 | Bin is empty | Recounts once, skips and flags | 90%, under 30 sec |
| 4 | Item is damaged | Puts it in the damage tote, continues | 90%, under 30 sec |
| 5 | Scanner stops responding | Verifies manually, completes put | 80%, under 45 sec |
| 6 | Tote is full | Swaps tote, completes put | 90%, under 30 sec |
| 7 | Light curtain broken mid-put | Stops, confirms clear, resumes deliberately | 100%, no accidental resume |
| 8 | Problem they can't fix | Escalates with the right reason | 90% |

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
| **4, Critical** | Safety risk, or the worker cannot continue without help. Fix before any pilot. |
| **3, Serious** | Significant delay or confusion; most participants affected. Fix before rollout. |
| **2, Moderate** | Slows some participants; workaround exists. Fix in the next iteration. |
| **1, Minor** | Cosmetic or preference. Backlog. |
