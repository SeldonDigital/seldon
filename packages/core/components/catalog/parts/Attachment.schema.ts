import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Attachment",
  id: Seldon.ComponentId.ATTACHMENT,
  intent: "Shows an attached file with its name, size, and a control to remove it.",
  tags: ["attachment", "file", "upload", "document", "chip", "part", "UI"],
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
      value: Sdn.Orientation.HORIZONTAL,
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
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
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
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "material-attachFile" },
            },
          },
        ],
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
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "proposal.pdf" },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "128 KB" },
            },
          },
        ],
      },
      {
        component: Seldon.ComponentId.BAR,
        variant: "buttonBar",
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        },
        children: [
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              ariaLabel: { type: Sdn.ValueType.EXACT, value: "Remove attachment" },
            },
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "image",
      label: "Image Attachment",
      intent: "Shows an attached image with a thumbnail instead of a file icon.",
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
            clip: { type: Sdn.ValueType.OPTION, value: true },
            corners: {
              topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
              topRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
              bottomLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
              bottomRight: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.tight" },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.IMAGE,
              overrides: {
                imageFit: { type: Sdn.ValueType.OPTION, value: Sdn.ImageFit.COVER },
                altText: { type: Sdn.ValueType.EXACT, value: "Attachment preview" },
              },
            },
          ],
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
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "cover.png" },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "2.4 MB" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                ariaLabel: { type: Sdn.ValueType.EXACT, value: "Remove attachment" },
              },
            },
          ],
        },
      ],
    },
    {
      id: "compact",
      label: "Compact Attachment",
      intent: "Names the file only, for dense lists where size is not useful.",
      overrides: {
        gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: { type: Sdn.ValueType.OPTION, value: "material-attachFile" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.VERTICAL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "proposal.pdf" },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BAR,
          variant: "buttonBar",
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                ariaLabel: { type: Sdn.ValueType.EXACT, value: "Remove attachment" },
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
