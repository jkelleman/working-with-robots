// Generates PATTERNS.md from src/data/patterns.ts so the doc and the app never drift.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('src/data/patterns.ts', 'utf8');
const start = src.indexOf('PATTERNS: Pattern[] = ') + 'PATTERNS: Pattern[] = '.length;
const json = src.slice(start, src.lastIndexOf('];') + 1);
const PATTERNS = new Function(`return ${json}`)();
let md = `# Pattern library\n\nReusable patterns for robotic workstations. Each pattern maps one meaning across screen, light, sound, and haptics, so every signal has a second channel.\n\n_Generated from [\`src/data/patterns.ts\`](src/data/patterns.ts) by \`npm run patterns\`. Edit the data file, not this one._\n\n`;
md += PATTERNS.map((p) => `- [${p.name}](#${p.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-')})`).join('\n') + '\n\n';
for (const p of PATTERNS) {
  md += `## ${p.name}\n\n${p.purpose}\n\n**When to use:** ${p.whenToUse}\n\n**States:** ${p.states.join(' · ')}\n\n`;
  md += `| Screen | Light | Sound | Haptic |\n| --- | --- | --- | --- |\n| ${p.mapping.screen} | ${p.mapping.light} | ${p.mapping.sound} | ${p.mapping.haptic} |\n\n`;
  md += `**Do**\n\n${p.do.map((d) => `- ${d}`).join('\n')}\n\n**Don't**\n\n${p.dont.map((d) => `- ${d}`).join('\n')}\n\n`;
}
writeFileSync('PATTERNS.md', md.trimEnd() + '\n');
console.log(`Wrote PATTERNS.md (${PATTERNS.length} patterns)`);
