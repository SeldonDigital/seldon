import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Description Term",
  id: Seldon.ComponentId.DESCRIPTION_TERM,
  intent: "Displays the term or label in a description list.",
  tags: ["term", "label", "dl", "description list", "primitive", "text"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Term",
    },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: {
        function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    },
    font: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@font.label",
      },
      family: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      weight: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
      textCase: { type: Sdn.ValueType.EMPTY, value: null },
      letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
    },
    textDecoration: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TextDecoration.NONE,
    },
    wrapText: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    lines: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDt" },
}
