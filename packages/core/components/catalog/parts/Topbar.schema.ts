import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Topbar",
  id: Seldon.ComponentId.TOPBAR,
  intent:
    "Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.",
  tags: [
    "topbar",
    "navbar",
    "header",
    "navigation",
    "brand",
    "menu",
    "part",
    "UI",
  ],
  level: Seldon.ComponentLevel.PART,
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
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
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
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      right: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@padding.comfortable",
      },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
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
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.offWhite",
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
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.compact" },
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
          value: "@shadow.light",
        },
        style: { type: Sdn.ValueType.EMPTY, value: null },
        offsetX: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 0 },
        },
        offsetY: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PX, value: 2 },
        },
        blur: { type: Sdn.ValueType.THEME_ORDINAL, value: "@blur.small" },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.black",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 10 },
        },
        spread: { type: Sdn.ValueType.THEME_ORDINAL, value: "@spread.xsmall" },
      },
    ],
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.BANNER },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.OPTION,
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
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
        },
        children: [
          {
            component: Seldon.ComponentId.IMAGE,
            overrides: {
              source: {
                type: Sdn.ValueType.EXACT,
                value: "/logo.svg",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              height: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@dimension.xsmall",
              },
            },
          },
          {
            component: Seldon.ComponentId.IMAGE,
            overrides: {
              source: {
                type: Sdn.ValueType.EXACT,
                value: "/wordmark-light.svg",
              },
              width: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Resize.FIT,
              },
              height: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.REM, value: 1 },
              },
            },
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
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
        },
        children: [
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
                    value: Sdn.BackgroundKind.NONE,
                  },
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
                    value: "Expertise",
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
                  wrapText: {
                    type: Sdn.ValueType.OPTION,
                    value: false,
                  },
                },
              },
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-expandMore",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.small",
                  },
                  color: {
                    type: Sdn.ValueType.COMPUTED,
                    value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.LINK,
            variant: "plain",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Services" },
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
              wrapText: {
                type: Sdn.ValueType.OPTION,
                value: false,
              },
            },
          },
          {
            component: Seldon.ComponentId.LINK,
            variant: "plain",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Study Case" },
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
              wrapText: {
                type: Sdn.ValueType.OPTION,
                value: false,
              },
            },
          },
          {
            component: Seldon.ComponentId.LINK,
            variant: "plain",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "About" },
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
              wrapText: {
                type: Sdn.ValueType.OPTION,
                value: false,
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
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-email",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "label",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "Contact",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "compact",
      label: "Compact",
      intent:
        "Brand with inline navigation, a language toggle, and a filled primary action.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            { component: Seldon.ComponentId.IMAGE },
            { component: Seldon.ComponentId.IMAGE },
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
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Expertise" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Services" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Study Case" },
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
                textDecoration: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextDecoration.UNDERLINE,
                },
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Contact Us" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
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
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "EN" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  weight: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontWeight.bold",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: " | " },
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
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "JP" },
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
          ],
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
                  value: "@swatch.primary",
                },
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
                content: { type: Sdn.ValueType.EXACT, value: "Start Project" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "centered",
      label: "Centered",
      intent:
        "Navigation on the left, brand centered, and a text action on the right.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "What We Do" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Our Work" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Contact Us" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
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
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            { component: Seldon.ComponentId.IMAGE },
            { component: Seldon.ComponentId.IMAGE },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
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
                      value: Sdn.BackgroundKind.NONE,
                    },
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
                    content: { type: Sdn.ValueType.EXACT, value: "Let's Talk" },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.primary",
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
      id: "menu",
      label: "Menu",
      intent:
        "Menu trigger on the left, centered wordmark, and a search action on the right.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
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
                      value: Sdn.BackgroundKind.NONE,
                    },
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
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-menu",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.COMPUTED,
                      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Menu" },
                    color: {
                      type: Sdn.ValueType.COMPUTED,
                      value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            { component: Seldon.ComponentId.IMAGE },
            { component: Seldon.ComponentId.IMAGE },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
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
                      value: Sdn.BackgroundKind.NONE,
                    },
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
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-phone",
                    },
                    size: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@size.small",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.primary",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Let's Talk" },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.primary",
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
      id: "inlineLinks",
      label: "Inline Links",
      intent:
        "Brand with inline links and a text action beside a filled primary action.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Services" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Our Work" },
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
                wrapText: {
                  type: Sdn.ValueType.OPTION,
                  value: false,
                },
              },
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
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.comfortable",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Contact" },
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
                      value: "@swatch.primary",
                    },
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
                      value: "Let's Connect",
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
              ],
            },
            {
              component: Seldon.ComponentId.IMAGE,
              overrides: {
                source: {
                  type: Sdn.ValueType.EXACT,
                  value: "/logo.svg",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
                height: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@dimension.xsmall",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "spread",
      label: "Spread",
      intent:
        "Brand on the left, evenly spread navigation, and a language toggle on the right.",
      overrides: {
        padding: {
          top: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.cozy",
          },
          right: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.comfortable",
          },
          bottom: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.cozy",
          },
          left: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@padding.comfortable",
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            { component: Seldon.ComponentId.IMAGE },
            { component: Seldon.ComponentId.IMAGE },
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
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.comfortable",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "What We Do" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Project" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Contact" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
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
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_RIGHT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          },
          children: [
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "EN" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  weight: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontWeight.semibold",
                  },
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: " | " },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.LINK,
              variant: "plain",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "JP" },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
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
