# font-collections

Packaged font families grouped as collections. See [FONT-COLLECTIONS.md](./FONT-COLLECTIONS.md) for the full reference.

## Quick map

| Path | Role |
| --- | --- |
| `collections/` | Packaged collection files and the registry. |
| `collections/system.ts` | Default `System` collection. Local fonts, no network request. |
| `collections/google/` | `Google Fonts` collection. `index.ts` builds the collection, and one folder per family holds that family's self-hosted `.woff2` files and license `.txt`. |
| `collections/google/google-fonts-manifest.ts` | Curated list of families to self-host, with their variants. |
| `collections/google/google-fonts.mjs` | Downloads each manifest family's `.woff2` and license into its folder. |
| `types/` | Document and id types. |
| `constants/` | `FontOrigin` type and values. |
| `helpers/` | `computeFontCollection`, `normalizeFontCollection`. |
| `compute/` | `instantiateFontCollection`, input normalizer. |
| `catalog-ids.ts` | `packagedFontCollectionCatalogIds`. |

## Common imports

```ts
import {
  STOCK_FONT_COLLECTIONS_BY_ID,
  FONT_COLLECTIONS_BY_ID,
  defaultFontCollection,
  computeFontCollection,
} from "@seldon/core/font-collections"
```
