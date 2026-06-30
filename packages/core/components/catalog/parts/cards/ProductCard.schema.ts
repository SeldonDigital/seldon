import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Product Card",
  id: Seldon.ComponentId.PRODUCT_CARD,
  intent:
    "Ecommerce product card emphasizing image, price, title, rating, and a single add-to-cart action.",
  tags: [
    "card",
    "product",
    "ecommerce",
    "price",
    "rating",
    "cta",
    "UI",
    "commerce",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
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
      value: "@gap.tight",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
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
          value: "@shadow.xlight",
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
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
        component: Seldon.ComponentId.IMAGE,
        overrides: {
          source: {
            type: Sdn.ValueType.EXACT,
            value: "https://static.seldon.app/background-default-light.jpg",
          },
          imageFit: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.ImageFit.COVER,
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.EXACT,
            value: { unit: Sdn.Unit.PX, value: 220 },
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
          padding: {
            top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.cozy",
            },
            left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.CHIP,
            overrides: {
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              background: [
                {
                  kind: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.BackgroundKind.COLOR,
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.active",
                  },
                  brightness: { type: Sdn.ValueType.EMPTY, value: null },
                  opacity: { type: Sdn.ValueType.EMPTY, value: null },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Sale",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "subtitle",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Product Name",
              },
              margin: {
                top: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@margin.cozy",
                },
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "$49.00",
              },
              font: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@font.heading",
                },
              },
            },
          },
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
              margin: {
                top: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@margin.tight",
                },
                bottom: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@margin.cozy",
                },
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.tight",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-star",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.medium",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              },
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-star",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.medium",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              },
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-star",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.medium",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              },
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-star",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.medium",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              },
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-star",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.medium",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.gray",
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
                value: Sdn.Resize.FILL,
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-shoppingCart",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Add to cart",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "minimal",
      label: "Minimal Product Card",
      intent:
        "Stripped-down product card showing only image, name, and price for dense grids.",
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "https://static.seldon.app/background-default-light.jpg",
            },
            imageFit: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.ImageFit.COVER,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 220 },
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
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "subtitle",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Product Name",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "$49.00",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.heading",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "horizontal",
      label: "Horizontal Product Card",
      intent:
        "Side-by-side product card with the image on the left and details on the right for list views.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Orientation.HORIZONTAL,
        },
        width: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Resize.FILL,
        },
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
        },
      },
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "https://static.seldon.app/background-default-light.jpg",
            },
            imageFit: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.ImageFit.COVER,
            },
            width: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PX, value: 160 },
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
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
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "subtitle",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Product Name",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "$49.00",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.heading",
                  },
                },
                margin: {
                  bottom: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@margin.compact",
                  },
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
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-shoppingCart",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Add to cart",
                    },
                  },
                },
              ],
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
