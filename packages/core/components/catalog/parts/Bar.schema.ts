import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Bar",
  id: Seldon.ComponentId.BAR,
  intent:
    "Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.",
  tags: [
    "bar",
    "controls",
    "buttons",
    "navigation",
    "tabs",
    "UI",
    "layout",
    "group",
  ],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    position: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_RIGHT,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.cozy",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: true,
    },
    clip: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@background.none",
        },
        image: { type: Sdn.ValueType.EMPTY, value: null },
        position: { type: Sdn.ValueType.EMPTY, value: null },
        size: { type: Sdn.ValueType.EMPTY, value: null },
        repeat: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        blendMode: { type: Sdn.ValueType.EMPTY, value: null },
        filter: { type: Sdn.ValueType.EMPTY, value: null },
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
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderTop: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderRight: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderBottom: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderLeft: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
      collapse: { type: Sdn.ValueType.EMPTY, value: null },
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
        offsetX: { type: Sdn.ValueType.EMPTY, value: null },
        offsetY: { type: Sdn.ValueType.EMPTY, value: null },
        blur: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
        spread: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
          background: [
            {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@background.none",
              },
              image: { type: Sdn.ValueType.EMPTY, value: null },
              position: { type: Sdn.ValueType.EMPTY, value: null },
              size: { type: Sdn.ValueType.EMPTY, value: null },
              repeat: { type: Sdn.ValueType.EMPTY, value: null },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.swatch1",
              },
              blendMode: { type: Sdn.ValueType.EMPTY, value: null },
              filter: { type: Sdn.ValueType.EMPTY, value: null },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          ],
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-add",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Add",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: {
                type: Sdn.ValueType.OPTION,
                value: "material-remove",
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "Remove",
              },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.BUTTON,
        overrides: {
          display: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Display.SHOW,
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "navigation",
      label: "Navigation Bar",
      intent:
        "Provides primary navigation controls for traversing sections or views.",
      overrides: {
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
        },
        position: {
          bottom: {
            type: Sdn.ValueType.EXACT,
            value: {
              value: 0,
              unit: Sdn.Unit.PX,
            },
          },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        wrapChildren: {
          type: Sdn.ValueType.EXACT,
          value: false,
        },
        border: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.none",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.black",
          },
          brightness: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 75,
            },
          },
        },
        borderBottom: {
          opacity: {
            type: Sdn.ValueType.EXACT,
            value: {
              unit: Sdn.Unit.PERCENT,
              value: 100,
            },
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
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
            background: [
              {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@background.none",
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
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: {
                    basedOn: "#background.color",
                  },
                },
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-home",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Home",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
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
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
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
            background: [
              {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@background.none",
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: {
                    basedOn: "#background.color",
                  },
                },
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-search",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Search",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
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
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
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
            background: [
              {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@background.none",
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: {
                    basedOn: "#background.color",
                  },
                },
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-favorite",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Favorites",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
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
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
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
            background: [
              {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@background.none",
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: {
                    basedOn: "#background.color",
                  },
                },
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-accountCircle",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Profile",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
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
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            width: {
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
            background: [
              {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@background.none",
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: {
                  function: Sdn.ComputedFunction.MATCH,
                  input: {
                    basedOn: "#background.color",
                  },
                },
              },
            },
            corners: {
              topLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              topRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomLeft: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
              bottomRight: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@corners.tight",
              },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-settings",
                },
                size: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@size.medium",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Settings",
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.normal",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "tabs",
      label: "Tabs Bar",
      intent:
        "Provides a horizontal tab bar for organizing content into selectable sections.",
      overrides: {
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
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
        wrapChildren: {
          type: Sdn.ValueType.EXACT,
          value: false,
        },
        background: [
          {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@background.none",
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
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Tab 1",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Tab 2",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Tab 3",
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
