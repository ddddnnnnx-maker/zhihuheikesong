// Fresh paraphrases deliberately absent from the host's calibration examples.
const examples = [
  ['origin', '这项能力识别的是死亡地点吗', 'YES', true],
  ['origin', '我的本事是在操纵时间吗', 'NO', true],
  ['origin', '那个城市的位置会影响真相吗', 'YES', true],
  ['origin', '故事中发生过地震吗', 'YES', true],
  ['origin', '找家人的求助者里有人没找到吗', 'YES', true],
  ['silent-game', '姐姐小时候是被人绑走的吗', 'YES', true],
  ['silent-game', '我入职的公司与姐姐失踪有关吗', 'YES', true],
  ['silent-game', '我的生日是哪一天会改变谜底吗', 'NO', true],
  ['silent-game', '公司安排体检真的是在关心我吗', 'NO', true],
  ['silent-game', '新公司的员工就是当年的那几名闯入者吗', 'INVALID', false]
];
const base = process.env.JUDGE_TEST_URL || 'http://127.0.0.1:4188';
let passed = 0;
for (const [index, [caseId, question, expected, expectedCounts]] of examples.entries()) {
  const headers = { 'content-type': 'application/json', 'CF-Connecting-IP': `judge-paraphrase-${index}` };
  const start = await fetch(`${base}/api/start`, { method: 'POST', headers, body: JSON.stringify({ caseId }) });
  const round = await start.json();
  if (!start.ok) throw new Error(`start ${caseId}: ${start.status} ${round.error || ''}`);
  const response = await fetch(`${base}/api/judge`, { method: 'POST', headers, body: JSON.stringify({ session: round.session, question }) });
  const result = await response.json();
  if (!response.ok) throw new Error(`judge ${caseId}: ${response.status} ${result.error || ''}`);
  const okay = result.verdict === expected && result.counts === expectedCounts;
  if (okay) passed++;
  console.log(`${okay ? 'PASS' : 'FAIL'} ${caseId} ${question} expected=${expected}/${expectedCounts} actual=${result.verdict}${result.reason ? `/${result.reason}` : ''}/${result.counts}`);
}
console.log(`live-paraphrases: ${passed}/${examples.length}`);
if (passed !== examples.length) process.exitCode = 1;
