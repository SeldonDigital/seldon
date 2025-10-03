import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Header Row",
  id: Seldon.ComponentId.TABLE_ROW_HEADER,
  intent: "Defines the header row with labels for table columns.",
  tags: [
    "table",
    "header",
    "columns",
    "row",
    "label",
    "UI",
    "grid",
    "headings",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.STUB,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        display: {
          type: Sdn.ValueType.PRESET,
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "First Column",
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        display: {
          type: Sdn.ValueType.PRESET,
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Second Column",
        },
        cellAlign: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER_LEFT,
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        display: {
          type: Sdn.ValueType.PRESET,
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Third Column",
        },
        cellAlign: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER_LEFT,
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        display: {
          type: Sdn.ValueType.PRESET,
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Fourth Column",
        },
        cellAlign: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER_LEFT,
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        display: {
          type: Sdn.ValueType.PRESET,
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Fifth Column",
        },
        cellAlign: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER_LEFT,
        },
      },
    },
  ],
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    cellAlign: {
      type: Sdn.ValueType.INHERIT,
      value: null,
    },
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.PRESET,
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

    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      topStyle: { type: Sdn.ValueType.EMPTY, value: null },
      topColor: { type: Sdn.ValueType.EMPTY, value: null },
      topWidth: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      rightStyle: { type: Sdn.ValueType.EMPTY, value: null },
      rightColor: { type: Sdn.ValueType.EMPTY, value: null },
      rightWidth: { type: Sdn.ValueType.EMPTY, value: null },
      rightOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftStyle: { type: Sdn.ValueType.EMPTY, value: null },
      leftColor: { type: Sdn.ValueType.EMPTY, value: null },
      leftWidth: { type: Sdn.ValueType.EMPTY, value: null },
      leftOpacity: { type: Sdn.ValueType.EMPTY, value: null },
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

    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLTr" },
}
