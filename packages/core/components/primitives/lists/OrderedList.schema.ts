import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Ordered List",
  id: Seldon.ComponentId.ORDERED_LIST,
  intent: "Displays a numbered list of items with sequential meaning.",
  tags: [
    "ordered list",
    "ol",
    "primitive",
    "sequence",
    "numbered",
    "UI",
    "text",
  ],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.INPUT,
  properties: {
    // This is a basic schema - developers will expand it as needed
    display: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLOl" },
}
