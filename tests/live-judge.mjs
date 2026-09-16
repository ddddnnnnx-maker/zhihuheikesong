import { JUDGE_CALIBRATION } from '../data/judge-calibration.mjs';

// Run against a separately started local dev server. The key remains on the
// server, never in this script or its output.
const base = process.env.JUDGE_TEST_URL || 'http://127.0.0.1:4188';
const limit = Number(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1] || Infinity);
const onlyCase = process.argv.find((arg) => arg.startsWith('--case='))?.split('=')[1];
let tested = 0;
let passed = 0;
for (const [caseId, guide] of Object.entries(JUDGE_CALIBRATION)) {
  if (onlyCase && caseId !== onlyCase) continue;
  for (const [question, expected] of guide.examples) {
    if (tested >= limit) break;
    const headers = { 'content-type': 'application/json', 'CF-Connecting-IP': `judge-live-${caseId}-${tested}` };
    const start = await fetch(`${base}/api/start`, { method: 'POST', headers, body: JSON.stringify({ caseId }) });
    const round = await start.json();
    if (!start.ok) throw new Error(`start ${caseId}: ${start.status} ${round.error || ''}`);
    const response = await fetch(`${base}/api/judge`, {
      method: 'POST', headers, body: JSON.stringify({ session: round.session, question })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(`judge ${caseId}: ${response.status} ${result.error || ''}`);
    tested++;
    const okay = result.verdict === expected && result.counts === true;
    if (okay) passed++;
    console.log(`${okay ? 'PASS' : 'FAIL'} ${caseId} ${question} expected=${expected} actual=${result.verdict}${result.reason ? `/${result.reason}` : ''} counted=${result.counts}`);
  }
}
console.log(`live-judge: ${passed}/${tested}`);
if (passed !== tested) process.exitCode = 1;
