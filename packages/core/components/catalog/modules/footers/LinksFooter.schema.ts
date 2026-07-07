import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Links Footer",
  id: Seldon.ComponentId.LINKS_FOOTER,
  intent:
    "A bold, vertically stacked footer with a centered hero call to action, multiple grouped navigation columns, and a stay-connected newsletter row. Suited to marketing and enterprise sites.",
  tags: [
    "footer",
    "module",
    "layout",
    "navigation",
    "hero",
    "branding",
    "newsletter",
    "stacked",
    "bottom",
    "web",
  ],
  level: Seldon.ComponentLevel.MODULE,
  icon: Seldon.ComponentIcon.FRAME,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.open",
      },
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
        value: "@border.none",
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
        component: Seldon.ComponentId.CTA,
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.comfortable",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.comfortable",
            },
          },
          gap: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Gap.EVENLY_SPACED,
          },
        },
        children: [
          {
            component: Seldon.ComponentId.SECTION,
            overrides: {
              padding: {
                top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "title",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "// Products",
                  },
                  font: {
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Platform Overview",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Integrations",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Security" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Enterprise" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Pricing" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.SECTION,
            overrides: {
              padding: {
                top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "title",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "// Solutions",
                  },
                  font: {
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "By Industry",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "By Team" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Professional Services",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Customers" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Partners" },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.primary",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.SECTION,
            overrides: {
              padding: {
                top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "title",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "// Resources",
                  },
                  font: {
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Documentation",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Blog" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Help Center",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Community" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Webinars" },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.SECTION,
            overrides: {
              padding: {
                top: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                right: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
                left: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "title",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "// Company",
                  },
                  font: {
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "About Us" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Careers" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Newsroom" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Contact" },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: { type: Sdn.ValueType.EXACT, value: "Legal" },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.BOTTOM_LEFT,
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.comfortable",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.comfortable",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.open",
          },
        },
        children: [
          {
            component: Seldon.ComponentId.SECTION,
            variant: "brand",
            overrides: {
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              padding: {
                top: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@padding.compact",
                },
                right: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Padding.NONE,
                },
                bottom: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@padding.compact",
                },
                left: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Padding.NONE,
                },
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.tight",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "subtitle",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Stay connected",
                  },
                  font: {
                    weight: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontWeight.medium",
                    },
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "description",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value:
                      "Get the latest product news, updates, and resources delivered to your inbox. We only send a few emails a month.",
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
            ],
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              orientation: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Orientation.HORIZONTAL,
              },
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER_RIGHT,
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.cozy",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.INPUT,
                overrides: {
                  inputType: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.InputType.EMAIL,
                  },
                  placeholder: {
                    type: Sdn.ValueType.EXACT,
                    value: "Enter your email",
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
                overrides: {
                  buttonSize: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Subscribe",
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
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLFooter" },
}
