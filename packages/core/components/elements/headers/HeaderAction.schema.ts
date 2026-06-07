import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Action Header",
  id: Seldon.ComponentId.HEADER_ACTION,
  intent: "Container for header-level action buttons or controls.",
  tags: [
    "header",
    "actions",
    "buttons",
    "top bar",
    "controls",
    "toolbar",
    "UI",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
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
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER,
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
    gap: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Gap.EVENLY_SPACED,
    },
    rotation: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
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
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.none",
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
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      topRight: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottomLeft: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      bottomRight: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
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
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 40,
            },
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          margin: {
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Header Title",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Provide additional context or information.",
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.tagline",
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
              },
              lines: {
                type: Sdn.ValueType.EXACT,
                value: 2,
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        children: [
          {
            component: Seldon.ComponentId.BUTTON,
            overrides: {
              padding: {
                top: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.5 },
                  },
                },
                right: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.875 },
                  },
                },
                bottom: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.5 },
                  },
                },
                left: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.75 },
                  },
                },
              },
              corners: {
                topLeft: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Corner.ROUNDED,
                },
                topRight: { type: Sdn.ValueType.EMPTY, value: null },
                bottomLeft: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Corner.ROUNDED,
                },
                bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
              },
            },
          },
          {
            component: Seldon.ComponentId.BUTTON,
            overrides: {
              padding: {
                top: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.5 },
                  },
                },
                right: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.75 },
                  },
                },
                bottom: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.5 },
                  },
                },
                left: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.75 },
                  },
                },
              },
              corners: {
                topLeft: { type: Sdn.ValueType.EMPTY, value: null },
                topRight: { type: Sdn.ValueType.EMPTY, value: null },
                bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
                bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
              },
            },
          },
          {
            component: Seldon.ComponentId.BUTTON,
            overrides: {
              padding: {
                top: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.5 },
                  },
                },
                right: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.875 },
                  },
                },
                bottom: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.5 },
                  },
                },
                left: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.OPTICAL_PADDING,
                    input: { basedOn: "#buttonSize", factor: 0.75 },
                  },
                },
              },
              corners: {
                topLeft: { type: Sdn.ValueType.EMPTY, value: null },
                topRight: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Corner.ROUNDED,
                },
                bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
                bottomRight: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Corner.ROUNDED,
                },
              },
            },
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
