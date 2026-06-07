# Seldon · Font Collections

A font collection lists font families a workspace can use. Collections work like themes. A packaged collection ships under `catalog/`. A workspace references a collection through a catalog row and layers `overrides` on top.

## Smallest valid collection

```ts
const collection: StockFontCollection = {
  metadata: {
    id: "system",
    name: "System",
    description: "System and local fonts.",
    intent: "Default font collection.",
  },
  families: {
    sans: { name: "System Sans", origin: "local", stack: "system-ui, sans-serif" },
  },
}
```

## Packaged collections

Packaged collection ids (`FontCollectionTemplateId`) are:

- `system`
- `googleFonts`

`system` is the default. It renders fonts already on the device and never makes a network request. `googleFonts` lists families served by Google Fonts. A workspace adds `googleFonts` on demand.

## Family entries

Each family in `families` is a `FontFamilyEntry`:

- `name` sets the CSS family name and the display label.
- `origin` is `local` or `remote`. A `local` family never makes a network request. A `remote` family may load from a font host.
- `stack` sets a CSS fallback stack for local families.
- `variants` lists weights and styles for remote families. URL builders read this.

## Module layout

- `catalog/` holds `system.ts` for the `system` collection and the `google/` folder for the `googleFonts` collection. The `google/` folder holds `index.ts`, `google-fonts-manifest.ts`, `default-enabled-families.ts`, and the `.woff2` assets. The google collection builds its families from `GOOGLE_FONT_FAMILIES`. `catalog/index.ts` exports `STOCK_FONT_COLLECTIONS`, `STOCK_FONT_COLLECTIONS_BY_ID`, `FONT_COLLECTIONS`, `FONT_COLLECTIONS_BY_ID`, `defaultFontCollection`, and `computeFontCollection`.
- `types/` holds the document and id types.
- `constants/` holds the `FontOrigin` type and the `FontOriginValue` values.
- `helpers/` holds `computeFontCollection`, `normalizeFontCollection`, `getRemoteFontUrl`, `isRemoteFontFamily`, `getFamilyNameByValue`, and the variant selection helpers `deriveVariantPreset`, `getEnabledVariants`, and `isVariantEnabled`.
- `compute/` holds `instantiateFontCollection` and the input normalizer `normalizeFontCollectionInput`.
- `catalog-ids.ts` exports `packagedFontCollectionCatalogIds`.
- `index.ts` re-exports the catalog, helpers, compute, constants, catalog ids, and types.

## Materialization

Use `computeFontCollection(collection)` to normalize a collection and resolve its `id`.

Use `instantiateFontCollection(templateId, overrides, STOCK_FONT_COLLECTIONS_BY_ID)` to derive a collection from a packaged template and overrides. Empty overrides skip the merge and compute the base collection.

## Workspace connection

Workspace files store raw authoring state only. A font collection board references a packaged collection by `catalogId`. A collection entry in `font-collections` uses `template: catalog:{FontCollectionTemplateId}` or `font-collection:{collectionId}` with `overrides` layered on top. Computed collections come from read-side helpers and are not persisted.
