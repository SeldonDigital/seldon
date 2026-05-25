import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Table",
  id: Seldon.ComponentId.TABLE,
  intent:
    "Schema for a standard data table with configurable columns, sorting, filtering, and row rendering options.",
  tags: [
    "table",
    "standard",
    "ui",
    "data",
    "columns",
    "rows",
    "filter",
    "sort",
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
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    cellAlign: {
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
    borderCollapse: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.BorderCollapse.COLLAPSE,
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
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            children: [
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Name" },
                  columns: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.NUMBER, value: 2 },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Details" },
                  columns: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.NUMBER, value: 3 },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            children: [
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "First" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Last" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Email" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Location" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_HEADER,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Role" },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        children: [
          {
            component: Seldon.ComponentId.TABLE_ROW_DATA,
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Hari" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Seldon" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "hari@fakeseldon.com",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Trantor" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Psychohistorian",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.TABLE_ROW_DATA,
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Salvor" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Hardin" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "salvor@terminus.gov",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Foundation" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Mayor" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.TABLE_ROW_DATA,
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Hober" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Mallow" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "hober@korell.trade",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Korell" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Merchant" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.TABLE_ROW_DATA,
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Bel" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Riose" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "bel.riose@empire.mil",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Empire" },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Military" },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        children: [
          {
            component: Seldon.ComponentId.TABLE_ROW_DATA,
            children: [
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  display: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Display.EXCLUDE,
                  },
                },
              },
              {
                component: Seldon.ComponentId.TABLE_DATA,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Total: 4" },
                  columns: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.NUMBER, value: 5 },
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
  react: { returns: "HTMLTable" },
}
