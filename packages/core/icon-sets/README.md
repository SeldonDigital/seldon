# Seldon · Icon Sets

An icon set lists the icons a workspace can use. Sets work like themes and font collections. A packaged set ships under `catalog/`. A workspace references a set through a catalog row and layers `overrides` on top.

## Smallest valid icon set

```ts
const set: StockIconSet = {
  metadata: {
    id: "seldonIcons",
    name: "Seldon",
    description: "The default Seldon icon set.",
    intent: "Provides the core interface icons.",
  },
  source: "seldon",
  icons: ["seldon-plus", "seldon-x"],
  defaultEnabledCategories: ["user-interface"],
}
```

## Packaged sets

Packaged sets are registered in `catalog/index.ts` and typed as `IconSetTemplateId`. Today they are `seldonIcons`, `googleMaterial`, `ibmCarbon`, and `lucideIcons`, and the list can grow. `seldonIcons` is the default and seeds every workspace. A workspace adds any other set on demand.

## Set fields

A `StockIconSet` holds:

- `metadata`: `id`, `name`, `description`, and `intent`.
- `source`: the shipped set the icons come from, one of `seldon`, `google-material`, `carbon`, or `lucide`. Each maps to an id prefix such as `seldon-`.
- `icons`: every icon id the set ships.
- `defaultEnabledCategories`: the categories on when the set is first added. Other categories start off.
- `defaultEnabledIcons` (optional): icon ids on by default, superseding `defaultEnabledCategories`. `googleMaterial` uses it to ship every icon while starting on a curated subset.

## Categories and inclusion

Icons group by category and subcategory. `IconCategory` values are `business`, `content`, `miscellaneous`, `social-media`, `specialized`, `system`, `user-interface`, and `utility`. A category path joins both, such as `user-interface/actions`.

An entry stores its selection in `overrides.includedIcons`, keyed by icon id. An absent icon falls back to the set's default categories, so the default entry needs no stored selection. A subcategory preset is `all`, `none`, or `custom`.

`getIconCategoryFromId` resolves a vendor id from `constants/icon-categories.ts`, one `id -> category` map for all vendor sets. An id missing from it falls back to a keyword match in `constants/category-keywords.ts`, then `DEFAULT_CATEGORY_PATH`, so a newly seeded icon still categorizes. The `seldon` set uses its folder-derived `category-map.ts` instead.

## Vendor icon data

The `material`, `carbon`, and `lucide` sets ship generated glyph data instead of component files. `scripts/generate-icons.mjs` reads a set's `available.ts` manifest, resolves every id against a pinned upstream Iconify package, and writes `data/<set>.icons.json`. Every id must resolve or the build fails, so the data always matches the manifest. There is no vendor fallback. An id that resolves to no glyph renders the `seldon-missing` glyph. The `__default__` id stays the arrow shown for an unset icon.

Run `npm run icons` to regenerate every set, or pass one set to scope it. Use `node scripts/generate-icons.mjs --seed <set>` to refill a manifest from upstream up to 5000 icons, group style variants, and drop aliases. The upstream package is a pinned devDependency, so a consumer install never reads upstream.

Each glyph `body` is injected as raw SVG when rendered and exported. The generator sanitizes and validates it first, failing on scripts, `foreignObject`, event handlers, or `javascript:` urls, so the committed data is trusted markup. A user-selected `symbol` id only looks it up. An unknown id renders `seldon-missing` and never reaches the sink.

The data lives behind the `@seldon/core/icon-sets/data` subpath. The core barrel and workspace engine never import it, so `terminus`, `hari`, and `ai` never load it. Only the editor and factory read it, and the package ships the JSON because factory export needs it at runtime. The editor loads all three files on first icon render, a few MB on desktop. The icon set board caps previews at `MAX_RENDERED_BOARD_ICONS` and shows an overflow notice, so enabling a whole large set cannot mount thousands of component trees.

## Module layout

- `catalog/` holds one folder per packaged set plus `index.ts`, which exports the set maps and `computeIconSet`. Each set folder holds `stock.ts` for the set definition, `available.ts` for the full available id list, and `default-enabled.ts` for the default-on subset. `seldon/` also ships component files and a `category-map.ts`.
- `data/` holds the generated vendor glyph data with `getIconData` and `hasIconData`.
- `constants/` holds the category types, values, keyword table, and the `vendorIconCategories` map.
- `helpers/` holds `computeIconSet`, the selection helpers, category lookups, and workspace helpers.
- `compute/` holds `instantiateIconSet` and its input normalizer.
- `index.ts` holds the icon id registry: `iconIds`, `defaultIconId`, and `getIconLabel`. `IconId` is a plain `string`, not a union of every id, because available icons are runtime data. Each consumer generates its own scoped union.
- `types/` and `catalog-ids.ts` hold the document and id types and `packagedIconSetCatalogIds`.

## Materialization

`computeIconSet(set)` normalizes a set and resolves its `id`, dropping empty and duplicate ids while keeping order. `instantiateIconSet(templateId, overrides, STOCK_ICON_SETS_BY_ID)` derives a set from a packaged template. Empty overrides compute the base set.

## Workspace connection

Workspace files store raw authoring state only. A board references a set by `catalogId`. An entry in `icon-sets` uses `template: catalog:{IconSetTemplateId}` or `icon-set:{iconSetId}` with `overrides` on top, and the per-icon selection lives under `overrides.includedIcons`. Computed sets come from read-side helpers and are not persisted. `getWorkspaceEnabledIcons(workspace)` returns the icons on across the workspace, in board then category order, each once.
