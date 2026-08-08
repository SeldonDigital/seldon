# Editing Exported Components

Treat `sdn` as generated output. Seldon rewrites this whole folder
on every export. Any hand edit here is lost the next time the user exports.

## Warn before editing

Before you change any file under `sdn`, warn the user:

- The change is overwritten on the next export.
- The durable fix is to change the design in the Seldon Editor, then re-export.
- When a local Seldon MCP server is available, use it to change the workspace,
  then re-export. It applies the same typed actions the Editor uses.

Only edit inside `sdn` when the user understands and accepts that
the edit is temporary.

## Never hand-edit these

- `refs/index.ts` and `refs/registry.json`. Seldon generates the ref registry.
- `styles.css` and `styles/`. Seldon generates the stylesheets from the theme.
- The generated component files. Change the schema in Seldon, not the output.

## The design source lives outside this folder

The editable source is `.seldon/seldon-editor.react.json` in your repo. The name is the
workspace label with the export target appended. The Editor writes it on every
export, so it always matches the design you just exported. Change it only through
Seldon, the Editor or a Seldon MCP server, never by patching the JSON. Regenerate
the components from it:

```sh
npx seldon-export --input .seldon/seldon-editor.react.json --platform react
```

Commit `.seldon/seldon-editor.react.json` as the design source, and ignore the Editor's
local state so backups and any live store stay out of the repo:

```gitignore
.seldon/workspaces/
.seldon/*.bak
```

## Set up a repeatable export

The `seldon-export` CLI ships with `@seldon/factory`, and `@seldon/terminus` and
`@seldon/hari` pull it in. Install one so the command is available:

```sh
npm i -D @seldon/factory
```

Then add a script to `package.json` so a re-export is one command. Add
`--preset vite` or `--preset next` if your project uses that layout:

```json
{
  "scripts": {
    "seldon:export": "seldon-export --input .seldon/seldon-editor.react.json --platform react"
  }
}
```

Run it with `npm run seldon:export` after every design change.

## The workspace contract

A Seldon workspace changes only through typed actions. The Editor sends actions,
a reducer applies them, and the result serializes to JSON. An MCP server follows
the same contract. Do not patch the workspace maps by hand outside that path.

## Generated scripts

`scripts/` holds generated scanner code with `scripts/INTEGRITY.json` recording a
hash per file. Do not edit the scripts. Verify integrity before running them.
Your own rule files under `rules/` are not hashed, so copy them out and edit the
copies in your repo.
