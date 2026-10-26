import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const LOG = fileURLToPath(new URL("../src/skills/show-me-your-work/scripts/log.mjs", import.meta.url));

const log = (...args) => spawnSync(process.execPath, [LOG, ...args], { encoding: "utf8" });
const rows = (file) => readFileSync(file, "utf8").trimEnd().split("\n").map((line) => line.split("\t"));

test("creates the folder and header, then appends one row per call", () => {
  const file = join(mkdtempSync(join(tmpdir(), "jstack-log-")), "nested", "decisions.tsv");
  assert.equal(log(file, "frame", "sized the work", "needed scope", "commit abc", "open").status, 0);
  assert.equal(log(file, "build", "added parser", "first unit", "src/parse.mjs", "tests pass").status, 0);

  const [header, first, second] = rows(file);
  assert.deepEqual(header, ["ts", "phase", "decision", "why", "evidence", "result"]);
  assert.match(first[0], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.deepEqual(first.slice(1), ["frame", "sized the work", "needed scope", "commit abc", "open"]);
  assert.equal(second[1], "build");
});

test("keeps each row on one line and neutralizes formulas", () => {
  const file = join(mkdtempSync(join(tmpdir(), "jstack-log-")), "decisions.tsv");
  log(file, "x", "tab\there", "line\nbreak", "=SUM(A1)", "-1");

  const [, row] = rows(file);
  assert.equal(row.length, 6);
  assert.deepEqual(row.slice(2), ["tab here", "line break", "'=SUM(A1)", "'-1"]);
});

test("rejects the wrong number of arguments", () => {
  const { status, stderr } = log("only-a-file.tsv");
  assert.equal(status, 1);
  assert.match(stderr, /usage/);
});
