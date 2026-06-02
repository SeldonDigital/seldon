# font-collections

Packaged font families grouped as collections. See [FONT-COLLECTIONS.md](./FONT-COLLECTIONS.md) for the full reference.

## Quick map

| Path | Role |
| --- | --- |
| `collections/` | Packaged collection files and the registry. |
| `collections/system.ts` | Default `System` collection. Local fonts, no network request. |
| `collections/google.ts` | `Google Fonts` collection. Remote families. |
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
