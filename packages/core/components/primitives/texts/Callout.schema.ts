import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Callout",
  id: Seldon.ComponentId.CALLOUT,
  intent: "Highlights important messages or warnings within a UI.",
  tags: ["callout", "alert", "notice", "info", "primitive", "message", "UI"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    display: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    htmlElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.HtmlElement.H6,
    },
    content: {
      type: Sdn.ValueType.EXACT,
      value: "Callout",
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
    color: {
      type: Sdn.ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
    },
    brightness: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    opacity: {
      type: Sdn.ValueType.EXACT,
      value: {
        value: 100,
        unit: Sdn.Unit.PERCENT,
      },
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
          type: Sdn.ValueType.EMPTY,
          value: null,
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
    font: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@font.callout",
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
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      letterSpacing: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
    },
    textAlign: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },

    textDecoration: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TextDecoration.NONE,
    },
    wrapText: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    lines: {
      type: Sdn.ValueType.EXACT,
      value: 2,
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
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "htmlElement" },
}
