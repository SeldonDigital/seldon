import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Item",
  id: Seldon.ComponentId.ITEM,
  intent: "Default list item used for general content with flexible layout.",
  tags: [
    "list",
    "item",
    "standard",
    "default",
    "row",
    "UI",
    "layout",
    "general",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.STUB,
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
      value: "@gap.cozy",
    },
    wrapChildren: { type: Sdn.ValueType.EMPTY, value: null },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
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
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderTop: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderRight: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderBottom: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderLeft: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
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
        component: Seldon.ComponentId.INPUT,
        variant: "checkbox",
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
        },
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.tight",
          },
          clip: {
            type: Sdn.ValueType.EXACT,
            value: true,
          },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Title",
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
            component: Seldon.ComponentId.TEXT,
            variant: "subtitle",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Subtitle",
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
              lines: {
                type: Sdn.ValueType.EXACT,
                value: 3,
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "avatar",
      label: "Avatar Item",
      intent: "List item that includes an avatar to represent an entity.",
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
          component: Seldon.ComponentId.AVATAR,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
        },
      ],
    },
    {
      id: "product",
      label: "Product Item",
      intent: "List item format optimized for showing product-related info.",
      children: [
        {
          component: Seldon.ComponentId.INPUT,
          variant: "checkbox",
          overrides: {
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
        },
        {
          component: Seldon.ComponentId.AVATAR,
          variant: "product",
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
          },
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
        },
      ],
    },
    {
      id: "input",
      label: "Input Item",
      intent:
        "List item used for input fields with a label and an input field.",
      overrides: {
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PX,
              value: 0,
            },
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.tight",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
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
                value: "@padding.tight",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-chevronDown",
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
          ],
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
        {
          component: Seldon.ComponentId.FORM_CONTROL,
          variant: "iconic",
          overrides: {
            width: {
              type: Sdn.ValueType.EXACT,
              value: {
                unit: Sdn.Unit.PERCENT,
                value: 60,
              },
            },
            padding: {
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
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
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.small",
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
              component: Seldon.ComponentId.INPUT,
              overrides: {
                padding: {
                  top: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@padding.tight",
                  },
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
                    value: "@padding.tight",
                  },
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
                  family: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@fontFamily.primary",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
                padding: {
                  top: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@padding.tight",
                  },
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
                    value: "@padding.tight",
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
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-chevronDown",
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
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
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
                value: "@padding.tight",
              },
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.thin",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-plus",
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
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
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
                value: "@padding.tight",
              },
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.thin",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-more",
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
          ],
        },
      ],
    },
    {
      id: "tree",
      label: "Tree Item",
      intent: "List item used for tree-like structures with nested children.",
      overrides: {
        margin: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.tight",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.tight",
          },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PX,
              value: 0,
            },
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.tight",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
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
                value: "@padding.tight",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-chevronDown",
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
          ],
        },
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "__default__",
            },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@size.small",
            },
            margin: {
              top: {
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PX,
                  value: 0,
                },
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PX,
                  value: 0,
                },
              },
              left: {
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PX,
                  value: 0,
                },
              },
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Tree Item",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
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
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
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
                value: "@padding.tight",
              },
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.thin",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-plus",
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
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.tight",
              },
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
                value: "@padding.tight",
              },
            },
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.thin",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-more",
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
          ],
        },
      ],
    },
    {
      id: "todo",
      label: "To-Do Item",
      intent:
        "List item for a to-do task with a checkbox, label, and action chips.",
      children: [
        {
          component: Seldon.ComponentId.INPUT,
          variant: "checkbox",
          overrides: {
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER,
            },
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
          component: Seldon.ComponentId.CHIP,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-plus",
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
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Add",
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
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
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
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.CHIP,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-minus",
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
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Remove",
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
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
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
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.CHIP,
          variant: "count",
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "999",
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
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
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
  react: { returns: "HTMLLi" },
}
