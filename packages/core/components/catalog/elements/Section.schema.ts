import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Section",
  id: Seldon.ComponentId.SECTION,
  intent:
    "Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.",
  tags: [
    "section",
    "navigation",
    "links",
    "menu",
    "element",
    "layout",
    "header",
    "footer",
    "sidebar",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.FRAME,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.DEFAULT,
    },
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
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EXACT, value: false },
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.LINK,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "About",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
      },
      {
        component: Seldon.ComponentId.LINK,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Contact",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
      },
      {
        component: Seldon.ComponentId.LINK,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Support",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "brand",
      label: "Section Brand",
      intent:
        "Brand section containing logo, company name, and tagline. Can be used in footers, headers, or any other layout context. Follows Material Design layout patterns.",
      children: [
        {
          component: Seldon.ComponentId.IMAGE,
          overrides: {
            source: {
              type: Sdn.ValueType.EXACT,
              value: "https://static.seldon.app/logo.svg",
            },
            altText: {
              type: Sdn.ValueType.EXACT,
              value: "Company Logo",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@dimension.large",
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Company Name",
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
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Building amazing products for the future.",
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
    {
      id: "social",
      label: "Section Social",
      intent:
        "Social media section containing social media buttons. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design button patterns.",
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
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
                  value: "seldon-iconSocialTwitter",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Twitter",
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
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
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
                  value: "seldon-iconSocialLinkedin",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "LinkedIn",
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
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
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
                  value: "seldon-iconSocialInstagram",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Instagram",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "newsletter",
      label: "Section Newsletter",
      intent:
        "Newsletter signup section with email input and subscribe button. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design form patterns.",
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Stay Updated",
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
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Subscribe to our newsletter for the latest updates.",
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
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-notifications",
                },
              },
            },
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
    {
      id: "legal",
      label: "Section Legal",
      intent:
        "Legal links section containing privacy policy, terms of service, and other legal links. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design link patterns.",
      children: [
        {
          component: Seldon.ComponentId.LINK,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Privacy Policy",
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
          },
        },
        {
          component: Seldon.ComponentId.LINK,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Terms of Service",
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
          },
        },
        {
          component: Seldon.ComponentId.LINK,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Cookie Policy",
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
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
