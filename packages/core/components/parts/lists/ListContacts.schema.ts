import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Contacts List",
  id: Seldon.ComponentId.LIST_CONTACTS,
  intent:
    "Defines a list layout for contact information such as name, email, phone, and avatar with optional actions.",
  tags: [
    "list",
    "contacts",
    "directory",
    "ui",
    "avatar",
    "email",
    "phone",
    "addressbook",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.LIST_ITEM_AVATAR,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.LIST_ITEM_AVATAR,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.LIST_ITEM_AVATAR,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.LIST_ITEM_AVATAR,
      overrides: {
        border: {
          bottomColor: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          bottomBrightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
          bottomStyle: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderStyle.SOLID,
          },
          bottomWidth: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    { component: Seldon.ComponentId.LIST_ITEM_AVATAR },
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
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
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
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    scroll: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Scroll.VERTICAL,
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      color: {
        type: Sdn.ValueType.PRESET,
        value: Sdn.Color.TRANSPARENT,
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
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
      bottomStyle: { type: Sdn.ValueType.EMPTY, value: null },
      bottomColor: { type: Sdn.ValueType.EMPTY, value: null },
      bottomWidth: { type: Sdn.ValueType.EMPTY, value: null },
      bottomOpacity: { type: Sdn.ValueType.EMPTY, value: null },
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
  react: { returns: "HTMLUl" },
}
