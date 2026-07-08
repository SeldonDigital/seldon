import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Ordinal Chip",
  id: Seldon.ComponentId.ORDINAL_CHIP,
  intent:
    "Schema for an ordinal chip that lists the ordinal theme scales for margin, padding, gap, border, and corners as labeled icon rows.",
  tags: ["ordinal", "chip", "scale", "specimen", "spacing", "theme", "ui"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_LEFT,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.cozy" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.cozy" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.cozy" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.cozy" },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy",
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    columnStart: { type: Sdn.ValueType.EMPTY, value: null },
    columnSpan: { type: Sdn.ValueType.EXACT, value: 2 },
    rowStart: { type: Sdn.ValueType.EMPTY, value: null },
    rowSpan: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: {
      type: Sdn.ValueType.EXACT,
      value: { unit: Sdn.Unit.PERCENT, value: 40 },
    },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.offWhite",
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
      color: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
      },
      width: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@borderWidth.medium",
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: {
        type: Sdn.ValueType.EXACT,
        value: { unit: Sdn.Unit.PERCENT, value: 50 },
      },
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
        value: "@corners.cozy",
      },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
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
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          margin: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
          },
          padding: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "material-margin" },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "3.12 · 0.25rem" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.callout",
                },
                weight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontWeight.light",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
                lineHeight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@lineHeight.compact",
                },
              },
              wrapText: { type: Sdn.ValueType.EXACT, value: false },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          margin: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
          },
          padding: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "material-padding" },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "3.12 · 0.25rem" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.callout",
                },
                weight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontWeight.light",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
                lineHeight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@lineHeight.compact",
                },
              },
              wrapText: { type: Sdn.ValueType.EXACT, value: false },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          margin: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
          },
          padding: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "seldon-gap" },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "3.12 · 0.25rem" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.callout",
                },
                weight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontWeight.light",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
                lineHeight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@lineHeight.compact",
                },
              },
              wrapText: { type: Sdn.ValueType.EXACT, value: false },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          margin: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
          },
          padding: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-borderStyle",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "3.12 · 0.25rem" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.callout",
                },
                weight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontWeight.light",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
                lineHeight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@lineHeight.compact",
                },
              },
              wrapText: { type: Sdn.ValueType.EXACT, value: false },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          margin: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
          },
          padding: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-roundedCorner",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "3.12 · 0.25rem" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.callout",
                },
                weight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontWeight.light",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
                lineHeight: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@lineHeight.compact",
                },
              },
              wrapText: { type: Sdn.ValueType.EXACT, value: false },
            },
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
