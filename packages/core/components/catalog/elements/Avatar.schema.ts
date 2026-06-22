import * as Sdn from "../../../properties"
import { ComputedFunction } from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Avatar",
  id: Seldon.ComponentId.AVATAR,
  intent:
    "Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.",
  tags: [
    "avatar",
    "user image",
    "profile",
    "identity",
    "initials",
    "picture",
    "circle",
    "UI element",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.DEFAULT,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
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
        value: "@border.none",
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
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.IMAGE,
        overrides: {
          source: {
            type: Sdn.ValueType.EXACT,
            value: "/avatar-user.png",
          },
          width: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@dimension.large",
          },
          height: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@dimension.large",
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
        },
      },
    ],
  },
  variants: [
    {
      id: "round",
      label: "Round Border",
      intent:
        "Renders a round bordered avatar for representing users, roles, or statuses.",
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "/avatar-user.png",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
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
          },
        },
      ],
    },
    {
      id: "square",
      label: "Square Border",
      intent:
        "Renders a round bordered avatar for representing users, roles, or statuses.",
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "/avatar-user.png",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
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
      id: "badge",
      label: "Badged",
      intent: "Renders a badged avatar for representing notifications.",
      overrides: {
        clip: {
          type: Sdn.ValueType.EXACT,
          value: false,
        },
      },
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "/avatar-user.png",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
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
          },
        },
        {
          component: Seldon.ComponentId.CHIP,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.tiny",
            },
            position: {
              right: {
                type: Sdn.ValueType.EXACT,
                value: { value: -1, unit: Sdn.Unit.REM },
              },
              bottom: {
                type: Sdn.ValueType.EXACT,
                value: { value: 0, unit: Sdn.Unit.REM },
              },
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.white",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "99" },
                font: {
                  size: {
                    type: Sdn.ValueType.COMPUTED,
                    value: {
                      function: ComputedFunction.AUTO_FIT,
                      input: {
                        basedOn: "#parent.buttonSize",
                        factor: 0.8,
                      },
                    },
                  },
                  weight: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontWeight.bold",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "stacked",
      label: "Stacked",
      intent: "Renders a stacked set of avatars.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.EXACT,
          value: Sdn.Orientation.HORIZONTAL,
        },
        clip: {
          type: Sdn.ValueType.EXACT,
          value: false,
        },
      },
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "/avatar-user.png",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
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
          },
        },
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "/avatar-user.png",
            },
            position: {
              right: {
                type: Sdn.ValueType.EXACT,
                value: { value: -2.5, unit: Sdn.Unit.REM },
              },
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
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
                  value: "@shadow.moderate",
                },
                offsetX: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 0, unit: Sdn.Unit.PX },
                },
                offsetY: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 0, unit: Sdn.Unit.PX },
                },
                blur: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 0, unit: Sdn.Unit.PX },
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.white",
                },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PERCENT },
                },
                spread: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@spread.xsmall",
                },
              },
            ],
          },
        },
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "/avatar-user.png",
            },
            position: {
              right: {
                type: Sdn.ValueType.EXACT,
                value: { value: -5, unit: Sdn.Unit.REM },
              },
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
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
                  value: "@shadow.moderate",
                },
                offsetX: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 0, unit: Sdn.Unit.PX },
                },
                offsetY: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 0, unit: Sdn.Unit.PX },
                },
                blur: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 0, unit: Sdn.Unit.PX },
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.white",
                },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PERCENT },
                },
                spread: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@spread.xsmall",
                },
              },
            ],
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
