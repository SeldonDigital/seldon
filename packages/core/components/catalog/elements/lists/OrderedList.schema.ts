import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Ordered List",
  id: Seldon.ComponentId.ORDERED_LIST,
  intent: "Displays a numbered list of items with sequential meaning.",
  tags: [
    "ordered list",
    "ol",
    "element",
    "sequence",
    "numbered",
    "UI",
    "text",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: { type: Sdn.ValueType.EMPTY, value: null },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.LIST_ITEM,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "List item 1" },
        },
      },
      {
        component: Seldon.ComponentId.LIST_ITEM,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "List item 2" },
        },
      },
      {
        component: Seldon.ComponentId.LIST_ITEM,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "List item 3" },
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLOl" },
}
