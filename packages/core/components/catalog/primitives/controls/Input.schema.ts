import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Input",
  id: Seldon.ComponentId.INPUT,
  intent: "Low-level text input control for collecting user input.",
  tags: [
    "input",
    "form",
    "text",
    "primitive",
    "field",
    "user entry",
    "control",
  ],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.INPUT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    inputType: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.InputType.TEXT,
    },
    checked: { type: Sdn.ValueType.EMPTY, value: null },
    placeholder: {
      type: Sdn.ValueType.EXACT,
      value: "Placeholder text",
    },
    buttonSize: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: { type: Sdn.ValueType.EMPTY, value: null },
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
        value: "@padding.compact",
      },
    },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
    },
    accentColor: { type: Sdn.ValueType.EMPTY, value: null },
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
      color: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 25,
        },
      },
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
        value: "@corners.tight",
      },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
    },
    font: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@font.body",
      },
      family: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      weight: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@fontSize.small" },
      lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
      textCase: { type: Sdn.ValueType.EMPTY, value: null },
      letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
    },

    textDecoration: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TextDecoration.NONE,
    },
    wrapText: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    lines: { type: Sdn.ValueType.EMPTY, value: null },
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
    ariaDisabled: { type: Sdn.ValueType.EMPTY, value: null },
    ariaExpanded: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHasPopup: { type: Sdn.ValueType.EMPTY, value: null },
    ariaInvalid: { type: Sdn.ValueType.EMPTY, value: null },
    ariaRequired: { type: Sdn.ValueType.EMPTY, value: null },
    ariaReadonly: { type: Sdn.ValueType.EMPTY, value: null },
  },
  variants: [
    {
      id: "checkbox",
      label: "Checkbox",
      intent: "Basic form control for toggling a binary value.",
      overrides: {
        inputType: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.InputType.CHECKBOX,
        },
        checked: { type: Sdn.ValueType.EXACT, value: false },
        buttonSize: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
        accentColor: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        padding: {
          top: { type: Sdn.ValueType.EMPTY, value: null },
          right: { type: Sdn.ValueType.EMPTY, value: null },
          bottom: { type: Sdn.ValueType.EMPTY, value: null },
          left: { type: Sdn.ValueType.EMPTY, value: null },
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.NONE,
            },
          },
        ],
        border: {
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
        font: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
          family: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.EMPTY, value: null },
          weight: { type: Sdn.ValueType.EMPTY, value: null },
          size: { type: Sdn.ValueType.EMPTY, value: null },
          lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
          textCase: { type: Sdn.ValueType.EMPTY, value: null },
          letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      id: "radio",
      label: "Radio Button",
      intent: "Basic form control for single-option selection in a group.",
      overrides: {
        inputType: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.InputType.RADIO,
        },
        checked: { type: Sdn.ValueType.EXACT, value: false },
        buttonSize: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
        accentColor: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        padding: {
          top: { type: Sdn.ValueType.EMPTY, value: null },
          right: { type: Sdn.ValueType.EMPTY, value: null },
          bottom: { type: Sdn.ValueType.EMPTY, value: null },
          left: { type: Sdn.ValueType.EMPTY, value: null },
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.NONE,
            },
          },
        ],
        border: {
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
        font: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
          family: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.EMPTY, value: null },
          weight: { type: Sdn.ValueType.EMPTY, value: null },
          size: { type: Sdn.ValueType.EMPTY, value: null },
          lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
          textCase: { type: Sdn.ValueType.EMPTY, value: null },
          letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLInput" },
}
