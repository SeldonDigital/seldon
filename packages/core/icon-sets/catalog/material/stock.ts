import { materialIconIds } from "."
import { computeIconSet } from "../../helpers/compute-icon-set"
import type { StockIconSet } from "../../types/icon-set"
import { materialAllIconIds } from "./index-all"

export const iconSet: StockIconSet = {
  metadata: {
    id: "googleSymbols",
    name: "Google Symbols",
    description: "Google Material Symbols icon set.",
    intent: "Provides Google Material Symbols for interface and content icons.",
  },
  source: "google-material",
  icons: [...materialAllIconIds],
  // The curated subset starts on. Every other shipped icon starts off until
  // the user turns it on, so default workspaces are not overloaded.
  defaultEnabledCategories: [],
  defaultEnabledIcons: [...materialIconIds],
}

export const defaultIconSet = computeIconSet(iconSet)
