import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Button",
  id: Seldon.ComponentId.BUTTON,
  intent:
    "Standard button for triggering actions like submit, confirm, or cancel.",
  tags: [
    "button",
    "action",
    "UI",
    "primary",
    "click",
    "control",
    "submit",
    "call to action",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
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
      value: Sdn.Align.CENTER,
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
    ariaDisabled: { type: Sdn.ValueType.EMPTY, value: null },
    ariaExpanded: { type: Sdn.ValueType.EMPTY, value: null },
    ariaPressed: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHasPopup: { type: Sdn.ValueType.EMPTY, value: null },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.ICON,
        overrides: {
          symbol: {
            type: Sdn.ValueType.OPTION,
            value: "seldon-component",
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
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Button",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.label",
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
      id: "label",
      label: "Simple",
      intent: "Text-only button with a single label and no icon.",
      overrides: {
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.cozy",
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
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Button",
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.label",
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
      intent: "Iconic button with a single icon and no label.",
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
            value: "@padding.compact",
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "seldon-component",
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
      id: "tools",
      label: "Tools",
      intent: "Vertical group of tool buttons.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Orientation.VERTICAL,
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
            value: "@padding.compact",
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        corners: {
          topLeft: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
          topRight: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
          bottomLeft: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
          bottomRight: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
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
              value: "@swatch.swatch4",
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
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
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
                value: "@padding.compact",
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
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
                value: "@padding.compact",
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
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
                value: "@padding.compact",
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
        },
      ],
    },
    {
      id: "segmented",
      label: "Segmented",
      intent:
        "Combines related actions into a segmented control with selectable options.",
      overrides: {
        padding: {
          top: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Padding.NONE,
          },
          right: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Padding.NONE,
          },
          bottom: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Padding.NONE,
          },
          left: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Padding.NONE,
          },
        },
        gap: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Gap.EVENLY_SPACED,
        },
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.none",
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
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
            corners: {
              topLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.ROUNDED,
              },
              topRight: { type: Sdn.ValueType.EMPTY, value: null },
              bottomLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.ROUNDED,
              },
              bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
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
            corners: {
              topLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              topRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
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
            corners: {
              topLeft: { type: Sdn.ValueType.EMPTY, value: null },
              topRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.ROUNDED,
              },
              bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.ROUNDED,
              },
            },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLButton", forwardRef: "HTMLButtonElement" },
}
