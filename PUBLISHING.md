# Publishing

This repo builds every package for npm but does not publish. Each package stays `private: true` and carries a `prepublishOnly` guard. Nothing reaches npm until someone follows the unlock checklist below on purpose.

## Packages

Publishable packages version in lockstep. They always share one version.

| Package | Role | What ships |
| --- | --- | --- |
| `@seldon/core` | Workspace engine, components, properties, themes | `dist` (bundled entry + `.d.ts`), the raw asset source the factory reads (`components/native-react`, `components/catalog/custom`, `icon-sets`), README |
| `@seldon/factory` | Export to framework components, `seldon-export` CLI | `dist` (bundled entry + CLI + `.d.ts`), `bindings` source, README |
| `@seldon/ai` | Local AI orchestration | `dist` (bundled entry + `.d.ts`), `scripts`, README |
| `@seldon/editor` | Embeddable editor library (framework-neutral helpers, Vite plugins) | source (`index.ts`, `lib`, `vite`), README |
| `@seldon/terminus` | Bundle: core + factory | `dist`, `index.ts`, README |
| `@seldon/hari` | Bundle: terminus + ai | `dist`, `index.ts`, README |
| `@seldon/foundation` | Bundle: hari + editor | source (`index.ts`), README |

Never published: `@seldon/editor-react`, `@seldon/editor-vue`, `@seldon/desktop`. These are apps. They stay `private` permanently and are ignored by Changesets.

## Dependencies per package

- `@seldon/core`: `chroma-js`, `immer`, `lodash`, `nanoid`, `pluralize`, `typescript-json-schema`, and the `@types/*` they need. Peer: `react`, `typescript`.
- `@seldon/factory`: `@seldon/core`, `@vue/compiler-sfc`, `change-case`, `csstype`, `happy-dom`. Peer: `react` (optional), `typescript`. The published `dist` bundles core and these deps, except the CLI reads assets from the installed `@seldon/core` at runtime.
- `@seldon/ai`: `@seldon/core`, `@earendil-works/pi-ai`, `@earendil-works/pi-coding-agent`, `typebox`. The pi packages stay external in the bundle because they spawn a local process.
- `@seldon/editor`: `@seldon/core`, `@seldon/factory`. Ships as source. The consumer's bundler resolves the app-level peers (`react`, state libs).
- Bundles depend only on the packages they re-export.

## Why the engine packages are bundled

Core is authored bundler-first, with extensionless directory imports that native Node ESM cannot resolve. The `build` step runs `tsc` for `.d.ts`, then bundles the entry with esbuild into one runnable `dist/index.js`. This is why a plain `node` import of `@seldon/terminus` works. Deep subpath imports under `node` (such as `@seldon/core/themes/compute`) are a bundler-only path. A Node consumer uses the main entry or a bundler.

## Versioning with Changesets

Versions are lockstep. Config lives in [.changeset/config.json](.changeset/config.json).

- Author a changeset with `npm run changeset` and commit it with your change.
- Apply pending bumps with `npm run version`. It bumps every package in the group and rewrites internal ranges. It only edits files locally.

There is no `release` or `changeset publish` script yet. Adding it is part of unlocking publishing.

## Safety layers

1. `private: true` on every package. `npm publish` refuses a private package and `changeset publish` skips it.
2. A `prepublishOnly` guard on every package that exits non-zero with a message.
3. No `release`/`publish` script anywhere.
4. No registry auth, no CI publish job, no push- or tag-triggered release.

Building, `npm pack`, local workspace linking, and `seldon-export` all work without publishing. `private: true` does not block any of them.

## CI safety

CI runs format, lint, typecheck, bindings-drift, and tests on pull requests and on push to `main`. It has no publish path. Merging to `main` cannot publish. Do not add a merge- or push-triggered publish job. When a release job is added, gate it behind a manual `workflow_dispatch` and a protected environment approval.

## Unlock publishing checklist

Do these deliberately, in one change, when the packages are ready:

1. Remove `"private": true` from each package to publish.
2. Remove the `prepublishOnly` guard from each of those packages.
3. Set the first real version (for example run `npm run version` against a changeset that sets the target version).
4. Add a root `release` script (`changeset publish`) and wire a manual, approval-gated CI job. Never an automatic trigger.
5. Confirm `npm run verify:packages` passes: clean tarballs, correct exports and types, no out-of-bounds files.
6. Publish from a clean checkout.
