import { camelCase } from "../utils/case-utils"
import { getSimplePropName } from "./get-simple-prop-name"

interface Options {
  isRelativeToRoot?: boolean
  simplifiedPropNames?: boolean
  parentComponentName?: string
}

/**
 * Each node in a JSON tree has a path, relative to the root
 * In most cases the name of the props is the camelCase version
 * of the path + Props
 *
 * In some cases (like in a nested object), we need these to be
 * relative to the root, hence the isRelativeToRoot option
 *
 * When simplifiedPropNames is true, it creates simplified prop names:
 *
 * - Removes parent component name from the path
 * - Moves numbers from beginning to end
 * - Only adds "Props" suffix when the name would conflict with
 *   HTML element properties
 *
 * @param path
 * @param options
 * @returns {string} Name for a specific prop
 */
export function getHumanReadablePropName(
  path: string,
  options?: Options,
): string {
  const {
    isRelativeToRoot = false,
    simplifiedPropNames = false,
    parentComponentName,
  } = options || {}

  if (simplifiedPropNames) {
    return getSimplePropName(path, parentComponentName)
  }

  // Original logic for backward compatibility
  if (!isRelativeToRoot) {
    return camelCase(path) + "Props"
  }

  // If this is a relative path, we need to remove the first part
  const parts = path.split(".")
  if (parts.length === 1) {
    return camelCase(path) + "Props"
  }

  return camelCase(parts.slice(-1).join(".")) + "Props"
}
