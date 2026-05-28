import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Navigation Bar",
  id: Seldon.ComponentId.BAR_NAVIGATION,
  intent:
    "Provides primary navigation controls for traversing sections or views.",
  tags: [
    "navigation",
    "navbar",
    "menu",
    "UI",
    "header",
    "section",
    "links",
    "routing",
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
    position: {
      top: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      right: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottom: {
        type: Sdn.ValueType.EXACT,
        value: {
          value: 0,
          unit: Sdn.Unit.PX,
        },
      },
      left: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
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
      value: "@gap.compact",
    },
    rotation: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
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
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.black",
      },
      width: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 75,
        },
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
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 100,
        },
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
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
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
              value: "@border.normal",
            },
            style: {
              type: Sdn.ValueType.EMPTY,
              value: null,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.MATCH,
                input: {
                  basedOn: "#background.color",
                },
              },
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
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-home",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@size.medium",
              },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Home",
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
                  value: "@fontSize.xsmall",
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
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
              value: "@border.normal",
            },
            style: {
              type: Sdn.ValueType.EMPTY,
              value: null,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.MATCH,
                input: {
                  basedOn: "#background.color",
                },
              },
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
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-search",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@size.medium",
              },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Search",
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
                  value: "@fontSize.xsmall",
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
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
              value: "@border.normal",
            },
            style: {
              type: Sdn.ValueType.EMPTY,
              value: null,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.MATCH,
                input: {
                  basedOn: "#background.color",
                },
              },
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
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-favorite",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@size.medium",
              },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Favorites",
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
                  value: "@fontSize.xsmall",
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
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
              value: "@border.normal",
            },
            style: {
              type: Sdn.ValueType.EMPTY,
              value: null,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.MATCH,
                input: {
                  basedOn: "#background.color",
                },
              },
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
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-accountCircle",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@size.medium",
              },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Profile",
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
                  value: "@fontSize.xsmall",
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
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
              value: "@border.normal",
            },
            style: {
              type: Sdn.ValueType.EMPTY,
              value: null,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.MATCH,
                input: {
                  basedOn: "#background.color",
                },
              },
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
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-settings",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@size.medium",
              },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Settings",
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
                  value: "@fontSize.xsmall",
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
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
