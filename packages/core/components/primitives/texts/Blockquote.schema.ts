import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Blockquote",
  id: Seldon.ComponentId.BLOCKQUOTE,
  intent: "Displays a block-level quotation for cited or referenced content.",
  tags: ["blockquote", "quote", "text", "citation", "primitive", "typography"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    // This is a basic schema - developers will expand it as needed
    display: { type: Sdn.ValueType.EMPTY, value: null },
    content: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLBlockquote" },
}
