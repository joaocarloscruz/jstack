import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { REASONS, check, parse } from "../src/hooks/shell-rules.mjs";

const HOOK = fileURLToPath(new URL("../src/hooks/guard-shell.mjs", import.meta.url));

const blocked = {
  noVerify: [
    "git commit -m x --no-verify",
    "git commit -n -m x",
    "git commit -nm x",
    "git -C repo commit --no-verify -m x",
    "git merge --no-verify feature",
    "cd repo && git commit --no-verify -m x",
    'bash -c "git commit --no-verify -m x"',
  ],
  forcePush: [
    "git push --force origin main",
    "git push origin main --force",
    "git push origin main --force; echo done",
    "git push -f",
    "git push -uf origin main",
    "git push -fu origin main",
    "git push origin +main",
    "git -C . push --force",
    "sudo git push --force",
    'pwsh -Command "git push --force origin main"',
  ],
  wipe: [
    "rm -rf /",
    "rm -fr ~/",
    "rm -rf $HOME",
    'rm -rf "$HOME"',
    "rm -rf ${HOME}",
    "rm -rf /*",
    "rm -r -f /",
    "rm --recursive --force /",
    "rm -rf -- /",
    "rm -r ~",
  ],
};

// PowerShell commands, parsed with PowerShell's escaping.
const blockedInPowerShell = [
  "Remove-Item -Recurse -Force ~",
  "Remove-Item -Path C:\\ -Recurse",
  "Remove-Item -Recurse $env:USERPROFILE",
  "git push --force origin main",
];
const allowedInPowerShell = ["Remove-Item -Recurse -Force C:\\Users\\me\\build", "git commit -m 'mention --no-verify'"];

for (const command of blockedInPowerShell) {
  test(`blocks in PowerShell: ${command}`, () => assert.notEqual(check(command, { powershell: true }), null));
}
for (const command of allowedInPowerShell) {
  test(`allows in PowerShell: ${command}`, () => assert.equal(check(command, { powershell: true }), null));
}

const allowed = [
  "git commit -m x",
  'git commit -m "docs: explain why --no-verify is blocked"',
  "git commit -mn",
  "git push -u origin HEAD && gh pr create -f",
  "git push origin feature && rm -f tmp.txt",
  "git push -u origin feat; tail -f log.txt",
  "git push --force-with-lease",
  "git push -n origin main",
  "git push origin feature",
  'echo "git commit --no-verify is banned" >> CONTRIBUTING.md',
  "cat > notes.md <<'EOF'\nnever run git push --force or rm -rf /\nEOF",
  "rm -rf ./build",
  "rm -rf /tmp/x",
  'rm -rf "$HOME/projects/old"',
  "rm ~/notes.txt",
];

for (const [reason, commands] of Object.entries(blocked)) {
  for (const command of commands) {
    test(`blocks (${reason}): ${command}`, () => assert.equal(check(command), REASONS[reason]));
  }
}

for (const command of allowed) {
  test(`allows: ${JSON.stringify(command)}`, () => assert.equal(check(command), null));
}

test("parse splits commands and keeps quoted text as one word", () => {
  assert.deepEqual(parse('git commit -m "a; b" && echo \'c d\''), [
    ["git", "commit", "-m", "a; b"],
    ["echo", "c d"],
  ]);
});

test("parse skips heredoc bodies and resumes after them", () => {
  assert.deepEqual(parse("cat <<EOF\ngit push --force\nEOF\nls -la"), [["cat"], ["ls", "-la"]]);
});

const run = (event) => spawnSync(process.execPath, [HOOK], { input: event, encoding: "utf8" });
const event = (tool, command) => JSON.stringify({ tool_name: tool, tool_input: { command } });

test("the hook exits 2 with a reason for Bash and PowerShell", () => {
  for (const tool of ["Bash", "PowerShell"]) {
    const { status, stderr } = run(event(tool, "git push --force origin main"));
    assert.equal(status, 2);
    assert.match(stderr, /^jstack: Force-push is blocked/);
  }
});

test("the hook exits 0 for allowed commands, other tools and bad input", () => {
  assert.equal(run(event("Bash", "git status")).status, 0);
  assert.equal(run(event("Write", "rm -rf /")).status, 0);
  assert.equal(run("not json").status, 0);
});
