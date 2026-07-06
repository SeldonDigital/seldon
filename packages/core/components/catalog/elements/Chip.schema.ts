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
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.xsmall",
    },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.POINTER,
    },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
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
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
      right: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
      bottom: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
      },
      left: {
        type: Sdn.ValueType.COMPUTED,
        value: Sdn.ComputedFunction.OPTICAL_PADDING,
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
        value: Sdn.ComputedFunction.MATCH_COLOR,
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
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    ariaPressed: { type: Sdn.ValueType.EMPTY, value: null },
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
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.normal",
            },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.AUTO_FIT,
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
              value: Sdn.ComputedFunction.AUTO_FIT,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.normal",
              },
              size: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.AUTO_FIT,
              },
            },
          },
        },
      ],
    },
    {
      id: "iconic",
      label: "Iconic",
      intent: "Iconic chip with a single icon and no label.",
      overrides: {
        buttonSize: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@fontSize.small",
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
        },
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
              value: "material-inbox",
            },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.AUTO_FIT,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
              value: Sdn.ComputedFunction.AUTO_FIT,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.normal",
              },
              size: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.AUTO_FIT,
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
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.normal",
              },
              size: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.AUTO_FIT,
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
              value: Sdn.ComputedFunction.AUTO_FIT,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.normal",
              },
              size: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.AUTO_FIT,
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
