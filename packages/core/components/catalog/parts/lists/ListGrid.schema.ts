import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Grid List",
  id: Seldon.ComponentId.LIST_GRID,
  intent:
    "Grid-based list layout schema for content cards, media tiles, or product showcases in a responsive format.",
  tags: [
    "list",
    "grid",
    "ui",
    "cards",
    "media",
    "layout",
    "tiles",
    "responsive",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    ariaLabel: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    direction: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
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
      top: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      right: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottom: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      left: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    padding: {
      top: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      right: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottom: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      left: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy",
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    color: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    brightness: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    opacity: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    background: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@background.none",
        },
        image: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        position: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        size: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        repeat: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        color: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        blendMode: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        filter: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        brightness: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        opacity: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.none",
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      color: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      width: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      brightness: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      opacity: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      collapse: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    borderTop: {
      preset: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      color: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      width: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      brightness: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      opacity: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      collapse: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    borderRight: {
      preset: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      color: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      width: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      brightness: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      opacity: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      collapse: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    borderBottom: {
      preset: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      color: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      width: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      brightness: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      opacity: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      collapse: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    borderLeft: {
      preset: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      color: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      width: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      brightness: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      opacity: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      collapse: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    corners: {
      topLeft: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      topRight: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottomLeft: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottomRight: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.none",
        },
        offsetX: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        offsetY: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        blur: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        color: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        brightness: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        opacity: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        spread: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
      },
    ],
    scroll: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Scroll.VERTICAL,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.AVATAR,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
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
                    value: "Default Title",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Details",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.AVATAR,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
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
                    value: "Default Title",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Details",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.AVATAR,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
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
                    value: "Default Title",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Details",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.AVATAR,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
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
                    value: "Default Title",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Details",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.AVATAR,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
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
                    value: "Default Title",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Details",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.AVATAR,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
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
                    value: "Default Title",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Details",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    family: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    style: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    weight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                    lineHeight: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                    textCase: {
                      type: Sdn.ValueType.EMPTY,
                      value: null,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLUl" },
}
