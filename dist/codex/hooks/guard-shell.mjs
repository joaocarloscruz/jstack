#!/usr/bin/env node
// PreToolUse hook for Bash. Claude Code and Codex both send the same stdin shape
// and both treat exit code 2 plus stderr as "deny with this reason".

const RULES = [
  {
    test: /\bgit\b.*\s--no-verify\b/,
    reason: "Skipping git hooks with --no-verify is blocked. Fix what the hook reports instead.",
  },
  {
    test: /\bgit\s+push\b(?=.*\s(?:--force(?!-with-lease)|-f)(?:\s|$))/,
    reason: "Force-push is blocked. Use --force-with-lease on your own branch, or ask the user.",
  },
  {
    test: /\brm\s+-(?=[a-z]*r)(?=[a-z]*f)[a-z]+\s+(?:\/|~|\$HOME)\/?\*?(?:\s|$)/i,
    reason: "Recursive delete of / or the home directory is blocked.",
  },
];

let input = "";
for await (const chunk of process.stdin) input += chunk;

let command;
try {
  const event = JSON.parse(input);
  if (event.tool_name !== "Bash") process.exit(0);
  command = String(event.tool_input?.command ?? "");
} catch {
  process.exit(0);
}

const hit = RULES.find((rule) => rule.test.test(command));
if (hit) {
  process.stderr.write(`jstack: ${hit.reason}\n`);
  process.exit(2);
}
