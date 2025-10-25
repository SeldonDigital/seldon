import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Status Bar",
  id: Seldon.ComponentId.BAR_STATUS,
  intent:
    "Provides a status bar for displaying application or system information.",
  tags: ["status", "bar", "UI", "footer", "section", "information"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.TEXT,
      overrides: {
        content: { type: Sdn.ValueType.EXACT, value: "Left status" },
        color: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            input: { basedOn: "#parent.background.color" },
          },
        },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.code",
            restrictions: {
              allowedValues: ["@font.tagline", "@font.body", "@font.code"],
            },
          },
          size: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@fontSize.xsmall",
          },
        },
        align: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Align.CENTER_LEFT,
        },
      },
    },
    {
      component: Seldon.ComponentId.TEXT,
      overrides: {
        content: { type: Sdn.ValueType.EXACT, value: "Middle status" },
        color: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            input: { basedOn: "#parent.background.color" },
          },
        },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.code",
            restrictions: {
              allowedValues: ["@font.tagline", "@font.body", "@font.code"],
            },
          },
          size: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@fontSize.xsmall",
          },
        },
        align: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Align.CENTER,
        },
      },
    },
    {
      component: Seldon.ComponentId.TEXT,
      overrides: {
        content: { type: Sdn.ValueType.EXACT, value: "Right status" },
        color: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            input: { basedOn: "#parent.background.color" },
          },
        },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.code",
            restrictions: {
              allowedValues: ["@font.tagline", "@font.body", "@font.code"],
            },
          },
          size: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@fontSize.xsmall",
          },
        },
        align: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Align.CENTER_RIGHT,
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
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Align.CENTER_LEFT,
    },
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FILL,
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
        value: "@padding.cozy",
      },
    },
    gap: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Gap.EVENLY_SPACED,
    },
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
        value: "@swatch.black",
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      image: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      position: { type: Sdn.ValueType.EMPTY, value: null },
      repeat: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      topStyle: { type: Sdn.ValueType.EMPTY, value: null },
      topColor: { type: Sdn.ValueType.EMPTY, value: null },
      topWidth: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      topBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      rightStyle: { type: Sdn.ValueType.EMPTY, value: null },
      rightColor: { type: Sdn.ValueType.EMPTY, value: null },
      rightWidth: { type: Sdn.ValueType.EMPTY, value: null },
      rightOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      rightBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      bottomBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      leftStyle: { type: Sdn.ValueType.EMPTY, value: null },
      leftColor: { type: Sdn.ValueType.EMPTY, value: null },
      leftWidth: { type: Sdn.ValueType.EMPTY, value: null },
      leftOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftBrightness: { type: Sdn.ValueType.EMPTY, value: null },
    },
    corners: {
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // TYPOGRAPHY
    // GRADIENTS
    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
