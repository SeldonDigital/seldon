import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Weekdays",
  id: Seldon.ComponentId.CALENDAR_WEEKDAYS,
  intent:
    "Schema for the calendar header row with month, year, navigation controls, and optional view switcher.",
  tags: [
    "calendar",
    "header",
    "month",
    "year",
    "navigation",
    "controls",
    "switcher",
    "ui",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: { addChildren: false, reorderChildren: false },
  children: [
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "January",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
        background: {
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          brightness: {
            type: Sdn.ValueType.EXACT,
            value: { unit: Sdn.Unit.PERCENT, value: 80 },
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Monday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Tuesday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Wednesday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Thursday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Friday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Saturday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.TABLE_HEADER,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Sunday",
        },
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 12.5 },
        },
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.compact",
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
    ariaHidden: { type: Sdn.ValueType.EXACT, value: false },
    // LAYOUT
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Align.CENTER_LEFT,
    },
    width: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Resize.FILL,
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
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: { type: Sdn.ValueType.EXACT, value: false },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.white",
      },
      image: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      position: { type: Sdn.ValueType.EMPTY, value: null },
      repeat: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: {
        type: Sdn.ValueType.EXACT,
        value: { unit: Sdn.Unit.PERCENT, value: 100 },
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
    },
    border: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
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
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
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
  react: { returns: "HTMLTr" },
}
