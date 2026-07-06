import * as Sdn from "../../../../properties";
import * as Seldon from "../../../constants";
import { ComponentExport, ComponentSchema } from "../../../types";





export const schema = {
  name: "Type Specimen",
  id: Seldon.ComponentId.TYPE_SPECIMEN,
  intent:
    "Schema for a type specimen panel that shows typography for a specific font.",
  tags: ["typography", "type", "specimen", "font", "ui", "panel", "text"],
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
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
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
        value: "@swatch.black",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 75,
        },
      },
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
      topLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
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
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "subheading",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Font Name",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Font weights",
          },
          margin: {
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.compact",
            },
          },
          padding: {
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
          borderBottom: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.hairline",
            },
          },
          font: {
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "abcdefghijklmnopqrstuvwxyz",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value:
              "0123456789 ¿ ? ¡ ! & @ ‘ ’ “ ” « » % * ^ # $ £ € ¢ / ( ) [ ] { } . , ® ©",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "The quick brown fox jumps over the lazy dog.",
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.compact",
            },
          },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
          borderTop: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.hairline",
            },
          },
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}