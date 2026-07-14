import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Media Card",
  id: Seldon.ComponentId.MEDIA_CARD,
  intent:
    "Visual-first media card where the thumbnail dominates, supported by a title, creator, metrics, and a play action.",
  tags: [
    "card",
    "media",
    "video",
    "thumbnail",
    "creator",
    "play",
    "streaming",
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.tight",
    },
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
            value: "https://static.seldon.app/background-default-dark.jpg",
          },
          imageFit: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.ImageFit.COVER,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.EXACT,
            value: { unit: Sdn.Unit.PX, value: 200 },
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
          padding: {
            top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.cozy",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Designing with cards",
              },
              lines: {
                type: Sdn.ValueType.EXACT,
                value: 2,
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
              margin: {
                top: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@margin.cozy",
                },
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.compact",
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
                      width: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@dimension.medium",
                      },
                      height: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@dimension.medium",
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
                    variant: "label",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Sir Bentley",
                      },
                      font: {
                        weight: {
                          type: Sdn.ValueType.THEME_ORDINAL,
                          value: "@fontWeight.medium",
                        },
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "1.2M views · 2 days ago",
                      },
                      font: {
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
          },
          {
            component: Seldon.ComponentId.BUTTON,
            overrides: {
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER,
              },
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
                    value: "material-playArrow",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Play now",
                  },
                  width: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Resize.FIT,
                  },
                },
              },
            ],
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
        "Dense media card showing only the thumbnail, title, and creator for browse grids.",
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "https://static.seldon.app/background-default-dark.jpg",
            },
            imageFit: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.ImageFit.COVER,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 160 },
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
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.cozy",
              },
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
                  value: "Designing with cards",
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
                  value: "Seldon Studio",
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
