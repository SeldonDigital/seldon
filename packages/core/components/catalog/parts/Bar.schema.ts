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
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
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
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        brightness: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 50 },
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
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      topRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
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
        component: Seldon.ComponentId.TEXT,
        variant: "title",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Title",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
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
  variants: [
    {
      id: "buttonBar",
      label: "Button Bar",
      intent: "Groups related action buttons in a horizontal bar.",
      children: [
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
    {
      id: "search",
      label: "Search Bar",
      intent:
        "Search field bar with a leading search icon and a clear control.",
      children: [
        {
          component: Seldon.ComponentId.FORM_CONTROL,
          variant: "search",
        },
      ],
    },
    {
      id: "menubar",
      label: "Menu Bar",
      intent: "Horizontal bar of menu triggers that open dropdown menus.",
      overrides: {
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.MENUBAR },
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
        },
        gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.NONE },
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
            ariaHasPopup: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.AriaHasPopup.MENU,
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
              bottomLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "File",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
            ariaHasPopup: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.AriaHasPopup.MENU,
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
              bottomLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "Edit",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
            ariaHasPopup: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.AriaHasPopup.MENU,
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
              bottomLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "View",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
            ariaHasPopup: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.AriaHasPopup.MENU,
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
              bottomLeft: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "Help",
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
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.TABLIST },
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
          bottom: { type: Sdn.ValueType.OPTION, value: Sdn.Padding.NONE },
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
        corners: {
          topLeft: { type: Sdn.ValueType.EMPTY, value: null },
          topRight: { type: Sdn.ValueType.EMPTY, value: null },
          bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
          bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.tight",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "Tab 1",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "Tab 2",
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
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
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
              },
              bottomRight: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Corner.SQUARED,
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
                  value: "Tab 3",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "breadcrumbs",
      label: "Breadcrumbs Bar",
      intent: "Shows the path of pages leading to the current view.",
      overrides: {
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.NAVIGATION },
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
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
              value: { unit: Sdn.Unit.PERCENT, value: 50 },
            },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "iconic",
          overrides: {
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.hairline",
              },
              color: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Color.TRANSPARENT,
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
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-chevronRight",
            },
            size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.small" },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
          },
        },
        {
          component: Seldon.ComponentId.LINK,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Home",
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
            },
            textDecoration: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextDecoration.NONE,
            },
          },
        },
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-chevronRight",
            },
            size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.small" },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
          },
        },
        {
          component: Seldon.ComponentId.LINK,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Profile",
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
            },
            textDecoration: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextDecoration.NONE,
            },
          },
        },
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-chevronRight",
            },
            size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.small" },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
          },
        },
        {
          component: Seldon.ComponentId.LINK,
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Settings",
            },
            ariaCurrent: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.AriaCurrent.PAGE,
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
            },
            textDecoration: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.TextDecoration.NONE,
            },
          },
        },
      ],
    },
    {
      id: "navigation",
      label: "Navigation Bar",
      intent:
        "Provides primary navigation controls for traversing sections or views.",
      overrides: {
        role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.NAVIGATION },
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
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.NONE,
            },
          },
        ],
        corners: {
          topLeft: { type: Sdn.ValueType.EMPTY, value: null },
          topRight: { type: Sdn.ValueType.EMPTY, value: null },
          bottomLeft: { type: Sdn.ValueType.EMPTY, value: null },
          bottomRight: { type: Sdn.ValueType.EMPTY, value: null },
        },
        borderTop: {
          preset: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@border.hairline",
          },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
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
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.MATCH,
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
                  value: "Home",
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
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.MATCH,
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
                  value: "Search",
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
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.MATCH,
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
                  value: "Favorites",
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
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.MATCH,
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
                  value: "Profile",
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
                kind: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.BackgroundKind.COLOR,
                },
                color: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Color.TRANSPARENT,
                },
                brightness: { type: Sdn.ValueType.EMPTY, value: null },
                opacity: { type: Sdn.ValueType.EMPTY, value: null },
              },
            ],
            border: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@border.normal",
              },
              color: {
                type: Sdn.ValueType.COMPUTED,
                value: Sdn.ComputedFunction.MATCH,
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
                  value: "Settings",
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
                    value: "@fontSize.xsmall",
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
