# Editing Exported Components

Treat `sdn` as generated output. Seldon rewrites this whole folder
on every export, so any hand edit here is lost the next time these components are
exported. This is true of the view files too, so behavior and data belong in your
own code, not inside the generated tree.

## Warn before editing

Before you change any file under `sdn`, tell the user:

- The change is overwritten the next time these components are exported.
- The durable fix is to change the design in Seldon, then re-export.
- Who can do that depends on the project. If you have the Seldon Editor or a
  Seldon MCP server, use it. If you only have these generated files, ask whoever
  owns the design source to make the change.

Only edit inside `sdn` when the user understands and accepts that
the edit is temporary.

## Never hand-edit these

- `refs/index.ts` and `refs/registry.json`. Seldon generates the ref registry.
- `styles.css` and `styles/`. Seldon generates the stylesheets from the theme.
- The generated component files. Change the design in Seldon, not the output.

## Where the design comes from

These components come from a Seldon workspace, a JSON file that holds the design.
How a project handles that file varies. Some keep it in the repo and re-export
from it. Others install the components from a package such as `@seldon/terminus`
and never see it. Either way, the design changes in Seldon, not by editing this
folder.

A workspace changes only through Seldon's typed actions, whether an editor or a
Seldon MCP server sends them. That is why a hand-patched JSON, or a hand-edited
file here, drifts from the design. Do not reproduce a design change that way.
Make the change in Seldon if you can, or ask whoever owns the source.

## When you have MCP

If the project only has generated files or `@seldon/terminus`, use these rules
and re-export through `seldon-export`.

If the project has `@seldon/hari` or a Seldon MCP server, call `get_design_guide`
for workflow, composition, properties, theme, images, and export. Edit through
write tools. Do not hand-edit workspace JSON.

An editor is optional. These rules stay the same. Change the design in the
editor or through MCP, then re-export.

## Re-export when you own the source

If your project keeps the workspace JSON and has the Seldon CLI, regenerate the
components by pointing the exporter at that file:

```sh
npx seldon-export --input path/to/workspace.json --platform vue
```

The `seldon-export` CLI ships with `@seldon/factory`, and `@seldon/terminus` and
`@seldon/hari` pull it in. Install one so the command is available:

```sh
npm i -D @seldon/factory
```

Add a script so a re-export is one command. The CLI reads
`.seldon/project.json` when `--input` is omitted, and uses the export
settings saved on that workspace:

```json
{
  "scripts": {
    "seldon:export": "seldon-export"
  }
}
```

Commit the workspace source under `.seldon`, such as
`dxf-website.react.json`, and `project.json`. The hashed files under
`.seldon/workspaces/` are backups. Ignore those backups and `.bak` copies:

```gitignore
.seldon/workspaces/
.seldon/*.bak
```

## Generated scripts

`scripts/` holds generated scanner code with `scripts/INTEGRITY.json` recording a
hash per file. Do not edit the scripts. Verify integrity before running them.
Your own rule files under `rules/` are not hashed, so copy them out and edit the
copies in your repo.
