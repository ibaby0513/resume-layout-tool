const assert = require("assert");
const fs = require("fs");
const path = require("path");

const app = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const blockedPatterns = [
  /1[3-9]\d{9}/,
  /[A-Za-z0-9._%+-]+@hust\.edu\.cn/,
];

for (const pattern of blockedPatterns) {
  assert.equal(pattern.test(app), false, `app.js should not include private/default branded pattern: ${pattern}`);
}

const oldLogoFile = "school-logo-" + "clean.png";
assert.equal(fs.existsSync(path.join(__dirname, "..", "assets", "template-icons", oldLogoFile)), false);

console.log("open-source defaults tests passed");
