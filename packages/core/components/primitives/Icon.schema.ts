import * as Sdn from "../../properties/constants"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

export const schema = {
  name: "Icon",
  id: Seldon.ComponentId.ICON,
  intent:
    "Displays a vector or symbolic icon representing an action or concept.",
  tags: ["icon", "symbol", "graphic", "primitive", "UI", "decoration"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.ICON,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    symbol: {
      type: Sdn.ValueType.PRESET,
      value: "__default__",
    },
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    size: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@size.medium",
      restrictions: {
        allowedValues: [
          "@size.xsmall",
          "@size.small",
          "@size.medium",
          "@size.large",
          "@size.xlarge",
        ],
      },
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    ariaHidden: { type: Sdn.ValueType.EXACT, value: false },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "iconMap" },
}
