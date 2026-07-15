import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Sandbox",
  id: Seldon.ComponentId.SANDBOX,
  intent:
    "Absolutely positioned playground frame placed directly on the canvas. Holds explicit position and size so playground sandboxes can be arranged without overlap. Never exported by the factory.",
  tags: [
    "sandbox",
    "playground",
    "frame",
    "layout",
    "container",
    "absolute",
    "canvas",
  ],
  level: Seldon.ComponentLevel.FRAME,
  icon: Seldon.ComponentIcon.FRAME,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    position: {
      top: {
        type: Sdn.ValueType.EXACT,
        value: { value: 0, unit: Sdn.Unit.PX },
      },
      left: {
        type: Sdn.ValueType.EXACT,
        value: { value: 0, unit: Sdn.Unit.PX },
      },
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    width: {
      type: Sdn.ValueType.EXACT,
      value: { value: 800, unit: Sdn.Unit.PX },
    },
    height: {
      type: Sdn.ValueType.EXACT,
      value: { value: 600, unit: Sdn.Unit.PX },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: true,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.none",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderTop: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderRight: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderBottom: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderLeft: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    corners: {
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.none",
        },
        style: { type: Sdn.ValueType.EMPTY, value: null },
        offsetX: { type: Sdn.ValueType.EMPTY, value: null },
        offsetY: { type: Sdn.ValueType.EMPTY, value: null },
        blur: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
        spread: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
  },
  default: { children: [] },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "wrapperElement" },
}
