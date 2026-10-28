import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Checks the references a hand-edited skill can break: there is no build step to catch them.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MODELS = ["opus", "sonnet", "haiku", "fable", "inherit"];
const EFFORTS = ["low", "medium", "high", "xhigh", "max"];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]));
const read = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const frontmatter = (text) =>
  Object.fromEntries((text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "").split("\n").map((line) => line.split(/:\s(.*)/s).slice(0, 2)));

const skills = readdirSync(join(ROOT, "skills"));
const agents = readdirSync(join(ROOT, "agents")).map((name) => name.replace(/\.md$/, ""));
const docs = [...walk(join(ROOT, "skills")), ...walk(join(ROOT, "agents"))].filter((path) => path.endsWith(".md"));
const rel = (path) => relative(ROOT, path).replace(/\\/g, "/");

test("every skill's name matches its folder and it has a description", () => {
  for (const skill of skills) {
    const fields = frontmatter(read(join(ROOT, "skills", skill, "SKILL.md")));
    assert.equal(fields.name, skill);
    assert.ok(fields.description, `${skill} has no description`);
  }
});

test("every agent sets its model and effort on one line each", () => {
  for (const agent of agents) {
    const fields = frontmatter(read(join(ROOT, "agents", `${agent}.md`)));
    assert.equal(fields.name, agent);
    assert.ok(MODELS.includes(fields.model), `${agent}: model "${fields.model}" is not one of ${MODELS.join(", ")}`);
    assert.ok(EFFORTS.includes(fields.effort), `${agent}: effort "${fields.effort}" is not one of ${EFFORTS.join(", ")}`);
  }
});

test("every jstack:<name> reference names a skill or an agent", () => {
  for (const path of docs) {
    for (const [, name] of read(path).matchAll(/jstack:([\w-]+)/g)) {
      assert.ok(skills.includes(name) || agents.includes(name), `${rel(path)} names jstack:${name}, which doesn't exist`);
    }
  }
});

test("every backticked file a skill points to exists", () => {
  for (const path of docs.filter((p) => rel(p).startsWith("skills/"))) {
    const skillDir = join(ROOT, "skills", rel(path).split("/")[1]);
    for (const [, ref] of read(path).matchAll(/`([\w./-]+\.(?:md|mjs|json))`/g)) {
      assert.ok(existsSync(join(skillDir, ref)) || existsSync(join(dirname(path), ref)), `${rel(path)} points to ${ref}, which doesn't exist`);
    }
  }
});

test("every principle a skill cites exists", () => {
  const principles = [...read(join(ROOT, "skills", "principles", "SKILL.md")).matchAll(/^\*\*(.+?)\.\*\*/gm)].map(([, name]) => name.toLowerCase());
  for (const path of docs) {
    for (const [, name] of read(path).matchAll(/per ([A-Z][^.,;]*?) in `\/jstack:principles`/g)) {
      assert.ok(principles.includes(name.toLowerCase()), `${rel(path)} cites "${name}", which isn't in principles`);
    }
  }
});

test("the marketplace serves the repo root and the hook covers both shells", () => {
  const marketplace = JSON.parse(read(join(ROOT, ".claude-plugin", "marketplace.json")));
  assert.equal(marketplace.plugins[0].source, "./");
  const hooks = JSON.parse(read(join(ROOT, "hooks", "hooks.json")));
  assert.match(hooks.hooks.PreToolUse[0].matcher, /Bash/);
  assert.match(hooks.hooks.PreToolUse[0].matcher, /PowerShell/);
});
