// Generates research/persona-maya.md from src/data/persona.ts so the doc and the site never drift.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('src/data/persona.ts', 'utf8');
const body = src.slice(src.indexOf('PERSONA = ') + 'PERSONA = '.length, src.lastIndexOf('};') + 1).replace(/ as Array<\[string, string\]>/g, '');
const P = new Function(`return ${body}`)();
const list = (xs) => xs.map((x) => `- ${x}`).join('\n');
const table = (h, rows) => `| ${h.join(' | ')} |\n| ${h.map(() => '---').join(' | ')} |\n` + rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
const md = `# Persona: ${P.name}

> **Proto-persona.** Built from public sources and stated assumptions, before field research. Use it to align the team, then replace assumptions with evidence from the [contextual inquiry](contextual-inquiry-guide.md). Fictional person.

_Generated from [\`src/data/persona.ts\`](../src/data/persona.ts) by \`npm run persona\`. Edit the data file, not this one._

## At a glance

| | |
| --- | --- |
| **Role** | ${P.role} |
| **Tenure** | ${P.tenure} |
| **Shift** | ${P.shift} |
| **Before this job** | ${P.before} |

> “${P.quote}”

${P.summary}

## Goals

${list(P.goals)}

## Frustrations

${list(P.frustrations)}

## What she needs from the station

${list(P.needs)}

## Her work environment

${list(P.context)}

## How she works

${list(P.behaviors)}

## A night in her shift

${table(['Time', 'What happens'], P.day)}

## Design for more people than ${P.name}

One persona can hide whole groups. These associates face the same station with different limits.

${table(['Type', 'Associate'], P.spectrum)}

## Other people at the station

${table(['Role', 'What they need'], P.secondary)}

## Assumptions to validate

${table(['Assumption', 'How to test it'], P.assumptions)}
`;
writeFileSync('research/persona-maya.md', md);
console.log('Wrote research/persona-maya.md');
