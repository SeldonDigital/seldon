import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "IAB Display Ad",
  id: Seldon.ComponentId.AD_IAB,
  intent:
    "Defines schema for IAB-compliant ad formats used in display and programmatic advertising, supporting standard sizes, creatives, and metrics.",
  tags: [
    "ads",
    "iab",
    "display",
    "programmatic",
    "standard",
    "media",
    "metrics",
    "creative",
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
        component: Seldon.ComponentId.TEXT,
        variant: "title",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Medium Rectangle",
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
        component: Seldon.ComponentId.TEXT,
        variant: "tagline",
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
      id: "billboard",
      label: "Billboard",
      intent: "IAB Billboard display ad unit (970×250 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 970 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 250 },
        },
      },
    },
    {
      id: "smartphoneBanner",
      label: "Smartphone Banner",
      intent:
        "IAB Smartphone Banner display ad unit (300×50 px). Alternate size: 320×50.",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 300 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 50 },
        },
      },
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      intent: "IAB Leaderboard display ad unit (728×90 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 728 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 90 },
        },
      },
    },
    {
      id: "superLeaderboard",
      label: "Super Leaderboard / Pushdown",
      intent: "IAB Super Leaderboard or Pushdown display ad unit (970×90 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 970 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 90 },
        },
      },
    },
    {
      id: "portrait",
      label: "Portrait",
      intent: "IAB Portrait display ad unit (300×1050 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 300 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 1050 },
        },
      },
    },
    {
      id: "skyscraper",
      label: "Skyscraper",
      intent: "IAB Skyscraper display ad unit (160×600 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 160 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 600 },
        },
      },
    },
    {
      id: "banner120x60",
      label: "120×60",
      intent: "IAB 120×60 display ad unit.",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 120 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 60 },
        },
      },
    },
    {
      id: "mobilePhoneInterstitial",
      label: "Mobile Phone Interstitial",
      intent:
        "IAB Mobile Phone Interstitial display ad unit (1080×1920 px). Alternate sizes: 640×1136, 750×1334.",
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
    },
    {
      id: "featurePhoneSmallBanner",
      label: "Feature Phone Small Banner",
      intent: "IAB Feature Phone Small Banner display ad unit (120×20 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 120 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 20 },
        },
      },
    },
    {
      id: "featurePhoneMediumBanner",
      label: "Feature Phone Medium Banner",
      intent: "IAB Feature Phone Medium Banner display ad unit (168×28 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 168 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 28 },
        },
      },
    },
    {
      id: "featurePhoneLargeBanner",
      label: "Feature Phone Large Banner",
      intent: "IAB Feature Phone Large Banner display ad unit (216×36 px).",
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 216 },
        },
        height: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 36 },
        },
      },
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
