# Changesets

This folder holds the version-management state for the publishable Seldon
packages. See [PUBLISHING.md](../PUBLISHING.md) for the full flow.

The publishable packages version in lockstep: `@seldon/core`, `@seldon/factory`,
`@seldon/ai`, `@seldon/editor`, `@seldon/terminus`, `@seldon/hari`, and
`@seldon/foundation` always share one version. The apps `@seldon/editor-react`,
`@seldon/editor-vue`, and `@seldon/desktop` are ignored; they are never
published.

## Authoring a changeset

Run `npm run changeset` and describe the change. This writes a Markdown file
here that records the intended bump. Commit it with your change.

## Applying versions

Run `npm run version` to consume the pending changesets, bump every package in
the lockstep group, and rewrite internal dependency ranges. This only edits
files locally.

## Publishing

There is no publish script yet, on purpose. Every package is `private: true` and
carries a `prepublishOnly` guard, so nothing can reach npm. Unlocking publishing
is a separate, deliberate step documented in [PUBLISHING.md](../PUBLISHING.md).
