#!/usr/bin/env node
// PreToolUse hook for shell tools. Claude Code and Codex both send the same stdin shape
// and both treat exit code 2 plus stderr as "deny with this reason".

import { check } from "./shell-rules.mjs";

const SHELL_TOOLS = new Set(["Bash", "PowerShell"]);

let input = "";
for await (const chunk of process.stdin) input += chunk;

let event;
try {
  event = JSON.parse(input);
} catch {
  process.exit(0);
}
if (!SHELL_TOOLS.has(event.tool_name)) process.exit(0);

const reason = check(String(event.tool_input?.command ?? ""), { powershell: event.tool_name === "PowerShell" });
if (reason) {
  process.stderr.write(`jstack: ${reason}\n`);
  process.exit(2);
}
