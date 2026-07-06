import * as Sdn from "../../../../properties";
import * as Seldon from "../../../constants";
import { ComponentExport, ComponentSchema } from "../../../types";





export const schema = {
  name: "Social Proof CTA",
  id: Seldon.ComponentId.SOCIAL_PROOF_CTA,
  intent:
    "Testimonial block that pairs a brand mark with a customer quote and an attributed author for social proof.",
  tags: [
    "cta",
    "call to action",
    "part",
    "social proof",
    "testimonial",
    "quote",
    "review",
    "marketing",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_CENTER,
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
      value: "@gap.tight",
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
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          margin: {
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.comfortable",
            },
          },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
        },
        children: [
          {
            component: Seldon.ComponentId.IMAGE,
            overrides: {
              source: {
                type: Sdn.ValueType.EXACT,
                value: "/logo.svg",
              },
              width: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@dimension.small",
              },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            },
          },
          {
            component: Seldon.ComponentId.IMAGE,
            overrides: {
              source: {
                type: Sdn.ValueType.EXACT,
                value: "/word-mark.svg",
              },
              width: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@dimension.medium",
              },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
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
            value:
              "We've saved us thousands of hours of work. We're able to help our customers 10x faster.",
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.heading",
            },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.large",
            },
          },
          textAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.TextAlign.CENTER,
          },
        },
      },
      {
        component: Seldon.ComponentId.AVATAR,
        variant: "round",
        overrides: {
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.comfortable",
            },
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "AM Herasimchuk",
          },
          font: {
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.small",
            },
            weight: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontWeight.semibold",
            },
          },
          textAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.TextAlign.CENTER,
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
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Product Manager,",
              },
              brightness: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 50 },
              },
              font: {
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
              },
            },
          },
          {
            component: Seldon.ComponentId.LINK,
            variant: "plain",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "seldon.digital",
              },
              font: {
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
                },
              },
              textDecoration: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextDecoration.UNDERLINE,
              },
            },
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}