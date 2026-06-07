import { Display, Orientation, ValueType } from "../../../properties"
import type { Properties } from "../../../properties/types/properties"
import type { ComponentEntry } from "../../model/components"

/** Initial `componentProperties` overrides when creating a catalog row by board type. */
export function getInitialBoardComponentProperties(
  type: ComponentEntry["type"],
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
        value: Orientation.HORIZONTAL,
      },
      wrapChildren: {
        type: ValueType.EXACT,
        value: true,
      },
      clip: {
        type: ValueType.EXACT,
        value: false,
      },
    }
  }

  return {}
}
