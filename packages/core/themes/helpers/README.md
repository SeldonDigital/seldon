# Helpers

Runtime entry points to coerce theme JSON, materialize `ComputedTheme`, and run modulation math. Most apps import `computeTheme` and `normalizeTheme` from `@seldon/core/themes` or this folder. The barrel also re-exports theme token schema helpers from `schemas/` for editor wiring.

---

## Flow

```mermaid
flowchart LR
  input[Unknown JSON or ComputedTheme] --> normalize[normalizeTheme]
  normalize --> stock[StockTheme shape]
  stock --> compute[computeTheme]
  compute --> out[ComputedTheme]
```

---

## Major Types And Functions

### Theme materialization

| Type or Function | File | Purpose and use |
| --- | --- | --- |
| `computeTheme` | `compute-theme.ts` | Normalizes input, resolves dynamic swatches, returns `ComputedTheme`. Used by `catalog/index.ts`, workspace read paths, and factory when a full theme is needed. |
| `normalizeTheme` | `normalize-theme.ts` | Coerces unknown or resolved theme JSON into `StockTheme` via `normalizeThemeInput`. Used before merge or recompute when workspace data is loose. |
| `toRecomputableStockInput` | `to-recomputable-stock.ts` | Picks stock or recomputed stock input for the compute pipeline. Called from `computeTheme` and `normalizeTheme`. Its resolved-theme detection and swatch stripping live in the same file as private helpers. |

### Modulation

| Type or Function | File | Purpose and use |
| --- | --- | --- |
| `modulate` | `modulate.ts` | Re-export of core math `modulate`. Scales a step with ratio and base size. |
| `modulateWithTheme` | `modulate.ts` | Runs `modulate` using `theme.modulation.parameters.ratio` and `theme.modulation.parameters.baseSize`. Used when token tables need live scale values from a theme instance. |

### Schema helpers (re-exported from `schemas/`)

| Type or Function | File | Purpose and use |
| --- | --- | --- |
| `THEME_TOKEN_SCHEMAS` | `../schemas/data/theme-token-schemas.ts` | Static token schema map. Used by theme token editors. |
| `getAllThemeTokenSchemas` | `../schemas/helpers/get-all-theme-token-schemas.ts` | Merges static and dynamic schemas for one theme. Used when listing all editable keys. |
| `getThemeTokenSchema` | `../schemas/helpers/get-theme-token-schema.ts` | Returns one schema with property defaults merged. |
| `getThemeTokenSchemasBySection` | `../schemas/helpers/get-theme-token-schemas-by-section.ts` | Lists schemas for one UI section and optional theme. |
| `resolveThemeTokenEntry` | `../schemas/helpers/resolve-theme-token-entry.ts` | Resolves static or dynamic catalog entry by key. |
| `resolveThemeTokenSchema` | `../schemas/helpers/resolve-theme-token-schema.ts` | Fills label, supports, and validation from `PROPERTY_SCHEMAS` when `propertyKey` is set. |

### Custom token helpers

| Type or Function | File | Purpose and use |
| --- | --- | --- |
| `buildEmptyCustomTokenPayload` | `build-empty-custom-token-payload.ts` | Default add-action payload, minus `themeId`, for a new custom token in a section. |
| `getReservedTokenKeys` | `reserved-token-names.ts` | Reserved key ids for a custom-capable section. |
| `isReservedTokenName` | `reserved-token-names.ts` | Tells whether a candidate custom-token name collides with a reserved name. |

---

## Notes

- Import `instantiateTheme` from `@seldon/core/themes/compute`, not from here, so `catalog/` does not cycle through this barrel.
- `normalizeThemeInput` lives in `compute/normalize-theme.ts`. `normalizeTheme` wraps it with `toRecomputableStockInput`.
- Property `@` resolution uses a `ComputedTheme` on `ComputeContext`. That path is in `properties/compute`, not this folder.

---
