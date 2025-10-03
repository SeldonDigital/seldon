import * as Sdn from "../../properties/constants"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

export const schema = {
  name: "Navigation",
  id: Seldon.ComponentId.NAV,
  intent: "Defines a navigational container for grouping menu links.",
  tags: ["navigation", "nav", "menu", "links", "primitive", "UI", "container"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    // This is a basic schema - developers will expand it as needed
    display: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLNav" },
}
