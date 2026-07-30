import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Alert",
  id: Seldon.ComponentId.ALERT,
  intent: "Calls out a status or consequence inline, next to the content it concerns.",
  tags: ["alert", "banner", "callout", "notice", "status", "inline", "element", "UI"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
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
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
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
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
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
        kind: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.BackgroundKind.COLOR,
        },
        color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
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
      bottomLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
      bottomRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
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
    role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.ALERT },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
    ariaLive: { type: Sdn.ValueType.OPTION, value: Sdn.AriaLive.POLITE },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.ICON,
        overrides: {
          symbol: { type: Sdn.ValueType.OPTION, value: "material-info" },
          color: { type: Sdn.ValueType.COMPUTED, value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR },
        },
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Heads up!" },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "You can add components to your app using the CLI.",
              },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "destructive",
      label: "Destructive",
      intent: "Reports a failure or a consequence the user should not miss.",
      overrides: {
        background: [
          {
            kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
            color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.negative" },
            brightness: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 90 } },
          },
        ],
        border: {
          preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
          color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.negative" },
        },
        ariaLive: { type: Sdn.ValueType.OPTION, value: Sdn.AriaLive.ASSERTIVE },
      },
    },
    {
      id: "success",
      label: "Success",
      intent: "Confirms that an action finished as intended.",
      overrides: {
        background: [
          {
            kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
            color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.positive" },
            brightness: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 90 } },
          },
        ],
        border: {
          preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
          color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.positive" },
        },
      },
    },
    {
      id: "warning",
      label: "Warning",
      intent: "Flags a condition the user should resolve before continuing.",
      overrides: {
        background: [
          {
            kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
            color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.warning" },
            brightness: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 90 } },
          },
        ],
        border: {
          preset: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
          color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.warning" },
        },
      },
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
