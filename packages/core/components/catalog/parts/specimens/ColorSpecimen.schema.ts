import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Color Specimen",
  id: Seldon.ComponentId.COLOR_SPECIMEN,
  intent:
    "Schema for a color specimen that lays out theme swatches as labeled color chips in grouped grids.",
  tags: ["color", "specimen", "palette", "swatch", "theme", "grid", "ui"],
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.tight",
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
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
      preset: { type: Sdn.ValueType.EMPTY, value: null },
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
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 2 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.white",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "White" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 2 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.gray",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Gray" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 2 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.black",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Black" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 3 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.foreground",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Foreground" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 3 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.background",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Background" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 3 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.offWhite",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Off White" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 3 },
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.offBlack",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Off Black" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              columnSpan: { type: Sdn.ValueType.EXACT, value: 2 },
            },
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch1",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Tint 1" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch2",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Tint 2" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch3",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Tint 3" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.swatch4",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Tint 4" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          columns: { type: Sdn.ValueType.EXACT, value: 6 },
        },
        children: [
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.active",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Active" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.punch",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Punch" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.positive",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Positive" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.negative",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Negative" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.warning",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Warning" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
          {
            component: Seldon.ComponentId.COLOR_CHIP,
            overrides: {
              background: [
                {
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.accent",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Accent" },
                },
              },
              { component: Seldon.ComponentId.TEXT },
              { component: Seldon.ComponentId.TEXT },
            ],
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
