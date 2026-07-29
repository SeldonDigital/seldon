# Seldon Scripts

The Seldon factory generated these scripts alongside the components in
`seldon`. They are for you to run in your own project. Seldon never runs them.

## generate-bindings.mjs

Records which code in this project drives which ref and slot on the generated
components, and writes `seldon/refs/bindings.json`.

```sh
node seldon/scripts/generate-bindings.mjs
```

The script reads source files under the project root and writes that one file. It
skips `seldon` itself, so the generated tree never reports itself as a consumer of
its own refs. It makes no network requests.

Run `--check` in continuous integration to fail on a stale manifest:

```sh
node seldon/scripts/generate-bindings.mjs --check
```

Use `--root`, `--components`, and `--out` when your project moved any of those.
This export baked in `react` and `seldon`. The framework takes no flag, because
this export emitted only the front ends a react project reaches. Re-export to
change it.

## What the manifest holds

`refs` is keyed by ref name and `slots` by component name then slot name. Each
consumer records the file, the line, the enclosing component, the expression
behind the value, and where the identifiers in that expression were declared.
Join it to the `views` in `seldon/refs/index.ts` to see a ref from the workspace
node that declares it through to the code that sets it.

## Dependencies

The full scan needs `typescript`,
resolved from this project's own `node_modules` rather than bundled here.

When a parser is missing the script still runs, in a shallow mode that records
ref and prop keys with their file and line. Shallow mode reports no expressions,
no declaration sites, and no positional slot props. The manifest records
`"mode": "shallow"` so a reader can tell the difference, and the script says so
in its output.

## Integrity

`INTEGRITY.json` lists a sha256 for each file in this folder.

A check the script runs on itself proves nothing, because a modified script can
report whatever hash it likes. Treat the check as external:

- Re-export from Seldon and confirm nothing under `scripts/` changed. The factory
  is deterministic, so the same workspace emits the same bytes. A difference is
  either a factory update or an edit made here.
- Or hash the files yourself and compare against `INTEGRITY.json`:

```sh
shasum -a 256 seldon/scripts/generate-bindings.mjs
```

Do not run a script that was edited by hand. Change the factory and re-export
instead, so the change survives the next export.

## Editing

Every file here is generated. The next export overwrites them.
