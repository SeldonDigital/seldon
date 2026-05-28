import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Iconic Input",
  id: Seldon.ComponentId.INPUT_ICONIC,
  intent: "Input field enhanced with icons for context or actions.",
  tags: [
    "input",
    "icon",
    "field",
    "text",
    "search",
    "form",
    "decorated",
    "control",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.INPUT,
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
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      bottom: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      left: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.tight",
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
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
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
        value: "@border.hairline",
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
          value: 25,
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
        component: Seldon.ComponentId.ICON,
        overrides: {
          symbol: {
            type: Sdn.ValueType.OPTION,
            value: "__default__",
          },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          buttonSize: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@fontSize.xsmall",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
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
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-chevronDown",
              },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              display: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Display.EXCLUDE,
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
