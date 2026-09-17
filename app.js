import { TYPE_REPORTS } from "./assets/liubti/reports.mjs";

const HOME_HOST_IMAGE = "assets/zhihu-brand/liu-kanshan-main-exact.webp";
const HOST_IMAGE = HOME_HOST_IMAGE;
const CARD_HOST_IMAGE = "assets/zhihu-brand/liu-kanshan-card-perch.webp";
const LOGO_IMAGE = "assets/zhihu-brand/zhihu-logo.svg";
const HOST_REACTION_IMAGES = {
  yes: "assets/zhihu-brand/host-yes-partial.gif",
  partial: "assets/zhihu-brand/host-yes-partial.gif",
  no: "assets/zhihu-brand/host-no.gif",
  irrelevant: "assets/zhihu-brand/host-irrelevant.gif"
};
const REWRITE_REACTION_IMAGE = "assets/zhihu-brand/host-rewrite.gif";
const MUSIC_TRACKS = {
  pages: "assets/audio/whimsical-sleuth-pages.mp3",
  reasoning: "assets/audio/whimsical-sleuth-reasoning.mp3"
};

const CASE_SCENE_IMAGES = {
  origin: "assets/case-scenes/origin.png",
  "silent-game": "assets/case-scenes/silent-game.png",
  takeaway: "assets/case-scenes/takeaway.png",
  "bear-child": "assets/case-scenes/bear-child.png",
  parcel: "assets/case-scenes/parcel.png",
  "mung-soup": "assets/case-scenes/mung-soup.png",
  holland: "assets/case-scenes/holland.png",
  scapegoat: "assets/case-scenes/scapegoat.png",
  "meat-juice": "assets/case-scenes/meat-juice.png"
};

const LIUBTI_PROFILES = {
  DEVO: { name: "线索收藏家", image: "assets/liubti/de-vo.webp" },
  DEVC: { name: "全景拼图家", image: "assets/liubti/de-vc.webp" },
  DEXO: { name: "疑点巡游者", image: "assets/liubti/de-xo.webp" },
  DEXC: { name: "现场排查员", image: "assets/liubti/de-xc.webp" },
  DFVO: { name: "细节考据家", image: "assets/liubti/df-vo.webp" },
  DFVC: { name: "线索拼图家", image: "assets/liubti/df-vc.webp" },
  DFXO: { name: "漏洞追踪者", image: "assets/liubti/df-xo.webp" },
  DFXC: { name: "证据审校员", image: "assets/liubti/df-xc.webp" },
  GEVO: { name: "脑洞漫游者", image: "assets/liubti/ge-vo.webp" },
  GEVC: { name: "假说建筑师", image: "assets/liubti/ge-vc.webp" },
  GEXO: { name: "可能性质疑者", image: "assets/liubti/ge-xo.webp" },
  GEXC: { name: "全局筛选师", image: "assets/liubti/ge-xc.webp" },
  GFVO: { name: "原理追问者", image: "assets/liubti/gf-vo.webp" },
  GFVC: { name: "因果解码师", image: "assets/liubti/gf-vc.webp" },
  GFXO: { name: "边界试探者", image: "assets/liubti/gf-xo.webp" },
  GFXC: { name: "逻辑验算师", image: "assets/liubti/gf-xc.webp" }
};

const legacyCases = { story: [], knowledge: [] };

const sourceCases = window.FORMAL_CASES || legacyCases;
const CASE_ORDER = {
  story: ["origin", "silent-game", "takeaway", "bear-child", "parcel"],
  knowledge: ["mung-soup", "holland", "scapegoat", "meat-juice"]
};

function orderCases(list, order, prefix) {
  const byId = new Map(list.map((item) => [item.id, item]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean);
  const remaining = list.filter((item) => !order.includes(item.id));
  return [...ordered, ...remaining].map((item, index) => ({
    ...item,
    number: `${prefix}-${String(index + 1).padStart(2, "0")}`
  }));
}

const cases = {
  story: orderCases(sourceCases.story, CASE_ORDER.story, "S"),
  knowledge: orderCases(sourceCases.knowledge, CASE_ORDER.knowledge, "K")
};

// App ID is public (assigned on the hackathon event page); the App Key that
// actually exchanges the code for a token lives only on the server.
const ZHIHU_OAUTH_APP_ID = "725";
const ZHIHU_OAUTH_REDIRECT_URI = "https://zhihuheikesong.vercel.app/api/zhihu-callback";
const zhihuLoginResult = new URLSearchParams(location.search).get("zhihu");
if (zhihuLoginResult) {
  history.replaceState(null, "", location.pathname);
  if (zhihuLoginResult === "ok") {
    sessionStorage.setItem("kanshanGuestEntered", "1");
    sessionStorage.setItem("kanshanZhihuLoggedIn", "1");
  }
}

const initialState = {
  screen: sessionStorage.getItem("kanshanGuestEntered") === "1" ? "home" : "login",
  mode: "story",
  carouselIndex: 0,
  selectedCaseId: null,
  questions: [],
  currentTurn: null,
  isThinking: false,
  isArchiving: false,
  recommendationOpen: false,
  recommendationGuide: "",
  selectedHint: "",
  evidenceLayout: null,
  evidenceCardPositions: {},
  guessOpen: false,
  rulesOpen: false,
  guess: "",
  inputError: "",
  score: 0,
  session: null,
  reveal: null,
  evaluation: null,
  evaluationStatus: "idle",
  evaluationError: "",
  isRevealing: false,
  isListening: false,
  answerRevealedDirectly: false,
  toast: ""
};

const state = { ...initialState };
const app = document.querySelector("#app");
let lastRenderedScreen = null;
let speechRecognition = null;
const backgroundMusic = new Audio();
backgroundMusic.loop = true;
backgroundMusic.preload = "metadata";
backgroundMusic.volume = 0.42;
let musicMuted = localStorage.getItem("kanshanMusicMuted") === "1";
let musicUnlockNeeded = false;

function musicButtonHTML() {
  return `<button class="music-toggle ${musicMuted ? "is-muted" : ""}" type="button" data-action="toggle-music" aria-label="${musicMuted ? "开启背景音乐" : musicUnlockNeeded ? "播放背景音乐" : "关闭背景音乐"}" aria-pressed="${!musicMuted}"><span aria-hidden="true">♫</span></button>`;
}

function updateMusicButtons() {
  document.querySelectorAll(".music-toggle").forEach((button) => {
    button.classList.toggle("is-muted", musicMuted);
    button.setAttribute("aria-pressed", String(!musicMuted));
    button.setAttribute("aria-label", musicMuted ? "开启背景音乐" : musicUnlockNeeded ? "播放背景音乐" : "关闭背景音乐");
  });
}

function syncMusic() {
  const desired = state.screen === "game" ? MUSIC_TRACKS.reasoning : MUSIC_TRACKS.pages;
  if (!backgroundMusic.src.endsWith(desired)) {
    backgroundMusic.src = desired;
    backgroundMusic.load();
  }
  backgroundMusic.muted = musicMuted;
  if (musicMuted) { backgroundMusic.pause(); return; }
  backgroundMusic.play().then(() => { musicUnlockNeeded = false; updateMusicButtons(); }).catch(() => { musicUnlockNeeded = true; updateMusicButtons(); });
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentList() {
  return cases[state.mode];
}

function currentCase() {
  const allCases = [...cases.story, ...cases.knowledge];
  return allCases.find((item) => item.id === state.selectedCaseId) || currentList()[state.carouselIndex];
}

function headerHTML(step = "探索") {
  const navState = state.screen === "home" ? "home" : state.screen === "topics" ? "topics" : "play";
  const backButton = state.screen === "home" ? "" : `<button class="back-button" type="button" data-action="back" aria-label="返回上一页"><span aria-hidden="true">←</span></button>`;
  return `
    <header class="topbar">
      <div class="brand-zone">
        ${backButton}
        <button class="brand-button" type="button" data-action="home" aria-label="返回首页">
          <img src="${LOGO_IMAGE}" alt="知乎" />
          <span class="product-name">看山有碗汤</span>
        </button>
      </div>
      <nav class="topnav" aria-label="主导航">
        <button class="nav-link ${navState === "home" ? "is-active" : ""}" type="button" data-action="home">首页</button>
        <button class="nav-link ${navState === "topics" ? "is-active" : ""}" type="button" data-action="topics">选题</button>
        <button class="nav-link ${navState === "play" ? "is-active" : ""}" type="button" data-action="show-rules">怎么玩</button>
      </nav>
      <div class="top-actions">${musicButtonHTML()}<span class="progress-pill">${escapeHTML(step)}</span></div>
    </header>`;
}

function loginHTML() {
  return `<main class="screen login-screen">
    <div class="login-sheen" aria-hidden="true"></div>
    <div class="login-copy"><span class="eyebrow">知乎 · 看山有碗汤</span><h1>看山有碗汤</h1><p>六个问题，把一个离奇故事问成你自己的答案。</p>
      <div class="login-actions"><button class="primary-button login-zhihu" type="button" data-action="zhihu-login"><img src="${LOGO_IMAGE}" alt="" /> 知乎账号登录</button><button class="ghost-button login-guest" type="button" data-action="guest-login">以游客身份开始 <span aria-hidden="true">→</span></button></div>
      <small class="login-note">知乎账号登录将跳转到知乎完成授权；游客同样可以体验完整推理。</small>
    </div>
    <div class="login-visual"><div class="login-orbit" aria-hidden="true"></div><img src="${HOME_HOST_IMAGE}" alt="拿着放大镜的刘看山" /></div>
    <div class="login-music">${musicButtonHTML()}</div>
  </main>`;
}

function homeHTML() {
  return `
    <main class="screen home-screen home-v2">
      <section class="home-atmosphere">
        <div class="aurora aurora-blue" aria-hidden="true"></div>
        <div class="aurora aurora-lime" aria-hidden="true"></div>
        <div class="glass-hero">
          <div class="glass-copy">
            <span class="eyebrow">知乎 × 看山有碗汤</span>
            <h1 class="hero-title">看山有碗汤</h1>
            <p class="hero-subtitle">和刘看山一起，把一个反常现象或一句离奇故事，问成你自己的答案。</p>
            <div class="mode-picks" aria-label="选择玩法方向">
              <button class="mode-pick" type="button" data-action="choose-mode" data-mode="story">
                <span class="mode-icon" aria-hidden="true">01</span>
                <span><strong>故事推理局</strong><small>追问被省略的情节，还原一句话背后的真相。</small></span>
                <i aria-hidden="true">→</i>
              </button>
              <button class="mode-pick" type="button" data-action="choose-mode" data-mode="knowledge">
                <span class="mode-icon" aria-hidden="true">02</span>
                <span><strong>知识推理局</strong><small>从日常现象出发，逐步拆出背后的原理。</small></span>
                <i aria-hidden="true">→</i>
              </button>
            </div>
          </div>
          <div class="glass-visual">
            <span class="host-label">AI 主持人 · 刘看山</span>
            <div class="host-halo" aria-hidden="true"></div>
            <img class="host-hero-image" src="${HOME_HOST_IMAGE}" alt="拿着放大镜的刘看山" />
          </div>
        </div>
      </section>
    </main>`;
}

function topicCardHTML(item, index, total) {
  const offset = (index - state.carouselIndex + total) % total;
  let className = "is-hidden";
  if (offset === 0) className = "is-current";
  if (offset === total - 1) className = "is-prev";
  if (offset === 1) className = "is-next";
  return `
    <article class="topic-card ${className}" data-card-index="${index}" aria-hidden="${offset === 0 ? "false" : "true"}">
      <div class="card-kicker"><span>${item.number} · ${item.mode === "knowledge" ? "知识推演" : "离奇故事"}</span><span class="difficulty">${item.difficulty}</span></div>
      <h2>${escapeHTML(item.hook)}</h2>
      <div class="card-bottom">
        <p>${escapeHTML(item.mode === "knowledge" ? item.title : item.subtitle)}</p>
        <button class="primary-button" type="button" data-action="select-case" data-case-id="${item.id}">选这题 <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
}

function topicsHTML() {
  const list = currentList();
  return `
    <main class="screen content-screen topics-v2">
      <div class="section-head">
        <div><h1 class="section-title"><small>CHOOSE A CASE</small>今天从哪个问题开始？</h1></div>
        <div class="mode-tabs" role="tablist" aria-label="内容方向">
          <button class="topic-tab ${state.mode === "story" ? "is-active" : ""}" type="button" data-action="choose-mode" data-mode="story">故事推理局</button>
          <button class="topic-tab ${state.mode === "knowledge" ? "is-active" : ""}" type="button" data-action="choose-mode" data-mode="knowledge">知识推理局</button>
        </div>
      </div>
      <div class="carousel-layout carousel-layout-v2">
        <section class="carousel-shell" id="carouselShell" aria-label="题目卡片轮播">
          <div class="carousel-counter">${String(state.carouselIndex + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}</div>
          <div class="carousel-viewport">${list.map((item, index) => topicCardHTML(item, index, list.length)).join("")}</div>
          <div class="carousel-arrows">
            <button class="carousel-arrow" type="button" data-action="carousel-prev" aria-label="上一题">←</button>
            <button class="carousel-arrow" type="button" data-action="carousel-next" aria-label="下一题">→</button>
          </div>
        </section>
      </div>
    </main>`;
}

function caseSceneHTML(item) {
  const sceneImage = CASE_SCENE_IMAGES[item.id];
  return `
    <aside class="case-animation polaroid-comic" aria-label="题目演绎定格漫画">
      <div class="polaroid-window">
        <div class="case-animation-stage case-scene--${escapeHTML(item.id)}">
          ${sceneImage ? `<img class="case-scene-image" src="${sceneImage}" alt="${escapeHTML(item.title)}的刘看山定格漫画" loading="eager" decoding="async" draggable="false" />` : `<img class="case-scene-host" src="${HOST_IMAGE}" alt="刘看山正在演绎题目" />`}
        </div>
      </div>
      <div class="polaroid-note"><span>看山现场记录</span><strong>先观察反常之处，再提出第一问</strong><i aria-hidden="true">●</i></div>
    </aside>`;
}

function introHTML(item) {
  return `
    <main class="screen content-screen">
      <div class="section-head"><h1 class="section-title"><small>${item.number} / CASE BRIEF</small>先读题，再决定第一问</h1><button class="ghost-button" type="button" data-action="topics">换一题</button></div>
      <div class="case-intro">
        <section class="case-prompt">
          <span class="eyebrow">${item.mode === "knowledge" ? "知识推演" : "离奇故事"} · ${item.difficulty}</span>
          <blockquote>${escapeHTML(item.prompt)}</blockquote>
          <footer><span>${escapeHTML(item.introNote)}</span><button class="secondary-button" type="button" data-action="start-game">开始提问 <span aria-hidden="true">→</span></button></footer>
        </section>
        ${caseSceneHTML(item)}
      </div>
    </main>`;
}

const evidencePositions = [
  { x: 18, y: 27, r: -2.2 },
  { x: 49, y: 18, r: 1.4 },
  { x: 81, y: 29, r: 2.1 },
  { x: 22, y: 73, r: 1.2 },
  { x: 52, y: 63, r: -1.7 },
  { x: 82, y: 76, r: 1.5 }
];

const evidenceConnections = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 4 },
  { from: 4, to: 5 }
];

function createEvidenceLayout() {
  const layout = evidencePositions.map((position) => ({ ...position }));
  for (let index = layout.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [layout[index], layout[swapIndex]] = [layout[swapIndex], layout[index]];
  }
  return layout;
}

function getEvidencePosition(index) {
  if (!state.evidenceLayout) state.evidenceLayout = createEvidenceLayout();
  return state.evidenceCardPositions[index] || state.evidenceLayout[index] || evidencePositions[index];
}

function evidenceLabel(result) {
  const labels = {
    yes: "命中关键事实",
    no: "排除错误方向",
    partial: "假设部分成立",
    irrelevant: "与真相无关"
  };
  return labels[result] || "等待判断";
}

function verdictLabel(result) {
  const labels = { yes: "是", no: "否", partial: "部分正确", irrelevant: "不相关" };
  return labels[result] || "";
}

function latestHostVerdict() {
  if (state.isThinking || ["thinking", "rejected"].includes(state.currentTurn?.kind)) return null;
  if (state.currentTurn?.kind === "answer") return state.currentTurn.result;
  return state.questions.at(-1)?.result || null;
}

function hostReactionHTML() {
  const needsRewrite = state.currentTurn?.kind === "rejected" && state.currentTurn.rejectionType !== "service";
  const result = latestHostVerdict();
  const src = needsRewrite ? REWRITE_REACTION_IMAGE : HOST_REACTION_IMAGES[result] || HOST_IMAGE;
  const alt = needsRewrite ? "刘看山提醒：请改写这个问题" : result ? `刘看山反馈：${verdictLabel(result)}` : "刘看山 AI 主持人";
  return `<div class="host-reaction-frame ${needsRewrite ? "is-rewrite" : result ? `is-${result}` : "is-idle"}" aria-live="polite">
    <img class="host-reaction-media" src="${src}" alt="${alt}" />
  </div>`;
}

function hostBubbleText() {
  if (state.isThinking) return "我正在核对这个假设。";
  if (state.currentTurn?.kind === "rejected") return state.currentTurn.rejectionType === "service" ? "这次没有扣机会，请稍后再试。" : "请改写这个问题，本次不扣机会。";
  const result = latestHostVerdict();
  return result ? `本轮判断：${verdictLabel(result)}` : "请提出一个是非问题。";
}

function evidenceLinesHTML() {
  return evidenceConnections.map((connection, index) => {
    const active = state.questions[connection.from]?.archived && state.questions[connection.to]?.archived;
    return `<path class="evidence-line ${active ? "is-active" : ""}" d="" data-line="${index}" data-from="${connection.from}" data-to="${connection.to}" />`;
  }).join("");
}

function evidenceCardHTML(question, index, className = "") {
  const position = getEvidencePosition(index);
  const verdict = verdictLabel(question.result);
  const archiveStates = { yes: "CONFIRMED", no: "ELIMINATED", partial: "PARTIAL", irrelevant: "IRRELEVANT" };
  const archiveState = archiveStates[question.result] || "REVIEW";
  return `
    <article class="evidence-card is-${question.result} ${question.justAdded ? "is-new" : ""} ${className}"
      data-evidence-index="${index}" title="${escapeHTML(question.text)}" aria-label="第 ${index + 1} 问：${escapeHTML(question.text)}。回答：${verdict}"
      style="--card-x:${position.x}%;--card-y:${position.y}%;--card-r:${position.r || 0}deg">
      <img class="evidence-host-mini" src="${CARD_HOST_IMAGE}" alt="" aria-hidden="true" />
      <i class="evidence-pin" aria-hidden="true"></i>
      <span class="evidence-watermark" aria-hidden="true">?</span>
      <span class="evidence-stamp" aria-hidden="true">CASE FILE</span>
      <div class="evidence-card-head"><span>CLUE ${String(index + 1).padStart(2, "0")}</span><i class="evidence-status-dot" aria-hidden="true"></i></div>
      <strong>${escapeHTML(question.keyword || "新线索")}</strong>
      <div class="evidence-index" aria-hidden="true"><span>REASONING EVIDENCE</span><i></i></div>
      <div class="evidence-verdict"><b>${verdict}</b><span>${evidenceLabel(question.result)}</span></div>
      <div class="evidence-footer-strip" aria-hidden="true"><span>${archiveState}</span><i></i><small>KANSHAN SOUP / 2026</small></div>
    </article>`;
}

function evidenceBoardHTML() {
  const archivedCards = state.questions.map((question, index) => question.archived ? evidenceCardHTML(question, index) : "").join("");
  const pendingIndex = state.questions.findIndex((question) => !question.archived);
  const nextIndex = pendingIndex >= 0 ? pendingIndex : state.questions.length;
  const placeholderPosition = nextIndex < 6 ? getEvidencePosition(nextIndex) : null;
  const placeholder = nextIndex < 6 ? `
    <div class="evidence-card is-placeholder ${pendingIndex >= 0 ? "is-target" : ""}"
      data-evidence-index="${nextIndex}" style="--card-x:${placeholderPosition.x}%;--card-y:${placeholderPosition.y}%;--card-r:${placeholderPosition.r || 0}deg">
      <i class="evidence-pin" aria-hidden="true"></i>
      <span class="placeholder-plus" aria-hidden="true">+</span>
      <span>${pendingIndex >= 0 ? "生成线索卡片" : "待发现"}</span>
    </div>` : "";
  return `
    <div class="logic-board" id="logicBoard" aria-label="推理线索关系图">
      <svg class="evidence-lines" aria-hidden="true">${evidenceLinesHTML()}</svg>
      ${archivedCards}${placeholder}
      ${state.questions.length === 0 ? `<p class="logic-empty-note">第一问会从下方飞到这里，成为你的第一张线索卡片。</p>` : ""}
    </div>`;
}

function currentTurnHTML() {
  const turn = state.currentTurn;
  if (!turn) {
    return `<div class="turn-empty" aria-label="等待输入下一问"></div>`;
  }
  if (turn.kind === "rejected") {
    const rejectedTitle = turn.rejectionType === "service"
      ? "AI 主持人暂时不可用"
      : turn.reason === "UNKNOWN"
        ? "题面暂时无法判断"
        : turn.reason === "MULTIPLE"
          ? "请一次只问一件事"
          : "请改写这个问题";
    return `<article class="current-exchange is-rejected">
      <div class="current-question"><span>当前问题</span><strong>${escapeHTML(turn.text)}</strong></div>
      <div class="current-answer"><span>主持人提醒</span><strong>${rejectedTitle}</strong><p>${escapeHTML(turn.message || "主持人只回答“是 / 不是”。请把两个选项拆开再问，本次不扣机会。")}</p></div>
    </article>`;
  }
  const verdict = verdictLabel(turn.result);
  return `<article class="current-exchange ${turn.kind === "answer" ? `is-${turn.result}` : "is-thinking"}" ${turn.index !== undefined ? `data-answer-index="${turn.index}"` : ""}>
    <div class="current-question"><span>当前问题</span><strong>${escapeHTML(turn.text)}</strong></div>
    <div class="current-answer"><span>AI 主持人</span>${state.isThinking ? `<span class="thinking-dots" aria-label="刘看山正在判断"><i></i><i></i><i></i></span>` : `<strong class="current-verdict">${verdict}</strong><p>${evidenceLabel(turn.result)}</p>`}</div>
  </article>`;
}

function recommendationsHTML(item) {
  if (!state.recommendationOpen) return "";
  return `
    <div class="recommend-panel">
      <div class="recommend-head"><strong>刘看山给你几个关键词</strong><span>只提示方向，不替你完成提问</span></div>
      <div class="recommend-list">${item.recommendations.map((hint) => `<button class="chip-button ${state.selectedHint === hint.keyword ? "is-selected" : ""}" type="button" data-action="use-recommendation" data-keyword="${escapeHTML(hint.keyword)}" data-guidance="${escapeHTML(hint.guidance)}"><span>${escapeHTML(hint.keyword)}</span><i aria-hidden="true">→</i></button>`).join("")}</div>
      ${state.recommendationGuide ? `<div class="hint-agent-guide"><img src="${HOST_IMAGE}" alt="" aria-hidden="true" /><div><strong>可以这样拆</strong><p>${escapeHTML(state.recommendationGuide)}</p></div></div>` : ""}
    </div>`;
}

function gameHTML(item) {
  const remaining = 6 - state.questions.length;
  const limitReached = remaining === 0;
  const inputLocked = limitReached || state.isThinking || state.isArchiving;
  return `
    <main class="screen game-screen">
      <div class="game-statusbar">
        <div><span class="game-mode-label">${item.mode === "knowledge" ? "知识推理局" : "故事推理局"}</span><h1>${escapeHTML(item.hook)}</h1></div>
        <button class="plain-button" type="button" data-action="show-rules">规则</button>
      </div>
      <div class="detective-workspace">
        <section class="logic-panel">
          <header class="logic-panel-head"><div><span class="game-mode-label">REASONING BOARD</span><h2>推理线索板</h2><p>每一个“是”与“否”，都会成为下一步判断的依据。</p></div><span class="logic-count">${state.questions.filter((question) => question.archived).length} 张卡片</span></header>
          ${evidenceBoardHTML()}
        </section>
        <aside class="detective-side">
          <section class="host-panel-v2">
            <div class="host-copy"><span class="game-mode-label">AI HOST</span><h2>AI 主持人</h2><p>我只回答：是 / 否 / 部分正确 / 不相关</p></div>
            ${hostReactionHTML()}
            <div class="host-bubble">${hostBubbleText()}</div>
          </section>
          <section class="case-note" tabindex="0" aria-label="完整题面，可滚动阅读"><span>完整题面</span><p>${escapeHTML(item.prompt)}</p></section>
        </aside>
        <section class="turn-dock">
          ${recommendationsHTML(item)}
          <div class="turn-dock-top">${currentTurnHTML()}</div>
          <div class="turn-dock-bottom">
            <div class="composer-line">
              <input class="question-input ${state.inputError ? "is-error" : ""}" id="questionInput" type="text" maxlength="80" value="" placeholder="${state.selectedHint ? `围绕“${escapeHTML(state.selectedHint)}”问一个是非问题…` : "继续问一个只能用是或否回答的问题…"}" ${inputLocked ? "disabled" : ""} />
              <button class="recommend-button" type="button" data-action="toggle-recommendations" ${inputLocked ? "disabled" : ""}>看山の线索</button>
              <button class="send-question-button" type="button" data-action="ask-question" aria-label="发送问题" ${inputLocked ? "disabled" : ""}><span aria-hidden="true">↗</span></button>
            </div>
            <div class="dock-end-actions">
              <button class="skip-answer-button" type="button" data-action="reveal-answer" ${state.isThinking || state.isArchiving ? "disabled" : ""}>直接看答案</button>
              <button class="final-guess-button" type="button" data-action="open-guess">${limitReached ? "提交最终推理" : "我知道答案了"}</button>
            </div>
          </div>
          ${state.inputError ? `<p class="error-text">${escapeHTML(state.inputError)}</p>` : ""}
          <span class="dock-hint">${limitReached ? "六次机会已用完，请提交最终推理" : state.isArchiving ? "正在整理这条线索…" : "Enter 发送 · 不符合是非格式的问题不扣次数"}</span>
        </section>
      </div>
    </main>`;
}

function guessModalHTML() {
  if (!state.guessOpen) return "";
  return `
    <div class="modal-backdrop" role="presentation" data-action="close-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="guessTitle" data-modal-content>
        <div class="modal-head"><div><span class="eyebrow">FINAL GUESS</span><h2 id="guessTitle">把你拼出的完整解释写下来</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="关闭">×</button></div>
        <p>用自己的话说出解释，短答案也可以。提交后，AI 会根据核心事实与因果关系评估，不按关键词数量或提问次数加分。</p>
        <div class="guess-input-wrap">
          <textarea class="guess-input" id="guessInput" placeholder="我认为……" autofocus>${escapeHTML(state.guess)}</textarea>
          <button class="voice-input-button ${state.isListening ? "is-listening" : ""}" type="button" data-action="toggle-voice" aria-pressed="${state.isListening}"><span aria-hidden="true">声</span>${state.isListening ? "正在听，点击结束" : "语音转文字"}</button>
        </div>
        <p class="voice-input-note">不想打字？说出你的推理，转成文字后可修改，再提交。</p>
        ${state.inputError ? `<p class="error-text">${escapeHTML(state.inputError)}</p>` : ""}
        <div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">再想想</button><button class="primary-button" type="button" data-action="submit-guess">确认，揭晓答案</button></div>
      </section>
    </div>`;
}

function rulesModalHTML() {
  if (!state.rulesOpen) return "";
  return `
    <div class="modal-backdrop" role="presentation" data-action="close-rules">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="rulesTitle" data-modal-content>
        <div class="modal-head"><div><span class="eyebrow">HOW TO PLAY</span><h2 id="rulesTitle">六问，一次最终判断</h2></div><button class="icon-button" type="button" data-action="close-rules" aria-label="关闭">×</button></div>
        <ol class="rules-list">
          <li><span class="rule-index">01</span><span><strong>一次问一个是非问题</strong><span>看山只回答“是 / 否 / 部分正确 / 不相关”，不解释答案。</span></span></li>
          <li><span class="rule-index">02</span><span><strong>有效回答才计次</strong><span>四种有效回答都会消耗机会；多问、开放式、重复或信息不足的问题不扣次数。</span></span></li>
          <li><span class="rule-index">03</span><span><strong>提示只给方向</strong><span>关键词帮助你拆分问题；已验证的概念汇入线索板，同一概念不会重复。</span></span></li>
          <li><span class="rule-index">04</span><span><strong>随时可以收束</strong><span>可以提前提交最终答案，也可以直接揭晓；报告只描述本局推理风格。</span></span></li>
        </ol>
        <div class="modal-actions"><button class="primary-button" type="button" data-action="close-rules">知道了</button></div>
      </section>
    </div>`;
}

function answerHTML(item) {
  const truth = state.reveal?.truth || "真相正在加载，请稍候。";
  const revealedFacts = Array.isArray(state.reveal?.facts) ? state.reveal.facts.slice(0, 3) : [];
  const truthParts = truth.split(/\n+/).map((part) => part.trim()).filter(Boolean).slice(0, 3);
  const breakdown = revealedFacts.length
    ? revealedFacts.map((fact, index) => ({
      label: fact.label || `真相线索 ${String(index + 1).padStart(2, "0")}`,
      title: fact.title || item.title || item.hook,
      body: fact.body || ""
    }))
    : truthParts.map((part, index) => ({ label: `真相线索 ${String(index + 1).padStart(2, "0")}`, title: item.title || item.hook, body: part }));
  const scoreHTML = state.answerRevealedDirectly
    ? `<div><span class="card-kicker">本局选择</span><div class="score-number is-direct">直接揭晓</div><p>你没有提交最终推理，因此本局不计算线索吻合度。</p></div>`
    : state.evaluationStatus === "loading"
      ? `<div><span class="card-kicker">答案匹配度</span><div class="score-number is-direct">评估中</div><p>AI 正在按核心事实与因果关系核对你的答案。</p></div>`
      : `<div><span class="card-kicker">答案匹配度</span><div class="score-number">${state.score}<small>%</small></div><p>按核心事实与因果关系评估，不按提问次数或关键词堆积加分。</p></div>`;
  const sourceLink = item.sourceUrl
    ? `<a class="ghost-button" href="${item.sourceUrl}" target="_blank" rel="noreferrer">查看原帖</a>`
    : `<span class="ghost-button" aria-label="内容来源">查看原帖</span>`;
  return `
    <main class="screen answer-screen">
      <section class="answer-hero">
        <div class="answer-main"><span class="eyebrow">ANSWER REVEALED / 真相揭晓</span><h1>这一碗汤的真相</h1><p>${escapeHTML(truth)}</p>${!state.answerRevealedDirectly && state.guess ? `<div class="submitted-guess"><span>你的最终答案</span><p>${escapeHTML(state.guess)}</p></div>` : ""}</div>
        <aside class="answer-score">${scoreHTML}<button class="ghost-button" type="button" data-action="view-report">查看我的推理报告 →</button></aside>
      </section>
      ${breakdown.length ? `<section class="knowledge-grid" aria-label="答案拆解">${breakdown.map((fact) => `<article class="knowledge-card"><span>${escapeHTML(fact.label)}</span><h3>${escapeHTML(fact.title)}</h3><p>${escapeHTML(fact.body)}</p></article>`).join("")}</section>` : ""}
      <div class="answer-actions">${sourceLink}<div><button class="ghost-button" type="button" data-action="replay">再玩一次</button> <button class="primary-button" type="button" data-action="view-report">生成个人报告</button></div></div>
    </main>`;
}

function currentLiuBTI() {
  const evaluated = state.evaluation?.profile;
  const code = evaluated?.code || null;
  const visual = code ? LIUBTI_PROFILES[code] : { name: evaluated?.name || "线索还不够", image: HOME_HOST_IMAGE };
  const labelMap = { D: "细节型 Detail", G: "全局型 Global", E: "广探型 Explore", F: "深挖型 Focus", V: "求证型 Verify", X: "排除型 Exclude", O: "开放型 Open", C: "定案型 Close" };
  const axes = (evaluated?.dimensions || []).map((dimension) => ({
    code: dimension.pole || "?",
    label: dimension.pole ? labelMap[dimension.pole] : `${dimension.axis} · 证据不足`,
    reason: dimension.reason,
    evidence: dimension.evidence || []
  }));
  const copy = code ? TYPE_REPORTS[code] : null;
  return { ...visual, code, axes, copy, summary: copy?.portrait || "本局问答证据不足，暂不判断完整类型。再多问几条有效问题，看山才能更准确地描述这一局的推理方式。" };
}

function reportHTML(item) {
  if (state.evaluationStatus === "loading") return `<main class="screen report-screen"><div class="report-header"><div><span class="eyebrow">LIUBTI · 本局推理图鉴</span><h1>报告正在生成</h1></div><span class="status-chip is-hot">AI ANALYSING</span></div><section class="report-grid"><article class="report-card"><h3>看山正在回看你的问答路径 <span class="thinking-dots" aria-hidden="true"><i></i><i></i><i></i></span></h3><p>报告会根据实际问题顺序、判断结果与最终答案生成，不使用模拟人格数据，通常需要几秒钟。</p></article></section></main>`;
  if (state.evaluationStatus === "error") return `<main class="screen report-screen"><div class="report-header"><div><span class="eyebrow">LIUBTI · 本局推理图鉴</span><h1>报告暂时没有生成</h1></div><span class="status-chip">RETRY</span></div><section class="report-grid"><article class="report-card"><h3>本局记录仍然保留</h3><p>${escapeHTML(state.evaluationError || "AI 服务暂时没有响应，请稍后重试。")}</p><button class="primary-button" type="button" data-action="retry-evaluate">重新生成报告</button></article></section></main>`;
  const profile = currentLiuBTI();
  const codeLabel = profile.code || "----";
  const copy = profile.copy;
  const dimensions = profile.axes.length ? profile.axes.map((axis) => `<span><b>${axis.code}</b>${escapeHTML(axis.label)}</span>`).join("") : `<span><b>?</b>需要至少两条有效问答</span>`;
  return `
    <main class="screen report-screen">
      <div class="report-header"><div><span class="eyebrow">LIUBTI · 本局推理图鉴</span><h1>你是怎么<br />接近真相的？</h1></div><span class="status-chip is-hot">${item.number} · ${state.questions.length} 问完成</span></div>
      <section class="report-grid">
        <article class="report-card tag-card liubti-card report-primary-card"><div class="liubti-title"><span>LiuBTI · ${codeLabel}</span><h2>${escapeHTML(profile.name)}</h2></div><p>${escapeHTML(profile.summary)}</p><div class="liubti-axes">${dimensions}</div><img class="report-host liubti-host" src="${profile.image}" alt="${escapeHTML(profile.name)}对应的刘看山形象" /></article>
        <article class="report-card community-card report-primary-card"><h3>本局判断依据</h3><div class="metric-big">${state.questions.length}<small>问</small></div><p>${profile.axes.map((axis) => escapeHTML(axis.reason)).join(" ") || "有效问答太少，本局暂不定型。"}</p><span class="demo-data">仅分析本局 · 不是固定人格标签</span></article>
        ${copy ? `<article class="report-card report-strength-card"><h3>你的优势</h3><p>${escapeHTML(copy.strength)}</p></article><article class="report-card report-blindspot-card"><h3>容易卡住的地方</h3><p>${escapeHTML(copy.blindspot)}</p></article><article class="report-card report-advice-card"><h3>下一局建议</h3><p>${escapeHTML(copy.advice)}</p></article><article class="report-card report-example-card"><h3>提问方式示例</h3><p>${escapeHTML(copy.examples)}</p><p>${escapeHTML(copy.message)}</p></article>` : ""}
      </section>
      <footer class="report-footer"><p>这是你这一局的推理模样，不是固定的人格标签。下一碗汤，也许会遇见不一样的你。</p><div class="report-actions"><button class="report-action" type="button" data-action="share-report">复制分享文案</button><button class="report-action" type="button" data-action="save-report">保存报告</button><button class="primary-button" type="button" data-action="topics">再选一题</button></div></footer>
    </main>`;
}

function render() {
  const screenChanged = lastRenderedScreen !== state.screen;
  const previousHostMedia = state.screen === "game" && !screenChanged ? app.querySelector(".host-reaction-media") : null;
  let content = "";
  let step = "探索";
  const item = currentCase();
  if (state.screen === "login") content = loginHTML();
  if (state.screen === "home") content = homeHTML();
  if (state.screen === "topics") { content = topicsHTML(); step = "01 选题"; }
  if (state.screen === "intro") { content = introHTML(item); step = "02 读题"; }
  if (state.screen === "game") { content = gameHTML(item); step = `${state.questions.length} / 6`; }
  if (state.screen === "answer") { content = answerHTML(item); step = "04 揭晓"; }
  if (state.screen === "report") { content = reportHTML(item); step = "05 报告"; }
  app.innerHTML = `<div class="app-frame">${state.screen === "login" ? "" : headerHTML(step)}${content}</div>${guessModalHTML()}${rulesModalHTML()}${state.toast ? `<div class="toast" role="status">${escapeHTML(state.toast)}</div>` : ""}`;
  if (!screenChanged) app.querySelector(".screen")?.classList.add("no-screen-enter");
  const nextHostMedia = app.querySelector(".host-reaction-media");
  if (previousHostMedia && nextHostMedia?.getAttribute("src") === previousHostMedia.getAttribute("src")) nextHostMedia.replaceWith(previousHostMedia);
  lastRenderedScreen = state.screen;
  if (screenChanged) syncMusic();
  requestAnimationFrame(() => {
    if (screenChanged) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const chat = document.querySelector("#chatLog");
    if (chat) chat.scrollTop = chat.scrollHeight;
    if (state.guessOpen) document.querySelector("#guessInput")?.focus();
    if (state.screen === "game") positionEvidenceLines();
  });
}

function positionEvidenceLines() {
  const board = document.querySelector("#logicBoard");
  const svg = board?.querySelector(".evidence-lines");
  if (!board || !svg || window.innerWidth <= 620) return;
  const boardRect = board.getBoundingClientRect();
  if (!boardRect.width || !boardRect.height) return;
  svg.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);
  svg.querySelectorAll(".evidence-line").forEach((line) => {
    const fromPin = board.querySelector(`[data-evidence-index="${line.dataset.from}"] .evidence-pin`);
    const toPin = board.querySelector(`[data-evidence-index="${line.dataset.to}"] .evidence-pin`);
    if (!fromPin || !toPin) {
      line.style.opacity = "0";
      return;
    }
    const fromRect = fromPin.getBoundingClientRect();
    const toRect = toPin.getBoundingClientRect();
    const x1 = fromRect.left + fromRect.width / 2 - boardRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - boardRect.top;
    const x2 = toRect.left + toRect.width / 2 - boardRect.left;
    const y2 = toRect.top + toRect.height / 2 - boardRect.top;
    const midX = (x1 + x2) / 2;
    line.setAttribute("d", `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
    line.style.opacity = "1";
  });
}

// Full render() tears down and rebuilds the whole evidence board (and forces
// a layout reflow in positionEvidenceLines) even when only the turn/host
// panel changed. That cost grows with the number of archived cards, which is
// why the board felt increasingly laggy after several questions. This patches
// just the turn-dock and host-reaction DOM in place, and defers to a full
// render() outside the game screen or before the board's own DOM exists.
function patchTurnAndHost() {
  const dockTop = app.querySelector(".turn-dock-top");
  if (state.screen !== "game" || lastRenderedScreen !== "game" || !dockTop) { render(); return; }
  dockTop.innerHTML = currentTurnHTML();
  if (!state.recommendationOpen) app.querySelector(".recommend-panel")?.remove();
  const reactionFrame = app.querySelector(".host-reaction-frame");
  if (reactionFrame) {
    const prevMedia = reactionFrame.querySelector(".host-reaction-media");
    const wrap = document.createElement("div");
    wrap.innerHTML = hostReactionHTML();
    const nextFrame = wrap.firstElementChild;
    const nextMedia = nextFrame.querySelector(".host-reaction-media");
    if (prevMedia && nextMedia?.getAttribute("src") === prevMedia.getAttribute("src")) nextMedia.replaceWith(prevMedia);
    reactionFrame.replaceWith(nextFrame);
  }
  const bubble = app.querySelector(".host-bubble");
  if (bubble) bubble.textContent = hostBubbleText();
  const remaining = 6 - state.questions.length;
  const limitReached = remaining === 0;
  const inputLocked = limitReached || state.isThinking || state.isArchiving;
  const input = app.querySelector("#questionInput");
  if (input) { input.disabled = inputLocked; input.value = ""; }
  app.querySelector('[data-action="toggle-recommendations"]')?.toggleAttribute("disabled", inputLocked);
  app.querySelector('[data-action="ask-question"]')?.toggleAttribute("disabled", inputLocked);
  app.querySelector('[data-action="reveal-answer"]')?.toggleAttribute("disabled", state.isThinking || state.isArchiving);
  const finalButton = app.querySelector('[data-action="open-guess"]');
  if (finalButton) finalButton.textContent = limitReached ? "提交最终推理" : "我知道答案了";
  const hint = app.querySelector(".dock-hint");
  if (hint) hint.textContent = limitReached ? "六次机会已用完，请提交最终推理" : state.isArchiving ? "正在整理这条线索…" : "Enter 发送 · 不符合是非格式的问题不扣次数";
  let errorEl = app.querySelector(".turn-dock > .error-text");
  if (state.inputError) {
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "error-text";
      app.querySelector(".turn-dock-bottom")?.insertAdjacentElement("afterend", errorEl);
    }
    errorEl.textContent = state.inputError;
  } else {
    errorEl?.remove();
  }
}

function resetRound() {
  if (speechRecognition) {
    speechRecognition.abort();
    speechRecognition = null;
  }
  state.questions = [];
  state.currentTurn = null;
  state.isThinking = false;
  state.isArchiving = false;
  state.recommendationOpen = false;
  state.recommendationGuide = "";
  state.selectedHint = "";
  state.evidenceLayout = createEvidenceLayout();
  state.evidenceCardPositions = {};
  state.guessOpen = false;
  state.guess = "";
  state.inputError = "";
  state.score = 0;
  state.session = null;
  state.reveal = null;
  state.evaluation = null;
  state.evaluationStatus = "idle";
  state.evaluationError = "";
  state.isRevealing = false;
  state.isListening = false;
  state.answerRevealedDirectly = false;
}

function chooseMode(mode) {
  state.mode = mode;
  state.carouselIndex = 0;
  state.screen = "topics";
  resetRound();
  render();
}

function moveCarousel(direction) {
  const length = currentList().length;
  state.carouselIndex = (state.carouselIndex + direction + length) % length;
  const cards = document.querySelectorAll("#carouselShell .topic-card");
  if (state.screen !== "topics" || cards.length !== length) { render(); return; }
  cards.forEach((card, index) => {
    const offset = (index - state.carouselIndex + length) % length;
    card.classList.remove("is-current", "is-prev", "is-next", "is-hidden");
    card.classList.add(offset === 0 ? "is-current" : offset === length - 1 ? "is-prev" : offset === 1 ? "is-next" : "is-hidden");
    card.setAttribute("aria-hidden", String(offset !== 0));
  });
  const counter = document.querySelector("#carouselShell .carousel-counter");
  if (counter) counter.textContent = `${String(state.carouselIndex + 1).padStart(2, "0")} / ${String(length).padStart(2, "0")}`;
}

function extractEvidenceKeyword(item, question, decision, questionNumber) {
  const verifiedClue = Array.isArray(decision?.board)
    ? decision.board.find((clue) => clue.questionIds?.includes(questionNumber))
    : null;
  const usedKeywords = new Set(state.questions.map((entry) => entry.keyword));
  const makeUnique = (candidate) => {
    const base = candidate.trim() || "关键假设";
    if (!usedKeywords.has(base)) return base;
    let suffix = 2;
    while (usedKeywords.has(`${base}·${suffix}`)) suffix += 1;
    return `${base}·${suffix}`;
  };
  if (verifiedClue?.label) return makeUnique(verifiedClue.label);
  const matchedHint = item.recommendations?.find((hint) => question.includes(hint.keyword));
  if (matchedHint) return makeUnique(matchedHint.keyword);
  const cleaned = question
    .replace(/[？?！!。]/g, "")
    .replace(/^(请问|我想知道|是不是|是否|会不会|有没有|难道|可能是|这个|这件事)/, "")
    .replace(/(吗|么|呢)$/, "")
    .trim();
  const clause = cleaned.split(/[，,；;、]/).map((part) => part.trim()).find((part) => part.length >= 2 && part.length <= 16);
  if (clause) return makeUnique(clause);
  if (cleaned.length <= 16) return makeUnique(cleaned);
  if (typeof Intl.Segmenter === "function") {
    const stop = new Set(["的", "了", "是", "在", "把", "被", "和", "与", "有", "这", "那", "一个", "因为", "所以", "吗"]);
    const words = [...new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(cleaned)]
      .filter((segment) => segment.isWordLike && !stop.has(segment.segment))
      .map((segment) => segment.segment);
    if (words.length) return makeUnique(words.slice(0, 3).join("·"));
  }
  return makeUnique("待核实的假设");
}

function useRecommendation(keyword, guidance) {
  state.selectedHint = keyword;
  state.recommendationGuide = guidance;
  state.recommendationOpen = true;
  render();
}

const API_ERROR_MESSAGES = {
  model_auth_failed: "AI 服务密钥未通过验证，请检查服务端配置。",
  model_balance_insufficient: "AI 服务账户余额不足，请充值后重试。",
  judge_not_configured: "AI 服务尚未配置，本次不扣次数。请配置服务后重试。",
  model_unavailable: "AI 服务暂时没有响应，本次操作未完成，请重试。",
  invalid_model_response: "AI 返回的结果无法确认，本次操作未完成，请重试。",
  too_many_requests: "操作较频繁，请稍后重试。",
  invalid_session: "本局会话已失效，请重新选题。",
  session_expired: "本局会话已过期，请重新选题。",
  round_limit: "六次机会已用完，请提交最终推理。",
  round_closed: "本局已揭晓，请重新选题。"
};

async function apiRequest(path, data) {
  const response = await fetch(`/api/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "service_unavailable");
    error.code = payload.error || "service_unavailable";
    throw error;
  }
  return payload;
}

async function ensureGameSession(item) {
  if (state.session) return state.session;
  const data = await apiRequest("start", { caseId: item.id });
  state.session = data.session;
  return state.session;
}

async function requestAIJudge(item, question) {
  await ensureGameSession(item);
  const data = await apiRequest("judge", { session: state.session, question });
  if (!["YES", "NO", "PARTIAL", "IRRELEVANT", "INVALID"].includes(data.verdict)) throw new Error("judge_invalid_response");
  state.session = data.session || state.session;
  return data;
}

async function askQuestion(question) {
  const text = question.trim();
  if (!text) {
    state.inputError = "先写下一个可以用“是 / 不是”回答的问题。";
    render();
    return;
  }
  if (state.questions.length >= 6 || state.isThinking || state.isArchiving) return;
  state.inputError = "";
  state.recommendationOpen = false;
  state.recommendationGuide = "";
  state.selectedHint = "";
  state.currentTurn = { kind: "thinking", text };
  state.isThinking = true;
  patchTurnAndHost();
  const item = currentCase();
  let result;
  let decision;
  try {
    decision = await requestAIJudge(item, text);
    if (decision.verdict === "INVALID" || decision.counts === false) {
      state.isThinking = false;
      state.currentTurn = { kind: "rejected", text, message: decision.message, reason: decision.reason };
      patchTurnAndHost();
      return;
    }
    const verdictMap = { YES: "yes", NO: "no", PARTIAL: "partial", IRRELEVANT: "irrelevant" };
    result = verdictMap[decision.verdict];
  } catch (error) {
    state.isThinking = false;
    state.currentTurn = { kind: "rejected", rejectionType: "service", text, message: API_ERROR_MESSAGES[error.code] || "AI 主持人暂时没有响应，本次不扣次数，请稍后重试。" };
    patchTurnAndHost();
    return;
  }
  window.setTimeout(() => {
    const pieceIndex = state.questions.length;
    state.questions.push({ text, keyword: extractEvidenceKeyword(item, text, decision, pieceIndex + 1), result, archived: false, justAdded: false });
    state.currentTurn = { kind: "answer", index: pieceIndex, text, result };
    state.isThinking = false;
    state.isArchiving = true;
    patchTurnAndHost();
    // Do not wait for requestAnimationFrame: background tabs can throttle it for seconds.
    window.setTimeout(() => animateAnswerToBoard(pieceIndex), 220);
  }, 120);
}

function animateAnswerToBoard(index) {
  const question = state.questions[index];
  if (!question) return;
  // Fly from the small verdict badge, not the whole wide answer bubble - starting
  // a card-shaped flight from a wide rectangle reads as "a box getting crushed".
  // A pill-sized seed that grows into the card feels like the exchange condensing
  // into a thought, and the content only appears once it has room to sit in.
  const seedSource = document.querySelector(`[data-answer-index="${index}"] .current-verdict`);
  const exchange = seedSource?.closest(".current-exchange");
  const target = document.querySelector(`[data-evidence-index="${index}"]`);
  const reduceMotion = document.body.classList.contains("no-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let finished = false;
  let flyingCard = null;
  const finish = () => {
    if (finished) return;
    finished = true;
    flyingCard?.remove();
    question.archived = true;
    question.justAdded = true;
    state.currentTurn = null;
    state.isArchiving = false;
    render();
    window.setTimeout(() => { question.justAdded = false; }, 850);
    if (state.questions.length === 6) showToast("六张线索卡片已归位，请提交最终推理。");
  };

  if (!seedSource || !target || reduceMotion) {
    finish();
    return;
  }

  const sourceRect = seedSource.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  flyingCard = document.createElement("article");
  flyingCard.className = `fly-evidence-card is-condensing is-${question.result}`;
  flyingCard.setAttribute("aria-hidden", "true");
  flyingCard.innerHTML = `
    <span class="fly-seed">${verdictLabel(question.result)}</span>
    <div class="fly-face">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHTML(question.keyword || "新线索")}</strong>
      <div><b>${verdictLabel(question.result)}</b><em>${evidenceLabel(question.result)}</em></div>
    </div>`;
  flyingCard.style.left = `${sourceRect.left}px`;
  flyingCard.style.top = `${sourceRect.top}px`;
  flyingCard.style.width = `${sourceRect.width}px`;
  flyingCard.style.height = `${sourceRect.height}px`;
  document.body.appendChild(flyingCard);

  exchange?.classList.add("is-departing");
  const deltaX = targetRect.left - sourceRect.left;
  const deltaY = targetRect.top - sourceRect.top;
  const targetScaleX = targetRect.width / sourceRect.width;
  const targetScaleY = targetRect.height / sourceRect.height;
  const duration = 620;
  const flight = flyingCard.animate([
    { transform: "translate(0, 0) scale(1)", borderRadius: "999px", offset: 0 },
    { transform: `translate(${deltaX * 0.4}px, ${deltaY * 0.4 - 46}px) scale(${Math.max(targetScaleX, targetScaleY) * 0.5}, ${Math.max(targetScaleX, targetScaleY) * 0.5})`, borderRadius: "46%", offset: .52 },
    { transform: `translate(${deltaX}px, ${deltaY}px) scale(${targetScaleX}, ${targetScaleY})`, borderRadius: "18px", offset: 1 }
  ], { duration, easing: "cubic-bezier(.22,.75,.22,1)", fill: "forwards" });
  flyingCard.querySelector(".fly-seed").animate(
    [{ opacity: 1, offset: 0 }, { opacity: 1, offset: .32 }, { opacity: 0, offset: .58 }],
    { duration, easing: "linear", fill: "forwards" }
  );
  flyingCard.querySelector(".fly-face").animate(
    [{ opacity: 0, offset: 0 }, { opacity: 0, offset: .5 }, { opacity: 1, offset: .88 }],
    { duration, easing: "linear", fill: "forwards" }
  );
  flight.addEventListener("finish", finish, { once: true });
  flight.addEventListener("cancel", finish, { once: true });
  window.setTimeout(finish, duration + 160);
}

function showToast(message) {
  state.toast = message;
  app.querySelector(".toast")?.remove();
  app.insertAdjacentHTML("beforeend", `<div class="toast" role="status">${escapeHTML(message)}</div>`);
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = "";
    app.querySelector(".toast")?.remove();
  }, 2600);
}

function openGuess() {
  state.guessOpen = true;
  state.inputError = "";
  render();
}

function stopVoiceInput() {
  if (speechRecognition) speechRecognition.stop();
}

function toggleVoiceInput() {
  if (state.isListening) {
    stopVoiceInput();
    return;
  }
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    showToast("当前浏览器暂不支持语音转文字，请使用最新版 Chrome 或 Edge。");
    return;
  }

  const textarea = document.querySelector("#guessInput");
  const initialText = textarea?.value.trim() || state.guess.trim();
  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.continuous = true;
  recognition.interimResults = true;
  speechRecognition = recognition;
  state.guess = initialText;
  state.isListening = true;
  render();

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0]?.transcript || "";
      if (event.results[index].isFinal) finalText += transcript;
      else interimText += transcript;
    }
    if (finalText) state.guess = `${state.guess}${state.guess ? " " : ""}${finalText}`.trim();
    const activeTextarea = document.querySelector("#guessInput");
    if (activeTextarea) activeTextarea.value = `${state.guess}${interimText ? ` ${interimText}` : ""}`.trim();
  };
  recognition.onerror = (event) => {
    if (event.error !== "aborted" && event.error !== "no-speech") state.inputError = "没有识别清楚，请再说一次或改用文字输入。";
  };
  recognition.onend = () => {
    const activeTextarea = document.querySelector("#guessInput");
    if (activeTextarea?.value.trim()) state.guess = activeTextarea.value.trim();
    state.isListening = false;
    speechRecognition = null;
    if (state.guessOpen) render();
  };
  try {
    recognition.start();
  } catch {
    state.isListening = false;
    speechRecognition = null;
    showToast("语音输入没有启动，请检查浏览器的麦克风权限。");
  }
}

async function evaluateRound() {
  state.evaluationStatus = "loading";
  state.evaluationError = "";
  render();
  try {
    const data = await apiRequest("evaluate", { session: state.session });
    state.evaluation = data;
    state.score = data.assessment?.score || 0;
    state.evaluationStatus = "ready";
  } catch (error) {
    state.evaluationStatus = "error";
    state.evaluationError = API_ERROR_MESSAGES[error.code] || "报告暂时生成失败，请稍后重试。";
  }
  render();
}

async function closeRound(guess) {
  if (state.isRevealing) return;
  state.isRevealing = true;
  state.inputError = "";
  render();
  try {
    await ensureGameSession(currentCase());
    const data = await apiRequest("reveal", { session: state.session, guess });
    state.session = data.session;
    state.reveal = { truth: data.truth, facts: data.facts || [] };
    state.answerRevealedDirectly = guess === null;
    state.guessOpen = false;
    state.rulesOpen = false;
    state.recommendationOpen = false;
    state.screen = "answer";
    state.isRevealing = false;
    render();
    void evaluateRound();
  } catch (error) {
    state.isRevealing = false;
    state.inputError = API_ERROR_MESSAGES[error.code] || "暂时无法揭晓答案，请稍后重试。";
    render();
  }
}

async function submitGuess() {
  stopVoiceInput();
  const textarea = document.querySelector("#guessInput");
  const guess = textarea?.value.trim() || "";
  if (!guess) {
    state.guess = guess;
    state.inputError = "先写下你的推理，短答案也可以。";
    render();
    return;
  }
  state.guess = guess;
  await closeRound(guess);
}

async function revealAnswer() {
  if (state.isThinking || state.isArchiving) return;
  state.guess = "";
  state.score = 0;
  await closeRound(null);
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#questionInput") && state.recommendationOpen) {
    state.recommendationOpen = false;
    document.querySelector(".recommend-panel")?.remove();
  }
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  if ((action === "close-modal" || action === "close-rules") && actionEl.classList.contains("modal-backdrop") && event.target !== actionEl) return;

  if (action === "guest-login") {
    sessionStorage.setItem("kanshanGuestEntered", "1");
    state.screen = "home";
    render();
    return;
  }
  if (action === "zhihu-login") {
    location.href = `https://openapi.zhihu.com/authorize?redirect_uri=${encodeURIComponent(ZHIHU_OAUTH_REDIRECT_URI)}&app_id=${ZHIHU_OAUTH_APP_ID}&response_type=code`;
    return;
  }
  if (action === "toggle-music") {
    if (musicUnlockNeeded && !musicMuted) { syncMusic(); return; }
    musicMuted = !musicMuted;
    localStorage.setItem("kanshanMusicMuted", String(Number(musicMuted)));
    musicUnlockNeeded = false;
    updateMusicButtons();
    syncMusic();
    return;
  }

  if (action === "back") {
    if (state.screen === "topics") state.screen = "home";
    else if (state.screen === "intro") { state.screen = "topics"; state.selectedCaseId = null; }
    else if (state.screen === "game") state.screen = "intro";
    else if (state.screen === "answer") state.screen = "intro";
    else if (state.screen === "report") state.screen = "answer";
    state.recommendationOpen = false;
    state.guessOpen = false;
    state.rulesOpen = false;
    render();
  }
  if (action === "home") { Object.assign(state, { ...initialState, screen: "home" }); render(); }
  if (action === "topics") { state.screen = "topics"; state.selectedCaseId = null; resetRound(); render(); }
  if (action === "choose-mode") chooseMode(actionEl.dataset.mode);
  if (action === "carousel-prev") moveCarousel(-1);
  if (action === "carousel-next") moveCarousel(1);
  if (action === "select-case") {
    state.selectedCaseId = actionEl.dataset.caseId;
    resetRound();
    state.screen = "intro";
    render();
  }
  if (action === "start-game") { resetRound(); state.screen = "game"; render(); }
  if (action === "ask-question") askQuestion(document.querySelector("#questionInput")?.value || "");
  if (action === "toggle-recommendations") {
    state.recommendationOpen = !state.recommendationOpen;
    if (!state.recommendationOpen) { state.recommendationGuide = ""; state.selectedHint = ""; }
    render();
  }
  if (action === "use-recommendation") useRecommendation(actionEl.dataset.keyword || "", actionEl.dataset.guidance || "");
  if (action === "open-guess") openGuess();
  if (action === "toggle-voice") toggleVoiceInput();
  if (action === "reveal-answer") revealAnswer();
  if (action === "close-modal") { stopVoiceInput(); state.guess = document.querySelector("#guessInput")?.value || state.guess; state.guessOpen = false; state.isListening = false; state.inputError = ""; render(); }
  if (action === "submit-guess") submitGuess();
  if (action === "show-rules") { state.rulesOpen = true; render(); }
  if (action === "close-rules") { state.rulesOpen = false; render(); }
  if (action === "view-report") { state.screen = "report"; render(); }
  if (action === "retry-evaluate") void evaluateRound();
  if (action === "replay") { resetRound(); state.screen = "intro"; render(); }
  if (action === "share-report") {
    const profile = currentLiuBTI();
    const shareText = state.answerRevealedDirectly
      ? `我在知乎「看山有碗汤」完成了一局推理，本局风格是“${profile.name}${profile.code ? `（${profile.code}）` : ""}”。这次我选择直接揭晓，你能用六个问题拼出答案吗？`
      : `我在知乎「看山有碗汤」完成了一局推理，本局风格是“${profile.name}${profile.code ? `（${profile.code}）` : ""}”，答案匹配度 ${state.score}%。六个问题，你能拼出答案吗？`;
    navigator.clipboard?.writeText(shareText).then(() => showToast("分享文案已复制。"), () => showToast("复制失败，请手动复制报告内容。"));
  }
  if (action === "save-report") window.print();
});

document.addEventListener("pointerdown", () => {
  if (musicUnlockNeeded && !musicMuted) syncMusic();
}, { capture: true });
document.addEventListener("focusin", (event) => {
  if (event.target.id === "questionInput" && state.recommendationOpen) {
    state.recommendationOpen = false;
    document.querySelector(".recommend-panel")?.remove();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && state.screen === "game" && document.activeElement?.id === "questionInput") {
    event.preventDefault();
    askQuestion(document.querySelector("#questionInput")?.value || "");
  }
  if (event.key === "Escape") {
    if (state.guessOpen) { stopVoiceInput(); state.guessOpen = false; state.isListening = false; state.inputError = ""; render(); }
    else if (state.rulesOpen) { state.rulesOpen = false; render(); }
  }
  if (state.screen === "topics" && !event.target.matches("input, textarea, select")) {
    if (event.key === "ArrowRight") moveCarousel(1);
    if (event.key === "ArrowLeft") moveCarousel(-1);
  }
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

let pointerStartX = null;
let evidenceDrag = null;
document.addEventListener("pointerdown", (event) => {
  const evidenceCard = event.target.closest(".evidence-card:not(.is-placeholder)");
  const evidenceBoard = event.target.closest("#logicBoard");
  if (state.screen === "game" && evidenceCard && evidenceBoard && window.innerWidth > 620) {
    const index = Number(evidenceCard.dataset.evidenceIndex);
    const boardRect = evidenceBoard.getBoundingClientRect();
    const cardRect = evidenceCard.getBoundingClientRect();
    evidenceDrag = {
      pointerId: event.pointerId,
      index,
      card: evidenceCard,
      boardRect,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      width: cardRect.width,
      height: cardRect.height,
      x: getEvidencePosition(index).x,
      y: getEvidencePosition(index).y
    };
    evidenceCard.setPointerCapture?.(event.pointerId);
    evidenceCard.classList.add("is-dragging");
    event.preventDefault();
    return;
  }
  if (state.screen === "topics" && event.target.closest("#carouselShell")) pointerStartX = event.clientX;
});

document.addEventListener("pointermove", (event) => {
  if (!evidenceDrag || evidenceDrag.pointerId !== event.pointerId) return;
  const drag = evidenceDrag;
  const centerX = clamp(event.clientX - drag.boardRect.left - drag.offsetX + drag.width / 2, drag.width / 2 + 10, drag.boardRect.width - drag.width / 2 - 10);
  const centerY = clamp(event.clientY - drag.boardRect.top - drag.offsetY + drag.height / 2, drag.height / 2 + 14, drag.boardRect.height - drag.height / 2 - 12);
  drag.x = centerX / drag.boardRect.width * 100;
  drag.y = centerY / drag.boardRect.height * 100;
  drag.card.style.setProperty("--card-x", `${drag.x}%`);
  drag.card.style.setProperty("--card-y", `${drag.y}%`);
  positionEvidenceLines();
});

function finishEvidenceDrag(event) {
  if (!evidenceDrag || evidenceDrag.pointerId !== event.pointerId) return false;
  const drag = evidenceDrag;
  const original = getEvidencePosition(drag.index);
  state.evidenceCardPositions[drag.index] = { x: drag.x, y: drag.y, r: original.r || 0 };
  drag.card.classList.remove("is-dragging");
  drag.card.releasePointerCapture?.(event.pointerId);
  evidenceDrag = null;
  positionEvidenceLines();
  return true;
}

document.addEventListener("pointerup", (event) => {
  if (finishEvidenceDrag(event)) return;
  if (pointerStartX === null) return;
  const delta = event.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(delta) < 46) return;
  moveCarousel(delta < 0 ? 1 : -1);
});
document.addEventListener("pointercancel", (event) => {
  finishEvidenceDrag(event);
  pointerStartX = null;
});
window.addEventListener("resize", () => {
  if (state.screen === "game") requestAnimationFrame(positionEvidenceLines);
});

render();
if (zhihuLoginResult === "ok") showToast("知乎账号登录成功。");
if (zhihuLoginResult === "error") showToast("知乎登录未完成，可以重试或先用游客身份体验。");
