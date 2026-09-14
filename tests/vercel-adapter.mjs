import assert from "node:assert/strict";
import startHandler from "../api/start.mjs";
import revealHandler from "../api/reveal.mjs";

process.env.SESSION_SECRET = "vercel-adapter-test-secret";

const post = (path, body) => new Request(`https://example.test/api/${path}`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    origin: "https://example.test"
  },
  body: JSON.stringify(body)
});

const startedResponse = await startHandler.fetch(post("start", { caseId: "origin" }));
assert.equal(startedResponse.status, 200);
const started = await startedResponse.json();
assert.equal(typeof started.session, "string");

const revealedResponse = await revealHandler.fetch(post("reveal", {
  session: started.session,
  guess: null
}));
assert.equal(revealedResponse.status, 200);
const revealed = await revealedResponse.json();
assert.equal(typeof revealed.truth, "string");
assert.ok(revealed.truth.length > 0);

console.log("vercel-adapter: ok");
