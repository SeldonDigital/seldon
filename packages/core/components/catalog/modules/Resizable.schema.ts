import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Resizable",
  id: Seldon.ComponentId.RESIZABLE,
  intent: "Splits a region into panels the reader can resize by dragging the handle between them.",
  tags: ["resizable", "split", "panels", "handle", "layout", "module", "UI"],
  level: Seldon.ComponentLevel.MODULE,
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
      value: Sdn.Orientation.HORIZONTAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
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
      type: Sdn.ValueType.OPTION,
      value: false,
    },
    clip: { type: Sdn.ValueType.OPTION, value: true },
    resize: { type: Sdn.ValueType.EMPTY, value: null },
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
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
    ariaValueNow: { type: Sdn.ValueType.EXACT, value: 50 },
    ariaValueMin: { type: Sdn.ValueType.EXACT, value: 0 },
    ariaValueMax: { type: Sdn.ValueType.EXACT, value: 100 },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          resize: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
        },
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.COL_RESIZE },
          width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          background: [
            {
              kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
              color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
            },
          ],
          role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.SEPARATOR },
          ariaLabel: { type: Sdn.ValueType.EXACT, value: "Resize panels" },
        },
      },
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
        },
      },
    ],
  },
  variants: [
    {
      id: "vertical",
      label: "Vertical",
      intent: "Stacks the panels and drags the handle up and down.",
      overrides: {
        orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            resize: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.ROW_RESIZE },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
              },
            ],
            role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.SEPARATOR },
            ariaLabel: { type: Sdn.ValueType.EXACT, value: "Resize panels" },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          },
        },
      ],
    },
    {
      id: "threePanel",
      label: "Three Panels",
      intent: "Splits the region into three panels with a handle between each pair.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            resize: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.COL_RESIZE },
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
              },
            ],
            role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.SEPARATOR },
            ariaLabel: { type: Sdn.ValueType.EXACT, value: "Resize panels" },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            resize: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.COL_RESIZE },
            width: { type: Sdn.ValueType.THEME_ORDINAL, value: "@dimension.tiny" },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            background: [
              {
                kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
                color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.gray" },
              },
            ],
            role: { type: Sdn.ValueType.OPTION, value: Sdn.AriaRole.SEPARATOR },
            ariaLabel: { type: Sdn.ValueType.EXACT, value: "Resize panels" },
          },
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
