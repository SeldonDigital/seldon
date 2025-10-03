import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Checkbox",
  id: Seldon.ComponentId.CHECKBOX,
  intent: "Basic form control for toggling a binary value.",
  tags: [
    "checkbox",
    "form",
    "input",
    "boolean",
    "toggle",
    "primitive",
    "control",
  ],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.INPUT,
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
      restrictions: {
        allowedValues: [
          "@fontSize.xsmall",
          "@fontSize.small",
          "@fontSize.medium",
          "@fontSize.large",
          "@fontSize.xlarge",
        ],
      },
    },
    checked: { type: Sdn.ValueType.EXACT, value: false },
    inputType: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.InputType.CHECKBOX,
      restrictions: {
        allowedValues: [Sdn.InputType.CHECKBOX],
      },
    },

    // LAYOUT
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
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FIT,
    },
    // APPEARANCE
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    accentColor: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },

    // TYPOGRAPHY
    // GRADIENTS
    // SHADOWS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLInput" },
}
