const assert = require("assert");
const { createBackupPayload, parseBackupText } = require("../state-backup.js");

const state = {
  activeTemplate: "academic",
  styles: { fontSize: 12.5 },
  resume: {
    profile: { name: "测试用户" },
    projects: [{ name: "项目", description: "**重点**内容" }],
  },
};

const payload = createBackupPayload(state, "2026-06-22T00:00:00.000Z");
assert.equal(payload.app, "resume-layout-tool");
assert.equal(payload.version, 1);
assert.equal(payload.exportedAt, "2026-06-22T00:00:00.000Z");
assert.deepEqual(payload.state, state);

const parsedPayload = parseBackupText(JSON.stringify(payload));
assert.deepEqual(parsedPayload, state);

const parsedRawState = parseBackupText(JSON.stringify(state));
assert.deepEqual(parsedRawState, state);

assert.throws(() => parseBackupText("{bad json"), /不是有效的 JSON/);
assert.throws(() => parseBackupText(JSON.stringify({ app: "resume-layout-tool" })), /缺少 state/);

console.log("state-backup tests passed");
