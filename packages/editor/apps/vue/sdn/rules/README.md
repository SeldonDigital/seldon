# Seldon Rules

Seldon generated these rules alongside the components in `sdn`. They
are for the assistant in your IDE, so it works with the generated components the
way Seldon expects. They do nothing on their own. Copy the ones you want into
your own repo.

This export targets **Vue**.

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
regenerated on every export, so anything left here is overwritten.

## Files

- `using-seldon-components.md` how to render and customize the components.
- `editing-exported-components.md` why `sdn` is generated output and
  what to change instead.
- `framework-target.md` the framework this export targets and when to warn about a
  mismatch.
- `controllers-and-refs.md` how a controller drives component data through refs.
- `css-variables-and-tokens.md` how to use the Seldon CSS variables and tokens.

## Refreshing

Re-export to refresh these rules. The framework and folder path are baked in at
export time, so a new export rewrites them to match your current setup.
