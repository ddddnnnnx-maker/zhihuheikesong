import worker from "../server/api.mjs";

const runtimeEnv = new Proxy({}, {
  get(_target, key) {
    return typeof key === "string" ? process.env[key] : undefined;
  }
});

export default {
  fetch(request) {
    return worker.fetch(request, runtimeEnv);
  }
};
