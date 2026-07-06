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
          background: [
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.LINEAR_GRADIENT,
              },
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              angle: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.DEGREES, value: 135 },
              },
              startColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.offWhite",
              },
              startPosition: { type: Sdn.ValueType.EMPTY, value: null },
              startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
              startOpacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 100 },
              },
              endColor: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.offWhite",
              },
              endPosition: { type: Sdn.ValueType.EMPTY, value: null },
              endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
              endOpacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 100 },
              },
            },
          ],
          border: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@border.normal",
            },
            style: { type: Sdn.ValueType.EMPTY, value: null },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@borderWidth.medium",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 30 },
            },
          },
          corners: {
            topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
            topRight: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@corners.cozy",
            },
            bottomLeft: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@corners.cozy",
            },
            bottomRight: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Corner.SQUARED,
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
                value: { unit: Sdn.Unit.PX, value: 4 },
              },
              blur: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@blur.medium",
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.offBlack",
              },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.PERCENT, value: 10 },
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
  variants: [
    {
      id: "subscribe",
      label: "Subscribe",
      intent:
        "Newsletter subscribe block with a headline, supporting text, an email input with action button, and a row of expert avatars.",
      overrides: {
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.NONE,
            },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Subscribe to our newsletter",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.heading",
              },
            },
            textAlign: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextAlign.CENTER,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Sign up today and get a free sample up to 100 records.",
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
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            margin: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.comfortable",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@margin.comfortable",
              },
            },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
          },
          children: [
            {
              component: Seldon.ComponentId.COMBOBOX_FIELD,
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-email",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.INPUT,
                  overrides: {
                    inputType: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.InputType.EMAIL,
                    },
                    placeholder: {
                      type: Sdn.ValueType.EXACT,
                      value: "Enter your email",
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
                    display: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Display.HIDE,
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
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Get started",
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
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Our experts are ready to help!",
                },
                margin: {
                  right: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@margin.compact",
                  },
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
              },
            },
            {
              component: Seldon.ComponentId.AVATAR,
              variant: "stacked",
              children: [
                {
                  component: Seldon.ComponentId.IMAGE,
                  overrides: {
                    width: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@dimension.medium",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.IMAGE,
                  overrides: {
                    width: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@dimension.medium",
                    },
                    margin: {
                      left: {
                        type: Sdn.ValueType.EXACT,
                        value: { value: -0.75, unit: Sdn.Unit.REM },
                      },
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.IMAGE,
                  overrides: {
                    width: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@dimension.medium",
                    },
                    margin: {
                      left: {
                        type: Sdn.ValueType.EXACT,
                        value: { value: -0.75, unit: Sdn.Unit.REM },
                      },
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
      id: "bold",
      label: "Bold",
      intent:
        "Bold dark call to action with a left-aligned headline, supporting text, and a light action button on an offBlack background.",
      overrides: {
        align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.TOP_LEFT },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.offBlack",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.RADIAL_GRADIENT,
            },
            preset: { type: Sdn.ValueType.EMPTY, value: null },
            positionX: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.GradientPositionX.LEFT,
            },
            positionY: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.GradientPositionY.BOTTOM,
            },
            shape: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.GradientShape.ELLIPSE,
            },
            radialSize: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.GradientSize.FARTHEST_SIDE,
            },
            startColor: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.accent",
            },
            startPosition: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 0 },
            },
            startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
            startOpacity: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 45 },
            },
            endColor: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.accent",
            },
            endPosition: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 55 },
            },
            endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
            endOpacity: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.PERCENT, value: 0 },
            },
          },
        ],
        corners: {
          topLeft: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.comfortable",
          },
          topRight: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.comfortable",
          },
          bottomLeft: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.comfortable",
          },
          bottomRight: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.comfortable",
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Experience superior skip tracing",
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.display",
              },
            },
            textAlign: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextAlign.LEFT,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "150+ data points per search.",
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
              value: Sdn.TextAlign.LEFT,
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
                value: "@border.none",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Get started",
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.label",
                  },
                  size: {
                    type: Sdn.ValueType.COMPUTED,
                    value: Sdn.ComputedFunction.AUTO_FIT,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
