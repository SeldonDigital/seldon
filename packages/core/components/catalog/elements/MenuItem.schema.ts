import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Menu Item",
  id: Seldon.ComponentId.MENU_ITEM,
  intent: "Single actionable row inside a menu.",
  tags: ["menu", "menuitem", "action", "row", "element", "UI"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.MENUITEM },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.EXACT, value: false },
    ariaDisabled: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.POINTER },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
    height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
    wrapChildren: { type: Sdn.ValueType.EXACT, value: false },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: {
        function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
        input: { basedOn: "#parent.background.color" },
      },
    },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
    ],
    border: {
      preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.none" },
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
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.ICON,
        overrides: {
          symbol: { type: Sdn.ValueType.OPTION, value: "__default__" },
          size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.small" },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              input: { basedOn: "#parent.background.color" },
            },
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Menu Item" },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              input: { basedOn: "#parent.background.color" },
            },
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
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "⌘K" },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          opacity: {
            type: Sdn.ValueType.EXACT,
            value: { unit: Sdn.Unit.PERCENT, value: 60 },
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              input: { basedOn: "#parent.background.color" },
            },
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
    ],
  },
  variants: [
    {
      id: "checkbox",
      label: "Checkbox Menu Item",
      intent: "Menu row that toggles a checked state.",
      overrides: {
        role: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.AriaRole.MENUITEMCHECKBOX,
        },
        ariaChecked: { type: Sdn.ValueType.EMPTY, value: null },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "✓" },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: { basedOn: "#parent.background.color" },
              },
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
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "Checkbox Item" },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: { basedOn: "#parent.background.color" },
              },
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
      ],
    },
    {
      id: "radio",
      label: "Radio Menu Item",
      intent: "Menu row that selects one option within a group.",
      overrides: {
        role: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.AriaRole.MENUITEMRADIO,
        },
        ariaChecked: { type: Sdn.ValueType.EMPTY, value: null },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "•" },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: { basedOn: "#parent.background.color" },
              },
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
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "Radio Item" },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: { basedOn: "#parent.background.color" },
              },
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
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLButton" },
}
