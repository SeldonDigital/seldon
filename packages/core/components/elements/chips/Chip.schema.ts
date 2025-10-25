import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Chip",
  id: Seldon.ComponentId.CHIP,
  intent:
    "Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.",
  tags: ["chip", "ui", "tag", "label", "badge", "filter", "category", "pill"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.ICON,
      overrides: {
        display: { type: Sdn.ValueType.PRESET, value: Sdn.Display.SHOW },
        symbol: {
          type: Sdn.ValueType.PRESET,
          value: "material-radioOff",
        },
        size: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.AUTO_FIT,
            input: { basedOn: "#parent.buttonSize", factor: 0.8 },
          },
        },
        color: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            input: { basedOn: "#parent.background.color" },
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.LABEL,
      overrides: {
        display: { type: Sdn.ValueType.PRESET, value: Sdn.Display.SHOW },
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Chip",
        },
        font: {
          size: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.AUTO_FIT,
              input: { basedOn: "#parent.buttonSize", factor: 0.8 },
            },
          },
        },
        color: {
          type: Sdn.ValueType.COMPUTED,
          value: {
            function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            input: { basedOn: "#parent.background.color" },
          },
        },
      },
    },
  ],
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.xsmall",
      restrictions: {
        allowedValues: [
          "@fontSize.xxsmall",
          "@fontSize.xsmall",
          "@fontSize.small",
          "@fontSize.medium",
          "@fontSize.large",
          "@fontSize.xlarge",
          "@fontSize.xxlarge",
        ],
      },
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
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: { basedOn: "#buttonSize", factor: 0.5 },
        },
      },
      right: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: { basedOn: "#buttonSize", factor: 0.875 },
        },
      },
      bottom: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: { basedOn: "#buttonSize", factor: 0.5 },
        },
      },
      left: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: { basedOn: "#buttonSize", factor: 0.75 },
        },
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Cursor.POINTER,
    },
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
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.normal",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.MATCH,
          input: { basedOn: "#background.color" },
        },
      },
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
      topLeft: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.Corner.ROUNDED,
      },
      topRight: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.Corner.ROUNDED,
      },
      bottomLeft: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.Corner.ROUNDED,
      },
      bottomRight: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.Corner.ROUNDED,
      },
    },
    // TYPOGRAPHY
    // GRADIENTS
    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: {
    returns: "HTMLSpan",
  },
}
