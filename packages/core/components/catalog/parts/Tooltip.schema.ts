import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Tooltip",
  id: Seldon.ComponentId.TOOLTIP,
  intent: "Names or explains the control the pointer is resting on.",
  tags: ["tooltip", "hint", "overlay", "popup", "help", "part", "UI"],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    wrapperElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.WrapperElement.DIV,
    },
    cursor: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    columnStart: { type: Sdn.ValueType.EMPTY, value: null },
    columnSpan: { type: Sdn.ValueType.EMPTY, value: null },
    rowStart: { type: Sdn.ValueType.EMPTY, value: null },
    rowSpan: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.BackgroundKind.COLOR,
        },
        color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
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
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      topRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      bottomLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      bottomRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.moderate",
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.TOOLTIP },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "description",
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Add to library" },
          color: { type: Sdn.ValueType.COMPUTED, value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR },
        },
      },
    ],
  },
  variants: [
    {
      id: "withKbd",
      label: "With Shortcut",
      intent: "Names the control and shows the keyboard shortcut that triggers it.",
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "Add to library" },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "kbd",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "A" },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
