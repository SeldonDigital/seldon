import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Input Item",
  id: Seldon.ComponentId.LIST_ITEM_INPUT,
  intent: "List item used for input fields with a label and an input field.",
  tags: ["list", "input", "item", "form", "field", "UI", "row"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.STUB,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
        buttonSize: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@fontSize.xsmall",
        },
        width: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Resize.FIT,
        },
        padding: {
          top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
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
        corners: {
          topLeft: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          topRight: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          bottomLeft: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          bottomRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
        },
        background: {
          color: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Color.TRANSPARENT,
          },
        },
        border: {
          color: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Color.TRANSPARENT,
          },
        },
      },
      nestedOverrides: {
        icon: { symbol: "material-chevronRight" },
        label: { display: "exclude" },
      },
    },
    {
      component: Seldon.ComponentId.LABEL,
      overrides: {
        content: {
          type: Sdn.ValueType.EXACT,
          value: "Label",
        },
        width: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Resize.FILL,
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
      component: Seldon.ComponentId.INPUT_ICONIC,
      overrides: {
        width: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 60 },
        },
      },
      nestedOverrides: {
        icon: {
          size: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@size.small",
          },
        },
        input: {
          font: {
            family: "@fontFamily.primary",
            size: "@fontSize.xsmall",
          },
          padding: {
            top: "@padding.tight",
            right: "@padding.tight",
            bottom: "@padding.tight",
            left: "@padding.tight",
          },
        },
      },
    },
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
        buttonSize: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@fontSize.xsmall",
        },
        width: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Resize.FIT,
        },
        padding: {
          top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
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
        corners: {
          topLeft: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          topRight: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          bottomLeft: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          bottomRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
        },
        background: {
          color: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Color.TRANSPARENT,
          },
        },
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.thin",
          },
          width: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.EMPTY, value: null },
          color: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
      nestedOverrides: {
        icon: { symbol: "material-add" },
        label: { display: "exclude" },
      },
    },
    {
      component: Seldon.ComponentId.BUTTON,
      overrides: {
        buttonSize: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@fontSize.xsmall",
        },
        width: {
          type: Sdn.ValueType.PRESET,
          value: Sdn.Resize.FIT,
        },
        padding: {
          top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
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
        corners: {
          topLeft: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          topRight: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          bottomLeft: { type: Sdn.ValueType.PRESET, value: Sdn.Corner.ROUNDED },
          bottomRight: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Corner.ROUNDED,
          },
        },
        background: {
          color: {
            type: Sdn.ValueType.PRESET,
            value: Sdn.Color.TRANSPARENT,
          },
        },
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.thin",
          },
          width: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.EMPTY, value: null },
          color: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
      },
      nestedOverrides: {
        icon: { symbol: "material-close" },
        label: { display: "exclude" },
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
      top: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.tight",
      },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.compact",
      },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.tight",
      },
      left: {
        type: Sdn.ValueType.EXACT,
        value: { unit: Sdn.Unit.PX, value: 0 },
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.tight",
    },
    wrapChildren: { type: Sdn.ValueType.EMPTY, value: null },
    clip: { type: Sdn.ValueType.EMPTY, value: null },

    // APPEARANCE
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: {
      color: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
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
      topBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      topOpacity: { type: Sdn.ValueType.EMPTY, value: null },
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
  react: { returns: "HTMLLi" },
}
