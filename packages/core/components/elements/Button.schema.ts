import * as Sdn from "../../properties"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

export const schema = {
  name: "Button",
  id: Seldon.ComponentId.BUTTON,
  intent:
    "Standard button for triggering actions like submit, confirm, or cancel.",
  tags: [
    "button",
    "action",
    "UI",
    "primary",
    "click",
    "control",
    "submit",
    "call to action",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    buttonSize: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.POINTER,
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
      value: Sdn.Resize.FIT,
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
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.5,
          },
        },
      },
      right: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.875,
          },
        },
      },
      bottom: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.5,
          },
        },
      },
      left: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.OPTICAL_PADDING,
          input: {
            basedOn: "#buttonSize",
            factor: 0.75,
          },
        },
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: {
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
          type: Sdn.ValueType.EMPTY,
          value: null,
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
          value: "@swatch.primary",
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
        value: "@border.normal",
      },
      style: {
        type: Sdn.ValueType.EMPTY,
        value: null,
      },
      color: {
        type: Sdn.ValueType.COMPUTED,
        value: {
          function: Sdn.ComputedFunction.MATCH,
          input: {
            basedOn: "#background.color",
          },
        },
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
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      topRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.EMPTY,
          value: null,
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
        component: Seldon.ComponentId.ICON,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          symbol: {
            type: Sdn.ValueType.OPTION,
            value: "__default__",
          },
          size: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.AUTO_FIT,
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              input: {
                basedOn: "#parent.background.color",
              },
            },
          },
        },
      },
      {
        component: Seldon.ComponentId.LABEL,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Button",
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: {
              function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              input: {
                basedOn: "#parent.background.color",
              },
            },
          },
          font: {
            preset: {
              type: Sdn.ValueType.EMPTY,
              value: null,
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
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#parent.buttonSize",
                  factor: 0.8,
                },
              },
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
        },
      },
    ],
  },
  variants: [
    {
      id: "label",
      label: "Label",
      intent: "Text-only button with a single label and no icon.",
      children: [
        {
          component: Seldon.ComponentId.LABEL,
          overrides: {
            display: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Display.SHOW,
            },
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Button",
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: {
                  basedOn: "#parent.background.color",
                },
              },
            },
            font: {
              preset: {
                type: Sdn.ValueType.EMPTY,
                value: null,
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
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.AUTO_FIT,
                  input: {
                    basedOn: "#parent.buttonSize",
                    factor: 0.8,
                  },
                },
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
          },
        },
      ],
    },
    {
      id: "social",
      label: "Social Media Button",
      intent:
        "Generic social media button that can be used for any platform. Includes customizable text and icon for different social media services.",
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: Seldon.ComponentIcon.ICON,
            },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.AUTO_FIT,
                input: {
                  basedOn: "#parent.buttonSize",
                  factor: 0.8,
                },
              },
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: {
                  basedOn: "#parent.background.color",
                },
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.LABEL,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Social",
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: {
                function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                input: {
                  basedOn: "#parent.background.color",
                },
              },
            },
            font: {
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              family: { type: Sdn.ValueType.EMPTY, value: null },
              style: { type: Sdn.ValueType.EMPTY, value: null },
              weight: { type: Sdn.ValueType.EMPTY, value: null },
              size: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.AUTO_FIT,
                  input: {
                    basedOn: "#parent.buttonSize",
                    factor: 0.8,
                  },
                },
              },
              lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
              textCase: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
        },
      ],
    },
    {
      id: "tools",
      label: "Tools Button Group",
      intent:
        "Vertical group of tool-style buttons (e.g. select / sketch / insert).",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.VERTICAL,
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
                background: [
                  {
                    preset: { type: Sdn.ValueType.EMPTY, value: null },
                    image: { type: Sdn.ValueType.EMPTY, value: null },
                    position: { type: Sdn.ValueType.EMPTY, value: null },
                    size: { type: Sdn.ValueType.EMPTY, value: null },
                    repeat: { type: Sdn.ValueType.EMPTY, value: null },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.primary",
                    },
                blendMode: { type: Sdn.ValueType.EMPTY, value: null },
                filter: { type: Sdn.ValueType.EMPTY, value: null },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              style: { type: Sdn.ValueType.EMPTY, value: null },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: { basedOn: "#background.color" },
                },
              },
              width: { type: Sdn.ValueType.EMPTY, value: null },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
              collapse: { type: Sdn.ValueType.EMPTY, value: null },
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-toolArrow",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Select" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
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
            background: [
              {
                preset: { type: Sdn.ValueType.EMPTY, value: null },
                image: { type: Sdn.ValueType.EMPTY, value: null },
                position: { type: Sdn.ValueType.EMPTY, value: null },
                size: { type: Sdn.ValueType.EMPTY, value: null },
                repeat: { type: Sdn.ValueType.EMPTY, value: null },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
                blendMode: { type: Sdn.ValueType.EMPTY, value: null },
                filter: { type: Sdn.ValueType.EMPTY, value: null },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              style: { type: Sdn.ValueType.EMPTY, value: null },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: { basedOn: "#background.color" },
                },
              },
              width: { type: Sdn.ValueType.EMPTY, value: null },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
              collapse: { type: Sdn.ValueType.EMPTY, value: null },
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-toolSketch",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Sketch" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
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
            background: [
              {
                preset: { type: Sdn.ValueType.EMPTY, value: null },
                image: { type: Sdn.ValueType.EMPTY, value: null },
                position: { type: Sdn.ValueType.EMPTY, value: null },
                size: { type: Sdn.ValueType.EMPTY, value: null },
                repeat: { type: Sdn.ValueType.EMPTY, value: null },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
                blendMode: { type: Sdn.ValueType.EMPTY, value: null },
                filter: { type: Sdn.ValueType.EMPTY, value: null },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              style: { type: Sdn.ValueType.EMPTY, value: null },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: { basedOn: "#background.color" },
                },
              },
              width: { type: Sdn.ValueType.EMPTY, value: null },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
              collapse: { type: Sdn.ValueType.EMPTY, value: null },
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-toolComponent",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Insert" },
              },
            },
          ],
        },
          ],
        },
      ],
    },
    {
      id: "segmented",
      label: "Segmented Button",
      intent:
        "Combines related actions into a segmented control with selectable options.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
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
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLButton" },
}
