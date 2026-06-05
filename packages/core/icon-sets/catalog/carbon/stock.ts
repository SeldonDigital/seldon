import { computeIconSet } from "../../helpers/compute-icon-set"
import type { IconCategory } from "../../constants/categories"
import { carbonIconIds } from "."
import type { StockIconSet } from "../../types/icon-set"

/**
 * Categories enabled when the Carbon icon set is added to a workspace. Icons in
 * every other category start off until the user turns them on.
 */
export const CARBON_DEFAULT_ENABLED_CATEGORIES: IconCategory[] = [
  "user-interface",
]

const iconSet: StockIconSet = {
  metadata: {
    id: "ibmCarbon",
    name: "Carbon",
    description: "IBM Carbon Design System icon set.",
    intent: "Provides IBM Carbon icons for interface and content icons.",
  },
  source: "carbon",
  icons: [...carbonIconIds],
  defaultEnabledCategories: CARBON_DEFAULT_ENABLED_CATEGORIES,
}

export const defaultIconSet = computeIconSet(iconSet)

export default iconSet
