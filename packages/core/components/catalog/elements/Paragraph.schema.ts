import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Paragraph",
  id: Seldon.ComponentId.PARAGRAPH,
  intent:
    "Block of text that can hold marked runs. Renders as a paragraph or heading and contains Text children for plain, bold, and italic spans.",
  tags: ["paragraph", "text", "inline", "element", "typography", "UI"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    htmlElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.HtmlElement.P,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: { type: Sdn.ValueType.EMPTY, value: null },
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
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [{ kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } }],
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
    textDecoration: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TextDecoration.NONE,
    },
    textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.LEFT },
    wrapText: {
      type: Sdn.ValueType.OPTION,
      value: true,
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
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
          content: {
            type: Sdn.ValueType.EXACT,
            value:
              "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          font: {
            preset: { type: Sdn.ValueType.INHERIT, value: null },
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "display",
      label: "Display",
      intent: "Large format text for page-level headings or prominent statements.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H1 },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.display",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 3 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
    {
      id: "heading",
      label: "Heading",
      intent: "Standard heading element to structure content hierarchy.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H2 },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.heading",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 3 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
    {
      id: "subheading",
      label: "Subheading",
      intent: "Secondary heading to support or extend a main heading.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H3 },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.subheading",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 3 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
    {
      id: "title",
      label: "Title",
      intent: "Prominent title text used at the top of sections or views.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H4 },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.title",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
    {
      id: "subtitle",
      label: "Subtitle",
      intent: "Displays supporting text under a main title or heading.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H5 },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.subtitle",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
    {
      id: "callout",
      label: "Callout",
      intent: "Highlights important messages or warnings within a UI.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.H6 },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.callout",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
    {
      id: "tagline",
      label: "Tagline",
      intent: "Brief descriptive or marketing phrase used in branding or headers.",
      overrides: {
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.tagline",
          },
        },
        lines: { type: Sdn.ValueType.EXACT, value: 2 },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            font: {
              preset: { type: Sdn.ValueType.INHERIT, value: null },
            },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "htmlElement" },
}
