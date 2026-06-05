import { computeIconSet } from "../../helpers/compute-icon-set"
import type { IconCategory } from "../../constants/categories"
import { materialIconIds } from "."
import type { StockIconSet } from "../../types/icon-set"

/**
 * Categories enabled when the Material icon set is added to a workspace. Icons
 * in every other category start off until the user turns them on.
 */
export const MATERIAL_DEFAULT_ENABLED_CATEGORIES: IconCategory[] = [
  "user-interface",
]

const iconSet: StockIconSet = {
  metadata: {
    id: "googleMaterial",
    name: "Material",
    description: "Google Material Symbols icon set.",
    intent: "Provides Google Material Symbols for interface and content icons.",
  },
  source: "google-material",
  icons: [...materialIconIds],
  defaultEnabledCategories: MATERIAL_DEFAULT_ENABLED_CATEGORIES,
}

export const defaultIconSet = computeIconSet(iconSet)

export default iconSet
