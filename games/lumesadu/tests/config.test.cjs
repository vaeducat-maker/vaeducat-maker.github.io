const fs = require("fs");
const vm = require("vm");
const path = require("path");

const configPath = path.join(__dirname, "..", "lumesadu.config.js");
const source = fs.readFileSync(configPath, "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const cfg = sandbox.window.LUMESADU_CONFIG;

function ok(condition, message) {
  if (!condition) {
    console.error("FAIL", message);
    process.exitCode = 1;
  } else {
    console.log("OK", message);
  }
}

ok(!!cfg, "config loads");
ok(cfg.items.length === 10, "MVP has 10 words");
ok(new Set(cfg.items.map(x => x.id)).size === cfg.items.length, "item ids are unique");
ok(new Set(cfg.items.map(x => x.word)).size === cfg.items.length, "words are unique");
ok(cfg.iceCubesPerRow === 4, "ice row has exactly 4 cubes");
ok(cfg.maxErrors === 5, "loss happens at 5 errors");
ok(cfg.questionCount === 10, "prototype core bank has 10 questions");
ok(cfg.modeLabel === "Rahulik", "first mode is Rahulik");
ok(cfg.feedback.wrongMs > 0 && cfg.feedback.correctAfterWrongMs > 0, "wrong/correct feedback timings exist");

if (process.exitCode) process.exit(process.exitCode);
