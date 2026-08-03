# Editing Exported Components

Treat `seldon` as generated output. Seldon rewrites this whole folder
on every export. Any hand edit here is lost the next time the user exports.

## Warn before editing

Before you change any file under `seldon`, warn the user:

- The change is overwritten on the next export.
- The durable fix is to change the design in the Seldon Editor, then re-export.
- When a local Seldon MCP server is available, use it to change the workspace,
  then re-export. It applies the same typed actions the Editor uses.

Only edit inside `seldon` when the user understands and accepts that
the edit is temporary.

## Never hand-edit these

- The workspace `.json` copy at the root of `seldon`. It is the design
  source. Change it only through Seldon actions, never by patching the JSON.
- `refs/index.ts` and `refs/registry.json`. Seldon generates the ref registry.
- `styles.css` and `styles/`. Seldon generates the stylesheets from the theme.
- The generated component files. Change the schema in Seldon, not the output.

## The workspace contract

A Seldon workspace changes only through typed actions. The Editor sends actions,
a reducer applies them, and the result serializes to JSON. An MCP server follows
the same contract. Do not patch the workspace maps by hand outside that path.

## Generated scripts

`scripts/` holds generated scanner code with `scripts/INTEGRITY.json` recording a
hash per file. Do not edit the scripts. Verify integrity before running them.
Your own rule files under `rules/` are not hashed, so copy them out and edit the
copies in your repo.
