import * as Sdn from "../../../properties";
import * as Seldon from "../../constants";
import { ComponentExport, ComponentSchema } from "../../types";





export const schema = {
  id: Seldon.ComponentId.THEME_SPEC,
  name: "Theme Spec Sheet",
  intent:
    "A screen that showcases a theme by composing a topbar, a color specimen, and a links footer.",
  tags: ["screen", "theme", "spec", "specimen"],
  level: Seldon.ComponentLevel.SCREEN,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    screenWidth: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    screenHeight: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
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
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
    },
    background: [
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
    ],
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
  },
  default: {
    children: [
      { component: Seldon.ComponentId.TOPBAR },
      { component: Seldon.ComponentId.JOIN_CTA },
      { component: Seldon.ComponentId.COLOR_SPECIMEN },
      { component: Seldon.ComponentId.ORDINAL_SPECIMEN },
      {
        component: Seldon.ComponentId.FOOTER,
        variant: "standard",
      },
    ],
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}