import { computeIconSet } from "../../helpers/compute-icon-set"
import { seldonAvailableIconIds } from "./available"
import { seldonDefaultEnabledIconIds } from "./default-enabled"

import type { StockIconSet } from "../../types/icon-set"

export const iconSet: StockIconSet = {
  metadata: {
    id: "seldonIcons",
    name: "Seldon",
    description: "The default Seldon icon set.",
    intent: "Provides the core interface icons shipped with every workspace.",
  },
  source: "seldon",
  icons: [...seldonAvailableIconIds],
  defaultEnabledCategories: [],
  defaultEnabledIcons: [...seldonDefaultEnabledIconIds],
}

export const defaultIconSet = computeIconSet(iconSet)
