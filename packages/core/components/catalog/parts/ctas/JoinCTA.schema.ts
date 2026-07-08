import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Join CTA",
  id: Seldon.ComponentId.JOIN_CTA,
  intent:
    "Horizontal affiliate call to action with left-aligned copy and a dark action button, paired with an orbit of avatars around concentric dashed rings and a center logo.",
  tags: [
    "cta",
    "call to action",
    "part",
    "join",
    "affiliate",
    "orbit",
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
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_LEFT,
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
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
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
      topLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
      },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.cozy",
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
            value: Sdn.Align.CENTER_LEFT,
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Become a Contributor",
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.gray",
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
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Explore the codebase",
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
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
              lines: { type: Sdn.ValueType.EXACT, value: 8 },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value:
                  "Experiment with Seldon's open source codebase and see how it can be used to create a consistent and user-friendly experience.",
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
              margin: {
                top: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@margin.cozy",
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
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-arrowForward",
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
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "View the repo",
                  },
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
          placement: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Placement.RELATIVE,
          },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          width: {
            type: Sdn.ValueType.EXACT,
            value: { value: 340, unit: Sdn.Unit.PX },
          },
          height: {
            type: Sdn.ValueType.EXACT,
            value: { value: 340, unit: Sdn.Unit.PX },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              placement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Placement.ABSOLUTE,
              },
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 20, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 20, unit: Sdn.Unit.PX },
                },
              },
              width: {
                type: Sdn.ValueType.EXACT,
                value: { value: 300, unit: Sdn.Unit.PX },
              },
              height: {
                type: Sdn.ValueType.EXACT,
                value: { value: 300, unit: Sdn.Unit.PX },
              },
              border: {
                preset: { type: Sdn.ValueType.EMPTY, value: null },
                style: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BorderStyle.DASHED,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.offBlack",
                },
                width: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@borderWidth.small",
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 12, unit: Sdn.Unit.PERCENT },
                },
              },
              corners: {
                topLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                topRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                bottomLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                bottomRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
              },
            },
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              placement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Placement.ABSOLUTE,
              },
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 60, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 60, unit: Sdn.Unit.PX },
                },
              },
              width: {
                type: Sdn.ValueType.EXACT,
                value: { value: 220, unit: Sdn.Unit.PX },
              },
              height: {
                type: Sdn.ValueType.EXACT,
                value: { value: 220, unit: Sdn.Unit.PX },
              },
              border: {
                preset: { type: Sdn.ValueType.EMPTY, value: null },
                style: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BorderStyle.DASHED,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.offBlack",
                },
                width: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@borderWidth.small",
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 12, unit: Sdn.Unit.PERCENT },
                },
              },
              corners: {
                topLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                topRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                bottomLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                bottomRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
              },
            },
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              placement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Placement.ABSOLUTE,
              },
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PX },
                },
              },
              width: {
                type: Sdn.ValueType.EXACT,
                value: { value: 140, unit: Sdn.Unit.PX },
              },
              height: {
                type: Sdn.ValueType.EXACT,
                value: { value: 140, unit: Sdn.Unit.PX },
              },
              border: {
                preset: { type: Sdn.ValueType.EMPTY, value: null },
                style: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BorderStyle.DASHED,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.offBlack",
                },
                width: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@borderWidth.small",
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 12, unit: Sdn.Unit.PERCENT },
                },
              },
              corners: {
                topLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                topRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                bottomLeft: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
                bottomRight: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PERCENT },
                },
              },
            },
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              placement: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Placement.ABSOLUTE,
              },
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 142, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 142, unit: Sdn.Unit.PX },
                },
              },
              align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
              width: {
                type: Sdn.ValueType.EXACT,
                value: { value: 56, unit: Sdn.Unit.PX },
              },
              height: {
                type: Sdn.ValueType.EXACT,
                value: { value: 56, unit: Sdn.Unit.PX },
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
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "seldon-component",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@size.xlarge",
                  },
                  color: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@swatch.gray",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.AVATAR,
            overrides: {
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 60, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PX },
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.AVATAR,
            overrides: {
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 190, unit: Sdn.Unit.PX },
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  source: {
                    type: Sdn.ValueType.EXACT,
                    value: "/avatar-bentley.png",
                  },
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.AVATAR,
            overrides: {
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 70, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 275, unit: Sdn.Unit.PX },
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.AVATAR,
            overrides: {
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 210, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 250, unit: Sdn.Unit.PX },
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  source: {
                    type: Sdn.ValueType.EXACT,
                    value: "/avatar-bentley.png",
                  },
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.AVATAR,
            overrides: {
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 170, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 50, unit: Sdn.Unit.PX },
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  source: {
                    type: Sdn.ValueType.EXACT,
                    value: "/avatar-bentley.png",
                  },
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.AVATAR,
            overrides: {
              position: {
                top: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 290, unit: Sdn.Unit.PX },
                },
                left: {
                  type: Sdn.ValueType.EXACT,
                  value: { value: 100, unit: Sdn.Unit.PX },
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.IMAGE,
                overrides: {
                  width: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                  height: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@dimension.medium",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
