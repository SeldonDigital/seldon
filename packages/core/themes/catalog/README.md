# Catalog

Packaged `StockTheme` authoring objects and precomputed theme catalogs. Each file under `catalog/` is a full theme document. `index.ts` aggregates them and runs `computeTheme` so callers get ready-to-use `ComputedTheme` maps.

---

## Flow

```mermaid
flowchart LR
  files[catalog/*.ts authoring] --> list[STOCK_THEMES]
  list --> compute[computeTheme]
  compute --> maps[THEMES and THEMES_BY_ID]
```

---

## Major Types And Functions

### Barrel (`index.ts`)

| Type or Function | File | Purpose and use |
| --- | --- | --- |
| `STOCK_THEMES` | `index.ts` | Ordered array of all packaged `StockTheme` objects. Used when iterating stock presets or building `STOCK_THEMES_BY_ID`. |
| `STOCK_THEMES_BY_ID` | `index.ts` | Map from `ThemeTemplateId` to authoring theme. Passed to `instantiateTheme` as the preset catalog. |
| `THEMES` | `index.ts` | Ordered array of `ComputedTheme` for every stock preset. Used when apps need resolved tokens without calling `computeTheme` again. |
| `THEMES_BY_ID` | `index.ts` | Map from theme id to `ComputedTheme`. Used for quick lookup by template id. |
| `computeTheme` | `index.ts` | Re-export from `helpers/compute-theme.ts`. Materializes one stock or resolved theme. Used by `THEMES` construction and direct callers. |
| `defaultTheme` | `index.ts` | Re-export from `seldon.ts`: precomputed `ComputedTheme` for the default stock preset. |

### Authoring modules (named export `theme`)

Each module exports one `StockTheme` as the named export `theme`. `metadata.id` matches the file’s template id.

| Type or Function | File | Purpose and use |
| --- | --- | --- |
| `theme` | `seldon.ts` | Default Seldon brand preset. Also exports `defaultTheme` as a precomputed `ComputedTheme`. |
| `theme` | `earth.ts` | Warm natural preset. |
| `theme` | `high-contrast.ts` | Neutral high-contrast preset. |
| `theme` | `industrial.ts` | Cool dense preset. |
| `theme` | `google-material.ts` | Material Design 3 aligned preset. |
| `theme` | `pop.ts` | High-contrast expressive preset. |
| `theme` | `ibm-carbon.ts` | IBM Carbon-inspired preset. |
| `theme` | `adobe-spectrum.ts` | Adobe Spectrum-inspired preset. |
| `theme` | `sunset-blue.ts` | Warm-cool split preset. |
| `theme` | `wildberry.ts` | Saturated square-harmony preset. |

---

## Notes

- Stock theme ids and descriptions are listed in [`../README.md`](../README.md).
- `catalog/` imports `computeTheme` from `helpers/`, not from `compute/`, to avoid import cycles with `themes/compute`.
- Workspace theme entries should merge overrides into a stock row, then call `instantiateTheme` in `themes/compute/`.

---
