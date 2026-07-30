import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "One-Time Code",
  id: Seldon.ComponentId.INPUT_OTP,
  intent: "Collects a one-time passcode as a row of single-character fields.",
  tags: ["otp", "one-time code", "passcode", "verification", "input", "part", "UI"],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    wrapperElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.WrapperElement.DIV,
    },
    cursor: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
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
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    columnStart: { type: Sdn.ValueType.EMPTY, value: null },
    columnSpan: { type: Sdn.ValueType.EMPTY, value: null },
    rowStart: { type: Sdn.ValueType.EMPTY, value: null },
    rowSpan: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.BackgroundKind.NONE,
        },
        color: { type: Sdn.ValueType.EMPTY, value: null },
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
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
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
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.GROUP },
    ariaLabel: { type: Sdn.ValueType.EXACT, value: "One-time code" },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
    ariaRequired: { type: Sdn.ValueType.OPTION, value: false },
    ariaInvalid: { type: Sdn.ValueType.OPTION, value: Sdn.AriaInvalid.FALSE },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "-" },
          ariaHidden: { type: Sdn.ValueType.OPTION, value: true },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
    ],
  },
  variants: [
    {
      id: "fourDigit",
      label: "Four Digit",
      intent: "Collects a four-character code as one unbroken run of fields.",
      children: [
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
      ],
    },
    {
      id: "grouped",
      label: "Grouped",
      intent: "Splits a six-character code into two groups of three.",
      overrides: {
        gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
      },
      children: [
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          overrides: {
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.xsmall" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
