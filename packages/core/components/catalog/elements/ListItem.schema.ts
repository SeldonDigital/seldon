import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "List Item",
  id: Seldon.ComponentId.LIST_ITEM,
  intent: "One list item block. Children are inline Text runs for plain, bold, and italic spans.",
  tags: ["list text", "li", "dt", "dd", "list item", "description", "element", "text"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    htmlElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.HtmlElement.LI,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: { type: Sdn.ValueType.EMPTY, value: null },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    width: { type: Sdn.ValueType.EMPTY, value: null },
    height: { type: Sdn.ValueType.EMPTY, value: null },
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
    textAlign: { type: Sdn.ValueType.EMPTY, value: null },
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
            value: "List item",
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
      id: "term",
      label: "Term",
      intent: "Term or label in a description list.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.DT },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.label",
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Term",
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
      id: "details",
      label: "Details",
      intent: "Definition or detail content in a description list.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.DD },
        margin: {
          bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.cozy" },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          overrides: {
            htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.SPAN },
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Details",
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
