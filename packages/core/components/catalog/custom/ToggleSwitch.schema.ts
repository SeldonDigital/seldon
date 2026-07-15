import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Toggle Switch",
  id: Seldon.ComponentId.TOGGLE_SWITCH,
  intent: "Toggles a single setting on or off with a sliding thumb.",
  tags: [
    "toggle",
    "switch",
    "control",
    "boolean",
    "binary",
    "on off",
    "ui",
    "form",
  ],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    checked: { type: Sdn.ValueType.OPTION, value: false },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.POINTER,
    },
    width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.medium" },
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
        value: "@padding.tight",
      },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.tight",
      },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.tight",
      },
      left: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.tight",
      },
    },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
    },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.gray",
        },
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
      topLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      topRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
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
      size: { type: Sdn.ValueType.EMPTY, value: null },
      lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
      textCase: { type: Sdn.ValueType.EMPTY, value: null },
      letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
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
    role: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.AriaRole.SWITCH,
    },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaChecked: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.AriaTristate.FALSE,
    },
    ariaDisabled: { type: Sdn.ValueType.EMPTY, value: null },
    ariaRequired: { type: Sdn.ValueType.EMPTY, value: null },
    ariaReadonly: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: {
    returns: "custom",
    custom: { base: "HTMLInput", template: "toggleSwitch" },
    forwardRef: "HTMLInputElement",
  },
  swift: { returns: "Toggle", tintFrom: "accentColor" },
  android: { returns: "Switch", tintFrom: "accentColor" },
}
