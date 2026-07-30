import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Slider",
  id: Seldon.ComponentId.SLIDER,
  intent: "Picks a value from a range by dragging a thumb along a track.",
  tags: ["slider", "range", "track", "thumb", "input", "element", "UI"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.GRAB },
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
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
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
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.SLIDER },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
    ariaDisabled: { type: Sdn.ValueType.OPTION, value: false },
    ariaValueNow: { type: Sdn.ValueType.EXACT, value: 40 },
    ariaValueMin: { type: Sdn.ValueType.EXACT, value: 0 },
    ariaValueMax: { type: Sdn.ValueType.EXACT, value: 100 },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
          background: [
            {
              kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
              color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
            },
          ],
          corners: {
            topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              width: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 40 } },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              background: [
                {
                  kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                  color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
                },
              ],
              corners: {
                topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
          cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.GRAB },
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          background: [
            {
              kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
              color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
            },
          ],
          border: {
            preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
          },
          corners: {
            topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
          },
          shadow: [
            {
              preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@shadow.light" },
            },
          ],
        },
      },
    ],
  },
  variants: [
    {
      id: "range",
      label: "Range",
      intent: "Picks a span with a thumb at each end.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
              },
            ],
            corners: {
              topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                width: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 40 } },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
                  },
                ],
                corners: {
                  topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                  topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                  bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                  bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
            cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.GRAB },
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
              },
            ],
            border: {
              preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
            },
            corners: {
              topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
            cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.GRAB },
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
              },
            ],
            border: {
              preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
            },
            corners: {
              topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            },
          },
        },
      ],
    },
    {
      id: "vertical",
      label: "Vertical",
      intent: "Runs the track up and down instead of across.",
      overrides: {
        orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
        width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
              },
            ],
            corners: {
              topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                height: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 40 } },
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
                  },
                ],
                corners: {
                  topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                  topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                  bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                  bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
            cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.GRAB },
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
              },
            ],
            border: {
              preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
            },
            corners: {
              topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
            },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
