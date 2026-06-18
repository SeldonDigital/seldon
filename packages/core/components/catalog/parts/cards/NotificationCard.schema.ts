import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Notification Card",
  id: Seldon.ComponentId.NOTIFICATION_CARD,
  intent:
    "Interrupting alert card with a status icon, title, short message, timestamp, and at most two quiet actions.",
  tags: [
    "card",
    "notification",
    "alert",
    "toast",
    "message",
    "snackbar",
    "status",
    "UI",
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
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_LEFT,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
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
          value: "@shadow.light",
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.ICON,
        overrides: {
          symbol: {
            type: Sdn.ValueType.OPTION,
            value: "material-info",
          },
          size: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@size.medium",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
                value: "Update available",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "A new version is ready to install.",
              },
              lines: {
                type: Sdn.ValueType.EXACT,
                value: 2,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "2 min ago",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.BUTTON,
        variant: "label",
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
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
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Undo",
              },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "success",
      label: "Success Notification",
      intent:
        "Positive confirmation toast with a success icon and a single acknowledge action.",
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-checkCircle",
            },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@size.medium",
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.custom2",
            },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
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
                  value: "Changes saved",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Just now",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Dismiss",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "alertNotification",
      label: "Alert Notification",
      intent:
        "Warning alert with a status icon, message, and two actions for dismiss or act.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Orientation.VERTICAL,
        },
      },
      children: [
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
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.cozy",
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-warning",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.large",
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.custom1",
                },
              },
            },
            {
              component: Seldon.ComponentId.FRAME,
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "title",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Storage almost full",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "description",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "You are using 95% of your available space.",
                    },
                    lines: {
                      type: Sdn.ValueType.EXACT,
                      value: 2,
                    },
                    font: {
                      family: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@fontFamily.primary",
                      },
                      style: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.FontStyle.NORMAL,
                      },
                      weight: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@fontWeight.light",
                      },
                      size: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@fontSize.xsmall",
                      },
                      lineHeight: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@lineHeight.compact",
                      },
                      textCase: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.TextCasing.NORMAL,
                      },
                      letterSpacing: { type: Sdn.ValueType.EMPTY, value: null },
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@font.callout",
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.BAR,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "label",
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.SHOW,
                },
                background: [
                  {
                    kind: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.BackgroundKind.NONE,
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.swatch1",
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
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Dismiss",
                    },
                  },
                },
              ],
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "label",
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.SHOW,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Upgrade",
                    },
                  },
                },
              ],
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
