import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Profile Card",
  id: Seldon.ComponentId.PROFILE_CARD,
  intent:
    "Identity card showing an avatar, name, role, and a single connect action, kept to a few data points.",
  tags: [
    "card",
    "profile",
    "user",
    "avatar",
    "identity",
    "follow",
    "social",
    "UI",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
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
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      left: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.tight",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
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
      topLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
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
          value: "@shadow.xlight",
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
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.AVATAR,
        children: [
          {
            component: Seldon.ComponentId.IMAGE,
            overrides: {
              source: {
                type: Sdn.ValueType.EXACT,
                value: "/avatar-bentley.png",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "subtitle",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Product Designer",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          margin: {
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
          textAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.TextAlign.CENTER,
          },
        },
      },
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-add",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Follow",
              },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "compact",
      label: "Compact",
      intent:
        "Horizontal hover-style profile card with avatar, identity, and a single message action.",
      overrides: {
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
          value: Sdn.Resize.FILL,
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.cozy",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.AVATAR,
          children: [
            {
              component: Seldon.ComponentId.IMAGE,
              overrides: {
                source: {
                  type: Sdn.ValueType.EXACT,
                  value: "/avatar-bentley.png",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Sir Bentley",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "subtitle",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Product Designer",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Message",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "withStats",
      label: "Stats",
      intent:
        "Profile card that adds a compact stats row beneath the identity block.",
      children: [
        {
          component: Seldon.ComponentId.AVATAR,
          children: [
            {
              component: Seldon.ComponentId.IMAGE,
              overrides: {
                source: {
                  type: Sdn.ValueType.EXACT,
                  value: "/avatar-bentley.png",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Sir Bentley",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            textAlign: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextAlign.CENTER,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "subtitle",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Product Designer",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            textAlign: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextAlign.CENTER,
            },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.cozy",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.VERTICAL,
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
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.tight",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "title",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "1.2k",
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FIT,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "tagline",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Followers",
                    },
                  },
                },
              ],
            },
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.VERTICAL,
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
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.tight",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "title",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "320",
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FIT,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "tagline",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Following",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-add",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Follow",
                },
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
