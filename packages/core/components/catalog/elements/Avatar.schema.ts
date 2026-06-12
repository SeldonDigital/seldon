import * as Sdn from "../../../properties";
import * as Seldon from "../../constants";
import { ComponentExport, ComponentSchema } from "../../types";





export const schema = {
  name: "Avatar",
  id: Seldon.ComponentId.AVATAR,
  intent:
    "Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.",
  tags: [
    "avatar",
    "user image",
    "profile",
    "identity",
    "initials",
    "picture",
    "circle",
    "UI element",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy",
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
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@background.none",
        },
        image: { type: Sdn.ValueType.EMPTY, value: null },
        position: { type: Sdn.ValueType.EMPTY, value: null },
        size: { type: Sdn.ValueType.EMPTY, value: null },
        repeat: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        blendMode: { type: Sdn.ValueType.EMPTY, value: null },
        filter: { type: Sdn.ValueType.EMPTY, value: null },
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
      style: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.BorderStyle.SOLID,
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
        component: Seldon.ComponentId.IMAGE,
        overrides: {
          source: {
            type: Sdn.ValueType.EXACT,
            value: "https://static.seldon.app/avatar-user.jpg",
          },
          width: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@dimension.medium",
          },
          height: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@dimension.medium",
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
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
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
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Default Title",
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
                family: { type: Sdn.ValueType.EMPTY, value: null },
                style: { type: Sdn.ValueType.EMPTY, value: null },
                weight: { type: Sdn.ValueType.EMPTY, value: null },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.medium",
                },
                lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
                textCase: { type: Sdn.ValueType.EMPTY, value: null },
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "subtitle",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Details",
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
                family: { type: Sdn.ValueType.EMPTY, value: null },
                style: { type: Sdn.ValueType.EMPTY, value: null },
                weight: { type: Sdn.ValueType.EMPTY, value: null },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.small",
                },
                lineHeight: { type: Sdn.ValueType.EMPTY, value: null },
                textCase: { type: Sdn.ValueType.EMPTY, value: null },
              },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "icon",
      label: "Iconic Avatar",
      intent:
        "Renders an icon-based avatar for representing users, roles, or statuses.",
      overrides: {
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.ICON,
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
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
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Default Title",
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
                    value: "@fontSize.medium",
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
                  value: "Details",
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
                    value: "@fontSize.small",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "product",
      label: "Product Avatar",
      intent: "Represents products or items visually using an image or icon.",
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
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
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
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Default Title",
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
                    value: "@fontSize.medium",
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
                  value: "Details",
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
                    value: "@fontSize.small",
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
  react: { returns: "Frame" },
}