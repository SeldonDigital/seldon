import * as Sdn from "../../../properties";
import * as Seldon from "../../constants";
import { ComponentExport, ComponentSchema } from "../../types";





export const schema = {
  name: "Avatar",
  id: Seldon.ComponentId.AVATAR,
  intent:
    "Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.",
  tags: [
    "avatar",
    "user image",
    "profile",
    "identity",
    "initials",
    "picture",
    "circle",
    "UI element",
  ],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.DEFAULT,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
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
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
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
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.normal",
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
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      topRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomLeft: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
      },
      bottomRight: {
        type: Sdn.ValueType.OPTION,
        value: Sdn.Corner.ROUNDED,
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
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.IMAGE,
        overrides: {
          source: {
            type: Sdn.ValueType.EXACT,
            value: "/avatar-user.png",
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
  variants: [
    {
      id: "square",
      label: "Square Avatar",
      intent:
        "Renders a square avatar for representing users, roles, or statuses.",
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
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
          bottomRight: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
        },
      },
    },
    {
      id: "gradient",
      label: "Gradient Bordered Avatar",
      intent:
        "Renders a gradient bordered avatar for representing users, roles, or statuses.",
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
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
          bottomRight: {
            type: Sdn.ValueType.THEME_ORDINAL,
            value: "@corners.tight",
          },
        },
      },
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
};