# Seldon Rules

Seldon generated these rules alongside the components in `sdn`. They
are for the assistant in your IDE, so it works with the generated components the
way Seldon expects. They do nothing on their own. Copy the ones you want into
your own repo.

This export targets **React**.

## Install

Pick the place your assistant reads:

- Cursor: copy each file into `.cursor/rules/`, rename it to `.mdc`, and add front
  matter at the top. A rule that should always apply uses:

  ```
  ---
  description: Working with Seldon exported components
  globs:
  alwaysApply: true
  ---
  ```

- `AGENTS.md`: paste the contents under a heading in your `AGENTS.md`.

Keep them in your own tree, not inside `sdn`. This folder is
regenerated on every export, so anything left here is overwritten. Each file is
prefixed with `seldon-`, so it stays separate from your own rules once copied.

## Files

- `seldon-using-components.md` how to render and customize the presentational
  components.
- `seldon-editing-components.md` why `sdn` is generated output and
  what to change instead. Also when to call MCP `get_design_guide`.
- `seldon-framework-target.md` the framework this export targets and when to warn
  about a mismatch.
- `seldon-driving-components.md` where the code that drives the components lives in
  your app, how to wire nested nodes by ref name, and how to author the wrapper
  markup.
- `seldon-css-tokens.md` how to use the Seldon CSS variables and tokens.

## Design changes

These rules cover using the generated components.

If the project only has generated files or `@seldon/terminus`, change the design
in Seldon and re-export with `seldon-export`.

If the project has `@seldon/hari` or a Seldon MCP server, call `get_design_guide`
for workflow, composition, properties, theme, images, and export. Edit through
write tools. Do not hand-edit workspace JSON.

An editor is optional. These rules stay the same. Change the design in the
editor or through MCP, then re-export.

## Refreshing

Re-export to refresh these rules. The framework and folder path are baked in at
export time, so a new export rewrites them to match your current setup.
