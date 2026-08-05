import { computeIconSet } from "../../helpers/compute-icon-set"
import { materialAvailableIconIds } from "./available"
import { materialDefaultEnabledIconIds } from "./default-enabled"

import type { StockIconSet } from "../../types/icon-set"

export const iconSet: StockIconSet = {
  metadata: {
    id: "googleSymbols",
    name: "Google Symbols",
    description: "Google Material Symbols icon set.",
    intent: "Provides Google Material Symbols for interface and content icons.",
  },
  source: "google-material",
  icons: [...materialAvailableIconIds],
  // The curated subset starts on. Every other available icon starts off until
  // the user turns it on, so default workspaces are not overloaded.
  defaultEnabledCategories: [],
  defaultEnabledIcons: [...materialDefaultEnabledIconIds],
}

export const defaultIconSet = computeIconSet(iconSet)
