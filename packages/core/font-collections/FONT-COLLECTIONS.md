# Font Collections

A font collection lists font families a workspace can use. Collections work like themes. A packaged collection ships under `collections/`. A workspace references a collection through a catalog row and layers `overrides` on top.

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

- `collections/` holds one file per packaged collection plus `index.ts`. `index.ts` exports `STOCK_FONT_COLLECTIONS`, `STOCK_FONT_COLLECTIONS_BY_ID`, `FONT_COLLECTIONS`, `FONT_COLLECTIONS_BY_ID`, and `defaultFontCollection`.
- `types/` holds the document and id types.
- `constants/` holds the `FontOrigin` type and values.
- `helpers/` holds `computeFontCollection` and `normalizeFontCollection`.
- `compute/` holds `instantiateFontCollection` and the input normalizer.
- `catalog-ids.ts` exports `packagedFontCollectionCatalogIds`.

## Materialization

Use `computeFontCollection(collection)` to normalize a collection and resolve its `id`.

Use `instantiateFontCollection(templateId, overrides, STOCK_FONT_COLLECTIONS_BY_ID)` to derive a collection from a packaged template and overrides. Empty overrides skip the merge and compute the base collection.

## Workspace connection

Workspace files store raw authoring state only. A font collection board references a packaged collection by `catalogId`. A collection entry in `font-collections` uses `template: catalog:{FontCollectionTemplateId}` or `font-collection:{collectionId}` with `overrides` layered on top. Computed collections come from read-side helpers and are not persisted.
