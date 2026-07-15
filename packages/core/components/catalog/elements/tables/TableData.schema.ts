import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Table Data",
  id: Seldon.ComponentId.TABLE_DATA,
  intent:
    "A standard table cell that hosts cell content such as text, status chips, icons, or stacked lines.",
  tags: ["table", "cell", "data", "td", "element", "grid", "content"],
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
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.tight",
    },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    columns: { type: Sdn.ValueType.EMPTY, value: null },
    rows: { type: Sdn.ValueType.EMPTY, value: null },
    cellAlign: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
    },
    color: {
      type: Sdn.ValueType.COMPUTED,
      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
    },
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
    borderCollapse: { type: Sdn.ValueType.EMPTY, value: null },
    corners: {
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
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
      type: Sdn.ValueType.OPTION,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "Cell" },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.body",
            },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.medium",
            },
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "numeric",
      label: "Numeric Cell",
      intent: "Cell for numbers and currency, right-aligned.",
      overrides: {
        cellAlign: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_RIGHT,
        },
      },
    },
    {
      id: "positive",
      label: "Positive Cell",
      intent: "Numeric cell tinted green to mark a positive or credit value.",
      overrides: {
        cellAlign: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_RIGHT,
        },
        color: {
          type: Sdn.ValueType.EXACT,
          value: "#1F9D55",
        },
      },
    },
    {
      id: "negative",
      label: "Negative Cell",
      intent: "Numeric cell tinted red to mark a negative or debit value.",
      overrides: {
        cellAlign: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_RIGHT,
        },
        color: {
          type: Sdn.ValueType.EXACT,
          value: "#E3342F",
        },
      },
    },
    {
      id: "status",
      label: "Status Cell",
      intent: "Cell that shows a status as a colored chip rather than text.",
      children: [
        {
          component: Seldon.ComponentId.CHIP,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Status" },
              },
            },
          ],
        },
      ],
    },
    {
      id: "twoLine",
      label: "Two Line Cell",
      intent:
        "Cell stacking a primary line over a muted secondary line, for name and detail pairs.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Primary" },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.subtitle",
                  },
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Secondary" },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.PERCENT, value: 60 },
                },
                font: {
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.small",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "input",
      label: "Table Input",
      intent: "Table cell that holds an editable input control.",
      children: [
        {
          component: Seldon.ComponentId.INPUT,
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLTd" },
}
