import { Theme, ValueType, Workspace } from "@seldon/core"
import { applyCompoundPreset as coreApplyCompoundPreset } from "@seldon/core/helpers/properties/properties-bridge"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import {
  getCompoundLayerValue,
  isLayeredPaintRoot,
} from "@lib/properties/property-paths"
import { getPropertiesSubjectId } from "./properties-data"
import { getParentPropertyKey } from "./property-types"

/**
 * Creates a preset property update with theme token handling
 * @param presetPropertyKey - The preset property key
 * @param presetValue - The preset value (can be theme token or preset name)
 * @param workspace - Current workspace
 * @param node - Node to update
 * @param theme - Optional theme for token resolution
 * @returns Update object for the preset property
 */
export function createPresetPropertyUpdate(
  presetPropertyKey: string,
  presetValue: string,
  workspace: Workspace,
  node: Variant | Instance | Board,
  theme?: Theme,
): Record<string, unknown> {
  const parentKey = getParentPropertyKey(presetPropertyKey)
  let presetForCore: string = presetValue
  let tokenForPreset: string | null = null

  if (typeof presetValue === "string" && presetValue.startsWith("@") && theme) {
    const token = presetValue.substring(1)
    const [section, id] = token.split(".")
    const sectionObj = (theme as Record<string, unknown>)[section]
    if (
      sectionObj &&
      (sectionObj as Record<string, unknown>)[id] &&
      typeof (sectionObj as Record<string, unknown>)[id] === "object" &&
      "name" in ((sectionObj as Record<string, unknown>)[id] as object)
    ) {
      presetForCore = String(
        ((sectionObj as Record<string, unknown>)[id] as { name: string }).name,
      )
      tokenForPreset = `@${section}.${id}`
    }
  }

  const applied = coreApplyCompoundPreset(
    parentKey,
    presetForCore,
    getPropertiesSubjectId(node),
    workspace as unknown as Workspace,
    theme,
  ) as Record<string, unknown>

  if (tokenForPreset && applied && applied[parentKey]) {
    const presetCell = {
      type: ValueType.THEME_CATEGORICAL,
      value: tokenForPreset,
    }
    if (isLayeredPaintRoot(parentKey)) {
      const layer = getCompoundLayerValue(applied[parentKey]) ?? {}
      applied[parentKey] = [{ ...layer, preset: presetCell }]
    } else {
      applied[parentKey] = {
        ...(applied[parentKey] as Record<string, unknown>),
        preset: presetCell,
      }
    }
  }

  return applied
}
