import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Select",
  id: Seldon.ComponentId.SELECT,
  intent:
    "Primitive dropdown component for choosing a single value from a list.",
  tags: ["select", "dropdown", "input", "form", "primitive", "menu", "choice"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.INPUT,
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
    clip: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
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
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@background.none",
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
          value: 25,
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
    font: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@font.body",
      },
      family: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      weight: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      size: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      lineHeight: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      textCase: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.TextCasing.NORMAL,
      },
      letterSpacing: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },

    textDecoration: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TextDecoration.NONE,
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.none",
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
        component: Seldon.ComponentId.OPTION,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Option 01",
          },
        },
      },
      {
        component: Seldon.ComponentId.OPTION,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Option 02",
          },
        },
      },
      {
        component: Seldon.ComponentId.OPTION,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Option 03",
          },
        },
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLSelect" },
}
