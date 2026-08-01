import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Menu",
  id: Seldon.ComponentId.MENU,
  intent: "Floating list of actions anchored to a trigger.",
  tags: ["menu", "dropdown", "actions", "part", "overlay", "UI"],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.POINTER },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
    height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: { type: Sdn.ValueType.OPTION, value: false },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
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
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.compact" },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.moderate",
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
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.MENU },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.MENU_ITEM,
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.STUB },
        },
      },
      {
        component: Seldon.ComponentId.MENU_ITEM,
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
        },
      },
      {
        component: Seldon.ComponentId.HR,
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
          margin: {
            top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.tight" },
            right: { type: Sdn.ValueType.EMPTY, value: null },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            left: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
      },
      {
        component: Seldon.ComponentId.MENU_ITEM,
        variant: "checkbox",
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
        },
      },
      {
        component: Seldon.ComponentId.MENU_ITEM,
        variant: "radio",
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
        },
      },
    ],
  },
  variants: [
    {
      id: "options",
      label: "Options",
      intent: "Menu of selectable options for a combobox or select.",
      overrides: {
        width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
        padding: {
          top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.LISTBOX },
      },
      children: [
        {
          component: Seldon.ComponentId.MENU_ITEM,
          variant: "option",
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.STUB },
          },
        },
        {
          component: Seldon.ComponentId.MENU_ITEM,
          variant: "option",
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
          },
        },
        {
          component: Seldon.ComponentId.MENU_ITEM,
          variant: "option",
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
          },
        },
      ],
    },
    {
      id: "groupedOptions",
      label: "Grouped Options",
      intent: "Options menu whose rows are organized into labeled groups.",
      overrides: {
        width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
        padding: {
          top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.LISTBOX },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.STUB },
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.GROUP },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Group A" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                margin: {
                  left: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@margin.compact",
                  },
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                brightness: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.PERCENT, value: 50 },
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
            { component: Seldon.ComponentId.MENU_ITEM, variant: "option" },
            {
              component: Seldon.ComponentId.MENU_ITEM,
              variant: "option",
              overrides: {
                display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.HR,
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.compact",
              },
              right: { type: Sdn.ValueType.EMPTY, value: null },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.compact",
              },
              left: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.MOCK },
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.GROUP },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Group B" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                margin: {
                  left: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@margin.compact",
                  },
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                brightness: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.PERCENT, value: 50 },
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
            { component: Seldon.ComponentId.MENU_ITEM, variant: "option" },
            { component: Seldon.ComponentId.MENU_ITEM, variant: "option" },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
