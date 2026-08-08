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
    sans: {
      name: "System Sans",
      origin: "local",
      stack: "system-ui, sans-serif",
    },
  },
}
```

## Packaged collections

Packaged collection ids, typed as `FontCollectionTemplateId`, are:

- `system`
- `googleFonts`
- `fontshare`

`system` is the default. It renders fonts already on the device and never makes a network request. `googleFonts` lists families served by Google Fonts. `fontshare` lists families served by Fontshare from the Indian Type Foundry. New workspaces seed all three.

## Family entries

Each family in `families` is a `FontFamilyEntry`:

- `name` sets the CSS family name and the display label.
- `origin` is `local`, `remote`, or `fontshare`. A `local` family never makes a network request. A `remote` family loads from Google Fonts. A `fontshare` family loads from Fontshare. Both `remote` and `fontshare` self-host their woff2 for the canvas.
- `stack` sets a CSS fallback stack for local families.
- `variants` lists weights and styles for remote families. URL builders read this.

## Font files

Core ships no font binaries. The `googleFonts` and `fontshare` collections are catalog data only, lists of families and variants built from `GOOGLE_FONT_FAMILIES` and `FONTSHARE_FONT_FAMILIES`. The editor canvas self-hosts the woff2 so it renders offline. `scripts/generate-fonts.mjs` reads both lists and writes each wanted variant's woff2 into the editor's public dir at `packages/editor/shared/public/font-files/<slug>/` with a license at `font-licenses/<slug>.txt`. Google families fetch woff2 from google-webfonts-helper and a license from the google/fonts GitHub. Fontshare families fetch woff2 from the Fontshare CDN and write a license pointer for the family's ITF or OFL terms. That dir is gitignored, so nothing is committed or shipped.

Run `npm run fonts` to materialize every family, or pass family names to scope it. The output dir doubles as the cache. A family whose files already exist is skipped without a network call, so reruns are fast and a warm cache works offline. A fresh clone materializes fonts on the first editor `dev` or `build`.

Factory export never reads these files. An exported app loads Google families from the Google Fonts CDN and Fontshare families from the Fontshare CSS API through `getRemoteFontUrl`. The ITF Free Font License permits both self-hosting the woff2 for your own project and loading through the Fontshare CSS API. It does not permit redistributing the font files, so the materialized woff2 stay in the local gitignored cache. Pinning font bytes only affects the editor canvas.

## Module layout

- `catalog/` holds `system.ts` for the `system` collection, the `google/` folder for the `googleFonts` collection, and the `fontshare/` folder for the `fontshare` collection. Each vendor folder holds `stock.ts` and `default-enabled.ts`. The google collection builds its families from `GOOGLE_FONT_FAMILIES` and the fontshare collection from `FONTSHARE_FONT_FAMILIES`. `catalog/index.ts` exports `STOCK_FONT_COLLECTIONS`, `STOCK_FONT_COLLECTIONS_BY_ID`, `FONT_COLLECTIONS`, `FONT_COLLECTIONS_BY_ID`, `defaultFontCollection`, and `computeFontCollection`.
- `types/` holds the document and id types.
- `constants/` holds the `FontOrigin` type, the `FontOriginValue` values, and `isSelfHostedRemoteOrigin`.
- `helpers/` holds `computeFontCollection`, `normalizeFontCollection`, `getRemoteFontUrl`, `isRemoteFontFamily`, `getFamilyNameByValue`, and the variant selection helpers `deriveVariantPreset`, `getEnabledVariants`, and `isVariantEnabled`.
- `compute/` holds `instantiateFontCollection` and the input normalizer `normalizeFontCollectionInput`.
- `catalog-ids.ts` exports `packagedFontCollectionCatalogIds`.
- `index.ts` re-exports the catalog, helpers, compute, constants, catalog ids, and types.

## Materialization

Use `computeFontCollection(collection)` to normalize a collection and resolve its `id`.

Use `instantiateFontCollection(templateId, overrides, STOCK_FONT_COLLECTIONS_BY_ID)` to derive a collection from a packaged template and overrides. Empty overrides skip the merge and compute the base collection.

## Workspace connection

Workspace files store raw authoring state only. A font collection board references a packaged collection by `catalogId`. A collection entry in `font-collections` uses `template: catalog:{FontCollectionTemplateId}` or `font-collection:{collectionId}` with `overrides` layered on top. Computed collections come from read-side helpers and are not persisted.
