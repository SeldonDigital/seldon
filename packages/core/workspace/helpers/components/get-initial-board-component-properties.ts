import { Display, Orientation, ValueType } from "../../../properties"
import type { Properties } from "../../../properties/types/properties"
import type { ComponentCatalogEntry } from "../../model/components"

/** Initial `componentProperties` overrides when creating a catalog row by board type. */
export function getInitialBoardComponentProperties(
  type: ComponentCatalogEntry["type"],
): Properties {
  if (type === "playground") {
    return {
      display: {
        type: ValueType.OPTION,
        value: Display.EXCLUDE,
      },
    }
  }

  if (type === "icon-set") {
    return {
      orientation: {
        type: ValueType.OPTION,
        value: Orientation.VERTICAL,
      },
    }
  }

  return {}
}
