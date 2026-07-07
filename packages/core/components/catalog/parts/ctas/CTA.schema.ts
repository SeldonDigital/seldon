import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "CTA",
  id: Seldon.ComponentId.CTA,
  intent:
    "A centered call to action block with a logo, headline, supporting text, and a primary action button. Used at the top of pages, footers, and marketing sections.",
  tags: [
    "cta",
    "call to action",
    "part",
    "hero",
    "headline",
    "button",
    "marketing",
    "conversion",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_CENTER,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      bottom: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      left: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.IMAGE },
        image: {
          type: Sdn.ValueType.EXACT,
          value: "https://static.seldon.app/background-default-light.jpg",
        },
        blendMode: { type: Sdn.ValueType.EMPTY, value: null },
        position: { type: Sdn.ValueType.EMPTY, value: null },
        size: { type: Sdn.ValueType.EMPTY, value: null },
        repeat: { type: Sdn.ValueType.EMPTY, value: null },
        filter: { type: Sdn.ValueType.EMPTY, value: null },
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
      topLeft: { type: Sdn.ValueType.EMPTY, value: null },
      topRight: { type: Sdn.ValueType.EMPTY, value: null },
      bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
      bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
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
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.VERTICAL,
          },
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER,
          },
          width: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@dimension.xxlarge",
          },
          height: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@dimension.xxlarge",
          },
          padding: {
            top: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.25 },
            },
            right: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.25 },
            },
            bottom: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.25 },
            },
            left: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.25 },
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
                value: { unit: Sdn.Unit.PERCENT, value: 0 },
              },
              opacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 100 },
              },
            },
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.RADIAL_GRADIENT,
              },
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@gradient.gradient2",
              },
              positionX: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.GradientPositionX.CENTER,
              },
              positionY: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.GradientPositionY.BOTTOM,
              },
              shape: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.GradientShape.CIRCLE,
              },
              radialSize: { type: Sdn.ValueType.EMPTY, value: null },
              startColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.offBlack",
              },
              startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
              startOpacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 40 },
              },
              endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
              endColor: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
              },
              endPosition: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 50 },
              },
            },
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.RADIAL_GRADIENT,
              },
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@gradient.gradient2",
              },
              positionX: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.GradientPositionX.CENTER,
              },
              positionY: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.GradientPositionY.TOP,
              },
              shape: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.GradientShape.CIRCLE,
              },
              startColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.offWhite",
              },
              startPosition: { type: Sdn.ValueType.EMPTY, value: null },
              startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
              startOpacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 40 },
              },
              endColor: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
              },
              endPosition: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 80 },
              },
              endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
              endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
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
          corners: {
            topLeft: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.5 },
            },
            topRight: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.5 },
            },
            bottomLeft: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.5 },
            },
            bottomRight: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.REM, value: 0.5 },
            },
          },
          shadow: [
            {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@shadow.light",
              },
              style: { type: Sdn.ValueType.EMPTY, value: null },
              offsetX: { type: Sdn.ValueType.EMPTY, value: null },
              offsetY: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PX, value: 2 },
              },
              blur: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@blur.medium",
              },
              color: { type: Sdn.ValueType.EMPTY, value: null },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 20 },
              },
              spread: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@spread.xsmall",
              },
            },
          ],
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              align: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Align.CENTER,
              },
              background: [
                {
                  kind: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.BackgroundKind.COLOR,
                  },
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
                  value: "@border.thin",
                },
                style: { type: Sdn.ValueType.EMPTY, value: null },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.offBlack",
                },
                width: { type: Sdn.ValueType.EMPTY, value: null },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.PERCENT, value: 30 },
                },
              },
              corners: {
                topLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.REM, value: 0.35 },
                },
                topRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.REM, value: 0.35 },
                },
                bottomLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.REM, value: 0.35 },
                },
                bottomRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.REM, value: 0.35 },
                },
              },
              shadow: [
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@shadow.xlight",
                  },
                  style: { type: Sdn.ValueType.EMPTY, value: null },
                  offsetX: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.PX, value: 0 },
                  },
                  offsetY: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.PX, value: 1 },
                  },
                  blur: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@blur.xxsmall",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.offBlack",
                  },
                  brightness: { type: Sdn.ValueType.EMPTY, value: null },
                  opacity: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.PERCENT, value: 25 },
                  },
                  spread: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@spread.tiny",
                  },
                },
                {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@shadow.xlight",
                  },
                  style: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.ShadowStyle.INNER,
                  },
                  offsetX: { type: Sdn.ValueType.EMPTY, value: null },
                  offsetY: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.PX, value: 1 },
                  },
                  blur: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@blur.xsmall",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.offBlack",
                  },
                  brightness: { type: Sdn.ValueType.EMPTY, value: null },
                  opacity: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.PERCENT, value: 15 },
                  },
                  spread: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@spread.xxsmall",
                  },
                },
              ],
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  source: {
                    type: Sdn.ValueType.EXACT,
                    value: "/logo.svg",
                  },
                  altText: {
                    type: Sdn.ValueType.EXACT,
                    value: "Company Logo",
                  },
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.large",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.large",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "title",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Discover a new way to design amazing products",
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.display",
            },
          },
          textAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.TextAlign.CENTER,
          },
          lines: {
            type: Sdn.ValueType.EXACT,
            value: 5,
          },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "description",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value:
              "Join a community of teams building better products, from startups to the Fortune 500.",
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.normal",
            },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.small",
            },
          },
          textAlign: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.TextAlign.CENTER,
          },
        },
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
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Get started for free",
              },
            },
          },
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-download",
              },
            },
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
