import * as compoundProperties from "../../helpers/properties/compound-properties"
import { Orientation, Unit, ValueType } from "../../index"
import * as Sdn from "../../properties"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

export const schema = {
  id: Seldon.ComponentId.SCREEN,
  name: "Screen",
  intent: "Screen...",
  tags: ["screen"],
  level: Seldon.ComponentLevel.SCREEN,
  icon: Seldon.ComponentIcon.STUB,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  properties: {
    background: compoundProperties.background,
    gradient: compoundProperties.gradient,
    direction: { type: ValueType.EMPTY, value: null },
    orientation: {
      type: ValueType.PRESET,
      value: Orientation.VERTICAL,
    },
    align: { type: ValueType.EMPTY, value: null },
    gap: {
      type: ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
    },
    padding: {
      top: {
        type: ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      right: {
        type: ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      bottom: {
        type: ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      left: {
        type: ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
    },
    screenWidth: {
      type: ValueType.EXACT,
      value: { value: 600, unit: Unit.PX },
    },
    screenHeight: {
      type: ValueType.EXACT,
      value: { value: 600, unit: Unit.PX },
    },
  },
  children: [],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
