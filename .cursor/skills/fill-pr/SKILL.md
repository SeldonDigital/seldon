---
name: fill-pr
description: Fill out the repo PULL_REQUEST.md template from the current branch changes and emit a single copy-pastable markdown block for the GitHub PR body. Use when the user runs /fill-pr or asks to generate a pull request description.
disable-model-invocation: true
---

# Fill PR

Generate a completed pull request description from the current branch and output it as one fenced markdown block the user can paste into GitHub.

## Steps

1. Gather context. Run these and read the results:
   - `git rev-parse --abbrev-ref HEAD` for the current branch.
   - Determine the base branch (default `main`; use the repo default if `main` is absent).
   - `git diff --stat <base>...HEAD` and `git diff <base>...HEAD` for changed files and content.
   - `git log <base>..HEAD --pretty=format:'%s%n%b'` for commit messages.
   - `git config user.name` and `git config user.email` for the CLA name.
   - GitHub username: from `gh api user --jq .login` if `gh` is available, else infer from the `origin` remote URL (`git remote get-url origin`).

2. Read the template at `PULL_REQUEST.md` (repo root). Use its exact section headings and order.

3. Fill each section:
   - **Description**: concise summary of what changed and why, from the diff and commits.
   - **Related Issues**: list `#<id>` references found in commit messages or branch name; leave blank if none.
   - **Type of Change**: keep only the bullets that apply. Remove the rest.
   - **Affected Packages**: keep only the packages whose files changed. Map paths:
     - `packages/core/**` -> `@seldon/core`
     - `packages/factory/**` -> `@seldon/factory`
     - `packages/editor/**` -> `@seldon/editor`
     - Remove unaffected entries. Add any other changed top-level area as a plain note.
   - **Screenshots/Videos**: leave a `_N/A_` placeholder unless the user provides media.
   - **Code Quality Checklist**: keep as-is.
   - **Breaking Changes / Deployment Notes / Documentation Updates / Additional Notes**: fill from evidence in the diff and commits; write `_None_` when there is nothing.
   - CLA block: replace `[ NAME ]` with `git config user.name` and `[ GITHUB ACCOUNT ]` with the resolved GitHub username.

4. Output the result as a single fenced ```markdown block so it is copy-pastable. Do not write to any file unless the user asks.

## Notes

- Do not invent issues, breaking changes, or screenshots. Use placeholders when evidence is missing.
- Keep section headings and emoji identical to `PULL_REQUEST.md`.
- If the branch has no diff against the base, say so and stop.
