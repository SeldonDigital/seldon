import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Bubble",
  id: Seldon.ComponentId.BUBBLE,
  intent: "Holds one chat turn as a styled container, with an avatar and optional reactions.",
  tags: ["bubble", "chat", "conversation", "speech", "comment", "part", "UI"],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    wrapperElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.WrapperElement.DIV,
    },
    cursor: { type: Sdn.ValueType.EMPTY, value: null },
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
      value: Sdn.Orientation.HORIZONTAL,
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
  },
  default: {
    children: [
      { component: Seldon.ComponentId.AVATAR },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              clip: { type: Sdn.ValueType.OPTION, value: true },
              padding: {
                top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
                right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
                bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
                left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
              },
              background: [
                {
                  kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                  color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
                },
              ],
              border: {
                preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.none" },
              },
              corners: {
                topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
                bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "description",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "How do I get started with the catalog?",
                  },
                  color: {
                    type: Sdn.ValueType.COMPUTED,
                    value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.BAR,
            overrides: {
              placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              { component: Seldon.ComponentId.CHIP, variant: "suggestion" },
              { component: Seldon.ComponentId.CHIP, variant: "suggestion" },
            ],
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "secondary",
      label: "Secondary",
      intent: "Lower-emphasis bubble for the other side of the conversation.",
      children: [
        { component: Seldon.ComponentId.AVATAR },
        {
          component: Seldon.ComponentId.FRAME,
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.swatch2" },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "muted",
      label: "Muted",
      intent: "Quiet bubble for system notes and other low-priority turns.",
      children: [
        { component: Seldon.ComponentId.AVATAR },
        {
          component: Seldon.ComponentId.FRAME,
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "tinted",
      label: "Tinted",
      intent: "Softened brand bubble that sits behind the primary turn.",
      children: [
        { component: Seldon.ComponentId.AVATAR },
        {
          component: Seldon.ComponentId.FRAME,
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
                    brightness: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.PERCENT, value: 85 },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: "outline",
      label: "Outline",
      intent: "Bubble drawn with a hairline outline instead of a fill.",
      children: [
        { component: Seldon.ComponentId.AVATAR },
        {
          component: Seldon.ComponentId.FRAME,
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.OPTION, value: Sdn.Color.TRANSPARENT },
                  },
                ],
                border: {
                  preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "ghost",
      label: "Ghost",
      intent: "Bare turn with no fill, outline, or padding.",
      children: [
        { component: Seldon.ComponentId.AVATAR },
        {
          component: Seldon.ComponentId.FRAME,
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                padding: {
                  top: { type: Sdn.ValueType.EMPTY, value: null },
                  right: { type: Sdn.ValueType.EMPTY, value: null },
                  bottom: { type: Sdn.ValueType.EMPTY, value: null },
                  left: { type: Sdn.ValueType.EMPTY, value: null },
                },
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE },
                  },
                ],
                border: {
                  preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.none" },
                },
                corners: {
                  topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
                  topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
                  bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
                  bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "destructive",
      label: "Destructive",
      intent: "Bubble for a turn that reports a failure or a destructive outcome.",
      children: [
        { component: Seldon.ComponentId.AVATAR },
        {
          component: Seldon.ComponentId.FRAME,
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                background: [
                  {
                    kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                    color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.negative" },
                  },
                ],
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
