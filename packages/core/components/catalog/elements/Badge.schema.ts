import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Badge",
  id: Seldon.ComponentId.BADGE,
  intent: "Short non-interactive label for a status or category.",
  tags: ["badge", "status", "label", "tag"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.xsmall",
    },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.POINTER,
    },
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
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
    },
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
      top: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
      right: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
      bottom: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
      left: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.normal",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.MATCH_COLOR,
      },
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
      topLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      topRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
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
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    ariaPressed: { type: Sdn.ValueType.EMPTY, value: null },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: { content: { type: Sdn.ValueType.EXACT, value: "New" } },
      },
    ],
  },
  variants: [
    {
      id: "solid",
      label: "Solid",
      intent: "Status badge with a filled ink background.",
      overrides: {
        background: [
          {
            kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
            color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
          },
        ],
        border: { preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.none" } },
        color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.background" },
      },
    },
    {
      id: "muted",
      label: "Muted",
      intent: "Quiet status badge for pending or secondary information.",
      overrides: {
        background: [
          {
            kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
            color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
            opacity: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 15 } },
          },
        ],
        border: { preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.none" } },
      },
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLSpan" },
}
