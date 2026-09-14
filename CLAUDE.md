# Claude Code 接手说明：看山有碗汤

更新日期：2026-09-15

## 目标与现状

这是知乎黑客松高保真互动 Demo。当前版本已经完成“保留现有前端设计、替换为交接包后端与正式内容”的合并。请先阅读 `README.md`、`brand-spec.md`、`主持人Prompt.md`。

## 不可擅自改变

1. 产品名是「看山有碗汤」。故事推理局在前，知识推理局在后。
2. 当前首页、选题、读题、推理线索板、卡片动效与拖动、主持人 GIF、语音输入、答案和报告的视觉语言均为已确认前端；不要用交接包里的 UI 或交互覆盖它。
3. 正式汤面与汤底以 `data/cases.mjs` 为唯一数据源，不润色、不缩写、不改字。
4. 浏览器只允许拿到 `publicCase()` 导出的字段；汤底、unknown、clues、judgeNotes 与 rubric 必须留在 Worker。
5. AI 主持人只裁判，不泄露汤底、不代替玩家提问。有效回答是 YES / NO / PARTIAL / IRRELEVANT；无效与重复问题不扣次数。
6. 不允许在前端恢复关键词匹配式的“假 AI”兜底。模型失败时应明确提示且不扣次数。
7. LiuBTI 只描述这一局。每个维度至少引用两条实际问答；证据不足就返回未定型。
8. 不伪造社区共鸣百分比。未接真实匿名聚合数据前，不显示模拟比例。
9. API 密钥与 `SESSION_SECRET` 只能放在托管环境变量，禁止写入源码、静态文件、文档或日志。

## 正式内容顺序

故事：`origin` → `silent-game` → `takeaway` → `bear-child` → `parcel`。

知识：`mung-soup` → `holland` → `scapegoat` → `meat-juice`。

前端顺序在 `app.js` 的 `CASE_ORDER`；服务端题库顺序不影响展示。

## 运行链路

```text
选择题目
  → POST /api/start 获取签名 session
  → POST /api/judge（携带最新 session）
  → 服务端合法性/相关性/事实判断与必要复核（DeepSeek 优先，上游失败时才使用已配置的知乎模型）
  → 返回新 session、history、board
  → 前端沿用现有问答飞入线索板动画
  → POST /api/reveal 关闭本局并返回汤底
  → POST /api/evaluate 语义评分并生成 LiuBTI
```

接口错误文案在 `app.js` 的 `API_ERROR_MESSAGES`。模型失败不能被前端伪装成有效答案。

## 数据与报告

- `data/cases.mjs`：9 题完整内容、提示、裁判边界、线索与评分 rubric。
- `scripts/sync-case-data.mjs`：只生成公开 `case-data.js`。
- `game-core.mjs`：线索合并、rubric 得分、LiuBTI 证据门槛。
- `assets/liubti/reports.mjs`：16 型完整报告文案。
- `assets/liubti/*.webp`：当前界面使用的 16 型形象映射。
- `assets/case-scenes/*.png`：按题目 ID 命名的 9 张读题漫画；映射在 `app.js` 的 `CASE_SCENE_IMAGES`。

## 前端约束

- 首页主形象覆盖在蓝色背景层上。
- 选题为循环卡片，不加“请拖动”等多余说明。
- 读题页保持一比二分栏：左侧完整汤面，右侧拍立得式定格漫画区域。
- 推理页桌面端保持线索板与主持人 3:2；卡片可拖动、钉点连线清晰、互不遮挡。
- 主持人区同时保留较小的角色反馈和可滚动完整题面；普通是非问只发起一次模型调用，PARTIAL / IRRELEVANT 等疑难结果才复核。
- 当前一问只在底部短暂显示，判定后飞入上方卡片。
- 保留“直接看答案”和最终答案语音转文字。
- 页面保持平面网页质感，禁止荧光外发光、厚黑描边和无意义套框。

## 修改后自检

1. 修改题库后运行 `node scripts/sync-case-data.mjs`。
2. 检查 `case-data.js` 不包含 `truth`、`unknown`、`clues`、`rubric`。
3. 运行 JS 语法检查和 `git diff --check`。
4. 验证公开目录、开局、有效问题、无效问题不计次、六问上限、直接揭晓、最终答案评分、少量问题不强行给 LiuBTI。
5. 逐页检查前端没有因后端合并产生布局或动效回退。
