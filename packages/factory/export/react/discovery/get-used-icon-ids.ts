import { ValueType, Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { IconId } from "@seldon/core/components/icons"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"

/**
 * Collect all icon IDs used in a workspace
 *
 * This function recursively traverses the workspace and collects all icon IDs
 * used in component properties, including nestedOverrides properties.
 *
 * @param workspace - The workspace to analyze
 * @returns Set of used icon IDs
 */

export function getUsedIconIds(workspace: Workspace): Set<IconId> {
  const usedIcons = new Set<IconId>(["__default__"]) // Always include default
  const values = Object.values(workspace.byId)

  for (const value of values) {
    // Check direct symbol properties
    const properties = getNodeProperties(value, workspace)
    if (
      properties?.symbol?.value &&
      properties.symbol.type === ValueType.PRESET
    ) {
      usedIcons.add(properties.symbol.value as IconId)
    }

    // Check nestedOverrides properties in the component schema
    const schema = getComponentSchema(value.component)
    if ("children" in schema && schema.children) {
      for (const child of schema.children) {
        if (child.nestedOverrides) {
          for (const [key, nestedOverridesValue] of Object.entries(
            child.nestedOverrides,
          )) {
            // Check if this is an icon.symbol nestedOverrides property
            if (
              key === "icon.symbol" &&
              typeof nestedOverridesValue === "string"
            ) {
              usedIcons.add(nestedOverridesValue as IconId)
            }
          }
        }
      }
    }
  }

  return usedIcons
}
