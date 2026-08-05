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

## Packaged icon sets

Packaged set ids, typed as `IconSetTemplateId`, are:

- `seldonIcons`
- `googleMaterial`
- `ibmCarbon`
- `lucideIcons`

`seldonIcons` is the default. It seeds into every workspace. A workspace adds `googleMaterial`, `ibmCarbon`, and `lucideIcons` on demand.

## Set fields

A `StockIconSet` has these fields:

- `metadata` holds `id`, `name`, `description`, and `intent`.
- `source` names the shipped component set the icons come from. Values are `seldon`, `google-material`, `carbon`, and `lucide`. Each maps to an icon id prefix, such as `seldon-` and `carbon-`.
- `icons` lists every icon id the set ships.
- `defaultEnabledCategories` lists the categories turned on when the set is first added. Icons in other categories start off until the user turns them on.
- `defaultEnabledIcons` is optional. When present it lists the icon ids turned on by default and supersedes `defaultEnabledCategories`. The `googleMaterial` set uses it to ship every Material icon while starting with a curated subset on.

## Categories and inclusion

Icons group by category and subcategory. `IconCategory` has these values: `business`, `content`, `miscellaneous`, `social-media`, `specialized`, `system`, `user-interface`, and `utility`. A category path joins both levels, such as `user-interface/actions`.

An icon set entry stores which icons are on. The selection lives in the entry `overrides` under `includedIcons`, keyed by icon id. An absent icon falls back to the set's default categories, so the default entry needs no stored selection. A subcategory preset is `all`, `none`, or `custom`.

## Module layout

- `catalog/` holds one folder per packaged set: `seldon/`, `material/`, `carbon/`, and `lucide/`. `seldon/` ships one component file per icon in category subfolders plus its folder-derived `category-map.ts`. `material/`, `carbon/`, and `lucide/` ship no component files; each holds `stock.ts`, `index.ts`, and `index-all.ts`. `catalog/index.ts` exports `STOCK_ICON_SETS`, `STOCK_ICON_SETS_BY_ID`, `ICON_SETS`, `ICON_SETS_BY_ID`, `defaultIconSet`, and `computeIconSet`.
- `data/` holds the generated glyph data for the vendor sets: `material.icons.json`, `carbon.icons.json`, and `lucide.icons.json`, plus `getIconData` and `hasIconData`. Only rendering and export read this module; the workspace engine never imports it.
- `types/` holds the document and id types, such as `StockIconSet`, `ComputedIconSet`, `IconSetMetadata`, `IconSetTemplateId`, `IconSetInstanceId`, and `IconSetId`.
- `constants/` holds the category types and values, such as `iconCategories`, `categorySubcategories`, `categoryPaths`, and `DEFAULT_CATEGORY_PATH`, the shared `categoryKeywords` table with `matchCategoryKeyword`, and the curated `vendorIconCategories` source that maps each vendor icon id to its category path.
- `helpers/` holds `computeIconSet`, the icon selection helpers (`getIncludedIcons`, `isIconIncluded`, `isIconEnabledByDefault`, `getIconsInSubcategory`, `getIconsInCategoryOrder`, `deriveSubcategoryPreset`), the category lookup helpers (`getIconCategoryFromId`, `iconBelongsToIconSet`), `getAvailableIcons`, and the workspace helpers (`getWorkspaceEnabledIcons`, `getAddedIconSetPrefixes`, `isIconUnavailable`).
- `compute/` holds `instantiateIconSet` and the input normalizer `normalizeIconSetInput`.
- `catalog-ids.ts` exports `packagedIconSetCatalogIds`.
- `index.ts` holds the icon id registry: the `iconIds` array, the `IconId` type, `defaultIconId`, and `getIconLabel`. `IconId` is a plain `string`, not a literal union of every catalog id, because the available icons are runtime data. Each consumer that needs a checked set of ids generates its own union scoped to what it uses, such as the editor chrome `Icon` primitive and the factory export `IconProps["icon"]`. `getIconLabel` derives a display label from an id's suffix and keeps a small override map for brand-cased social names and a few acronym glyphs.

## Vendor icon data

The `material`, `carbon`, and `lucide` sets ship generated glyph data instead of component files. `scripts/generate-icons.mjs` reads a set's `index-all.ts` manifest, resolves every id against a pinned upstream Iconify package, and writes `data/<set>.icons.json`. It does not touch categories.

The manifest is the list of available icons. Every id in it must resolve upstream. The generator fails and lists any id that does not, so the data always matches the manifest. There is no vendor fallback. A referenced id that resolves to no glyph renders the Seldon `seldon-missing` glyph, at render time in the editor and at export time in the factory. The `__default__` id stays the arrow shown for an unset or component-default icon.

Run `node scripts/generate-icons.mjs <set>` to regenerate a set after editing its manifest. The upstream package is a pinned devDependency, so a consumer install never reads upstream and an upstream release never changes a build.

To grow a set, run `node scripts/generate-icons.mjs --seed <set>`. Seeding refills the manifest from upstream up to the per-set cap of 5000, groups style variants to one concept, and drops pure aliases. Run the default mode afterwards to write the data.

### Categories

`getIconCategoryFromId` resolves a vendor id from the curated `constants/icon-categories.ts` source, one `id -> category` map for all three vendor sets. An id absent from that source falls back to the first keyword in `constants/category-keywords.ts` whose token appears in the id, then `DEFAULT_CATEGORY_PATH`, so a newly seeded icon still categorizes without a hand edit. Edit an entry in `icon-categories.ts` to correct one icon. The `seldon` set keeps its folder-derived `category-map.ts`, generated by `scripts/generate-mappings.ts`, since `seldon` ships component files.

## Materialization

Use `computeIconSet(set)` to normalize a set and resolve its `id`. Normalizing drops empty icon ids and removes duplicates while keeping order.

Use `instantiateIconSet(templateId, overrides, STOCK_ICON_SETS_BY_ID)` to derive a set from a packaged template and overrides. Empty overrides skip the merge and compute the base set.

## Workspace connection

Workspace files store raw authoring state only. An icon set board references a packaged set by `catalogId`. An icon set entry in `icon-sets` uses `template: catalog:{IconSetTemplateId}` or `icon-set:{iconSetId}` with `overrides` layered on top. The per-icon selection lives under `overrides.includedIcons`. Computed sets come from read-side helpers and are not persisted.

Use `getWorkspaceEnabledIcons(workspace)` to read the icons turned on across the workspace. It returns the union of included icons across every icon set entry, in board then category order, with each icon once.
