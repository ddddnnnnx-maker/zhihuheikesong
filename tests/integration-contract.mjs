import { readFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
import { randomBytes } from 'node:crypto';
import { CASES, publicCase } from '../data/cases.mjs';
import { HOST_PROMPT_REFERENCE } from '../server/host-prompt.mjs';
import { TYPES } from '../game-core.mjs';
import { TYPE_REPORTS } from '../assets/liubti/reports.mjs';
import { deepSeekModels } from '../server/api.mjs';
import worker from '../worker.js';

const prompt = (await readFile(new URL('../主持人Prompt.md', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
assert.equal(prompt, HOST_PROMPT_REFERENCE, '主持人 Prompt 快照必须与原文一致');
assert.equal(CASES.length, 9, '正式题库必须包含 9 题');
assert.deepEqual(Object.keys(TYPE_REPORTS).sort(), Object.keys(TYPES).sort(), '16 型报告文案必须完整');
assert.deepEqual(deepSeekModels({}, 'fast'), ['deepseek-flash', 'deepseek-v4-pro'], '普通判断应优先 Flash 并以 Pro 备用');
assert.deepEqual(deepSeekModels({}, 'pro'), ['deepseek-v4-pro', 'deepseek-flash'], '疑难判断和报告应优先 Pro 并以 Flash 备用');
assert.deepEqual(deepSeekModels({ DEEPSEEK_MODEL: 'deepseek-v4-flash' }, 'fast'), ['deepseek-flash', 'deepseek-v4-pro'], '旧 Flash 名称应自动迁移到当前名称');

const publicText = JSON.stringify(CASES.map(publicCase));
for (const privateField of ['truth', 'unknown', 'clues', 'rubric', 'judgeNotes']) {
  assert.equal(publicText.includes(`"${privateField}"`), false, `公开题目不能包含 ${privateField}`);
}

const env = { SESSION_SECRET: randomBytes(32).toString('hex'), DEEPSEEK_API_KEY: 'mock' };
const originalFetch = globalThis.fetch;
let modelCalls = 0;
let lastModelRequest = null;
globalThis.fetch = async (_url, options) => {
  modelCalls += 1;
  lastModelRequest = JSON.parse(options.body);
  return new Response(JSON.stringify({
    choices: [{ message: { content: JSON.stringify({ verdict: 'YES', reason: null, duplicateOf: null, clueKeys: ['family'] }) } }]
  }));
};

const call = async (path, body, targetEnv = env, clientId = 'integration-contract') => {
  const response = await worker.fetch(new Request(`http://test/api/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'CF-Connecting-IP': clientId },
    body: JSON.stringify(body)
  }), targetEnv);
  return { status: response.status, data: await response.json() };
};

try {
  const started = await call('start', { caseId: 'parcel' });
  assert.equal(started.status, 200);
  const judged = await call('judge', { session: started.data.session, question: '取快递的人是我的亲人吗？' });
  assert.equal(judged.status, 200);
  assert.equal(judged.data.verdict, 'YES');
  assert.equal(judged.data.history.length, 1);
  assert.equal(modelCalls, 1, '普通是非问只应调用一次模型');
  assert.equal(lastModelRequest.max_tokens, 600, '判题 JSON 不应保留报告级输出长度');
  assert.equal(lastModelRequest.model, 'deepseek-flash', '普通判断应使用当前 DeepSeek Flash 名称');

  const relationRound = await call('start', { caseId: 'parcel' });
  const callsBeforeRelation = modelCalls;
  const relation = await call('judge', { session: relationRound.data.session, question: '这件事和妈妈有关吗？' });
  assert.equal(relation.status, 200);
  assert.equal(modelCalls, callsBeforeRelation + 1, '简单“有关吗”不应触发串行复核');

  const negativeRound = await call('start', { caseId: 'parcel' });
  const callsBeforeNegative = modelCalls;
  const negative = await call('judge', { session: negativeRound.data.session, question: '来的人不是妈妈吗？' });
  assert.equal(negative.status, 200);
  assert.equal(modelCalls, callsBeforeNegative + 1, '普通否定问句也只应调用一次模型');

  const callsBeforeMultiple = modelCalls;
  const multiple = await call('judge', { session: relationRound.data.session, question: '来的是妈妈还是爸爸？' });
  assert.equal(multiple.status, 200);
  assert.equal(multiple.data.counts, false);
  assert.equal(multiple.data.reason, 'MULTIPLE');
  assert.equal(modelCalls, callsBeforeMultiple, '明显二选一问题应在调用模型前返回');
  const revealed = await call('reveal', { session: judged.data.session, guess: '是我妈妈' });
  assert.equal(revealed.status, 200);
  assert.equal(revealed.data.truth, CASES.find((item) => item.id === 'parcel').truth);

  const fallbackEnv = { SESSION_SECRET: randomBytes(32).toString('hex'), DEEPSEEK_API_KEY: 'mock-deepseek', ZHIHU_ACCESS_SECRET: 'mock-zhihu' };
  const providerUrls = [];
  globalThis.fetch = async (url) => {
    providerUrls.push(String(url));
    if (String(url).includes('api.deepseek.com')) throw new DOMException('upstream unavailable', 'AbortError');
    return new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ verdict: 'YES', reason: null, duplicateOf: null, clueKeys: ['family'] }) } }]
    }));
  };
  const fallbackStart = await call('start', { caseId: 'parcel' }, fallbackEnv, 'fallback-contract');
  const fallbackJudge = await call('judge', { session: fallbackStart.data.session, question: '来的人是妈妈吗？' }, fallbackEnv, 'fallback-contract');
  assert.equal(fallbackJudge.status, 200);
  assert.deepEqual(providerUrls.map((url) => new URL(url).hostname), ['api.deepseek.com', 'api.deepseek.com', 'developer.zhihu.com'], 'DeepSeek 两档模型不可用时应转到已配置的知乎模型');

  const hidden = await worker.fetch(new Request('http://test/data/cases.mjs'), env);
  assert.equal(hidden.status, 404);
} finally {
  globalThis.fetch = originalFetch;
}

console.log(`integration-contract: ok; cases=${CASES.length}; reports=${Object.keys(TYPE_REPORTS).length}`);
