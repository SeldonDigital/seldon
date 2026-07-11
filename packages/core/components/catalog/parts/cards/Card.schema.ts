import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Card",
  id: Seldon.ComponentId.CARD_STACKED,
  intent:
    "Defines a vertically stacked card layout with support for headers, content blocks, and action elements.",
  tags: [
    "card",
    "stacked",
    "vertical",
    "ui",
    "block",
    "layout",
    "cta",
    "content",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EXACT, value: false },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
        value: "@border.hairline",
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
      topLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.HEADER,
        overrides: {
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
        },
      },
      {
        component: Seldon.ComponentId.IMAGE,
        overrides: {
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
        },
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.tight",
          },
          clip: {
            type: Sdn.ValueType.EXACT,
            value: true,
          },
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
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.NONE,
            },
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
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Title",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "subtitle",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Subtitle",
              },
              lines: {
                type: Sdn.ValueType.EXACT,
                value: 3,
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "description",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
          },
          margin: {
            top: { type: Sdn.ValueType.EMPTY, value: null },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.comfortable",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.normal",
            },
            family: { type: Sdn.ValueType.EMPTY, value: null },
            style: { type: Sdn.ValueType.EMPTY, value: null },
            weight: { type: Sdn.ValueType.EMPTY, value: null },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.small",
            },
            lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
            textCase: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
      },
      {
        component: Seldon.ComponentId.BAR,
        variant: "buttonBar",
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
          background: [
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.NONE,
              },
            },
          ],
        },
      },
    ],
  },
  variants: [
    {
      id: "horizontal",
      label: "Horizontal",
      intent:
        "UI component schema for horizontally oriented cards, often used in product previews, listings, and compact content displays.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Orientation.HORIZONTAL,
        },
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER,
        },
        width: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Resize.FILL,
        },
        gap: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Gap.EVENLY_SPACED,
        },
      },
      children: [
        {
          component: Seldon.ComponentId.AVATAR,
          overrides: {
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.cozy",
            },
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
            borderBottom: {
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              style: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderStyle.NONE,
              },
              color: { type: Sdn.ValueType.EMPTY, value: null },
              width: { type: Sdn.ValueType.EMPTY, value: null },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
          },
        },
      ],
    },
    {
      id: "product",
      label: "Product",
      intent:
        "Product card schema optimized for ecommerce use cases, supporting pricing, images, descriptions, and action triggers.",
      overrides: {
        width: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Resize.FILL,
        },
        gap: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Gap.EVENLY_SPACED,
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.IMAGE,
            },
            image: {
              type: Sdn.ValueType.EXACT,
              value: "https://static.seldon.app/background-default-light.jpg",
            },
            blendMode: { type: Sdn.ValueType.EMPTY, value: null },
            position: { type: Sdn.ValueType.EMPTY, value: null },
            size: { type: Sdn.ValueType.EMPTY, value: null },
            repeat: { type: Sdn.ValueType.EMPTY, value: null },
            filter: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "tagline",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Tagline",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Product Card Title",
                },
                margin: {
                  bottom: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@margin.compact",
                  },
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.heading",
                  },
                  family: { type: Sdn.ValueType.EMPTY, value: null },
                  style: { type: Sdn.ValueType.EMPTY, value: null },
                  weight: { type: Sdn.ValueType.EMPTY, value: null },
                  size: { type: Sdn.ValueType.EMPTY, value: null },
                  lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
                  textCase: { type: Sdn.ValueType.EMPTY, value: null },
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus.",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
            padding: {
              top: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Padding.NONE,
              },
              right: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Padding.NONE,
              },
              bottom: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Padding.NONE,
              },
              left: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Padding.NONE,
              },
            },
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.NONE,
                },
              },
            ],
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
