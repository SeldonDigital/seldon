import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Disclosure",
  id: Seldon.ComponentId.DISCLOSURE,
  intent: "Hides a block of content behind a heading the reader can open.",
  tags: ["disclosure", "collapsible", "expander", "details", "toggle", "element", "UI"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.POINTER },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.BackgroundKind.NONE,
        },
        color: { type: Sdn.ValueType.EMPTY, value: null },
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
    ariaExpanded: { type: Sdn.ValueType.OPTION, value: false },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.BAR,
        overrides: {
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Is it accessible?" },
            },
          },
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "material-chevronDown" },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.EXCLUDE },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Yes. It follows the WAI-ARIA disclosure pattern.",
              },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "expanded",
      label: "Expanded",
      intent: "Disclosure with its body already open.",
      overrides: {
        ariaExpanded: { type: Sdn.ValueType.OPTION, value: true },
      },
      children: [
        {
          component: Seldon.ComponentId.BAR,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Is it accessible?" },
              },
            },
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: { type: Sdn.ValueType.OPTION, value: "material-chevronDown" },
                rotation: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.DEGREES, value: 180 },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            display: { type: Sdn.ValueType.EMPTY, value: null },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Yes. It follows the WAI-ARIA disclosure pattern.",
                },
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
