/**
 * Simple case conversion utilities to avoid external dependencies
 */

/**
 * Convert string to PascalCase
 */
export function pascalCase(str: string): string {
  const words = str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .replace(/[^a-zA-Z0-9\s_]/g, " ") // Remove special characters except underscores
    .split(/[\s_]+/) // Split on spaces and underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  // Join words and add underscores between letters and numbers
  return words.join("").replace(/([a-zA-Z])(\d)/g, "$1_$2")
}

/**
 * Convert string to camelCase
 */
export function camelCase(str: string): string {
  const pascal = pascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Add dash before capital letters
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters except dashes
    .split(/[\s-]+/) // Split on spaces and dashes
    .map((word) => word.toLowerCase())
    .join("-")
}
