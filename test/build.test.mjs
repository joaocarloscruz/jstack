import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCES = ["build.mjs", "jstack.json", "roles.json", "LICENSE", "harness", "src"];

// Each test builds a private copy of the repo, so a broken source never touches the real one.
function copyRepo() {
  const dir = mkdtempSync(join(tmpdir(), "jstack-build-"));
  for (const path of SOURCES) cpSync(join(ROOT, path), join(dir, path), { recursive: true });
  return dir;
}

const build = (dir, ...args) => spawnSync(process.execPath, [join(dir, "build.mjs"), ...args], { encoding: "utf8" });

test("the committed build output is up to date", () => {
  const { status, stderr } = build(ROOT, "--check");
  assert.equal(status, 0, stderr);
});

test("a fresh build passes its own check", () => {
  const dir = copyRepo();
  assert.equal(build(dir).status, 0);
  assert.equal(build(dir, "--check").status, 0);
});

test("--check catches a hand-edited output file", () => {
  const dir = copyRepo();
  build(dir);
  appendFileSync(join(dir, "dist", "codex", "skills", "prove", "SKILL.md"), "edited\n");
  const { status, stderr } = build(dir, "--check");
  assert.equal(status, 1);
  assert.match(stderr, /dist\/codex\/skills\/prove\/SKILL\.md/);
});

const failures = [
  ["an unknown token", "{{oops:x}}", /unknown token \{\{oops:x\}\}/],
  ["a missing skill", "{{skill:nope}}", /names no skill/],
  ["a missing role", "{{role:ghost}}", /role "ghost" has no/],
  ["a missing harness text key", "{{harness:nothing}}", /has no "text\.nothing"/],
  ["a missing reference file", "See `references/nope.md`.", /`references\/nope\.md` doesn't exist/],
  ["a hard-coded model", "Run it on grok-4.", /hard-coded model name/],
  ["a harness tool name", "Use the Task tool.", /harness tool name/],
  ["a harness path", "Edit CLAUDE.md.", /harness path/],
  ["a bare model alias", "Run the second reviewer on opus.", /hard-coded model name/],
  ["a harness name", "In Claude Code, do this.", /harness name/],
  ["a rendered skill name", "Run /jstack:prove before done.", /rendered skill or agent name/],
  ["a malformed token", "Run {{ skill:prove }} first.", /contains "\{\{"/],
  ["a citation of a missing principle", "Per Make it fast in {{skill:principles}}.", /names no principle/],
];

test("ordinary English isn't mistaken for a harness term", () => {
  const dir = copyRepo();
  appendFileSync(join(dir, "src", "skills", "tdd", "SKILL.md"), "\nMove the cursor to the end of the line.\n");
  assert.equal(build(dir).status, 0);
});

for (const [name, text, message] of failures) {
  test(`fails on ${name}`, () => {
    const dir = copyRepo();
    appendFileSync(join(dir, "src", "skills", "tdd", "SKILL.md"), `\n${text}\n`);
    const { status, stderr } = build(dir);
    assert.equal(status, 1);
    assert.match(stderr, message);
  });
}

test("fails when a skill's name doesn't match its folder", () => {
  const dir = copyRepo();
  const path = join(dir, "src", "skills", "tdd", "SKILL.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("name: tdd", "name: test-first"));
  const { status, stderr } = build(dir);
  assert.equal(status, 1);
  assert.match(stderr, /must match its folder "tdd"/);
});

test("fails on an effort the harness doesn't accept", () => {
  const dir = copyRepo();
  const path = join(dir, "roles.json");
  writeFileSync(path, readFileSync(path, "utf8").replace('"effort": "low"', '"effort": "turbo"'));
  const { status, stderr } = build(dir);
  assert.equal(status, 1);
  assert.match(stderr, /effort "turbo" is not one of/);
});

// The tests below read the committed dist/, which the first test proves is current.
const dist = (...path) => readFileSync(join(ROOT, "dist", ...path), "utf8");
const harness = (id) => JSON.parse(readFileSync(join(ROOT, "harness", `${id}.json`), "utf8"));
const roles = JSON.parse(readFileSync(join(ROOT, "roles.json"), "utf8"));

test("the Claude Code reviewer agent has valid frontmatter and the judge role's model", () => {
  const [, frontmatter] = dist("claude-code", "agents", "reviewer.md").match(/^---\n([\s\S]*?)\n---\n/);
  const fields = Object.fromEntries(frontmatter.split("\n").map((line) => line.split(/: (.*)/s).slice(0, 2)));
  assert.equal(fields.name, "reviewer");
  assert.equal(typeof JSON.parse(fields.description), "string");
  assert.equal(fields.model, roles.judge["claude-code"].model);
  assert.equal(fields.effort, roles.judge["claude-code"].effort);
  assert.deepEqual(fields.tools.split(", "), harness("claude-code").readonlyTools);
});

test("the Codex reviewer agent is well-formed TOML with a prefixed name", () => {
  const toml = dist("codex", "agents", "jstack_reviewer.toml");
  const [head, body] = toml.split("developer_instructions = '''\n");
  const fields = Object.fromEntries(head.trim().split("\n").map((line) => {
    const [key, value] = line.split(" = ");
    return [key, JSON.parse(value)];
  }));
  assert.equal(fields.name, "jstack_reviewer");
  assert.equal(fields.model_reasoning_effort, roles.judge.codex.effort);
  assert.ok(!("model" in fields), "a null model must be left out so the session model applies");
  assert.ok(body.trimEnd().endsWith("'''"));
});

test("role tokens render to each harness's model and effort", () => {
  const { model, effort } = roles.coder["claude-code"];
  assert.match(dist("claude-code", "skills", "lead", "SKILL.md"), new RegExp(`\`${model}\` at \`${effort}\` effort`));
  assert.match(dist("codex", "skills", "lead", "SKILL.md"), new RegExp(`the session model at \`${roles.coder.codex.effort}\``));
});

test("both marketplaces point at their harness's build", () => {
  const claude = JSON.parse(readFileSync(join(ROOT, ".claude-plugin", "marketplace.json"), "utf8"));
  const codex = JSON.parse(readFileSync(join(ROOT, ".agents", "plugins", "marketplace.json"), "utf8"));
  assert.equal(claude.plugins[0].source, "./dist/claude-code");
  assert.equal(codex.plugins[0].source.path, "./dist/codex");
});

test("every harness gets the hook, its rules and a shell matcher covering PowerShell", () => {
  for (const id of ["claude-code", "codex"]) {
    assert.ok(dist(id, "hooks", "shell-rules.mjs").includes("export function check"));
    assert.match(JSON.parse(dist(id, "hooks", "hooks.json")).hooks.PreToolUse[0].matcher, /PowerShell/);
  }
});

test("the README's token table matches the harness profiles", () => {
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  for (const id of ["claude-code", "codex"]) {
    const profile = harness(id);
    assert.ok(readme.includes(profile.skillRef.replace("{name}", "prove")), `${id} skillRef`);
    assert.ok(readme.includes(profile.agentRef.replace("{name}", "reviewer")), `${id} agentRef`);
  }
});

test("manual skills render per harness", () => {
  const dir = copyRepo();
  build(dir);
  const claude = readFileSync(join(dir, "dist", "claude-code", "skills", "lead", "SKILL.md"), "utf8");
  const codex = readFileSync(join(dir, "dist", "codex", "skills", "lead", "SKILL.md"), "utf8");
  const policy = readFileSync(join(dir, "dist", "codex", "skills", "lead", "agents", "openai.yaml"), "utf8");
  assert.match(claude, /^disable-model-invocation: true$/m);
  assert.doesNotMatch(codex, /invocation/);
  assert.match(policy, /allow_implicit_invocation: false/);
});
