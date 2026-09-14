# 看山有碗汤

知乎黑客松互动 Demo。用户从故事或知识题中选题，通过最多 6 个有效是非问题与刘看山 AI 主持人推理，最后查看汤底、答案语义评分和 LiuBTI 本局推理图鉴。

## 当前实现

- 前端沿用原高保真版本：首页、循环选题、读题、侦探线索板、可拖动卡片、主持人 GIF、语音转文字、揭晓与报告界面均保留。
- 后端采用交接包版本：HMAC 签名会话、四小时过期、六问计数、重复/开放式/多问/歧义处理、疑难结果复核、线索合并、揭晓与报告评分。普通是非问只调用一次判题模型，避免串行复核造成等待。
- 9 道正式题目的汤面、汤底、提示、裁判边界和评分 rubric 统一维护在 `data/cases.mjs`；浏览器只收到公开题面，不包含答案。
- AI 主持人通过服务端智能切换 DeepSeek V4：首次是非判断优先调用 Flash（`deepseek-v4-flash`），格式修复、疑难结果复核和最终报告优先调用 Pro（`deepseek-v4-pro`）；首选模型不可用时自动回退到另一款，浏览器不保存任何 API 密钥，也不使用关键词规则伪造判断。
- 9 张读题漫画按题目 ID 保存在 `assets/case-scenes/`，读题页完整显示；推理页 AI 主持人区提供可滚动的完整题面。
- 揭晓页固定从事实核心、关键反转或机制、线索闭环三个视角拆解真相；报告页的 LiuBTI 与本局判断依据采用 1:1 等高布局。
- LiuBTI 由服务端根据实际问答生成。每个维度至少需要两条可引用的问答证据；不足时显示“线索还不够”，不会猜测类型。
- 16 型完整报告文案在 `assets/liubti/reports.mjs`。

## API

| 路由 | 用途 |
|---|---|
| `GET /api/cases` | 公开题目目录，不返回汤底与评分规则 |
| `POST /api/start` | 创建签名游戏会话 |
| `POST /api/judge` | 按主持人规则判断本轮问题 |
| `POST /api/reveal` | 关闭本局并返回汤底 |
| `POST /api/evaluate` | 语义评估最终答案并生成 LiuBTI |

Vercel 部署通过根目录下的 `api/*.mjs` 入口复用 `server/api.mjs`。密钥只从 Vercel 环境变量读取，不进入浏览器或仓库。

生产环境必须配置 `DEEPSEEK_API_KEY`（secret）和独立的 `SESSION_SECRET`（secret）。可用 `DEEPSEEK_FAST_MODEL`、`DEEPSEEK_PRO_MODEL` 分别覆盖默认的 `deepseek-v4-flash`、`deepseek-v4-pro`；兼容旧的 `DEEPSEEK_MODEL`，仅把它作为快速模型配置读取。禁止把密钥写入仓库、前端、文档或日志。

## 关键文件

- `index.html`、`app.js`、四个 CSS：现有前端设计与交互。
- `case-data.js`：由 `scripts/sync-case-data.mjs` 从正式题库生成的公开前端数据。
- `data/cases.mjs`：正式题库与服务端裁判数据。
- `server/api.mjs`：完整 Worker API。
- `server/host-prompt.mjs`、`主持人Prompt.md`：主持人规则快照与原文。
- `game-core.mjs`：线索合并、答案评分、LiuBTI 校验。
- `assets/liubti/reports.mjs`：16 型正式报告文案。
- `worker.js`：Worker 入口，只转出 `server/api.mjs`。
- `CLAUDE.md`：给下一位开发者或 Claude Code 的接手说明。

修改 `data/cases.mjs` 后运行 `node scripts/sync-case-data.mjs`。前端不得直接读取 `data/cases.mjs`，因为其中包含汤底、裁判规则和评分项。

提交前至少运行：

```powershell
node --check app.js
node --check server/api.mjs
node --check worker.js
node tests/vercel-adapter.mjs
git diff --check
```
