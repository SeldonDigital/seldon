import { pascalCase } from "../utils/case-utils"

/**
 * Converts an icon ID to its component name
 *
 * @param key - The icon ID (e.g., "material-add" or "__default__")
 * @returns The component name (e.g., "IconMaterialAdd" or "IconDefault")
 */
export function getIconComponentName(key: string): string {
  if (key === "__default__") {
    return "IconDefault"
  }
  return `Icon${pascalCase(key)}`
}
