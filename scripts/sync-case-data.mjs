import { writeFile } from 'node:fs/promises';
import { CASES, publicCase } from '../data/cases.mjs';

const publicCases = CASES.map(publicCase).map((item) => ({
  ...item,
  prompt: item.surface,
  introNote: item.mode === 'knowledge'
    ? '不需要先知道专业术语，从条件、变化和因果关系逐步验证。'
    : '读完题面，先找最反常的地方，再把猜想拆成一个是非问题。',
  recommendations: item.hints
}));

const grouped = {
  story: publicCases.filter((item) => item.mode === 'story'),
  knowledge: publicCases.filter((item) => item.mode === 'knowledge')
};

await writeFile(new URL('../case-data.js', import.meta.url), `window.FORMAL_CASES = ${JSON.stringify(grouped, null, 2)};\n`, 'utf8');
