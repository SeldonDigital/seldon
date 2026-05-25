import * as Sdn from "../../../properties"
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
    display: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    inputType: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.InputType.CHECKBOX,
    },
    checked: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      right: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottom: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      left: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    padding: {
      top: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      right: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottom: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      left: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
    },
    accentColor: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    },
    brightness: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    opacity: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        offsetX: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        offsetY: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        blur: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        color: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        brightness: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        opacity: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        spread: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLInput" },
}
