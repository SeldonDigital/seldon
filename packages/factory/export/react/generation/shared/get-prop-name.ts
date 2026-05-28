import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Retrieves a prop name from the prop names map.
 *
 * Throws an error if the path is not found, ensuring all prop references are valid.
 *
 * @param path - Node path to look up (e.g., "button.icon")
 * @param propNamesMap - Map of node paths to prop names
 * @param componentName - Component name for error messages
 * @returns The prop name for the given path
 * @throws Error if path is not found in the map
 */
export function getPropName(
  path: string,
  propNamesMap: Map<string, string>,
  componentName: string,
): string {
  const propName = propNamesMap.get(path)
  if (!propName) {
    throw new Error(
      `Prop path "${path}" not found in propNamesMap for component "${componentName}"`,
    )
  }
  return propName
}
