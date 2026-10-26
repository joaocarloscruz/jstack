#!/usr/bin/env node
// Renders src/ into one plugin per harness under dist/.
//   node build.mjs          write dist/
//   node build.mjs --check  fail if dist/ is out of date

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");
const HARNESSES = readdirSync(join(ROOT, "harness"))
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.slice(0, -".json".length))
  .sort();
const TOKEN = /\{\{(\w+):([\w-]+)\}\}/g;

// Harness-specific names that must reach the source only through a token or a harness profile.
const NOT_NEUTRAL = [
  [/\bpoteto\b|\bpstack\b/i, "pstack name"],
  [/\bCursor\b|\.cursor\b/, "Cursor-specific term"],
  [/\bgrok\b|\bgpt-\d|\bclaude-(?:opus|sonnet|haiku|fable)|\b(?:opus|sonnet|haiku|fable)\b/i, "hard-coded model name; use {{role:...}}"],
  [/\bBugbot\b|\bdeslop\b|cursor-team-kit/i, "Cursor-only tool"],
  [/\bAskQuestion\b|\bAskUserQuestion\b|\bTodoWrite\b|\bgeneralPurpose\b|\bspawn_agent\b|\bTask tool\b|\bAgent tool\b/, "harness tool name"],
  [/\bClaude Code\b|\bCodex\b|\bExplore subagent\b/, "harness name; use a token"],
  [/[/$]jstack:[\w-]+|jstack_\w+/, "rendered skill or agent name; use {{skill:...}} or {{agent:...}}"],
  [/CLAUDE\.md|AGENTS\.md|~\/\.claude\b|~\/\.codex\b|\.claude-plugin|\.codex-plugin/, "harness path; use {{harness:...}}"],
];
// "<Principle name> in {{skill:principles}}" must name a principle that exists.
const PRINCIPLE_CITE = /in \{\{skill:principles\}\}/g;
// Backticked file references that a skill's own files must contain. Placeholders and repo paths are exempt.
const FILE_REF = /`([^`\s]+\.(?:md|mjs|tsv|json))`/g;
const NOT_A_SKILL_FILE = /[<>]|^src\/|^(?:decisions\.tsv|jstack\.json)$/;

const readJson = (path) => JSON.parse(readFileSync(join(ROOT, path), "utf8"));
const toBuffer = (content) => (Buffer.isBuffer(content) ? content : Buffer.from(content));
const meta = readJson("jstack.json");
const roles = readJson("roles.json");

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function parseFrontmatter(text, path) {
  const match = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${path}: missing frontmatter`);
  const fields = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const i = line.indexOf(":");
      const value = line.slice(i + 1).trim();
      return [line.slice(0, i).trim(), value === "true" ? true : value === "false" ? false : value];
    }),
  );
  return { fields, body: match[2] };
}

const problems = new Set();

function roleFor(name, harness, where) {
  const role = roles[name]?.[harness.id];
  if (!role) problems.add(`${where}: role "${name}" has no ${harness.id} entry in roles.json`);
  else if (!harness.efforts.includes(role.effort)) {
    problems.add(`${where}: role "${name}" effort "${role.effort}" is not one of ${harness.efforts.join(", ")} for ${harness.id}`);
  }
  return role ?? {};
}

function renderText(text, harness, where) {
  return text.replace(TOKEN, (token, kind, name) => {
    if (kind === "skill") {
      if (!existsSync(join(SRC, "skills", name, "SKILL.md"))) problems.add(`${where}: ${token} names no skill`);
      return harness.skillRef.replace("{name}", name);
    }
    if (kind === "agent") {
      if (!existsSync(join(SRC, "agents", `${name}.md`))) problems.add(`${where}: ${token} names no agent`);
      return harness.agentRef.replace("{name}", name);
    }
    if (kind === "role") {
      const { model, effort } = roleFor(name, harness, where);
      return model ? `\`${model}\` at \`${effort}\` effort` : `the session model at \`${effort}\` reasoning effort`;
    }
    if (kind === "harness") {
      const value = harness.text?.[name];
      if (typeof value !== "string") problems.add(`${where}: ${token} has no "text.${name}" in harness/${harness.id}.json`);
      return value ?? token;
    }
    problems.add(`${where}: unknown token ${token}`);
    return token;
  });
}

// Source checks run once, on the raw text, since they don't depend on the harness.
function checkSource() {
  const principlesFile = join(SRC, "skills", "principles", "SKILL.md");
  const principles = existsSync(principlesFile)
    ? [...readFileSync(principlesFile, "utf8").matchAll(/^\*\*(.+?)\.\*\*/gm)].map(([, name]) => name.toLowerCase())
    : [];

  const sources = [...walk(join(SRC, "skills")), ...walk(join(SRC, "agents"))].filter((path) => path.endsWith(".md"));
  for (const path of sources) {
    const rel = relative(SRC, path).replace(/\\/g, "/");
    const text = readFileSync(path, "utf8");
    for (const cite of text.matchAll(PRINCIPLE_CITE)) {
      const before = text.slice(0, cite.index).trimEnd().toLowerCase();
      if (!principles.some((name) => before.endsWith(name))) {
        problems.add(`src/${rel}: "${text.slice(Math.max(0, cite.index - 40), cite.index).trim()} in principles" names no principle`);
      }
    }
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const [pattern, reason] of NOT_NEUTRAL) {
        if (pattern.test(line)) problems.add(`src/${rel}:${i + 1}: ${reason}: ${line.trim().slice(0, 80)}`);
      }
    });
    if (!rel.startsWith("skills/")) continue;
    const skillDir = join(SRC, rel.split("/").slice(0, 2).join("/"));
    for (const [, ref] of lines.join("\n").matchAll(FILE_REF)) {
      if (NOT_A_SKILL_FILE.test(ref)) continue;
      if (!existsSync(join(skillDir, ref)) && !existsSync(join(dirname(path), ref))) {
        problems.add(`src/${rel}: \`${ref}\` doesn't exist in this skill`);
      }
    }
  }
}

function renderSkill(rel, text, harness, files) {
  if (!rel.endsWith("/SKILL.md")) return text;
  const folder = rel.split("/")[1];
  const { fields } = parseFrontmatter(text, `src/${rel}`);
  if (fields.name !== folder) problems.add(`src/${rel}: name "${fields.name}" must match its folder "${folder}"`);
  if (!fields.description) problems.add(`src/${rel}: missing description`);
  if (fields.invocation === undefined) return text;
  if (fields.invocation !== "manual") problems.add(`src/${rel}: invocation must be "manual" or absent`);

  const { frontmatter, file, content } = harness.manualSkill;
  if (file) files.set(`skills/${folder}/${file}`, content);
  return text.replace(/^invocation: manual\r?\n/m, frontmatter ? `${frontmatter}\n` : "");
}

function renderAgent(path, harness) {
  const where = relative(ROOT, path);
  const { fields, body } = parseFrontmatter(readFileSync(path, "utf8"), where);
  for (const key of ["name", "description", "role"]) if (!fields[key]) problems.add(`${where}: missing ${key}`);
  const { model, effort } = roleFor(fields.role, harness, where);
  const text = renderText(body, harness, where).trim();

  if (harness.agentFormat === "claude-md") {
    // JSON strings are valid YAML, so a description with ": " in it can't break the frontmatter.
    const lines = [`name: ${fields.name}`, `description: ${JSON.stringify(fields.description)}`];
    if (fields.readonly) lines.push(`tools: ${harness.readonlyTools.join(", ")}`);
    if (model) lines.push(`model: ${model}`);
    if (effort) lines.push(`effort: ${effort}`);
    return [`agents/${fields.name}.md`, `---\n${lines.join("\n")}\n---\n\n${text}\n`];
  }

  // Codex agents can't override the sandbox, so "readonly" rests on the instructions alone.
  // Their names are global, so the profile can prefix them.
  if (text.includes("'''")) problems.add(`${where}: body can't contain ''' (TOML literal string)`);
  const name = (harness.agentName ?? "{name}").replace("{name}", fields.name);
  const toml = [`name = ${JSON.stringify(name)}`,`description = ${JSON.stringify(fields.description)}`];
  if (model) toml.push(`model = ${JSON.stringify(model)}`);
  if (effort) toml.push(`model_reasoning_effort = ${JSON.stringify(effort)}`);
  toml.push(`developer_instructions = '''\n${text}\n'''`);
  return [`agents/${name}.toml`, `${toml.join("\n")}\n`];
}

function renderHarness(id) {
  const harness = { id, ...readJson(`harness/${id}.json`) };
  const files = new Map();

  const manifest = { ...(harness.manifestSchema && { $schema: harness.manifestSchema }), ...meta };
  files.set(harness.manifest, `${JSON.stringify(manifest, null, 2)}\n`);

  files.set("LICENSE", readFileSync(join(ROOT, "LICENSE")));

  for (const path of walk(join(SRC, "skills"))) {
    const rel = relative(SRC, path).replace(/\\/g, "/");
    const bytes = readFileSync(path);
    if (!rel.endsWith(".md")) {
      files.set(rel, bytes);
      continue;
    }
    files.set(rel, renderSkill(rel, renderText(bytes.toString("utf8"), harness, `src/${rel}`), harness, files));
  }

  for (const path of walk(join(SRC, "hooks"))) {
    files.set(relative(SRC, path).replace(/\\/g, "/"), readFileSync(path));
  }

  for (const path of walk(join(SRC, "agents"))) {
    const [out, text] = renderAgent(path, harness);
    files.set(out, text);
  }

  return files;
}

checkSource();
const output = new Map();
for (const id of HARNESSES) {
  for (const [path, content] of renderHarness(id)) output.set(`${id}/${path}`, content);
}
// The repo root is a marketplace for each harness, so `<harness> plugin marketplace add <repo>` works locally and from GitHub.
const toJson = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const rootFiles = new Map([
  [
    ".claude-plugin/marketplace.json",
    toJson({
      name: meta.name,
      owner: meta.author,
      description: meta.description,
      plugins: [{ name: meta.name, source: "./dist/claude-code", description: meta.description }],
    }),
  ],
  [
    ".agents/plugins/marketplace.json",
    toJson({
      name: meta.name,
      interface: { displayName: meta.name },
      plugins: [
        {
          name: meta.name,
          source: { source: "local", path: "./dist/codex" },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: "Developer Tools",
        },
      ],
    }),
  ],
]);

for (const [path, content] of output) {
  if (/\.(?:md|toml|ya?ml|json)$/.test(path) && toBuffer(content).toString("utf8").includes("{{")) {
    problems.add(`dist/${path}: contains "{{", a malformed or unknown token`);
  }
}

if (problems.size > 0) {
  for (const problem of problems) console.error(`FAIL ${problem}`);
  process.exit(1);
}


if (process.argv.includes("--check")) {
  const onDisk = new Map(walk(DIST).map((path) => [relative(DIST, path).replace(/\\/g, "/"), readFileSync(path)]));
  const drifted = [...new Set([...output.keys(), ...onDisk.keys()])]
    .sort()
    .filter((path) => !output.has(path) || !onDisk.has(path) || !toBuffer(output.get(path)).equals(onDisk.get(path)))
    .map((path) => `dist/${path}`);
  for (const [path, content] of rootFiles) {
    if (!existsSync(join(ROOT, path)) || !readFileSync(join(ROOT, path)).equals(content)) drifted.push(path);
  }
  for (const path of drifted) console.error(path);
  if (drifted.length > 0) {
    console.error("Build output is out of date. Run `node build.mjs`.");
    process.exit(1);
  }
  console.log("dist/ is up to date.");
} else {
  rmSync(DIST, { recursive: true, force: true });
  for (const [path, content] of output) {
    mkdirSync(dirname(join(DIST, path)), { recursive: true });
    writeFileSync(join(DIST, path), toBuffer(content));
  }
  for (const [path, content] of rootFiles) {
    mkdirSync(dirname(join(ROOT, path)), { recursive: true });
    writeFileSync(join(ROOT, path), content);
  }
  console.log(`Built ${HARNESSES.join(" and ")} into dist/ (${output.size} files) and wrote ${[...rootFiles.keys()].join(", ")}.`);
}
