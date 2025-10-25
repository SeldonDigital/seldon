import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Description List",
  id: Seldon.ComponentId.DESCRIPTION_LIST,
  intent:
    "Renders a list of term-description pairs for structured information.",
  tags: ["description list", "dl", "terms", "definitions", "primitive", "info"],

  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.INPUT,
  properties: {
    // This is a basic schema - developers will expand it as needed
    display: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDl" },
}
