import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Calendar",
  id: Seldon.ComponentId.CALENDAR,
  intent:
    "Schema for a full calendar component supporting month, week, and day views with events, navigation, and selection logic.",
  tags: [
    "calendar",
    "ui",
    "month",
    "week",
    "day",
    "events",
    "navigation",
    "selection",
  ],
  level: Seldon.ComponentLevel.MODULE,
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
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.EMPTY,
      value: null,
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
      type: Sdn.ValueType.OPTION,
      value: Sdn.Gap.EVENLY_SPACED,
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
          wrapperElement: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.WrapperElement.THEAD,
          },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              wrapperElement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.WrapperElement.TR,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Jan" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Mon" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Tue" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Wed" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Thu" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Fri" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Sat" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Sun" },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          wrapperElement: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.WrapperElement.TBODY,
          },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              wrapperElement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.WrapperElement.TR,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "01" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "01" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "02" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "03" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "04" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              wrapperElement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.WrapperElement.TR,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "02" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "05" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "06" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "07" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "08" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "09" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "10" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "11" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              wrapperElement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.WrapperElement.TR,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "03" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "12" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "13" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "14" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "15" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "16" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "17" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "18" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              wrapperElement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.WrapperElement.TR,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "04" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "19" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "20" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "21" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "22" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "23" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "24" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "25" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              wrapperElement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.WrapperElement.TR,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "05" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "26" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "27" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "28" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "29" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "30" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "31" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "" },
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
  react: { returns: "HTMLTable" },
}
