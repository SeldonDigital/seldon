import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Footer",
  id: Seldon.ComponentId.FOOTER,
  intent:
    "A comprehensive footer component with sections for branding, navigation, social media, newsletter signup, and legal links. Based on Material Design and modern web patterns.",
  tags: [
    "footer",
    "module",
    "layout",
    "navigation",
    "branding",
    "social",
    "newsletter",
    "legal",
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
      top: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      left: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
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
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.TOP_LEFT },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.comfortable" },
        },
        children: [
          {
            component: Seldon.ComponentId.SECTION,
            variant: "brand",
            overrides: {
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            },
            children: [
              {
                component: Seldon.ComponentId.FRAME,
                overrides: {
                  orientation: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Orientation.HORIZONTAL,
                  },
                  align: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Align.CENTER_LEFT,
                  },
                  width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                  height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                  gap: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@gap.compact",
                  },
                },
                children: [
                  {
                    component: Seldon.ComponentId.IMAGE,
                    overrides: {
                      source: {
                        type: Sdn.ValueType.EXACT,
                        value: "/logo.svg",
                      },
                      altText: {
                        type: Sdn.ValueType.EXACT,
                        value: "Company Logo",
                      },
                      width: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@dimension.small",
                      },
                      height: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Resize.FIT,
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "title",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "ABC Corporation",
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
                ],
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "description",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value:
                      "We help teams turn complex ideas into clear, compelling products that are easy to share, understand, and act on.",
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
                component: Seldon.ComponentId.FRAME,
                overrides: {
                  orientation: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Orientation.HORIZONTAL,
                  },
                  align: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.Align.CENTER_LEFT,
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
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "seldon-iconSocialTwitter",
                      },
                    },
                  },
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
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "seldon-iconSocialLinkedin",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.ICON,
                    overrides: {
                      symbol: {
                        type: Sdn.ValueType.OPTION,
                        value: "seldon-iconSocialGithub",
                      },
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
              align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.TOP_LEFT },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
            },
            children: [
              {
                component: Seldon.ComponentId.SECTION,
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "subtitle",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Product",
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
                        value: "Features",
                      },
                    },
                  },
                  {
                    component: Seldon.ComponentId.LINK,
                    variant: "footer",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "Pricing" },
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
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Changelog",
                      },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.SECTION,
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "subtitle",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Resources",
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
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Tutorials",
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
                      content: { type: Sdn.ValueType.EXACT, value: "Support" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.SECTION,
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "subtitle",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Company",
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
                      content: { type: Sdn.ValueType.EXACT, value: "About" },
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
                      content: { type: Sdn.ValueType.EXACT, value: "Contact" },
                    },
                  },
                  {
                    component: Seldon.ComponentId.LINK,
                    variant: "footer",
                    overrides: {
                      content: {
                        type: Sdn.ValueType.EXACT,
                        value: "Partners",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.HR,
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              orientation: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Orientation.HORIZONTAL,
              },
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER_LEFT,
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "description",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "© 2026 ABC Corporation. All rights reserved.",
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
                value: "@gap.comfortable",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Privacy Policy",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Terms of Service",
                  },
                },
              },
              {
                component: Seldon.ComponentId.LINK,
                variant: "footer",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Cookies Settings",
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
      id: "standard",
      label: "Standard",
      intent:
        "Footer with a brand row and tagline, link and contact columns, a language selector, social icons, and a legal bar.",
      overrides: {
        gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.HORIZONTAL,
                },
                align: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Align.CENTER_LEFT,
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.IMAGE,
                  overrides: {
                    source: { type: Sdn.ValueType.EXACT, value: "/logo.svg" },
                    altText: {
                      type: Sdn.ValueType.EXACT,
                      value: "Company Logo",
                    },
                    width: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@dimension.small",
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
                      value: "ABC Corporation",
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
              ],
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Designing products for the future.",
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
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.RIGHT,
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.HR,
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.TOP_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.HORIZONTAL,
                },
                align: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Align.TOP_LEFT,
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
              },
              children: [
                {
                  component: Seldon.ComponentId.SECTION,
                  overrides: {
                    padding: {
                      top: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      right: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      bottom: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      left: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
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
                          value: "Company",
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
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "About Us",
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Services",
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "Team" },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Testimonials",
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Contact",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.SECTION,
                  overrides: {
                    padding: {
                      top: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      right: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      bottom: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      left: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
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
                          value: "Navigation",
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
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Key Benefits",
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Our Services",
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Why Choose Us",
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.LINK,
                      variant: "footer",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "Testimonials",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.SECTION,
                  overrides: {
                    padding: {
                      top: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      right: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      bottom: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
                      },
                      left: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Padding.NONE,
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
                          value: "Contact",
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
                      component: Seldon.ComponentId.FRAME,
                      overrides: {
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
                          value: Sdn.Resize.FIT,
                        },
                        height: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Resize.FIT,
                        },
                        gap: {
                          type: Sdn.ValueType.THEME_ORDINAL,
                          value: "@gap.cozy",
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.ICON,
                          overrides: {
                            symbol: {
                              type: Sdn.ValueType.OPTION,
                              value: "material-email",
                            },
                            size: {
                              type: Sdn.ValueType.THEME_ORDINAL,
                              value: "@size.small",
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.primary",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "description",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "info@company.com",
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
                        gap: {
                          type: Sdn.ValueType.THEME_ORDINAL,
                          value: "@gap.cozy",
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.ICON,
                          overrides: {
                            symbol: {
                              type: Sdn.ValueType.OPTION,
                              value: "material-phone",
                            },
                            size: {
                              type: Sdn.ValueType.THEME_ORDINAL,
                              value: "@size.small",
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.primary",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "description",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "+1 234 567 890",
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
                        gap: {
                          type: Sdn.ValueType.THEME_ORDINAL,
                          value: "@gap.cozy",
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.ICON,
                          overrides: {
                            symbol: {
                              type: Sdn.ValueType.OPTION,
                              value: "material-locationOn",
                            },
                            size: {
                              type: Sdn.ValueType.THEME_ORDINAL,
                              value: "@size.small",
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.primary",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "description",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "New York, USA",
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
            },
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.VERTICAL,
                },
                align: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Align.TOP_RIGHT,
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.comfortable",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.BUTTON,
                  overrides: {
                    buttonSize: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.small",
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
                        brightness: { type: Sdn.ValueType.EMPTY, value: null },
                        opacity: { type: Sdn.ValueType.EMPTY, value: null },
                      },
                    ],
                    border: {
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@border.hairline",
                      },
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: {
                          type: Sdn.ValueType.EXACT,
                          value: "English",
                        },
                        color: {
                          type: Sdn.ValueType.COMPUTED,
                          value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                        },
                        font: {
                          preset: {
                            type: Sdn.ValueType.THEME_CATEGORICAL,
                            value: "@font.label",
                          },
                          size: {
                            type: Sdn.ValueType.COMPUTED,
                            value: Sdn.ComputedFunction.AUTO_FIT,
                          },
                        },
                      },
                    },
                    {
                      component: Seldon.ComponentId.ICON,
                      overrides: {
                        symbol: {
                          type: Sdn.ValueType.OPTION,
                          value: "material-expandMore",
                        },
                        size: {
                          type: Sdn.ValueType.COMPUTED,
                          value: Sdn.ComputedFunction.AUTO_FIT,
                        },
                        color: {
                          type: Sdn.ValueType.COMPUTED,
                          value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FIT,
                    },
                    height: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FIT,
                    },
                    gap: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@gap.cozy",
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.BUTTON,
                      variant: "iconic",
                      overrides: {
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.offBlack",
                            },
                            brightness: {
                              type: Sdn.ValueType.EMPTY,
                              value: null,
                            },
                            opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
                              value: "seldon-iconSocialLinkedin",
                            },
                            size: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.AUTO_FIT,
                            },
                            color: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.BUTTON,
                      variant: "iconic",
                      overrides: {
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.offBlack",
                            },
                            brightness: {
                              type: Sdn.ValueType.EMPTY,
                              value: null,
                            },
                            opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
                              value: "seldon-iconSocialInstagram",
                            },
                            size: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.AUTO_FIT,
                            },
                            color: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.BUTTON,
                      variant: "iconic",
                      overrides: {
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.offBlack",
                            },
                            brightness: {
                              type: Sdn.ValueType.EMPTY,
                              value: null,
                            },
                            opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
                              value: "seldon-iconSocialFacebook",
                            },
                            size: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.AUTO_FIT,
                            },
                            color: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.BUTTON,
                      variant: "iconic",
                      overrides: {
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.offBlack",
                            },
                            brightness: {
                              type: Sdn.ValueType.EMPTY,
                              value: null,
                            },
                            opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
                              value: "seldon-iconSocialYoutube",
                            },
                            size: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.AUTO_FIT,
                            },
                            color: {
                              type: Sdn.ValueType.COMPUTED,
                              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
        {
          component: Seldon.ComponentId.HR,
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
              value: Sdn.Align.CENTER_LEFT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.HORIZONTAL,
                },
                align: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Align.CENTER_LEFT,
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "description",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "© 2026 ABC Corporation. All rights reserved.",
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
                  value: "@gap.comfortable",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.LINK,
                  variant: "footer",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Terms & Conditions",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.LINK,
                  variant: "footer",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Privacy Policy",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.LINK,
                  variant: "footer",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Cookies" },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "brand",
      label: "Brand",
      intent:
        "Bold branded footer with a large logo mark, company name, link columns, and a back-to-top bar on a tinted background.",
      overrides: {
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 10 },
            },
          },
        ],
        gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.TOP_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
          },
          children: [
            {
              component: Seldon.ComponentId.IMAGE,
              overrides: {
                source: { type: Sdn.ValueType.EXACT, value: "/logo.svg" },
                altText: {
                  type: Sdn.ValueType.EXACT,
                  value: "ABC Corporation Logo",
                },
                width: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.PX, value: 150 },
                },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              },
            },
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.VERTICAL,
                },
                align: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Align.TOP_LEFT,
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.comfortable",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "heading",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "ABC Corporation",
                    },
                    font: {
                      size: {
                        type: Sdn.ValueType.THEME_ORDINAL,
                        value: "@fontSize.xlarge",
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
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_LEFT,
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
                      value: "@gap.open",
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.SECTION,
                      overrides: {
                        padding: {
                          top: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
                          },
                          right: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
                          },
                          bottom: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
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
                          variant: "title",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "About Us",
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
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Mission",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Team",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Newsletter",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.SECTION,
                      overrides: {
                        padding: {
                          top: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
                          },
                          right: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
                          },
                          bottom: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
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
                          variant: "title",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Support",
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
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Contact",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Refund Policy",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "FAQ's",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.SECTION,
                      overrides: {
                        padding: {
                          top: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
                          },
                          right: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
                          },
                          bottom: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Padding.NONE,
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
                          variant: "title",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Social",
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
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Instagram",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "LinkedIn",
                            },
                          },
                        },
                        {
                          component: Seldon.ComponentId.LINK,
                          variant: "footer",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "YouTube",
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
        {
          component: Seldon.ComponentId.HR,
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
              value: Sdn.Align.CENTER_LEFT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
          },
          children: [
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Orientation.HORIZONTAL,
                },
                align: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Align.CENTER_LEFT,
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "description",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Copyright © ABC Corporation",
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
              component: Seldon.ComponentId.LINK,
              variant: "footer",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Terms of Service",
                },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.small",
                },
                background: [
                  {
                    kind: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.BackgroundKind.COLOR,
                    },
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
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Back to top",
                    },
                    color: {
                      type: Sdn.ValueType.COMPUTED,
                      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                    },
                    font: {
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@font.label",
                      },
                      size: {
                        type: Sdn.ValueType.COMPUTED,
                        value: Sdn.ComputedFunction.AUTO_FIT,
                      },
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-arrowUpward",
                    },
                    size: {
                      type: Sdn.ValueType.COMPUTED,
                      value: Sdn.ComputedFunction.AUTO_FIT,
                    },
                    color: {
                      type: Sdn.ValueType.COMPUTED,
                      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
  react: { returns: "HTMLFooter" },
}
