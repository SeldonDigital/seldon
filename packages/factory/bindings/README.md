# Bindings

The bindings scan reads a project's own source and reports which code drives which ref and slot on the generated components. It is the consumer half of the binding manifest. The view half is the `views` array in the generated `refs/index.ts`, described in the [factory README](../README.md).

Joining the two answers the question a reader has when looking at a component on the canvas: which controller drives this node, which prop keys does it set, and which const or hook produced each value.

---

## Directory Layout

The folder is flat, because the export emits it as a flat `lib/`. The code is grouped by stage:

1. **Config** (`config.ts`) fills defaults and decides which files and imports count.
2. **Front ends** (`scan-typescript.ts`, `scan-vue.ts`) read one file and report its bindings.
3. **Orchestration** (`scan.ts`) walks a project through a `FileSource` and merges the results.
4. **Serialization** (`serialize.ts`) writes a stable-ordered `bindings.json`.
5. **Support** (`declaration-index.ts`, `describe-expression.ts`, `resolve-object-literal.ts`) resolves identifiers to object literals and describes expressions.

`types.ts` holds every shape. `version.ts` holds the manifest version alone, so reading the version never pulls in a parser. `shallow.ts` is the degraded scan. `cli.ts` is the standalone Node entry point.

`scan.ts` routes a file to a front end by extension, and loads that front end the first time a file calls for one. A project with no `.vue` files never loads the Vue compiler, which is what lets the scan run against `typescript` alone.

Routing by extension means both frameworks use `scan-typescript.ts`, since a Vue project holds plain TypeScript consumers alongside its `.vue` files. Only `scan-vue.ts` belongs to one framework.

---

## Reading Sources

The scan reads through a `FileSource`, which has two methods:

```typescript
export interface FileSource {
  list(): Promise<string[]>
  read(path: string): Promise<string>
}
```

A Node host backs it with `fs`, a browser host with a directory handle, and a test with a plain map. The library never touches a filesystem, so `node:fs` lives only in `cli.ts`.

Important: the editor must not import the scan. The editor bundles factory for in-browser export, and the scan depends on the TypeScript compiler, which does not belong in that bundle. The scan runs in the project it is scanning.

Two narrow exceptions carry no code into that bundle, and the editor uses both to read a manifest without repeating its shape:

- `import type` from `types.ts`, which erases completely.
- `version.ts`, which has no imports of its own. That is why the version sits alone in a module.

The export reads these files as text to emit them, and never imports them. See [Emitting This Library](#emitting-this-library).

---

## What Gets Scanned

`resolveBindingsConfig` fills the defaults. `include` and `exclude` hold folder paths relative to the scan root and are matched by path prefix, so no pattern library is needed. An empty `include` scans everything the excludes leave behind.

Default extensions follow the framework. A React scan reads `.ts` and `.tsx`, so it never needs the Vue compiler. A Vue scan adds `.vue` and keeps `.ts`, since a Vue project holds plain TypeScript consumers too.

The generated components folder is always excluded. That also covers the `scripts/` folder emitted inside it, so a generated tree never reports itself as a consumer of its own refs.

A component counts as generated when the file imports it from the components folder, either through a path alias such as `@seldon/components/` or by a relative path into the folder.

---

## How Bindings Are Found

Consumers never write a refs map inline. They hoist it into a `const`, a `useMemo`, or a Vue `computed`, then pass the identifier:

```typescript
const seldonRefs = {
  dialogCancel: { onClick: onClose },
}
```

So the scan resolves the identifier to its declaration and unwraps whatever holds the literal. Three details follow from how the code is really written:

- The map is keyed on the attribute name, not the variable name, because one consumer passes a map named `toggleRefs` under the `seldonRefs` attribute.
- Keys added after the literal are included, such as `seldonRefs.valueIcon = ...`, and are marked `conditional` when they sit behind a branch.
- A value built by a helper call has no visible prop keys, so the entry reports the whole `expression` and leaves `props` empty.

Parsing is single-file and syntax-only, with no program and no type checker. An identifier imported from another module reports that import rather than being followed into it. Following it needs full module resolution, which would tie the scan to a filesystem and break the browser host.

Vue reads both blocks. The template says which component receives what, and the script holds the declarations behind each expression. Script line numbers stay absolute because the block content is padded to its position in the file.

---

## Slots

A controller can drive a slot with a positional prop and no ref, so slots are reported too, keyed by generated component then slot name. An object spread is resolved to the keys it carries, and those entries are marked `spread` so a reader knows the name never appears at the call site.

The scan has no slot vocabulary of its own. Every attribute that is not obviously excluded is reported as a candidate, and a candidate that matches no slot in the generated registry is dropped when the two halves are joined. That keeps a root-level attribute spread from being guessed at with a heuristic.

---

## Output

```jsonc
{
  "version": 1,
  "mode": "full",
  "framework": "react",
  "scannedFiles": 258,
  "refs": {
    "exportRootPath": [
      {
        "file": "app/dialogs/export-components/ExportComponentsController.tsx",
        "component": "ExportComponentsDialog",
        "line": 137,
        "conditional": false,
        "expression": "{ value: directoryLabel, readOnly: true, onClick: chooseDirectory }",
        "inputs": [
          { "name": "directoryLabel", "declaredAt": { "line": 120, "kind": "const" } }
        ],
        "props": [
          {
            "key": "value",
            "expression": "directoryLabel",
            "inputs": [
              { "name": "directoryLabel", "declaredAt": { "line": 120, "kind": "const" } }
            ]
          }
        ]
      }
    ]
  },
  "slots": {}
}
```

`declaredAt.kind` is one of `const`, `let`, `function`, `import`, or `parameter`. `via` names the call a declaration initializes from, which is what identifies the hook behind a value, such as `useMemo`, `computed`, or `ref`. `module` names the source module for an import.

Keys are sorted and consumers are ordered by file then line, so re-running the scan on unchanged sources produces a byte-identical file.

---

## Shallow Mode

`shallow.ts` is the scan for a project that has no parser to lend. It reads no dependencies at all, so it always runs.

It reports which refs a file drives and which prop keys it sets on them, with a file and a line. It cannot report the expression behind a value, the declaration that produced it, or positional slot props, because all three need a real parse. Those fields stay empty, and the manifest records `"mode": "shallow"`.

A reader must check `mode` before presenting a binding as complete. Shallow mode also finds fewer refs, because it only reads a map written as an object literal. A map built by a helper call reports nothing.

---

## Emitting This Library

The export emits this folder into `<components>/scripts/lib/` so a user can run the scan in their own project. `export/shared/generate-scripts.ts` reads each file as text and transpiles it, which strips types and leaves everything else in place, so each emitted module stays one-to-one with its source. This folder is flat so the emitted `lib/` is flat too, and no import needs rewriting.

An export emits only the front ends its framework reaches. A React export leaves `scan-vue.ts` out, because a React scan reads no `.vue` file. Both keep `scan-typescript.ts`. `FRAMEWORK_ONLY_SOURCES` in the generator records that, so a new front end declares its framework in one place.

That puts one constraint on this folder: avoid TypeScript-only runtime features. No enums, no decorators, no parameter properties, no namespaces. Types, interfaces, and plain JavaScript all emit correctly.

Two more rules follow from the same pipeline:

- Import a type with `import type`, so nothing is left behind pointing at `types.ts`. A types-only module transpiles to nothing and is not emitted.
- Keep external dependencies to `typescript` and `@vue/compiler-sfc`. Both resolve from the user's own `node_modules` at runtime, and neither is bundled.

---

## Running It

Both editors keep an emitted copy of the scanner, so the normal path is an npm script:

```bash
npm run bindings        # writes both manifests
npm run bindings:check  # fails on a stale manifest
```

Each runs `seldon/scripts/generate-bindings.mjs` inside the app and writes `seldon/refs/bindings.json`. That is the same file a consuming project runs, so this repo exercises what it ships. CI runs the check, so a committed manifest cannot fall behind the code that drives the refs.

`cli.ts` runs the library directly, without needing an export first:

```bash
bun packages/factory/bindings/cli.ts <projectRoot> [--framework react|vue] [--components seldon] [--out bindings.json]
```

Note: it writes `bindings.json` at the project root unless `--out` says otherwise. Pass `--out seldon/refs/bindings.json` to write where the emitted script writes.
