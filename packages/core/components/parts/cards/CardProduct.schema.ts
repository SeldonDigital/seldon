import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Product Card",
  id: Seldon.ComponentId.CARD_PRODUCT,
  intent:
    "Product card schema optimized for ecommerce use cases, supporting pricing, images, descriptions, and action triggers.",
  tags: [
    "card",
    "product",
    "ecommerce",
    "ui",
    "pricing",
    "image",
    "cta",
    "catalog",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.TEXTBLOCK_DETAILS,
      overrides: {
        margin: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.BAR_BUTTONS,
      overrides: {
        width: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Resize.FIT,
        },
        margin: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@margin.cozy",
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
      value: Sdn.Alignment.CENTER_LEFT,
    },
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.PRESET,
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
      type: Sdn.ValueType.PRESET,
      value: Sdn.Gap.EVENLY_SPACED,
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
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      image: {
        type: Sdn.ValueType.EXACT,
        value: "https://static.seldon.app/background-default-light.jpg",
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
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      topStyle: { type: Sdn.ValueType.EMPTY, value: null },
      topColor: { type: Sdn.ValueType.EMPTY, value: null },
      topWidth: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      topBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      rightStyle: { type: Sdn.ValueType.EMPTY, value: null },
      rightColor: { type: Sdn.ValueType.EMPTY, value: null },
      rightWidth: { type: Sdn.ValueType.EMPTY, value: null },
      rightOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      rightBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      bottomBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      leftStyle: { type: Sdn.ValueType.EMPTY, value: null },
      leftColor: { type: Sdn.ValueType.EMPTY, value: null },
      leftWidth: { type: Sdn.ValueType.EMPTY, value: null },
      leftOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      leftBrightness: { type: Sdn.ValueType.EMPTY, value: null },
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
    // GRADIENTS
    gradient: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      angle: { type: Sdn.ValueType.EMPTY, value: null },
      startColor: { type: Sdn.ValueType.EMPTY, value: null },
      startOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      startPosition: { type: Sdn.ValueType.EMPTY, value: null },
      endColor: { type: Sdn.ValueType.EMPTY, value: null },
      endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
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
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
