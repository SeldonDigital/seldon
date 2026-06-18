import { lucideIconIds } from "."
import type { IconCategory } from "../../constants/categories"
import { computeIconSet } from "../../helpers/compute-icon-set"
import type { StockIconSet } from "../../types/icon-set"

/**
 * Categories enabled when the Lucide icon set is added to a workspace. Icons in
 * every other category start off until the user turns them on.
 */
export const LUCIDE_DEFAULT_ENABLED_CATEGORIES: IconCategory[] = [
  "user-interface",
]

export const iconSet: StockIconSet = {
  metadata: {
    id: "lucideIcons",
    name: "Lucide",
    description: "Lucide open-source icon set.",
    intent: "Provides Lucide icons for interface and content icons.",
  },
  source: "lucide",
  icons: [...lucideIconIds],
  defaultEnabledCategories: LUCIDE_DEFAULT_ENABLED_CATEGORIES,
}

export const defaultIconSet = computeIconSet(iconSet)
