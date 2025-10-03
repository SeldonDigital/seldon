import * as Sdn from "../../../properties/constants"
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
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.TITLE,
      overrides: {
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "IAB Display Ad",
        },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        font: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@font.title",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TAGLINE,
      overrides: {
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
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Ads by Seldon",
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
        },
      },
    },
    {
      component: Seldon.ComponentId.DESCRIPTION,
      overrides: {
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
        content: {
          type: Sdn.ValueType.EXACT,
          value:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus. Donec euismod in fringilla.",
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
        },
      },
    },
  ],
  properties: {
    // COMPONENT
    display: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Display.SHOW,
    },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Alignment.TOP_LEFT,
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
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@background.background1",
      },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.white",
      },
      image: {
        type: Sdn.ValueType.EXACT,
        value: "https://static.seldon.app/background-default-dark.jpg",
      },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      position: { type: Sdn.ValueType.EMPTY, value: null },
      repeat: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      topStyle: { type: Sdn.ValueType.EMPTY, value: null },
      topColor: { type: Sdn.ValueType.EMPTY, value: null },
      topWidth: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      rightStyle: { type: Sdn.ValueType.EMPTY, value: null },
      rightColor: { type: Sdn.ValueType.EMPTY, value: null },
      rightWidth: { type: Sdn.ValueType.EMPTY, value: null },
      rightOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftStyle: { type: Sdn.ValueType.EMPTY, value: null },
      leftColor: { type: Sdn.ValueType.EMPTY, value: null },
      leftWidth: { type: Sdn.ValueType.EMPTY, value: null },
      leftOpacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    corners: {
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // TYPOGRAPHY
    // GRADIENTS
    gradient: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      angle: { type: Sdn.ValueType.EMPTY, value: null },
      startColor: { type: Sdn.ValueType.EMPTY, value: null },
      startOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      startPosition: { type: Sdn.ValueType.EMPTY, value: null },
      endColor: { type: Sdn.ValueType.EMPTY, value: null },
      endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      endPosition: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
