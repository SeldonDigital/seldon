# Legacy property fixtures

`packages/core/workspace/workspace-sample.v0.json` still contains `restrictions.allowedValues` on node overrides. That file uses an older runtime wire shape and is not maintained as v2 catalog truth.

The properties sidebar uses `getPropertyPickerOptions`, which reads restrictions from effective merged properties and catalog defaults. Prefer defining restrictions on component schemas (for example `Display.schema.ts` `font.preset`) or current workspace v2 files instead of editing the legacy fixtures.
