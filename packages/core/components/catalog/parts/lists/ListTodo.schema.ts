import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

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
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
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
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@background.none",
        },
        image: { type: Sdn.ValueType.EMPTY, value: null },
        position: { type: Sdn.ValueType.EMPTY, value: null },
        size: { type: Sdn.ValueType.EMPTY, value: null },
        repeat: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        blendMode: { type: Sdn.ValueType.EMPTY, value: null },
        filter: { type: Sdn.ValueType.EMPTY, value: null },
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
    scroll: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Scroll.VERTICAL,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          border: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.none",
            },
          },
          borderBottom: {
            preset: { type: Sdn.ValueType.EMPTY, value: null },
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderWidth.HAIRLINE,
            },
            brightness: {
              type: Sdn.ValueType.EXACT,
              value: {
                unit: Sdn.Unit.PERCENT,
                value: 75,
              },
            },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.INPUT,
            variant: "checkbox",
            overrides: {
              checked: {
                type: Sdn.ValueType.EXACT,
                value: false,
              },
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.black",
              },
              accentColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Get snacks for the road",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FILL,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-plus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Add",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.SHOW,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch2",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-minus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Remove",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            variant: "count",
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "999",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          border: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.none",
            },
          },
          borderBottom: {
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderWidth.HAIRLINE,
            },
            brightness: {
              type: Sdn.ValueType.EXACT,
              value: {
                unit: Sdn.Unit.PERCENT,
                value: 75,
              },
            },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.INPUT,
            variant: "checkbox",
            overrides: {
              checked: {
                type: Sdn.ValueType.EXACT,
                value: true,
              },
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.black",
              },
              accentColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Book hotels",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FILL,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.SHOW,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch1",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-plus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Add",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-minus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Remove",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            variant: "count",
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "999",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          border: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.none",
            },
          },
          borderBottom: {
            preset: { type: Sdn.ValueType.EMPTY, value: null },
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderWidth.HAIRLINE,
            },
            brightness: {
              type: Sdn.ValueType.EXACT,
              value: {
                unit: Sdn.Unit.PERCENT,
                value: 75,
              },
            },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.INPUT,
            variant: "checkbox",
            overrides: {
              checked: {
                type: Sdn.ValueType.EXACT,
                value: false,
              },
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.black",
              },
              accentColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Arrange day trips",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FILL,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.SHOW,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch1",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-plus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Add",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.SHOW,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch2",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-minus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Remove",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            variant: "count",
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "999",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          border: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.none",
            },
          },
          borderBottom: {
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderWidth.HAIRLINE,
            },
            brightness: {
              type: Sdn.ValueType.EXACT,
              value: {
                unit: Sdn.Unit.PERCENT,
                value: 75,
              },
            },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.INPUT,
            variant: "checkbox",
            overrides: {
              checked: {
                type: Sdn.ValueType.EXACT,
                value: false,
              },
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.black",
              },
              accentColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Attractions booked",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FILL,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-plus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Add",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-minus",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Remove",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.CHIP,
            variant: "count",
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.SHOW,
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@background.none",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch3",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "999",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLUl" },
}
