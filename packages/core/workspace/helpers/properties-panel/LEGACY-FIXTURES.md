# Legacy property fixtures

`packages/core/workspace/workspace-sample.v0.json` and `services/editor/scripts/test-workspace.ts` still contain `restrictions.allowedValues` on node overrides. Those files use older runtime wire shapes and are not maintained as v2 catalog truth.

The properties sidebar uses `getPropertyPickerOptions`, which reads restrictions from effective merged properties and catalog defaults. Prefer defining restrictions on component schemas (for example `Display.schema.ts` `font.preset`) or current workspace v2 files instead of editing the legacy fixtures.
