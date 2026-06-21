import * as Sdn from "../../../properties";
import * as Seldon from "../../constants";
import { ComponentExport, ComponentSchema } from "../../types";





export const schema = {
  name: "Form Control",
  id: Seldon.ComponentId.FORM_CONTROL,
  intent: "Captures plain text input from the user for forms or interactions.",
  tags: [
    "UI",
    "UI control",
    "binary",
    "boolean",
    "checkbox",
    "choice",
    "control",
    "decorated",
    "dropdown",
    "editable",
    "exclusive",
    "field",
    "form",
    "icon",
    "input",
    "menu",
    "options",
    "query",
    "radio",
    "search",
    "select",
    "single choice",
    "text",
    "toggle",
    "user entry",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.INPUT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
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
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE },
        color: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
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
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.black",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 25,
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
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Label",
          },
          width: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 30,
            },
          },
        },
      },
      {
        component: Seldon.ComponentId.INPUT,
        overrides: {
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
  variants: [
    {
      id: "dropdown",
      label: "Dropdown Input",
      intent: "Lets users pick one option from a collapsible list.",
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Label",
            },
            width: {
              type: Sdn.ValueType.EXACT,
              value: {
                unit: Sdn.Unit.PERCENT,
                value: 30,
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.SELECT,
          overrides: {
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
    {
      id: "search",
      label: "Search Input",
      intent:
        "Specialized input field for entering and submitting search queries.",
      overrides: {
        padding: {
          top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
          },
        ],
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.hairline",
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
      },
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-search",
            },
          },
        },
        {
          component: Seldon.ComponentId.INPUT,
          variant: "combobox",
          overrides: {
            placeholder: {
              type: Sdn.ValueType.EXACT,
              value: "Search for...",
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            padding: {
              top: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
              right: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
              bottom: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
              left: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 0 },
              },
            },
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.NONE,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.none",
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
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.small",
            },
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.NONE,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.none",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: { type: Sdn.ValueType.OPTION, value: "material-close" },
              },
            },
          ],
        },
      ],
    },
    {
      id: "checkbox",
      label: "Checkbox",
      intent: "Allows users to select one or more binary options in a form.",
      children: [
        {
          component: Seldon.ComponentId.INPUT,
          variant: "checkbox",
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Label",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.label",
              },
            },
          },
        },
      ],
    },
    {
      id: "radio",
      label: "Radio Button",
      intent:
        "Allows selection of a single option among multiple mutually exclusive choices.",
      children: [
        {
          component: Seldon.ComponentId.INPUT,
          variant: "radio",
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Label",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.label",
              },
            },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}