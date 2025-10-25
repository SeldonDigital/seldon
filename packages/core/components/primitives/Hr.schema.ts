import * as Sdn from "../../properties"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

export const schema = {
  name: "Hr",
  id: Seldon.ComponentId.HR,
  intent: "Renders a horizontal rule for visual separation of content.",
  tags: ["divider", "hr", "horizontal rule", "primitive", "separator", "UI"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    // This is a basic schema - developers will expand it as needed
    display: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLHr" },
}
