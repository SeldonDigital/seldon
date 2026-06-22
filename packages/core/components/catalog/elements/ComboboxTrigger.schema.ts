import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Combobox Trigger",
  id: Seldon.ComponentId.COMBOBOX_TRIGGER,
  intent: "Field box that holds the combobox input and opens its listbox.",
  tags: ["combobox", "trigger", "input", "field", "select", "element", "UI"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
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
        input: { basedOn: "#background.color" },
      },
    },
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
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.black",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: { unit: Sdn.Unit.PERCENT, value: 25 },
      },
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
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.EXACT, value: false },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.INPUT,
        variant: "combobox",
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          padding: {
            top: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 0 },
            },
            right: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 0 },
            },
            bottom: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 0 },
            },
            left: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 0 },
            },
          },
          background: [
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.NONE,
              },
            },
          ],
          border: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.none",
            },
          },
          corners: {
            topLeft: { type: Sdn.ValueType.EMPTY, value: null },
            topRight: { type: Sdn.ValueType.EMPTY, value: null },
            bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
            bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
      },
      {
        component: Seldon.ComponentId.ICON,
        overrides: {
          symbol: {
            type: Sdn.ValueType.OPTION,
            value: "material-chevronDown",
          },
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
    ],
  },
  variants: [
    {
      id: "iconic",
      label: "Iconic Combobox Trigger",
      intent: "Combobox field with a leading icon, input, and chevron.",
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
          component: Seldon.ComponentId.INPUT,
          variant: "combobox",
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            padding: {
              top: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
              right: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
              bottom: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
              left: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
            },
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.NONE,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.none",
              },
            },
            corners: {
              topLeft: { type: Sdn.ValueType.EMPTY, value: null },
              topRight: { type: Sdn.ValueType.EMPTY, value: null },
              bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
              bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-chevronDown",
            },
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
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
