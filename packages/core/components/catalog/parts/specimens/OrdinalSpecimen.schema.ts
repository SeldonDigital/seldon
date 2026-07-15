import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Ordinal Specimen",
  id: Seldon.ComponentId.ORDINAL_SPECIMEN,
  intent:
    "Schema for an ordinal specimen that lays out theme ordinal scales as labeled chips in grouped grids beneath a legend.",
  tags: ["ordinal", "specimen", "scale", "spacing", "theme", "grid", "ui"],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.tight" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.tight" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.tight" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@margin.tight" },
    },
    padding: {
      top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
      right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
      bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
      left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
    },
    gap: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Gap.NONE,
    },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    columnStart: { type: Sdn.ValueType.EMPTY, value: null },
    columnSpan: { type: Sdn.ValueType.EMPTY, value: null },
    rowStart: { type: Sdn.ValueType.EMPTY, value: null },
    rowSpan: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Color.TRANSPARENT,
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.offBlack",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: {
        type: Sdn.ValueType.EXACT,
        value: { unit: Sdn.Unit.PERCENT, value: 50 },
      },
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
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      topRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
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
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.EVENLY_SPACED },
          margin: {
            top: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
            bottom: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Margin.NONE,
            },
            left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
          },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
          },
          borderBottom: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.hairline",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 50 },
            },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value:
                      "Use the controls below to see how various combinations of this theme's tokens work in practice.",
                  },
                  font: {
                    preset: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@font.normal",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.xsmall",
                    },
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              orientation: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Orientation.HORIZONTAL,
              },
              margin: {
                top: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@margin.cozy",
                },
                right: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
                bottom: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Margin.NONE,
                },
                left: { type: Sdn.ValueType.OPTION, value: Sdn.Margin.NONE },
              },
              padding: {
                top: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Padding.NONE,
                },
                right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
              },
              gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.EVENLY_SPACED },
            },
            children: [
              {
                component: Seldon.ComponentId.BUTTON,
                variant: "menu",
                children: [
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-margin",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "Margin" },
                    },
                  },
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-chevronDown",
                      },
                      size: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.AUTO_FIT,
                      },
                      color: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                      },
                      cursor: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Cursor.POINTER,
                      },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.BUTTON,
                variant: "menu",
                children: [
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-padding",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "Padding" },
                    },
                  },
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-chevronDown",
                      },
                      size: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.AUTO_FIT,
                      },
                      color: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                      },
                      cursor: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Cursor.POINTER,
                      },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.BUTTON,
                variant: "menu",
                children: [
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "seldon-gap",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "Gap" },
                    },
                  },
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-chevronDown",
                      },
                      size: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.AUTO_FIT,
                      },
                      color: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                      },
                      cursor: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Cursor.POINTER,
                      },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.BUTTON,
                variant: "menu",
                children: [
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-borderStyle",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "Border" },
                    },
                  },
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-chevronDown",
                      },
                      size: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.AUTO_FIT,
                      },
                      color: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                      },
                      cursor: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Cursor.POINTER,
                      },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.BUTTON,
                variant: "menu",
                children: [
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-roundedCorner",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "Corners" },
                    },
                  },
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "material-chevronDown",
                      },
                      size: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.AUTO_FIT,
                      },
                      color: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                      },
                      cursor: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Cursor.POINTER,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.NONE },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          { component: Seldon.ComponentId.ORDINAL_CHIP },
          { component: Seldon.ComponentId.ORDINAL_CHIP },
          { component: Seldon.ComponentId.ORDINAL_CHIP },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.NONE },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          { component: Seldon.ComponentId.ORDINAL_CHIP },
          {
            component: Seldon.ComponentId.ORDINAL_CHIP,
            overrides: {
              opacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 100 },
              },
            },
          },
          { component: Seldon.ComponentId.ORDINAL_CHIP },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.NONE },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          { component: Seldon.ComponentId.ORDINAL_CHIP },
          { component: Seldon.ComponentId.ORDINAL_CHIP },
          { component: Seldon.ComponentId.ORDINAL_CHIP },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
