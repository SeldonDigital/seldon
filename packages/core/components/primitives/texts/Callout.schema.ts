import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Callout",
  id: Seldon.ComponentId.CALLOUT,
  intent: "Highlights important messages or warnings within a UI.",
  tags: ["callout", "alert", "notice", "info", "primitive", "message", "UI"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Callout",
    },
    htmlElement: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.HtmlElement.H6,
      restrictions: {
        allowedValues: [
          Sdn.HtmlElement.H1,
          Sdn.HtmlElement.H2,
          Sdn.HtmlElement.H3,
          Sdn.HtmlElement.H4,
          Sdn.HtmlElement.H5,
          Sdn.HtmlElement.H6,
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
        value: "@font.callout",
        restrictions: {
          allowedValues: ["@font.title", "@font.subtitle", "@font.callout"],
        },
      },
      family: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      size: {
        type: Sdn.ValueType.EMPTY,
        value: null,
        restrictions: {
          allowedValues: [
            "@fontSize.small",
            "@fontSize.medium",
            "@fontSize.large",
            "@fontSize.xlarge",
            "@fontSize.xxlarge",
          ],
        },
      },
      weight: { type: Sdn.ValueType.EMPTY, value: null },
      lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
      textCase: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.TextCasing.NORMAL,
      },
    },
    textAlign: { type: Sdn.ValueType.EMPTY, value: null },
    letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
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
