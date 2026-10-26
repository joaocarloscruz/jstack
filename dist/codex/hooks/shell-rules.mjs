// Rules for guard-shell. The command is split into simple commands and words before any rule
// runs, so text that only mentions a flag (a commit message, an echo, a heredoc) never counts as using it.

export const REASONS = {
  noVerify: "Skipping git hooks (--no-verify, or -n on commit) is blocked. Fix what the hook reports instead.",
  forcePush: "Force-push is blocked. Use --force-with-lease on your own branch, or ask the user.",
  wipe: "Recursive delete of the filesystem root or the home directory is blocked.",
};

// Splits a command line into simple commands, each a list of words with quotes removed.
// Heredoc bodies are skipped, since they are data, not commands.
// PowerShell escapes with a backtick, so there a backslash is an ordinary character, as in C:\.
export function parse(line, { powershell = false } = {}) {
  const escape = powershell ? "`" : "\\";
  const commands = [];
  let words = [];
  let word = "";
  let inWord = false;
  let heredoc = null;

  const endWord = () => {
    if (inWord) words.push(word);
    word = "";
    inWord = false;
  };
  const endCommand = () => {
    endWord();
    if (words.length) commands.push(words);
    words = [];
  };

  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (c === "\n" && heredoc) {
      endCommand();
      const body = line.slice(i + 1).split("\n");
      const end = body.findIndex((l) => l.trim() === heredoc);
      if (end === -1) return commands;
      i += body.slice(0, end + 1).join("\n").length;
      heredoc = null;
      continue;
    }

    const start = line.slice(i).match(/^<<-?\s*(['"]?)([\w-]+)\1/);
    if (start) {
      endWord();
      heredoc = start[2];
      i += start[0].length - 1;
    } else if (c === "'" || c === '"') {
      const close = line.indexOf(c, i + 1);
      const end = close === -1 ? line.length : close;
      word += line.slice(i + 1, end);
      inWord = true;
      i = end;
    } else if (c === escape && i + 1 < line.length && line[i + 1] !== "\n") {
      word += line[++i];
      inWord = true;
    } else if (";|&\n()".includes(c)) {
      endCommand();
    } else if (/\s/.test(c)) {
      endWord();
    } else {
      word += c;
      inWord = true;
    }
  }
  endCommand();
  return commands;
}

const WRAPPERS = new Set(["sudo", "command", "env", "time", "nohup", "xargs", "exec"]);
const SHELLS = new Set(["bash", "sh", "zsh", "dash", "pwsh", "powershell", "cmd"]);
const DELETE_COMMANDS = new Set(["rm", "remove-item", "ri", "rmdir", "rd", "del"]);
const GIT_OPTIONS_WITH_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace"]);
const DANGEROUS_TARGET = /^(?:\/|~|\$HOME|\$\{HOME\}|\$env:USERPROFILE|%USERPROFILE%|[A-Za-z]:)[\\/]?\*?$/i;

const commandName = (word) => word.split(/[\\/]/).pop().toLowerCase().replace(/\.exe$/, "");

// The short flags in a cluster that come before the first flag taking a value: "-nm" gives "n", "-mn" gives "".
const flagsBefore = (word, takesValue) => word.slice(1).match(new RegExp(`^[^${takesValue}]*`))[0];

function checkGit(args) {
  let i = 0;
  while (i < args.length && args[i].startsWith("-")) i += GIT_OPTIONS_WITH_VALUE.has(args[i]) ? 2 : 1;
  const sub = args[i];
  const rest = args.slice(i + 1);
  const clusters = rest.filter((w) => /^-[A-Za-z]+$/.test(w));

  if (rest.includes("--no-verify")) return REASONS.noVerify;
  if (sub === "commit" && clusters.some((w) => flagsBefore(w, "mFCctS").includes("n"))) return REASONS.noVerify;
  if (sub === "push") {
    if (rest.includes("--force") || clusters.some((w) => flagsBefore(w, "o").includes("f"))) return REASONS.forcePush;
    if (rest.some((w) => w.length > 1 && w.startsWith("+"))) return REASONS.forcePush;
  }
  return null;
}

function checkDelete(args) {
  let recursive = false;
  let endOfOptions = false;
  const targets = [];
  for (const word of args) {
    if (endOfOptions || !word.startsWith("-")) targets.push(word);
    else if (word === "--") endOfOptions = true;
    else if (/^-(?:-recursive|recurse)$/i.test(word) || /^-[fiIrRdv]*[rR][fiIrRdv]*$/.test(word)) recursive = true;
  }
  return recursive && targets.some((t) => DANGEROUS_TARGET.test(t)) ? REASONS.wipe : null;
}

// Returns the reason a command is blocked, or null if it's allowed.
export function check(line, { powershell = false, depth = 0 } = {}) {
  for (const raw of parse(line, { powershell })) {
    let start = 0;
    while (start < raw.length && (WRAPPERS.has(raw[start]) || /^\w+=/.test(raw[start]))) start++;
    if (start === raw.length) continue;

    const name = commandName(raw[start]);
    const args = raw.slice(start + 1);

    if (SHELLS.has(name)) {
      const flag = args.findIndex((w) => /^(?:-c|-command|\/c)$/i.test(w));
      const inner = { powershell: name === "pwsh" || name === "powershell", depth: depth + 1 };
      const nested = flag !== -1 && depth < 3 ? check(args.slice(flag + 1).join(" "), inner) : null;
      if (nested) return nested;
      continue;
    }
    const reason = name === "git" ? checkGit(args) : DELETE_COMMANDS.has(name) ? checkDelete(args) : null;
    if (reason) return reason;
  }
  return null;
}
