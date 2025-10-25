import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Avatar",
  id: Seldon.ComponentId.AVATAR,
  intent:
    "Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.",
  tags: [
    "avatar",
    "user image",
    "profile",
    "identity",
    "initials",
    "picture",
    "circle",
    "UI element",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.IMAGE,
      overrides: {
        source: {
          type: Sdn.ValueType.EXACT,
          value: "https://static.seldon.app/avatar-user.jpg",
        },
        width: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@dimension.medium",
        },
        height: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@dimension.medium",
        },
        corners: {
          topLeft: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
          topRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
          bottomLeft: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
          bottomRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TEXTBLOCK_AVATAR,
      nestedOverrides: {
        title: {
          content: "Full Name",
          fontSize: "@fontSize.small",
          color: "@swatch.primary",
        },
        subtitle: {
          content: "email@example.com",
          fontSize: "@fontSize.xsmall",
          color: "@swatch.swatch1",
        },
      },
    },
  ],
  properties: {
    // COMPONENT
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Align.CENTER,
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
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy",
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
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      image: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      position: { type: Sdn.ValueType.EMPTY, value: null },
      repeat: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
      bottomStyle: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.BorderStyle.SOLID,
      },
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
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
    },
    // TYPOGRAPHY
    // GRADIENTS
    // EFFECTS
    shadow: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      offsetX: { type: Sdn.ValueType.EMPTY, value: null },
      offsetY: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      blur: { type: Sdn.ValueType.EMPTY, value: null },
      spread: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
