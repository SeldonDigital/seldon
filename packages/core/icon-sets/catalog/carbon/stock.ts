import { computeIconSet } from "../../helpers/compute-icon-set"
import { carbonAvailableIconIds } from "./available"
import { carbonDefaultEnabledIconIds } from "./default-enabled"

import type { StockIconSet } from "../../types/icon-set"

export const iconSet: StockIconSet = {
  metadata: {
    id: "ibmCarbon",
    name: "Carbon",
    description: "IBM Carbon Design System icon set.",
    intent: "Provides IBM Carbon icons for interface and content icons.",
  },
  source: "carbon",
  icons: [...carbonAvailableIconIds],
  // The curated subset starts on. Every other available icon starts off until
  // the user turns it on, so default workspaces are not overloaded.
  defaultEnabledCategories: [],
  defaultEnabledIcons: [...carbonDefaultEnabledIconIds],
}

export const defaultIconSet = computeIconSet(iconSet)
