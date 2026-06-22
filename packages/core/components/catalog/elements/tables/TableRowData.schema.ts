import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Data Row",
  id: Seldon.ComponentId.TABLE_ROW_DATA,
  intent: "Displays data cells for a standard row in a data table.",
  tags: ["table", "row", "data", "cells", "UI", "list", "grid", "structured"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    cellAlign: {
      type: Sdn.ValueType.INHERIT,
      value: null,
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
    borderCollapse: { type: Sdn.ValueType.EMPTY, value: null },
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
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          columns: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
            },
          },
          rows: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
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
                value: "Andrei",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          columns: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
            },
          },
          rows: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
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
                value: "Herasimchuk",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          columns: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
            },
          },
          rows: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
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
                value: "Seldon",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          columns: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
            },
          },
          rows: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
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
                value: "andrei@fakeseldon.com",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          columns: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
            },
          },
          rows: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.NUMBER,
              value: 1,
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
                value: "CEO",
              },
            },
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLTr" },
}
