import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Tagline",
  id: Seldon.ComponentId.TAGLINE,
  intent: "Brief descriptive or marketing phrase used in branding or headers.",
  tags: ["tagline", "branding", "message", "description", "text", "primitive"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Tagline",
    },
    htmlElement: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.HtmlElement.P,
      restrictions: {
        allowedValues: [
          Sdn.HtmlElement.H5,
          Sdn.HtmlElement.H6,
          Sdn.HtmlElement.P,
        ],
      },
    },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // APPEARANCE
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: {
      type: Sdn.ValueType.EXACT,
      value: {
        value: 100,
        unit: Sdn.Unit.PERCENT,
      },
    },
    background: {
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // TYPOGRAPHY
    font: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@font.tagline",
        restrictions: {
          allowedValues: ["@font.body", "@font.tagline", "@font.code"],
        },
      },
      family: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      size: {
        type: Sdn.ValueType.EMPTY,
        value: null,
        restrictions: {
          allowedValues: [
            "@fontSize.xxsmall",
            "@fontSize.xsmall",
            "@fontSize.small",
            "@fontSize.medium",
            "@fontSize.large",
          ],
        },
      },
      weight: { type: Sdn.ValueType.EMPTY, value: null },
      lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    textAlign: { type: Sdn.ValueType.EMPTY, value: null },
    letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
    textCase: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.TextCasing.NORMAL,
    },
    textDecoration: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.TextDecoration.NONE,
    },
    wrapText: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    lines: {
      type: Sdn.ValueType.EXACT,
      value: 2,
    },
    // EFFECTS
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
  react: { returns: "htmlElement" },
}
