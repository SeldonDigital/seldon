import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Top Bar",
  id: Seldon.ComponentId.BAR_TOP,
  intent: "Provides controls for the top of an application.",
  tags: [
    "navigation",
    "topbar",
    "menus",
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
        type: Sdn.ValueType.EXACT,
        value: {
          value: 0,
          unit: Sdn.Unit.PX,
        },
      },
      right: {
        type: Sdn.ValueType.EXACT,
        value: {
          value: 0,
          unit: Sdn.Unit.PX,
        },
      },
      bottom: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      left: {
        type: Sdn.ValueType.EXACT,
        value: {
          value: 0,
          unit: Sdn.Unit.PX,
        },
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
          type: Sdn.ValueType.EMPTY,
          value: null,
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
          type: Sdn.ValueType.EMPTY,
          value: null,
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
            value: Sdn.Resize.FILL,
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
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          background: [
            {
              preset: {
                type: Sdn.ValueType.EMPTY,
                value: null,
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
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PERCENT,
                  value: 100,
                },
              },
            },
          ],
          border: {
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
            value: Sdn.Align.CENTER,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          background: [
            {
              preset: {
                type: Sdn.ValueType.EMPTY,
                value: null,
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
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PERCENT,
                  value: 100,
                },
              },
            },
          ],
          border: {
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
            value: Sdn.Align.CENTER_RIGHT,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
          background: [
            {
              preset: {
                type: Sdn.ValueType.EMPTY,
                value: null,
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
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PERCENT,
                  value: 100,
                },
              },
            },
          ],
          border: {
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
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
