import { parsePropertyPath } from "@lib/properties/property-paths"
import { getPropertyCategory } from "@seldon/core/properties/schemas"

export type ControlType = "combo" | "menu" | "number" | "text" | "error"

export interface PropertyOption {
  value: string
  name: string
}

export interface PropertyRegistryEntry {
  label?: string
  /** Icon id rendered by the custom-components Icon wrapper. */
  icon: string
  control?: ControlType
  subProperties?: {
    [subPropertyKey: string]: PropertyRegistryEntry
  }
}

export interface PropertyRegistry {
  [propertyKey: string]: PropertyRegistryEntry
}

/**
 * Runtime UI params for property registry
 * These define presentation-only concerns and are deep-merged with core schemas at runtime
 */
const UI_OVERRIDES: PropertyRegistry = {
  // ========================================
  // 1. ATTRIBUTES PROPERTIES
  // ========================================
  content: {
    icon: "seldon-text",
    control: "text",
  },
  altText: {
    icon: "seldon-text",
    control: "text",
  },
  ariaLabel: {
    icon: "seldon-text",
    control: "text",
  },
  ariaHidden: {
    icon: "seldon-radioOff",
    control: "menu",
  },
  placeholder: {
    icon: "seldon-text",
    control: "text",
  },
  checked: {
    icon: "seldon-radioOff",
    control: "menu",
  },
  inputType: {
    icon: "seldon-inputType",
    control: "menu",
  },
  htmlElement: {
    label: "HTML Element",
    icon: "seldon-token",
    control: "menu",
  },
  wrapperElement: {
    label: "Wrapper",
    icon: "seldon-token",
    control: "menu",
  },
  symbol: {
    icon: "seldon-token",
    control: "combo",
  },
  source: {
    icon: "seldon-image",
    control: "combo",
  },
  imageFit: {
    icon: "seldon-imageFit",
    control: "menu",
  },
  display: {
    icon: "seldon-display",
    control: "menu",
  },
  size: {
    icon: "seldon-size",
    control: "combo",
  },
  buttonSize: {
    icon: "seldon-fontSize",
    control: "combo",
  },
  board: {
    icon: "seldon-component",
    control: "menu",
    subProperties: {
      preset: {
        icon: "seldon-component",
        control: "menu",
      },
      width: {
        icon: "seldon-width",
        control: "combo",
      },
      height: {
        icon: "seldon-height",
        control: "combo",
      },
    },
  },

  // ========================================
  // 2. LAYOUT
  // ========================================
  direction: {
    icon: "seldon-align",
    control: "menu",
  },
  position: {
    icon: "seldon-text",
    control: "text",
    subProperties: {
      top: {
        label: "Top",
        icon: "seldon-text",
        control: "number",
      },
      right: {
        label: "Right",
        icon: "seldon-text",
        control: "number",
      },
      bottom: {
        label: "Bottom",
        icon: "seldon-text",
        control: "number",
      },
      left: {
        label: "Left",
        icon: "seldon-text",
        control: "number",
      },
    },
  },
  orientation: {
    icon: "seldon-token",
    control: "menu",
  },
  align: {
    icon: "seldon-align",
    control: "menu",
  },
  cellAlign: {
    icon: "seldon-align",
    control: "menu",
  },
  width: {
    icon: "seldon-width",
    control: "combo",
  },
  height: {
    icon: "seldon-height",
    control: "combo",
  },
  screenWidth: {
    icon: "seldon-width",
    control: "combo",
  },
  screenHeight: {
    icon: "seldon-height",
    control: "combo",
  },
  margin: {
    icon: "seldon-margin",
    control: "combo",
    subProperties: {
      top: {
        icon: "seldon-margin",
        control: "combo",
      },
      right: {
        icon: "seldon-margin",
        control: "combo",
      },
      bottom: {
        icon: "seldon-margin",
        control: "combo",
      },
      left: {
        icon: "seldon-margin",
        control: "combo",
      },
    },
  },
  padding: {
    icon: "seldon-padding",
    control: "combo",
    subProperties: {
      top: {
        icon: "seldon-padding",
        control: "combo",
      },
      right: {
        icon: "seldon-padding",
        control: "combo",
      },
      bottom: {
        icon: "seldon-padding",
        control: "combo",
      },
      left: {
        icon: "seldon-padding",
        control: "combo",
      },
    },
  },
  gap: {
    icon: "seldon-gap",
    control: "combo",
  },
  rotation: {
    icon: "seldon-rotation",
    control: "number",
  },
  wrapChildren: {
    icon: "seldon-fontTextWrap",
    control: "menu",
  },
  clip: {
    icon: "seldon-clip",
    control: "menu",
  },
  cursor: {
    icon: "seldon-token",
    control: "menu",
  },
  columns: {
    icon: "seldon-token",
    control: "number",
  },
  rows: {
    icon: "seldon-token",
    control: "number",
  },

  // ========================================
  // 3. APPEARANCE
  // ========================================
  color: {
    icon: "icon-custom-color-value",
    control: "combo",
  },
  accentColor: {
    icon: "icon-custom-color-value",
    control: "combo",
  },
  brightness: {
    icon: "seldon-brightness",
    control: "number",
  },
  opacity: {
    icon: "seldon-opacity",
    control: "number",
  },
  background: {
    icon: "icon-custom-color-value",
    subProperties: {
      preset: {
        icon: "icon-custom-color-value",
        control: "combo",
      },
      color: {
        icon: "seldon-backgroundColor",
        control: "combo",
      },
      brightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      opacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      image: {
        icon: "seldon-image",
        control: "combo",
      },
      position: {
        icon: "seldon-token",
        control: "menu",
      },
      size: {
        icon: "seldon-token",
        control: "menu",
      },
      repeat: {
        icon: "seldon-token",
        control: "menu",
      },
      blendMode: {
        icon: "seldon-token",
        control: "menu",
      },
      filter: {
        icon: "seldon-token",
        control: "combo",
      },
    },
  },
  border: {
    icon: "seldon-borderStyle",
    subProperties: {
      preset: {
        icon: "seldon-borderStyle",
        control: "combo",
      },
      style: {
        icon: "seldon-borderStyle",
        control: "menu",
      },
      color: {
        icon: "seldon-borderColor",
        control: "combo",
      },
      width: {
        icon: "seldon-borderStyle",
        control: "combo",
      },
      brightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      opacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      // Individual border sides
      topStyle: {
        icon: "seldon-borderStyle",
        control: "menu",
      },
      topColor: {
        icon: "seldon-borderColor",
        control: "combo",
      },
      topWidth: {
        icon: "seldon-borderStyle",
        control: "combo",
      },
      topBrightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      topOpacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      rightStyle: {
        icon: "seldon-borderStyle",
        control: "menu",
      },
      rightColor: {
        icon: "seldon-borderColor",
        control: "combo",
      },
      rightWidth: {
        icon: "seldon-borderStyle",
        control: "combo",
      },
      rightBrightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      rightOpacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      bottomStyle: {
        icon: "seldon-borderStyle",
        control: "menu",
      },
      bottomColor: {
        icon: "seldon-borderColor",
        control: "combo",
      },
      bottomWidth: {
        icon: "seldon-borderStyle",
        control: "combo",
      },
      bottomBrightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      bottomOpacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      leftStyle: {
        icon: "seldon-borderStyle",
        control: "menu",
      },
      leftColor: {
        icon: "seldon-borderColor",
        control: "combo",
      },
      leftWidth: {
        icon: "seldon-borderStyle",
        control: "combo",
      },
      leftBrightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      leftOpacity: {
        icon: "seldon-opacity",
        control: "number",
      },
    },
  },
  borderCollapse: {
    icon: "seldon-token",
    control: "menu",
  },
  corners: {
    icon: "seldon-corner",
    control: "combo",
    subProperties: {
      topLeft: {
        icon: "seldon-corner",
        control: "combo",
      },
      topRight: {
        icon: "seldon-corner",
        control: "combo",
      },
      bottomRight: {
        icon: "seldon-corner",
        control: "combo",
      },
      bottomLeft: {
        icon: "seldon-corner",
        control: "combo",
      },
    },
  },

  // ========================================
  // 4. TYPOGRAPHY
  // ========================================
  font: {
    icon: "seldon-font",
    subProperties: {
      preset: {
        icon: "seldon-font",
        control: "combo",
      },
      family: {
        icon: "seldon-fontFamily",
        control: "combo",
      },
      style: {
        icon: "seldon-token",
        control: "menu",
      },
      weight: {
        icon: "seldon-fontWeight",
        control: "combo",
      },
      size: {
        icon: "seldon-fontSize",
        control: "combo",
      },
      lineHeight: {
        icon: "seldon-fontLineHeight",
        control: "combo",
      },
      textCase: {
        icon: "seldon-token",
        control: "menu",
      },
      letterSpacing: {
        icon: "seldon-fontLetterSpacing",
        control: "number",
      },
    },
  },
  textAlign: {
    icon: "seldon-textAlign",
    control: "menu",
  },
  textDecoration: {
    icon: "seldon-fontTextDecoration",
    control: "menu",
  },
  wrapText: {
    icon: "seldon-fontTextWrap",
    control: "menu",
  },
  lines: {
    icon: "seldon-lines",
    control: "number",
  },

  // ========================================
  // 5. GRADIENTS
  // ========================================
  gradient: {
    icon: "seldon-gradient",
    subProperties: {
      preset: {
        icon: "seldon-gradient",
        control: "combo",
      },
      gradientType: {
        icon: "seldon-gradient",
        control: "menu",
      },
      angle: {
        icon: "seldon-text",
        control: "number",
      },
      startColor: {
        icon: "icon-custom-color-value",
        control: "combo",
      },
      startBrightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      startOpacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      startPosition: {
        icon: "seldon-text",
        control: "number",
      },
      endColor: {
        icon: "icon-custom-color-value",
        control: "combo",
      },
      endBrightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      endOpacity: {
        icon: "seldon-opacity",
        control: "number",
      },
      endPosition: {
        icon: "seldon-text",
        control: "number",
      },
    },
  },

  // ========================================
  // 6. EFFECTS
  // ========================================
  shadow: {
    icon: "seldon-shadow",
    subProperties: {
      preset: {
        icon: "seldon-shadow",
        control: "combo",
      },
      offsetX: {
        icon: "seldon-token",
        control: "number",
      },
      offsetY: {
        icon: "seldon-token",
        control: "number",
      },
      blur: {
        icon: "seldon-token",
        control: "combo",
      },
      spread: {
        icon: "seldon-token",
        control: "combo",
      },
      color: {
        icon: "icon-custom-color-value",
        control: "combo",
      },
      brightness: {
        icon: "seldon-brightness",
        control: "number",
      },
      opacity: {
        icon: "seldon-opacity",
        control: "number",
      },
    },
  },
  scroll: {
    icon: "seldon-token",
    control: "menu",
  },
  scrollbarStyle: {
    icon: "seldon-token",
    control: "menu",
  },
}

function mapCategoryToType(
  category?: string,
): "atomic" | "compound" | "shorthand" {
  if (category === "compound") return "compound"
  if (category === "shorthand") return "shorthand"
  return "atomic"
}

function mergeEntry(
  base: PropertyRegistryEntry,
  override?: PropertyRegistryEntry,
): PropertyRegistryEntry {
  if (!override) return base
  const merged: PropertyRegistryEntry = {
    label: override.label ?? base.label,
    icon: override.icon ?? base.icon,
    control: override.hasOwnProperty("control")
      ? override.control
      : base.control,
  }
  if (base.subProperties || override.subProperties) {
    merged.subProperties = {}
    const keys = new Set<string>([
      ...Object.keys(base.subProperties ?? {}),
      ...Object.keys(override.subProperties ?? {}),
    ])
    keys.forEach((k) => {
      const b = base.subProperties?.[k]
      const o = override.subProperties?.[k]
      if (b || o) {
        merged.subProperties![k] = mergeEntry(
          b || (o as PropertyRegistryEntry),
          o,
        )
      }
    })
  }
  return merged
}

function buildBaseEntry(propertyKey: string): PropertyRegistryEntry {
  const category = getPropertyCategory(propertyKey)
  const type = mapCategoryToType(category)
  const override = UI_OVERRIDES[propertyKey]

  // Set default control based on property type, but only if override doesn't have subProperties without control
  const hasSubPropertiesWithoutControl =
    override?.subProperties && !override?.hasOwnProperty("control")
  const base: PropertyRegistryEntry = {
    icon: "seldon-token",
    control: hasSubPropertiesWithoutControl
      ? undefined
      : type === "atomic"
        ? "combo"
        : "text",
  }
  // For compound/shorthand, infer sub-properties from overrides first for order
  const overrideSub = override?.subProperties
  if (type === "compound" || type === "shorthand") {
    const subMap: Record<string, PropertyRegistryEntry> = {}
    if (overrideSub) {
      Object.keys(overrideSub).forEach((subKey) => {
        const subOverride = overrideSub[subKey]
        subMap[subKey] = {
          label: subOverride?.label,
          icon: subOverride?.icon ?? "seldon-token",
          control: subOverride?.control ?? "combo",
        }
      })
    }
    // Ensure any missing subprops exist at least as atomic controls; actual existence is ensured by flatten
    base.subProperties = Object.keys(subMap).length
      ? subMap
      : base.subProperties
  }
  return mergeEntry(base, override)
}

const __rootEntryCache = new Map<string, PropertyRegistryEntry>()

/**
 * Builds (and caches) the presentation entry for a top-level property key.
 * Works for any catalog key, not only those with a `UI_OVERRIDES` row: schema category
 * supplies the default control and `IconTokenValue` is the default icon.
 */
function getRootEntry(rootKey: string): PropertyRegistryEntry {
  let entry = __rootEntryCache.get(rootKey)
  if (!entry) {
    entry = buildBaseEntry(rootKey)
    __rootEntryCache.set(rootKey, entry)
  }
  return entry
}

export function getPropertyRegistryEntry(
  propertyPath: string,
): PropertyRegistryEntry | undefined {
  const parsed = parsePropertyPath(propertyPath)
  if (parsed.kind === "layered-facet" || parsed.kind === "facet") {
    return getRootEntry(parsed.root).subProperties?.[parsed.facet]
  }

  const parts = propertyPath.split(".")
  let current: PropertyRegistryEntry | undefined = getRootEntry(parts[0]!)

  for (let i = 1; i < parts.length && current; i++) {
    current = current.subProperties?.[parts[i]!]
  }

  return current
}
