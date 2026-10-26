# Opening a PR

The last step of every playbook that changes code. If the repo has no remote, or the user said not to open PRs, stop after the commits and say so.

**Branch.** You should already be on the branch or worktree `lead` had you create before the first edit. Parallel subagents writing to the same repo each get their own worktree. If the branch has unrelated changes, move them out of the way first.

**Commits.** Commit often while working. Before opening the PR, rebase into small, ordered commits that each build and pass on their own and tell the story in order. The one exception is a failing regression test, which lands in its own commit directly before the fix that makes it pass. Amend when a fix belongs in the commit you just made. Commit bodies don't repeat the subject.

**Clean the diff.** Before committing, remove dead code, debug output and comments that narrate what the code does. Keep comments that explain a non-obvious why. Apply {{skill:unslop}} to the title, description and commit messages.

**Title.** Conventional Commits, `type(scope): subject`, no trailing period. The type is `feat`, `fix`, `docs`, `refactor`, `test`, `chore` or `perf`. The subject is short and imperative, and it names the real symbol when one carries the change.

**Description.** A one-minute briefing for a reviewer who has the diff. Use `##` headings in this order, and drop any section with nothing to say:

- `## Why`: the problem and the approach, in one to three sentences.
- `## What changed`: one to three bullets. Name both sides of a rename.
- `## Scope`: always present. What it covers and what it deliberately leaves out.
- `## Tradeoffs`: only alternatives a reviewer would otherwise ask about.
- `## Risk`: who or what it touches, and why that's safe or risky.
- `## Verification`: one to three bullets, each a real command or path and its result. For performance, one number with its unit, `before → after`.

Attach screenshots or recordings when they prove a claim. Long logs and checklists go in a linked file, not the body.

**Tooling.** Push your branch. If the harness has its own PR tool, use it. Otherwise use `gh pr create`. Open the PR as ready for review, not as a draft. Check `gh pr view <number>` before you describe its status.

**Size.** Prefer several narrow PRs to one large one. For a stack, each child PR targets its parent's branch.

**After opening.** Post the URL and keep working. Don't wait on CI or reviews unless the user asks you to.
