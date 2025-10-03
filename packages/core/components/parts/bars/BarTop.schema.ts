import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Top Bar",
  id: Seldon.ComponentId.BAR_TOP,
  intent: "Provides controls for the top of an application.",
  tags: [
    "navigation",
    "topbar",
    "menus",
    "UI",
    "header",
    "section",
    "links",
    "routing",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.FRAME,
      overrides: {
        orientation: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Orientation.HORIZONTAL,
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
          value: Sdn.Resize.FILL,
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
            value: "@padding.tight",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        background: {
          color: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 100,
            },
          },
        },
        border: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.FRAME,
      overrides: {
        orientation: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Orientation.HORIZONTAL,
        },
        align: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER,
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
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        background: {
          color: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 100,
            },
          },
        },
        border: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
    },
    {
      component: Seldon.ComponentId.FRAME,
      overrides: {
        orientation: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Orientation.HORIZONTAL,
        },
        align: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Alignment.CENTER_RIGHT,
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
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.tight",
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        background: {
          color: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 100,
            },
          },
        },
        border: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
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
      value: Sdn.Alignment.CENTER_LEFT,
    },
    position: {
      top: {
        type: Sdn.ValueType.EXACT,
        value: { value: 0, unit: Sdn.Unit.PX },
      },
      right: {
        type: Sdn.ValueType.EXACT,
        value: { value: 0, unit: Sdn.Unit.PX },
      },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: {
        type: Sdn.ValueType.EXACT,
        value: { value: 0, unit: Sdn.Unit.PX },
      },
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
      color: { type: Sdn.ValueType.EMPTY, value: null },
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
      bottomOpacity: {
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 100,
        },
      },
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
