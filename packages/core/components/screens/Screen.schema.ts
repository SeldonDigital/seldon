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
  properties: {
    screenWidth: {
      type: Sdn.ValueType.EXACT,
      value: {
        value: 600,
        unit: Sdn.Unit.PX,
      },
    },
    screenHeight: {
      type: Sdn.ValueType.EXACT,
      value: {
        value: 600,
        unit: Sdn.Unit.PX,
      },
    },
    direction: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    padding: {
      top: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      left: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
    },
    background: [
      {
        preset: { type: Sdn.ValueType.EMPTY, value: null },
        image: { type: Sdn.ValueType.EMPTY, value: null },
        position: { type: Sdn.ValueType.EMPTY, value: null },
        size: { type: Sdn.ValueType.EMPTY, value: null },
        repeat: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        blendMode: { type: Sdn.ValueType.EMPTY, value: null },
        filter: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    gradient: [
      {
        preset: { type: Sdn.ValueType.EMPTY, value: null },
        gradientType: { type: Sdn.ValueType.EMPTY, value: null },
        angle: { type: Sdn.ValueType.EMPTY, value: null },
        startColor: { type: Sdn.ValueType.EMPTY, value: null },
        startOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
        startPosition: { type: Sdn.ValueType.EMPTY, value: null },
        endColor: { type: Sdn.ValueType.EMPTY, value: null },
        endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
        endPosition: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
  },
  default: { children: [] },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
