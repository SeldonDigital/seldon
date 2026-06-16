import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Description List",
  id: Seldon.ComponentId.DESCRIPTION_LIST,
  intent:
    "Renders a list of term-description pairs for structured information.",
  tags: ["description list", "dl", "terms", "definitions", "element", "info"],
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
        component: Seldon.ComponentId.DESCRIPTION_TERM,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Term 1" },
        },
      },
      {
        component: Seldon.ComponentId.DESCRIPTION_DETAILS,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Details 1" },
        },
      },
      {
        component: Seldon.ComponentId.DESCRIPTION_TERM,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Term 2" },
        },
      },
      {
        component: Seldon.ComponentId.DESCRIPTION_DETAILS,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Details 2" },
        },
      },
      {
        component: Seldon.ComponentId.DESCRIPTION_TERM,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Term 3" },
        },
      },
      {
        component: Seldon.ComponentId.DESCRIPTION_DETAILS,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Details 3" },
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDl" },
}
