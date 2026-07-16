/**
 * Derives stable identifiers for an authored component board from its
 * human-entered name. The board key follows the camelCase convention used by
 * catalog board keys, and the export name follows the PascalCase convention
 * used by generated component files.
 */

function splitWords(name: string): string[] {
  return name
    .trim()
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
}

/** camelCase workspace board key derived from an authored component name. */
export function authoredBoardKeyFromName(name: string): string {
  const words = splitWords(name)
  return words
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("")
}

/** PascalCase export component name derived from an authored component name. */
export function authoredExportNameFromName(name: string): string {
  const words = splitWords(name)
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}
