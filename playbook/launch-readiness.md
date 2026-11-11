# Multi-site rollout playbook

How to take a new station guidance release from one pilot station to every site, without surprising the people who work there.

## 1. Pilot (one site, 2–4 stations, 2 weeks)

**Entry criteria**

- [ ] All severity 4 and 3 usability findings fixed ([test plan](../research/usability-test-plan.md))
- [ ] Safety review signed off by the site safety lead
- [ ] Rollback tested: the station can return to the previous release within one shift change
- [ ] Baseline metrics captured for 2 weeks on the pilot stations
- [ ] Associates and leads on the pilot stations trained ([training outline](training-outline.md))

**During the pilot**

- Daily 10-minute check-in with shift leads; log every confusion, workaround, and andon pull
- Designer or researcher on the floor at least 3 shifts per week, including one night shift
- Weekly readout to product, engineering, operations, and safety

## 2. Go/no-go for wider rollout

| Metric | Go if |
| --- | --- |
| Safety stops caused by guidance confusion | Zero |
| Accidental resumes after a safety stop | Zero |
| Time to recover from exceptions | At or below baseline |
| Exception rate | At or below baseline |
| Units per hour | Within 3% of baseline by week 2 |
| Andon pulls per 100 tasks | At or below baseline |
| Associate confidence (end-of-pilot survey, 1–5) | 4.0 or higher |

Any safety metric miss is an automatic no-go. Productivity misses can go forward with a written plan.

## 3. Staged rollout

1. **Wave 1:** 3 sites with different layouts and shift patterns. Two weeks each, overlapping by one week.
2. **Wave 2:** 25% of remaining sites, then 50%, then 100%, with a one-week hold between steps.
3. Each new site follows the [site checklist](#site-checklist) and the same go/no-go table.

## Site checklist

- [ ] Site lead and safety lead briefed one week ahead
- [ ] Training sessions scheduled for every shift, including nights and weekends
- [ ] Standard work cards printed and posted at every station ([card](standard-work-card.md))
- [ ] Stack light and put wall hardware checked against the signal map
- [ ] Audio levels tested at peak floor noise
- [ ] Feedback channel set up and named in training

## 4. Feedback loop from sites back to design

- Shift leads log issues in one shared form with the station ID and the screen state shown
- Design reviews the log weekly; every item gets an owner and a status within 5 working days
- Monthly cross-site review to spot patterns that only show up at scale
- Changes ship in the next release and are called out in the release notes for shift leads
