/**
 * Icon Set ID type - defines which icon sets are available
 * Re-exported from icons for convenience
 */
export type IconSetId = "google-material" | "carbon" | "lucide" | "seldon"

/**
 * Display state for icons in an icon set
 */
export enum IconSetDisplay {
  INCLUDE = "include",
  EXCLUDE = "exclude",
}

/**
 * Flattened icon variant structure stored in IconSet.variants
 * This is a minimal representation for performance - doesn't create full workspace variants
 */
export interface IconSetVariant {
  iconId: string
  display: IconSetDisplay
}

/**
 * Icon Set structure
 * Represents a collection of icons (e.g., Google Material Design, Carbon, Lucide)
 */
export interface IconSet {
  id: IconSetId
  label: string
  screenWidth: string
  variants: IconSetVariant[]
}
