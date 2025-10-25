import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "To-Do List",
  id: Seldon.ComponentId.LIST_TODO,
  intent:
    "Defines a list of to-do items with grouping, sorting, and filtering capabilities for task management interfaces.",
  tags: [
    "todo",
    "list",
    "tasks",
    "ui",
    "group",
    "filter",
    "sort",
    "management",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.LIST_ITEM_TODO,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
        },
      },
      nestedOverrides: {
        checkbox: { accentColor: "@swatch.primary" },
        label: { content: "Get snacks for the road", color: "@swatch.primary" },
        chip1: { display: "exclude" },
        chip2: { backgroundColor: "@swatch.swatch2" },
        chipCount: { display: "exclude" },
      },
    },
    {
      component: Seldon.ComponentId.LIST_ITEM_TODO,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
        },
      },
      nestedOverrides: {
        checkbox: { checked: true, accentColor: "@swatch.primary" },
        label: { content: "Book hotels", color: "@swatch.primary" },
        chip1: { backgroundColor: "@swatch.swatch1" },
        chip2: { display: "exclude" },
        chipCount: { display: "exclude" },
      },
    },
    {
      component: Seldon.ComponentId.LIST_ITEM_TODO,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
        },
      },
      nestedOverrides: {
        checkbox: { accentColor: "@swatch.primary" },
        label: { content: "Arrange day trips", color: "@swatch.primary" },
        chip1: { backgroundColor: "@swatch.swatch1" },
        chip2: { backgroundColor: "@swatch.swatch2" },
        chipCount: { display: "exclude" },
      },
    },
    {
      component: Seldon.ComponentId.LIST_ITEM_TODO,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
      nestedOverrides: {
        checkbox: { accentColor: "@swatch.primary" },
        label: { content: "Attractions booked", color: "@swatch.primary" },
        chip1: { display: "exclude" },
        chip2: { display: "exclude" },
        chipCount: { backgroundColor: "@swatch.swatch3" },
      },
    },
  ],
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
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
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    scroll: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Scroll.VERTICAL,
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      topStyle: { type: Sdn.ValueType.EMPTY, value: null },
      topColor: { type: Sdn.ValueType.EMPTY, value: null },
      topWidth: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      topBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      rightStyle: { type: Sdn.ValueType.EMPTY, value: null },
      rightColor: { type: Sdn.ValueType.EMPTY, value: null },
      rightWidth: { type: Sdn.ValueType.EMPTY, value: null },
      rightOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      rightBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftStyle: { type: Sdn.ValueType.EMPTY, value: null },
      leftColor: { type: Sdn.ValueType.EMPTY, value: null },
      leftWidth: { type: Sdn.ValueType.EMPTY, value: null },
      leftOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftBrightness: { type: Sdn.ValueType.EMPTY, value: null },
    },
    corners: {
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLUl" },
}
