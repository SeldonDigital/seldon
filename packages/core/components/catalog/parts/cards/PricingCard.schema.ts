import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Pricing Card",
  id: Seldon.ComponentId.PRICING_CARD,
  intent:
    "Plan comparison card with a plan name, price, a single subscribe action, and a short list of differentiating features.",
  tags: [
    "card",
    "pricing",
    "plan",
    "subscription",
    "features",
    "cta",
    "saas",
    "UI",
  ],
  level: Seldon.ComponentLevel.PART,
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
      value: Sdn.Orientation.VERTICAL,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
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
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: false,
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
        type: { type: Sdn.ValueType.EMPTY, value: null },
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
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "title",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Pro",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "display",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "$29",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          lines: {
            type: Sdn.ValueType.EXACT,
            value: 1,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "label",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "per month",
          },
        },
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
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
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
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.cozy",
            },
          },
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
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
                value: "@gap.compact",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-checkCircle",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.small",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.custom2",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Unlimited projects",
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
                value: Sdn.Resize.FILL,
              },
              height: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.compact",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-checkCircle",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.small",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.custom2",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Advanced analytics",
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
                value: Sdn.Resize.FILL,
              },
              height: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.compact",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-checkCircle",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.small",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.custom2",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Priority support",
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
                value: Sdn.Resize.FILL,
              },
              height: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.compact",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-checkCircle",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.small",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.custom2",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Team collaboration",
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
                value: Sdn.Resize.FILL,
              },
              height: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              gap: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@gap.compact",
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-checkCircle",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.small",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.custom2",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Custom integrations",
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
      id: "popular",
      label: "Popular Pricing Card",
      intent:
        "Highlighted middle-tier pricing card with a Most Popular badge and stronger elevation.",
      overrides: {
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.normal",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
        shadow: [
          {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@shadow.moderate",
            },
            type: { type: Sdn.ValueType.EMPTY, value: null },
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
                  value: "@swatch.primary",
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
                  value: "Most Popular",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Pro",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "display",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "$29",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            lines: {
              type: Sdn.ValueType.EXACT,
              value: 1,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "per month",
            },
          },
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
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
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
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.cozy",
              },
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.compact",
            },
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
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-checkCircle",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.custom2",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Everything in Starter",
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
                  value: Sdn.Resize.FILL,
                },
                height: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-checkCircle",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.custom2",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Advanced analytics",
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
                  value: Sdn.Resize.FILL,
                },
                height: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-checkCircle",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.custom2",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Priority support",
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
                  value: Sdn.Resize.FILL,
                },
                height: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-checkCircle",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.custom2",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Team collaboration",
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
                  value: Sdn.Resize.FILL,
                },
                height: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-checkCircle",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.custom2",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Custom integrations",
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
