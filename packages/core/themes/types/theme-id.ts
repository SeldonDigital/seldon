/**
 * Packaged theme catalog ids (`ThemeTemplateId`).
 *
 * **`ThemeTemplateId`** — Use these exact strings as the suffix in `catalog:{id}` template
 * references (see [THEMES.md](../THEMES.md) and [WORKSPACE.md](../../workspace/WORKSPACE.md)).
 * They match `metadata.id` on stock themes under `themes/catalog/`.
 *
 * **`ThemeInstanceId`** — TypeScript models the **catalog** identity of a computed stock row
 * (`ThemeTemplateId`). In a workspace file, **node `theme` fields, board theme refs, and keys in
 * the `themes` map** are opaque **strings** (for example `theme-sky-default`); resolution happens
 * through `getComputedTheme` / `computeWorkspaceThemes`, not through this union alone. Prefer
 * treating those refs as `string` at workspace boundaries until workspace types are aligned.
 */

export type ThemeTemplateId =
  | "seldon"
  | "earth"
  | "highContrast"
  | "industrial"
  | "material"
  | "pop"
  | "royalAzure"
  | "sky"
  | "sunsetBlue"
  | "wildberry"

export type ThemeInstanceId = ThemeTemplateId
