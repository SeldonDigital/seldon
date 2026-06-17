import { seldonIconIds } from "."
import type { IconCategory } from "../../constants/categories"
import { computeIconSet } from "../../helpers/compute-icon-set"
import type { StockIconSet } from "../../types/icon-set"

/**
 * Categories enabled when the Seldon icon set is added to a workspace. Icons in
 * every other category start off until the user turns them on.
 */
export const SELDON_DEFAULT_ENABLED_CATEGORIES: IconCategory[] = [
  "user-interface",
]

export const iconSet: StockIconSet = {
  metadata: {
    id: "seldonIcons",
    name: "Seldon",
    description: "The default Seldon icon set.",
    intent: "Provides the core interface icons shipped with every workspace.",
  },
  source: "seldon",
  icons: [...seldonIconIds],
  defaultEnabledCategories: SELDON_DEFAULT_ENABLED_CATEGORIES,
}

export const defaultIconSet = computeIconSet(iconSet)