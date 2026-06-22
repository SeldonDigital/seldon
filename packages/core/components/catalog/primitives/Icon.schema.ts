import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

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
      type: Sdn.ValueType.OPTION,
      value: "__default__",
    },
    size: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@size.medium",
    },
    cursor: {
      type: Sdn.ValueType.INHERIT,
      value: null,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: {
        function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "iconMap" },
}
