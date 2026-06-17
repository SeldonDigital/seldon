import { computeIconSet } from "../helpers/compute-icon-set"
import type { ComputedIconSet, StockIconSet } from "../types/icon-set"
import type { IconSetTemplateId } from "../types/icon-set-id"
import { iconSet as carbonStock } from "./carbon/stock"
import { iconSet as lucideStock } from "./lucide/stock"
import { iconSet as materialStock } from "./material/stock"
import { defaultIconSet, iconSet as seldonStock } from "./seldon/stock"

/** Packaged icon set definitions (`catalog/*.ts`), display order. */
export const STOCK_ICON_SETS: StockIconSet[] = [
  seldonStock,
  materialStock,
  carbonStock,
  lucideStock,
]

export const STOCK_ICON_SETS_BY_ID = Object.fromEntries(
  STOCK_ICON_SETS.map((s) => [s.metadata.id, s]),
) as Record<IconSetTemplateId, StockIconSet>

/** Computed packaged icon sets, same order as `STOCK_ICON_SETS`. */
export const ICON_SETS: ComputedIconSet[] = STOCK_ICON_SETS.map(computeIconSet)

export const ICON_SETS_BY_ID = Object.fromEntries(
  ICON_SETS.map((s) => [s.id, s]),
) as Record<IconSetTemplateId, ComputedIconSet>

export { computeIconSet }
export { defaultIconSet }
