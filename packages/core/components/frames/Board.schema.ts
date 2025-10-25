import * as Sdn from "../../properties"
import * as Seldon from "../constants"
import { ComponentExport, ComponentSchema } from "../types"

/**
 * ⚠️ CRITICAL SYSTEM COMPONENT ⚠️
 *
 * This is the Board schema - a system-critical component that defines the properties
 * available for all component boards in the workspace.
 *
 * DO NOT MODIFY THIS SCHEMA without understanding the full impact:
 * - This affects ALL boards in ALL workspaces
 * - Changes may break existing board configurations
 * - Property additions/removals require workspace migrations
 * - This schema is used for validation, UI generation, and export
 *
 * If you need to modify board properties, consider:
 * 1. Adding new properties (requires migration)
 * 2. Changing default values (requires migration)
 * 3. Removing properties (requires migration and may break existing boards)
 *
 * Always test changes with existing workspaces before deploying.
 */
export const schema = {
  id: Seldon.ComponentId.BOARD,
  name: "Board",
  intent:
    "System component that defines the properties available for component boards. Boards are containers for component variants and provide layout, sizing, and appearance properties for the entire component system.",
  tags: [
    "board",
    "system",
    "container",
    "layout",
    "workspace",
    "component",
    "variants",
  ],
  level: Seldon.ComponentLevel.FRAME,
  icon: Seldon.ComponentIcon.FRAME,
  restrictions: {
    addChildren: true,
    reorderChildren: true,
  },
  children: [],
  properties: {
    // LAYOUT
    screenWidth: { type: Sdn.ValueType.PRESET, value: Sdn.Resize.FIT },
    screenHeight: { type: Sdn.ValueType.PRESET, value: Sdn.Resize.FIT },
    orientation: {
      type: Sdn.ValueType.PRESET,
      value: Sdn.Orientation.VERTICAL,
    },
    align: { type: Sdn.ValueType.EMPTY, value: null },
    gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.cozy" },
    },
    direction: { type: Sdn.ValueType.PRESET, value: Sdn.Direction.LTR },

    // APPEARANCE
    background: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      color: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@swatch.white",
      },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      image: { type: Sdn.ValueType.EMPTY, value: null },
      position: { type: Sdn.ValueType.EMPTY, value: null },
      size: { type: Sdn.ValueType.EMPTY, value: null },
      repeat: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gradient: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      gradientType: { type: Sdn.ValueType.EMPTY, value: null },
      angle: { type: Sdn.ValueType.EMPTY, value: null },
      startColor: { type: Sdn.ValueType.EMPTY, value: null },
      startBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      startOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      startPosition: { type: Sdn.ValueType.EMPTY, value: null },
      endColor: { type: Sdn.ValueType.EMPTY, value: null },
      endOpacity: { type: Sdn.ValueType.EMPTY, value: null },
      endBrightness: { type: Sdn.ValueType.EMPTY, value: null },
      endPosition: { type: Sdn.ValueType.EMPTY, value: null },
    },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLDiv" },
}
