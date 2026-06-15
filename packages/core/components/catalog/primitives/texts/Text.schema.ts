import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Text",
  id: Seldon.ComponentId.TEXT,
  intent: "Base text component for general-purpose inline content.",
  tags: ["text", "inline", "paragraph", "primitive", "typography", "UI"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    htmlElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.HtmlElement.P,
    },
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Body",
    },
    cursor: {
      type: Sdn.ValueType.INHERIT,
      value: null,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: {
        function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: {
      type: Sdn.ValueType.EXACT,
      value: {
        value: 100,
        unit: Sdn.Unit.PERCENT,
      },
    },
    background: [
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
    ],
    font: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@font.body",
      },
      family: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      weight: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
      textCase: { type: Sdn.ValueType.EMPTY, value: null },
      letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
    },
    textAlign: { type: Sdn.ValueType.EMPTY, value: null },

    textDecoration: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TextDecoration.NONE,
    },
    wrapText: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    lines: { type: Sdn.ValueType.EMPTY, value: null },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.none",
        },
        offsetX: { type: Sdn.ValueType.EMPTY, value: null },
        offsetY: { type: Sdn.ValueType.EMPTY, value: null },
        blur: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
        spread: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
  },
  variants: [
    {
      id: "display",
      label: "Display",
      intent:
        "Large format text for page-level headings or prominent statements.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H1 },
        content: { type: Sdn.ValueType.EXACT, value: "Display" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.display",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 3 },
      },
    },
    {
      id: "heading",
      label: "Heading",
      intent: "Standard heading element to structure content hierarchy.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H2 },
        content: { type: Sdn.ValueType.EXACT, value: "Heading" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.heading",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 3 },
      },
    },
    {
      id: "subheading",
      label: "Subheading",
      intent: "Secondary heading to support or extend a main heading.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H3 },
        content: { type: Sdn.ValueType.EXACT, value: "Subheading" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.subheading",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 3 },
      },
    },
    {
      id: "title",
      label: "Title",
      intent: "Prominent title text used at the top of sections or views.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H4 },
        content: { type: Sdn.ValueType.EXACT, value: "Title" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.title",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
    },
    {
      id: "subtitle",
      label: "Subtitle",
      intent: "Displays supporting text under a main title or heading.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H5 },
        content: { type: Sdn.ValueType.EXACT, value: "Subtitle" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.subtitle",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
    },
    {
      id: "callout",
      label: "Callout",
      intent: "Highlights important messages or warnings within a UI.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H6 },
        content: { type: Sdn.ValueType.EXACT, value: "Callout" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.callout",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
    },
    {
      id: "tagline",
      label: "Tagline",
      intent:
        "Brief descriptive or marketing phrase used in branding or headers.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.P },
        content: { type: Sdn.ValueType.EXACT, value: "Tagline" },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.tagline",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
    },
    {
      id: "label",
      label: "Label",
      intent: "Associates readable text with a form control for accessibility.",
      overrides: {
        htmlElement: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.HtmlElement.LABEL,
        },
        content: { type: Sdn.ValueType.EXACT, value: "Label" },
        width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.label",
          },
        },
        wrapText: { type: Sdn.ValueType.EXACT, value: false },
      },
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "htmlElement" },
}
