import {
  ThemeOptionId,
  ThemeTokenNamespace,
  ThemeValueKey,
} from "../../themes/types"
import { isThemeValueKey } from "../validation/theme"

/**
 * Tolerant `@section.optionId` parser. Returns null when the value is not a
 * string, lacks the `@` prefix, or has no dot-separated option id. The option
 * id keeps everything after the first dot, so multi-segment ids stay intact.
 */
export function parseThemeRef(
  value: unknown,
): { section: string; optionId: string } | null {
  if (typeof value !== "string" || !value.startsWith("@")) {
    return null
  }
  const path = value.slice(1)
  const dot = path.indexOf(".")
  if (dot <= 0 || dot === path.length - 1) {
    return null
  }
  return { section: path.slice(0, dot), optionId: path.slice(dot + 1) }
}

/**
 * Parses a theme value key into its section and option components
 *
 * @param key - The theme value key to parse (e.g., "@fontSize.medium", "@swatch.primary")
 * @returns An object containing the section and optionId components
 * @throws Error if the key is not a valid theme value key
 */
export function getThemeKeyComponents(key: ThemeValueKey): {
  section: ThemeTokenNamespace
  optionId: ThemeOptionId
} {
  if (!isThemeValueKey(key)) {
    throw new Error(`${key} is not a valid theme value`)
  }

  const parsed = parseThemeRef(key)
  if (!parsed) {
    throw new Error(`${key} is not a valid theme value`)
  }

  return {
    section: parsed.section as ThemeTokenNamespace,
    optionId: parsed.optionId as ThemeOptionId,
  }
}
