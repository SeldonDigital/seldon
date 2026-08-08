import { computeIconSet } from "../../helpers/compute-icon-set"
import { lucideAvailableIconIds } from "./available"
import { lucideDefaultEnabledIconIds } from "./default-enabled"

import type { StockIconSet } from "../../types/icon-set"

export const iconSet: StockIconSet = {
  metadata: {
    id: "lucideIcons",
    name: "Lucide",
    description: "Lucide open-source icon set.",
    intent: "Provides Lucide icons for interface and content icons.",
  },
  source: "lucide",
  icons: [...lucideAvailableIconIds],
  // The curated subset starts on. Every other available icon starts off until
  // the user turns it on, so default workspaces are not overloaded.
  defaultEnabledCategories: [],
  defaultEnabledIcons: [...lucideDefaultEnabledIconIds],
}

export const defaultIconSet = computeIconSet(iconSet)
