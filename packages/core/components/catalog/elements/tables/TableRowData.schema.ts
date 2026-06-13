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
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
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
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@background.none",
        },
        image: { type: Sdn.ValueType.EMPTY, value: null },
        position: { type: Sdn.ValueType.EMPTY, value: null },
        size: { type: Sdn.ValueType.EMPTY, value: null },
        repeat: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        blendMode: { type: Sdn.ValueType.EMPTY, value: null },
        filter: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
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
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderTop: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.BorderStyle.SOLID,
      },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.gray",
      },
      width: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@borderWidth.xsmall",
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderRight: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderBottom: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderLeft: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    corners: {
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderCollapse: { type: Sdn.ValueType.EMPTY, value: null },
    gradient: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@gradient.none",
        },
        gradientType: { type: Sdn.ValueType.EMPTY, value: null },
        angle: { type: Sdn.ValueType.EMPTY, value: null },
        startColor: { type: Sdn.ValueType.EMPTY, value: null },
        startOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
        startPosition: { type: Sdn.ValueType.EMPTY, value: null },
        endColor: { type: Sdn.ValueType.EMPTY, value: null },
        endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
        endPosition: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.none",
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
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Andrei",
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
          cellAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_LEFT,
          },
        },
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Herasimchuk",
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
          cellAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_LEFT,
          },
        },
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Seldon",
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
          cellAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_LEFT,
          },
        },
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          content: {
            type: Sdn.ValueType.EXACT,
            value: "andrei@fakeseldon.com",
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
          cellAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_LEFT,
          },
        },
      },
      {
        component: Seldon.ComponentId.TABLE_DATA,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          content: {
            type: Sdn.ValueType.EXACT,
            value: "CEO",
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
          cellAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_LEFT,
          },
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLTr" },
}
