import { strict as assert } from 'node:assert';
import { randomBytes } from 'node:crypto';
import { JUDGE_CALIBRATION } from '../data/judge-calibration.mjs';
import { reconcileDecisions } from '../server/api.mjs';
import worker from '../worker.js';

const expected = {
  origin: [
    ['我是人吗', 'YES'], ['A市在哪里重要吗', 'YES'],
    ['我的超能力和时间有关吗', 'NO'], ['我有吃人的爱好吗', 'NO'],
    ['我是坏人吗', 'NO'], ['寻亲失败的那些人重要吗', 'YES'],
    ['寻亲失败的人杀人了吗', 'NO'], ['故事里有人死吗', 'YES'],
    ['故事里有鬼吗', 'NO'], ['你吃饭了吗', 'IRRELEVANT'],
    ['我有家人吗', 'IRRELEVANT'], ['我能帮人找到他们的亲人吗', 'PARTIAL']
  ],
  'silent-game': [
    ['是不是和我的生日有关', 'NO'], ['姐姐是不是死了', 'IRRELEVANT'],
    ['父母离异了吗', 'IRRELEVANT'], ['是不是这家公司当年把姐姐带走了', 'YES'],
    ['这家公司问我具体出生时辰是想知道我是不是当年被他们带走的女孩的弟弟', 'YES']
  ]
};
for (const [id, examples] of Object.entries(expected)) {
  assert.deepEqual(JUDGE_CALIBRATION[id].examples, examples, `${id} 的人工校准样本不能丢失`);
}

const corrected = reconcileDecisions(
  { counts: false, verdict: 'INVALID', reason: 'UNKNOWN', message: 'unknown', clues: [] },
  { counts: true, verdict: 'YES', clues: [] }
);
assert.equal(corrected.verdict, 'YES', 'Pro 复核应修复过度使用 UNKNOWN 的初判');
assert.equal(reconcileDecisions(
  { counts: true, verdict: 'IRRELEVANT', clues: [] },
  { counts: true, verdict: 'NO', clues: [] }
).verdict, 'NO', 'Pro 复核应修复过度使用 IRRELEVANT 的初判');

const originalFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (_url, options) => {
  const request = JSON.parse(options.body);
  calls.push(request);
  const verdict = calls.length === 1 ? 'INVALID' : 'YES';
  return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
    verdict, reason: verdict === 'INVALID' ? 'UNKNOWN' : null,
    duplicateOf: null, clueKeys: []
  }) } }] }));
};
try {
  const env = { SESSION_SECRET: randomBytes(32).toString('hex'), DEEPSEEK_API_KEY: 'mock' };
  const post = (path, body) => worker.fetch(new Request(`http://test/api/${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'CF-Connecting-IP': 'judge-calibration' },
    body: JSON.stringify(body)
  }), env);
  const started = await (await post('start', { caseId: 'origin' })).json();
  const result = await (await post('judge', { session: started.session, question: 'A市在哪里重要吗' })).json();
  assert.equal(result.verdict, 'YES');
  assert.equal(result.history.length, 1);
  assert.equal(calls.length, 2, 'UNKNOWN 初判应触发一次 Pro 复核');
  assert.equal(calls[0].model, 'deepseek-flash');
  assert.equal(calls[1].model, 'deepseek-v4-pro');
  const dossier = JSON.parse(calls[0].messages[1].content);
  assert.deepEqual(dossier.calibration.examples, expected.origin);
  assert.ok(calls[0].messages[0].content.includes('“X重要吗/有关吗”是单一的相关性命题'));
} finally {
  globalThis.fetch = originalFetch;
}
console.log('judge-calibration: ok; examples=17; unknown-review=ok');
