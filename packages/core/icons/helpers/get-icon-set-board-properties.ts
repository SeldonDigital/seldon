import { ValueType } from "@seldon/core/properties/constants"
import { Properties } from "@seldon/core/properties/types/properties"
import { Orientation } from "@seldon/core/properties/values/layout/orientation"
import { ScreenSize } from "@seldon/core/properties/values/layout/screen-size"

export function getIconSetBoardProperties(): Properties {
  return {
    screenWidth: {
      type: ValueType.OPTION,
      value: ScreenSize.TABLET,
    },
    orientation: {
      type: ValueType.OPTION,
      value: Orientation.VERTICAL,
    },
  }
}
