import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "List",
  id: Seldon.ComponentId.LIST,
  intent:
    "Displays a list of items. Renders as an unordered bulleted list or an ordered numbered list.",
  tags: [
    "list",
    "ul",
    "ol",
    "element",
    "bulleted",
    "numbered",
    "sequence",
    "text",
    "UI",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    htmlElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.HtmlElement.UL,
    },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.EXACT, value: false },
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
    wrapChildren: { type: Sdn.ValueType.EXACT, value: false },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    listStyleType: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.ListStyleType.DISC,
    },
    listStylePosition: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.ListStylePosition.OUTSIDE,
    },
    background: [
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
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
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderTop: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderRight: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderBottom: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderLeft: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
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
        offsetX: { type: Sdn.ValueType.EMPTY, value: null },
        offsetY: { type: Sdn.ValueType.EMPTY, value: null },
        blur: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
        spread: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    textAlign: { type: Sdn.ValueType.EMPTY, value: null },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.LIST_TEXT,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "List item 1" },
        },
      },
      {
        component: Seldon.ComponentId.LIST_TEXT,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "List item 2" },
        },
      },
      {
        component: Seldon.ComponentId.LIST_TEXT,
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "List item 3" },
        },
      },
    ],
  },
  variants: [
    {
      id: "ordered",
      label: "Ordered",
      intent: "Displays a numbered list of items with sequential meaning.",
      overrides: {
        htmlElement: { type: Sdn.ValueType.OPTION, value: Sdn.HtmlElement.OL },
        listStyleType: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.ListStyleType.DECIMAL,
        },
      },
      children: [
        {
          component: Seldon.ComponentId.LIST_TEXT,
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "List item 1" },
          },
        },
        {
          component: Seldon.ComponentId.LIST_TEXT,
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "List item 2" },
          },
        },
        {
          component: Seldon.ComponentId.LIST_TEXT,
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "List item 3" },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "htmlElement" },
}
