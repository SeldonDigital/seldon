import { FONT_COLLECTIONS } from "../collections"

/**
 * Finds the display name for a stored font family value across packaged collections.
 * Matches the value a picker stores (`family.stack` for local families, `family.name`
 * for remote families) and returns the friendly `name`. Returns null when no family
 * matches, so callers can fall back to the raw value.
 */
export function getFamilyNameByValue(value: string): string | null {
  for (const collection of FONT_COLLECTIONS) {
    for (const family of Object.values(collection.families)) {
      if ((family.stack ?? family.name) === value) {
        return family.name
      }
    }
  }
  return null
}
