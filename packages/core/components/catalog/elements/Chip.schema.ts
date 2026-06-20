import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Chip",
  id: Seldon.ComponentId.CHIP,
  intent:
    "Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.",
  tags: ["chip", "ui", "tag", "label", "badge", "filter", "category", "pill"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    ariaPressed: { type: Sdn.ValueType.EMPTY, value: null },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.xsmall",
    },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.POINTER,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
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
      top: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.5,
          },
        },
      },
      right: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.875,
          },
        },
      },
      bottom: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.5,
          },
        },
      },
      left: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.75,
          },
        },
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.normal",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.MATCH,
          input: {
            basedOn: "#background.color",
          },
        },
      },
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
      topLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      topRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
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
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          content: {
            type: Sdn.ValueType.EXACT,
            value: "999",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              input: {
                basedOn: "#parent.background.color",
              },
            },
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.normal",
            },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#parent.buttonSize",
                  factor: 0.8,
                },
              },
            },
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "assist",
      label: "Assist",
      intent:
        "Smart or automated action suggested to the user, with a leading icon and label.",
      overrides: {
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-calendarToday",
            },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.AUTO_FIT,
                input: { basedOn: "#parent.buttonSize", factor: 0.8 },
              },
            },
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
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            content: { type: Sdn.ValueType.EXACT, value: "Assist" },
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
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.AUTO_FIT,
                  input: { basedOn: "#parent.buttonSize", factor: 0.8 },
                },
              },
            },
          },
        },
      ],
    },
    {
      id: "filter",
      label: "Filter",
      intent:
        "Selectable tag that filters content, with a leading checkmark and label.",
      overrides: {
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.none",
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            symbol: { type: Sdn.ValueType.OPTION, value: "material-check" },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.AUTO_FIT,
                input: { basedOn: "#parent.buttonSize", factor: 0.8 },
              },
            },
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
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            content: { type: Sdn.ValueType.EXACT, value: "Filter" },
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
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.AUTO_FIT,
                  input: { basedOn: "#parent.buttonSize", factor: 0.8 },
                },
              },
            },
          },
        },
      ],
    },
    {
      id: "input",
      label: "Input",
      intent:
        "Represents user-entered information, with a label and a trailing remove icon.",
      overrides: {
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            content: { type: Sdn.ValueType.EXACT, value: "Input" },
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
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.AUTO_FIT,
                  input: { basedOn: "#parent.buttonSize", factor: 0.8 },
                },
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            symbol: { type: Sdn.ValueType.OPTION, value: "material-close" },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.AUTO_FIT,
                input: { basedOn: "#parent.buttonSize", factor: 0.8 },
              },
            },
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
    {
      id: "suggestion",
      label: "Suggestion",
      intent: "Dynamically generated suggestion shown as a label only.",
      overrides: {
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
            content: { type: Sdn.ValueType.EXACT, value: "Suggestion" },
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
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.AUTO_FIT,
                  input: { basedOn: "#parent.buttonSize", factor: 0.8 },
                },
              },
            },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: {
    returns: "HTMLSpan",
  },
}
