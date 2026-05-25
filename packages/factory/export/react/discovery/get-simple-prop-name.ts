// HTML element properties that might conflict and need "Props" suffix
const HTML_ELEMENT_PROPERTIES = new Set(["title", "lang", "dir", "spellCheck"])

/**
 * Creates a simplified prop name from a component path
 *
 * - Removes parent component name from the path
 * - Moves numbers from beginning to end
 * - Only adds "Props" suffix when the name would conflict with
 *   HTML element properties
 *
 * @param path - The full path like "cardProduct.details.buttonBar.button1.icon"
 * @param parentComponentName - The parent component name to remove (e.g., "cardProduct")
 * @returns Simplified prop name like "icon1", "barButtons", or "titleProps"
 */
export function getSimplePropName(
  path: string,
  parentComponentName?: string,
): string {
  const parts = path.split(".")

  // Remove parent component name if it matches the first part
  if (parentComponentName && parts[0] === parentComponentName) {
    parts.shift()
  }

  // Get the last part of the path (the actual component name)
  let componentName = parts[parts.length - 1]

  // Move numbers from beginning to end
  const numberMatch = componentName.match(/^(\d+)(.+)/)
  if (numberMatch) {
    const [, number, name] = numberMatch
    componentName = name + number
  }

  // Add "Props" suffix only if it would conflict with
  // HTML element properties
  if (HTML_ELEMENT_PROPERTIES.has(componentName)) {
    componentName += "Props"
  }

  return componentName
}
