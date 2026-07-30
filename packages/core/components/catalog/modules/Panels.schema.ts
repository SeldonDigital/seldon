import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Panel",
  id: Seldon.ComponentId.PANEL,
  intent:
    "Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.",
  tags: ["panel", "dialog", "modal", "ui", "overlay", "popup", "interaction", "alert"],
  level: Seldon.ComponentLevel.MODULE,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    width: {
      type: Sdn.ValueType.EXACT,
      value: {
        unit: Sdn.Unit.PX,
        value: 450,
      },
    },
    height: {
      type: Sdn.ValueType.EXACT,
      value: {
        unit: Sdn.Unit.PX,
        value: 350,
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
      type: Sdn.ValueType.OPTION,
      value: Sdn.Gap.EVENLY_SPACED,
    },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.OPTION,
      value: true,
    },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.black",
      },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: {
          unit: Sdn.Unit.PERCENT,
          value: 75,
        },
      },
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
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.DIALOG },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.BAR,
        overrides: {
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
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
              value: "@padding.cozy",
            },
          },
          background: [
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.COLOR,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              brightness: {
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PERCENT,
                  value: 35,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderWidth.HAIRLINE,
            },
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
            bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
            bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Panel",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
              },
            },
          },
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
          },
          {
            component: Seldon.ComponentId.BUTTON,
          },
        ],
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
          gap: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@gap.compact",
          },
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
        },
      },
      {
        component: Seldon.ComponentId.BAR,
        variant: "buttonBar",
        overrides: {
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          height: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FIT,
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
          background: [
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.COLOR,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              brightness: {
                type: Sdn.ValueType.EXACT,
                value: {
                  unit: Sdn.Unit.PERCENT,
                  value: 35,
                },
              },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderWidth.HAIRLINE,
            },
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
            topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
            topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
            bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
            bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "modal",
      label: "Modal",
      intent: "Confirmation dialog with a titled header and cancel or confirm actions.",
      children: [
        {
          component: Seldon.ComponentId.BAR,
          overrides: {
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                value: "@padding.cozy",
              },
            },
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.primary",
                },
                brightness: {
                  type: Sdn.ValueType.EXACT,
                  value: {
                    unit: Sdn.Unit.PERCENT,
                    value: 35,
                  },
                },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
              style: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderStyle.SOLID,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderWidth.HAIRLINE,
              },
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
              bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
              bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Modal",
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.small",
                  },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
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
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.compact",
            },
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
          },
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.primary",
                },
                brightness: {
                  type: Sdn.ValueType.EXACT,
                  value: {
                    unit: Sdn.Unit.PERCENT,
                    value: 35,
                  },
                },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
              style: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderStyle.SOLID,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderWidth.HAIRLINE,
              },
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
              topLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              topRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
              bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.small",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "seldon-none",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Cancel",
                    },
                  },
                },
              ],
            },
            {
              component: Seldon.ComponentId.BUTTON,
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.small",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-check",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "OK",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "palette",
      label: "Palette",
      intent: "Floating palette panel with a titled header, close control, and an open body.",
      children: [
        {
          component: Seldon.ComponentId.BAR,
          overrides: {
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FIT,
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
                value: "@padding.cozy",
              },
            },
            background: [
              {
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.primary",
                },
                brightness: {
                  type: Sdn.ValueType.EXACT,
                  value: {
                    unit: Sdn.Unit.PERCENT,
                    value: 35,
                  },
                },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
              style: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderStyle.SOLID,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderWidth.HAIRLINE,
              },
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
              bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
              bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Palette",
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.xsmall",
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
                background: [
                  {
                    kind: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.BackgroundKind.NONE,
                    },
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
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-close",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            height: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
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
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.compact",
            },
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
          },
        },
      ],
    },
    {
      id: "alertDialog",
      label: "Alert Dialog",
      intent: "Interrupts the user to confirm or cancel a consequential action.",
      overrides: {
        height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.ALERTDIALOG },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
            padding: {
              top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Are you sure?" },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "This action cannot be undone.",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_RIGHT },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Cancel" },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Continue" },
              },
            },
          ],
        },
      ],
    },
    {
      id: "popover",
      label: "Popover",
      intent: "Floating panel of content anchored to the control that opened it.",
      overrides: {
        placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
        height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
      },
      children: [
        {
          component: Seldon.ComponentId.BAR,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Dimensions" },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                ariaLabel: { type: Sdn.ValueType.EXACT, value: "Close" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
            padding: {
              top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Set the dimensions for the layer.",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "hoverCard",
      label: "Hover Card",
      intent: "Preview of a linked entity shown when the pointer rests on its trigger.",
      overrides: {
        placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
        height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.HORIZONTAL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
            padding: {
              top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
            },
          },
          children: [
            { component: Seldon.ComponentId.AVATAR },
            {
              component: Seldon.ComponentId.FRAME,
              overrides: {
                orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
                gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "title",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "@seldon" },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "description",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Design systems, from schema to export.",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sheet",
      label: "Sheet",
      intent: "Panel anchored to the edge of the screen that slides over the content.",
      overrides: {
        placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.FIXED },
        position: {
          top: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PX, value: 0 } },
          right: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PX, value: 0 } },
          bottom: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PX, value: 0 } },
          left: { type: Sdn.ValueType.EMPTY, value: null },
        },
        height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
        corners: {
          topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
          topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
          bottomLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
          bottomRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.BAR,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "title",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Edit profile" },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                ariaLabel: { type: Sdn.ValueType.EXACT, value: "Close" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
            scroll: { type: Sdn.ValueType.OPTION, value: Sdn.Scroll.VERTICAL },
            padding: {
              top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
              left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
            },
          },
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_RIGHT },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
