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

Packaged set ids (`IconSetTemplateId`) are:

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

- `catalog/` holds one folder per packaged set: `seldon/`, `material/`, `carbon/`, and `lucide/`. Each folder holds `stock.ts`, `index.ts`, `index-all.ts`, `category-map.ts`, and category subfolders with the icon components. `catalog/index.ts` exports `STOCK_ICON_SETS`, `STOCK_ICON_SETS_BY_ID`, `ICON_SETS`, `ICON_SETS_BY_ID`, `defaultIconSet`, and `computeIconSet`.
- `types/` holds the document and id types, such as `StockIconSet`, `ComputedIconSet`, `IconSetMetadata`, `IconSetTemplateId`, `IconSetInstanceId`, and `IconSetId`.
- `constants/` holds the category types and values, such as `iconCategories`, `categorySubcategories`, `categoryPaths`, and `DEFAULT_CATEGORY_PATH`.
- `helpers/` holds `computeIconSet`, the icon selection helpers (`getIncludedIcons`, `getDefaultIncludedIcons`, `isIconIncluded`, `isIconEnabledByDefault`, `getIconsInCategory`, `getIconsInSubcategory`, `getIconsInCategoryOrder`, `deriveSubcategoryPreset`), the category lookup helpers (`getIconCategoryFromId`, `iconBelongsToIconSet`, `getIconCategoryFromPath`, `parseCategoryPath`), `getAvailableIcons`, and the workspace helpers (`getWorkspaceEnabledIcons`, `getAddedIconSetPrefixes`, `isIconUnavailable`).
- `compute/` holds `instantiateIconSet` and the input normalizer `normalizeIconSetInput`.
- `catalog-ids.ts` exports `packagedIconSetCatalogIds`.
- `index.ts` holds the icon id registry: the `iconIds` array, the `IconId` type, `defaultIconId`, and an icon display-label map.

## Materialization

Use `computeIconSet(set)` to normalize a set and resolve its `id`. Normalizing drops empty icon ids and removes duplicates while keeping order.

Use `instantiateIconSet(templateId, overrides, STOCK_ICON_SETS_BY_ID)` to derive a set from a packaged template and overrides. Empty overrides skip the merge and compute the base set.

## Workspace connection

Workspace files store raw authoring state only. An icon set board references a packaged set by `catalogId`. An icon set entry in `icon-sets` uses `template: catalog:{IconSetTemplateId}` or `icon-set:{iconSetId}` with `overrides` layered on top. The per-icon selection lives under `overrides.includedIcons`. Computed sets come from read-side helpers and are not persisted.

Use `getWorkspaceEnabledIcons(workspace)` to read the icons turned on across the workspace. It returns the union of included icons across every icon set entry, in board then category order, with each icon once.
