import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Item List",
  id: Seldon.ComponentId.LIST_STANDARD,
  intent:
    "General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.",
  tags: [
    "list",
    "standard",
    "vertical",
    "ui",
    "content",
    "items",
    "generic",
    "repeater",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
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
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
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
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
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
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      topRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
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
    scroll: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Scroll.VERTICAL,
    },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
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
                value: 50,
              },
            },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
      },
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
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
                value: 50,
              },
            },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
      },
      {
        component: Seldon.ComponentId.ITEM,
        overrides: {
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "contacts",
      label: "Contacts List",
      intent:
        "Defines a list layout for contact information such as name, email, phone, and avatar with optional actions.",
      children: [
        {
          component: Seldon.ComponentId.ITEM,
          variant: "avatar",
          overrides: {
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
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
                  value: 50,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.ITEM,
          variant: "avatar",
          overrides: {
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
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
                  value: 50,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.ITEM,
          variant: "avatar",
          overrides: {
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
            },
          },
        },
      ],
    },
    {
      id: "products",
      label: "Product List",
      intent:
        "List view tailored for product entries in catalogs or search results, supporting pricing and CTA buttons.",
      children: [
        {
          component: Seldon.ComponentId.ITEM,
          variant: "product",
          overrides: {
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
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
                  value: 50,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.ITEM,
          variant: "product",
          overrides: {
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
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
                  value: 50,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.ITEM,
          variant: "product",
          overrides: {
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
            },
          },
        },
      ],
    },
    {
      id: "todo",
      label: "Todo List",
      intent:
        "Task list layout with checkboxes, labels, and status chips for tracking to-do items.",
      children: [
        {
          component: Seldon.ComponentId.ITEM,
          variant: "todo",
          overrides: {
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
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
                  value: 50,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.INPUT,
              variant: "checkbox",
              overrides: {
                checked: { type: Sdn.ValueType.EXACT, value: false },
                align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
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
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.CHIP,
              variant: "assist",
            },
          ],
        },
        {
          component: Seldon.ComponentId.ITEM,
          variant: "todo",
          overrides: {
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
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
                  value: 50,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.INPUT,
              variant: "checkbox",
              overrides: {
                checked: { type: Sdn.ValueType.EXACT, value: true },
                align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
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
                content: { type: Sdn.ValueType.EXACT, value: "Book hotels" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.primary",
                },
              },
            },
            {
              component: Seldon.ComponentId.CHIP,
              variant: "input",
            },
            {
              component: Seldon.ComponentId.CHIP,
              variant: "input",
            },
          ],
        },
        {
          component: Seldon.ComponentId.ITEM,
          variant: "todo",
          overrides: {
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.compact",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.INPUT,
              variant: "checkbox",
              overrides: {
                checked: { type: Sdn.ValueType.EXACT, value: false },
                align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
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
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.CHIP,
              variant: "iconic",
            },
            {
              component: Seldon.ComponentId.CHIP,
            },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLUl" },
}
