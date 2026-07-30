import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Empty State",
  id: Seldon.ComponentId.EMPTY,
  intent: "Explains why a region has no content yet and offers the action that fills it.",
  tags: ["empty", "empty state", "placeholder", "zero state", "blank", "part", "UI"],
  level: Seldon.ComponentLevel.PART,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    wrapperElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.WrapperElement.DIV,
    },
    cursor: { type: Sdn.ValueType.EMPTY, value: null },
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
    align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
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
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.open" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.open" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.open" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.open" },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: false },
    columnStart: { type: Sdn.ValueType.EMPTY, value: null },
    columnSpan: { type: Sdn.ValueType.EMPTY, value: null },
    rowStart: { type: Sdn.ValueType.EMPTY, value: null },
    rowSpan: { type: Sdn.ValueType.EMPTY, value: null },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.BackgroundKind.NONE,
        },
        color: { type: Sdn.ValueType.EMPTY, value: null },
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
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "material-inbox" },
              size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.large" },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "title",
        overrides: {
          content: { type: Sdn.ValueType.EXACT, value: "No projects yet" },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.TEXT,
        variant: "description",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Create your first project to get started.",
          },
          textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
        },
      },
      {
        component: Seldon.ComponentId.BAR,
        variant: "buttonBar",
        overrides: {
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
        },
        children: [
          {
            component: Seldon.ComponentId.BUTTON,
            overrides: {
              ariaLabel: { type: Sdn.ValueType.EXACT, value: "Create project" },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "avatarEmpty",
      label: "Avatar Empty State",
      intent: "Empty state for a person or account region, led by an avatar.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          },
          children: [{ component: Seldon.ComponentId.AVATAR }],
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "No members yet" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Invite someone to collaborate on this project.",
            },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              overrides: {
                ariaLabel: { type: Sdn.ValueType.EXACT, value: "Invite member" },
              },
            },
          ],
        },
      ],
    },
    {
      id: "search",
      label: "No Results",
      intent: "Reports that a search returned nothing, without offering an action.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: { type: Sdn.ValueType.OPTION, value: "material-search" },
                size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.large" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "title",
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "No results found" },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Try a different search term.",
            },
            textAlign: { type: Sdn.ValueType.OPTION, value: Sdn.TextAlign.CENTER },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
