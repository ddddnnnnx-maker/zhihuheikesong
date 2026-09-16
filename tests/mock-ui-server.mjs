// Local-only UI smoke-test server. No DeepSeek calls and no real game data is changed.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".mp3": "audio/mpeg" };
let count = 0;
const json = (response, data) => {
  response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
};

http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname === "/api/start") return json(response, { session: "mock-session" });
  if (url.pathname === "/api/judge") {
    let raw = "";
    for await (const part of request) raw += part;
    const question = JSON.parse(raw).question || "";
    if (question.includes("还是")) return json(response, { verdict: "INVALID", counts: false, reason: "MULTIPLE", message: "主持人只回答是或否，请把两个选项拆开再问。", session: "mock-session" });
    count += 1;
    return json(response, { verdict: count % 2 ? "YES" : "IRRELEVANT", counts: true, session: "mock-session", board: [{ label: `完整线索概念${count}`, questionIds: [count] }] });
  }
  if (url.pathname === "/api/reveal") return json(response, { session: "mock-session", truth: "这是仅用于界面测试的答案。", facts: [] });
  if (url.pathname === "/api/evaluate") return json(response, { assessment: { score: 50 }, profile: { dimensions: [] } });
  const relative = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const file = path.resolve(root, relative);
  if (!file.startsWith(root) || relative.includes("..")) { response.writeHead(404); response.end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
}).listen(4189, "127.0.0.1", () => console.log("Mock UI: http://127.0.0.1:4189/"));
