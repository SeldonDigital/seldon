import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Social Media Ad",
  id: Seldon.ComponentId.AD_SOCIAL_MEDIA,
  intent:
    "Generic schema for social media ad campaigns supporting shared properties across platforms like Instagram, TikTok, LinkedIn, and YouTube.",
  tags: [
    "ads",
    "social",
    "generic",
    "cross-platform",
    "campaign",
    "meta",
    "media",
    "unified",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Display.SHOW,
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
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_LEFT,
    },
    width: {
      type: Sdn.ValueType.EXACT,
      value: {
        unit: Sdn.Unit.PX,
        value: 300,
      },
    },
    height: {
      type: Sdn.ValueType.EXACT,
      value: {
        unit: Sdn.Unit.PX,
        value: 250,
      },
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
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
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
          value: "@background.background1",
        },
        image: {
          type: Sdn.ValueType.EXACT,
          value: "https://static.seldon.app/background-default-dark.jpg",
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
          value: "@swatch.white",
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
        value: "@border.hairline",
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
    gradient: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@gradient.none",
        },
        gradientType: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        angle: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        startColor: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        startOpacity: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        startBrightness: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        startPosition: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        endColor: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        endOpacity: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        endBrightness: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
        endPosition: {
          type: Sdn.ValueType.EMPTY,
          value: null,
        },
      },
    ],
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
        component: Seldon.ComponentId.TITLE,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Social Media Ad",
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
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
              value: "@font.title",
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
              type: Sdn.ValueType.EMPTY,
              value: null,
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
        component: Seldon.ComponentId.TAGLINE,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Ads by Seldon",
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.white",
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.tagline",
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
              type: Sdn.ValueType.EMPTY,
              value: null,
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
        component: Seldon.ComponentId.DESCRIPTION,
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
          },
          margin: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@margin.tight",
            },
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.white",
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.body",
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
              type: Sdn.ValueType.EMPTY,
              value: null,
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
  variants: [
    {
      id: "instagram",
      label: "Instagram",
      intent:
        "Instagram ad format for feed and story placements (1080×1080 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1080 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1080 },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.DISPLAY,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Instagram Ad",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.display",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.HEADING,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Ads by Seldon",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.heading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.TEXT,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.subheading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
      id: "tiktok",
      label: "TikTok",
      intent: "TikTok vertical video ad format (1080×1920 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1080 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1920 },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.DISPLAY,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "TikTok Ad",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.display",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.HEADING,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Ads by Seldon",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.heading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.TEXT,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.subheading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
      id: "linkedIn",
      label: "LinkedIn",
      intent: "LinkedIn sponsored content ad format (1200×627 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1200 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 627 },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.DISPLAY,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "LinkedIn Ad",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.display",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.HEADING,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Ads by Seldon",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.heading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.TEXT,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.subheading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
      id: "youTube",
      label: "YouTube",
      intent: "YouTube video ad format (1920×1080 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1920 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1080 },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.DISPLAY,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "YouTube Ad",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.display",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.HEADING,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Ads by Seldon",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.heading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
          component: Seldon.ComponentId.TEXT,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
            },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.tight",
              },
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.white",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.subheading",
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
                type: Sdn.ValueType.EMPTY,
                value: null,
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
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
