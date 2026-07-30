import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"

import type { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Carousel",
  id: Seldon.ComponentId.CAROUSEL,
  intent: "Scrolls through a row of cards, one page at a time.",
  tags: ["carousel", "slider", "gallery", "slideshow", "scroller", "module", "UI"],
  level: Seldon.ComponentLevel.MODULE,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    wrapperElement: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.WrapperElement.DIV,
    },
    cursor: { type: Sdn.ValueType.EMPTY, value: null },
    placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.RELATIVE },
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
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
    scrollbarStyle: { type: Sdn.ValueType.EMPTY, value: null },
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: { type: Sdn.ValueType.OPTION, value: false },
    ariaLive: { type: Sdn.ValueType.OPTION, value: Sdn.AriaLive.POLITE },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          clip: { type: Sdn.ValueType.OPTION, value: true },
          scroll: { type: Sdn.ValueType.OPTION, value: Sdn.Scroll.HORIZONTAL },
          scrollbarStyle: { type: Sdn.ValueType.OPTION, value: Sdn.ScrollbarStyle.HIDDEN },
        },
        children: [
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.HORIZONTAL },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
            },
            children: [
              { component: Seldon.ComponentId.CARD_STACKED },
              { component: Seldon.ComponentId.CARD_STACKED },
              { component: Seldon.ComponentId.CARD_STACKED },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.BUTTON,
        variant: "iconic",
        overrides: {
          placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
          position: {
            top: { type: Sdn.ValueType.EMPTY, value: null },
            right: { type: Sdn.ValueType.EMPTY, value: null },
            bottom: { type: Sdn.ValueType.EMPTY, value: null },
            left: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PX, value: 0 } },
          },
          ariaLabel: { type: Sdn.ValueType.EXACT, value: "Previous slide" },
        },
      },
      {
        component: Seldon.ComponentId.BUTTON,
        variant: "iconic",
        overrides: {
          placement: { type: Sdn.ValueType.OPTION, value: Sdn.Placement.ABSOLUTE },
          position: {
            top: { type: Sdn.ValueType.EMPTY, value: null },
            right: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PX, value: 0 } },
            bottom: { type: Sdn.ValueType.EMPTY, value: null },
            left: { type: Sdn.ValueType.EMPTY, value: null },
          },
          ariaLabel: { type: Sdn.ValueType.EXACT, value: "Next slide" },
        },
      },
      {
        component: Seldon.ComponentId.BAR,
        overrides: {
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
        },
        children: [
          { component: Seldon.ComponentId.CHIP, variant: "iconic" },
          { component: Seldon.ComponentId.CHIP, variant: "iconic" },
          { component: Seldon.ComponentId.CHIP, variant: "iconic" },
        ],
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
