import * as Sdn from "../../properties"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

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
    wrapChildren: {
      type: Sdn.ValueType.EMPTY,
      value: null,
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
        component: Seldon.ComponentId.CHECKBOX,
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
            component: Seldon.ComponentId.TITLE,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Title",
              },
            },
          },
          {
            component: Seldon.ComponentId.SUBTITLE,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Subtitle",
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
          component: Seldon.ComponentId.CHECKBOX,
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
          component: Seldon.ComponentId.CHECKBOX,
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
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
          },
          children: [
            {
              component: Seldon.ComponentId.IMAGE,
              overrides: {
                width: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@dimension.large",
                },
                height: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@dimension.large",
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
            },
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                height: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.tight",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TITLE,
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Default Title",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.black",
                    },
                    font: {
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@font.normal",
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
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@fontSize.medium",
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
                {
                  component: Seldon.ComponentId.SUBTITLE,
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Details",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.black",
                    },
                    font: {
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@font.normal",
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
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@fontSize.small",
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
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-chevronRight",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.EXCLUDE,
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.LABEL,
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
                value: "@font.normal",
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
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.xsmall",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.small",
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
                  style: {
                    type: Sdn.ValueType.EMPTY,
                    value: null,
                  },
                  weight: {
                    type: Sdn.ValueType.EMPTY,
                    value: null,
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
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
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
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
                value: "@border.thin",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-add",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.EXCLUDE,
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
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
                value: "@border.thin",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-close",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.EXCLUDE,
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
        "Schema for an individual to-do entry containing title, description, status, due date, and optional priority or labels.",
      overrides: {
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_RIGHT,
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
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.CHECKBOX,
          overrides: {
            checked: {
              type: Sdn.ValueType.EXACT,
              value: false,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.black",
            },
            accentColor: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.black",
            },
          },
        },
        {
          component: Seldon.ComponentId.LABEL,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "To Do Category",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.black",
            },
          },
        },
        {
          component: Seldon.ComponentId.CHIP,
          overrides: {
            display: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Display.SHOW,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-localAirport",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Travel",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.CHIP,
          overrides: {
            display: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Display.SHOW,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-ticket",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Attractions",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.CHIP,
          variant: "count",
          overrides: {
            display: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Display.SHOW,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
          },
          children: [
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "999",
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
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-chevronRight",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.EXCLUDE,
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
          component: Seldon.ComponentId.LABEL,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Tree Item",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.normal",
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
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.xsmall",
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
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
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
                value: "@border.thin",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-add",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.EXCLUDE,
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
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
                value: "@border.thin",
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
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-close",
                },
              },
            },
            {
              component: Seldon.ComponentId.LABEL,
              overrides: {
                display: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Display.EXCLUDE,
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
