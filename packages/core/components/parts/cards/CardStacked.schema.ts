import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Stacked Card",
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
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.HEADER_CARD,
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
          type: Sdn.ValueType.PRESET,
          value: Sdn.Resize.FIT,
        },
        margin: {
          top: { type: Sdn.ValueType.EMPTY, value: null },
          right: { type: Sdn.ValueType.EMPTY, value: null },
          bottom: { type: Sdn.ValueType.EMPTY, value: null },
          left: { type: Sdn.ValueType.EMPTY, value: null },
        },
        border: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.TEXTBLOCK_TITLE,
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
        border: {
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.NONE,
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.DESCRIPTION,
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
          size: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@fontSize.small",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.BAR_BUTTONS,
      overrides: {
        align: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER_RIGHT,
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
      },
    },
  ],
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Alignment.CENTER_LEFT,
    },
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FIT,
    },
    height: {
      type: Sdn.ValueType.PRESET,
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
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.white",
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      topStyle: { type: Sdn.ValueType.EMPTY, value: null },
      topColor: { type: Sdn.ValueType.EMPTY, value: null },
      topWidth: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      rightStyle: { type: Sdn.ValueType.EMPTY, value: null },
      rightColor: { type: Sdn.ValueType.EMPTY, value: null },
      rightWidth: { type: Sdn.ValueType.EMPTY, value: null },
      rightOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftStyle: { type: Sdn.ValueType.EMPTY, value: null },
      leftColor: { type: Sdn.ValueType.EMPTY, value: null },
      leftWidth: { type: Sdn.ValueType.EMPTY, value: null },
      leftOpacity: { type: Sdn.ValueType.EMPTY, value: null },
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
    // TYPOGRAPHY
    // GRADIENTS
    gradient: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      angle: { type: Sdn.ValueType.EMPTY, value: null },
      startColor: { type: Sdn.ValueType.EMPTY, value: null },
      startOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      startPosition: { type: Sdn.ValueType.EMPTY, value: null },
      endColor: { type: Sdn.ValueType.EMPTY, value: null },
      endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      endPosition: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
