import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Segmented Button",
  id: Seldon.ComponentId.BUTTON_SEGMENTED,
  intent:
    "Combines related actions into a segmented control with selectable options.",
  tags: [
    "segmented control",
    "toggle",
    "switch",
    "UI",
    "options",
    "selection",
    "button group",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
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
        corners: {
          topLeft: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
          topRight: { type: Sdn.ValueType.EMPTY, value: null },
          bottomLeft: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
          bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
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
              input: { basedOn: "#buttonSize", factor: 0.75 },
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
        corners: {
          topLeft: { type: Sdn.ValueType.EMPTY, value: null },
          topRight: { type: Sdn.ValueType.EMPTY, value: null },
          bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
          bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
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
        corners: {
          topLeft: { type: Sdn.ValueType.EMPTY, value: null },
          topRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
          bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
          bottomRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
        },
      },
    },
  ],
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Alignment.CENTER,
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
    // APPEARANCE
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
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
  react: { returns: "Frame" },
}
