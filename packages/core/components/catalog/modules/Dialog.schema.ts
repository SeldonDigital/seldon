import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Dialog",
  id: Seldon.ComponentId.DIALOG,
  intent:
    "Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.",
  tags: [
    "panel",
    "dialog",
    "modal",
    "ui",
    "overlay",
    "popup",
    "interaction",
    "alert",
  ],
  level: Seldon.ComponentLevel.MODULE,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
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
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
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
      type: Sdn.ValueType.EXACT,
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
                value: "Dialog",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                  input: {
                    basedOn: "#self.background.color",
                  },
                },
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
      intent:
        "Confirmation dialog with a titled header and cancel or confirm actions.",
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
                font: {
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.small",
                  },
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                    input: {
                      basedOn: "#self.background.color",
                    },
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
      intent:
        "Floating palette panel with a titled header, close control, and an open body.",
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
                font: {
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: {
                    function: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                    input: {
                      basedOn: "#self.background.color",
                    },
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
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
