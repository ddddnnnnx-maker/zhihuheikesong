export const VERDICTS = Object.freeze({ YES: '是', NO: '否', PARTIAL: '部分正确', IRRELEVANT: '不相关' });
export const TYPES = Object.freeze({
  DEVO:'线索收藏家', DEVC:'全景拼图家', DEXO:'疑点巡游者', DEXC:'现场排查员',
  DFVO:'细节考据家', DFVC:'线索拼图家', DFXO:'漏洞追踪者', DFXC:'证据审校员',
  GEVO:'脑洞漫游者', GEVC:'假说建筑师', GEXO:'可能性质疑者', GEXC:'全局筛选师',
  GFVO:'原理追问者', GFVC:'因果解码师', GFXO:'边界试探者', GFXC:'逻辑验算师'
});
export const AXES = [ ['D','G','细节','全局'], ['E','F','广探','深挖'], ['V','X','求证','排除'], ['O','C','开放','定案'] ];
export const normalizeQuestion = value => String(value).normalize('NFKC').replace(/[\s，。！？、,.!?“”"‘’']/g, '').toLowerCase();
export function mergeClues(existing, incoming, questionIndex) {
  const result = existing.map(c => ({...c, questionIds: [...c.questionIds]}));
  for (const clue of incoming) {
    const previous = result.find(c => c.id === clue.id);
    if (!previous) result.push({...clue, questionIds:[questionIndex]});
    else {
      if (!previous.questionIds.includes(questionIndex)) previous.questionIds.push(questionIndex);
      if (clue.level > previous.level) Object.assign(previous, clue, {questionIds: previous.questionIds});
    }
  }
  return result;
}
export function scoreRubric(rubric, assessments) {
  if (!Array.isArray(assessments) || assessments.length !== rubric.length) throw new Error('invalid_assessment');
  const ids = new Set();
  const items = rubric.map(item => {
    const matches = assessments.filter(x => x.id === item.id);
    if (matches.length !== 1 || ids.has(item.id)) throw new Error('invalid_assessment');
    ids.add(item.id);
    const a = matches[0];
    if (!['covered','partial','missing','contradicted'].includes(a.status) || typeof a.reason !== 'string') throw new Error('invalid_assessment');
    const factor = a.status === 'covered' ? 1 : a.status === 'partial' ? 0.5 : 0;
    return {...item, status:a.status, reason:a.reason.slice(0,180), earned:item.weight * factor};
  });
  return { score: Math.round(items.reduce((n,i)=>n+i.earned,0) / items.reduce((n,i)=>n+i.weight,0) * 100), items };
}
export function validateProfile(raw, history) {
  const unknown = {code:null, name:'线索还不够', dimensions:AXES.map(a=>({axis:a[0]+a[1], pole:null, evidence:[], reason:'本局证据不足，暂不判断。'}))};
  if (history.length < 2) return unknown;
  if (!raw || !Array.isArray(raw.dimensions) || raw.dimensions.length !== 4) throw new Error('invalid_profile');
  const dimensions = AXES.map(a => {
    const d = raw.dimensions.find(x=>x.axis===a[0]+a[1]);
    if (!d || !(d.pole === null || a.slice(0,2).includes(d.pole)) || !Array.isArray(d.evidence) || typeof d.reason !== 'string') throw new Error('invalid_profile');
    const evidence = [...new Set(d.evidence)].filter(i=>Number.isInteger(i) && i >= 1 && i <= history.length);
    // At least two grounded turns per axis. A sparse round must not fabricate a complete type.
    return {axis:d.axis, pole:evidence.length >= 2 ? d.pole : null, evidence, reason:d.reason.slice(0,220)};
  });
  const code = dimensions.every(d=>d.pole) ? dimensions.map(d=>d.pole).join('') : null;
  return {code, name:TYPES[code] || '推理风格探索中', dimensions};
}
