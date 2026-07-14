import { parsePropertyPath } from "@lib/properties/property-paths"
import { getPropertyIcon as coreGetPropertyIcon } from "@seldon/core/icon-registry"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import {
  getCompoundSubPropertySchema,
  getPropertySchema,
} from "@seldon/core/properties/schemas/helpers"

export type ControlType =
  | "combo"
  | "menu"
  | "number"
  | "text"
  | "switch"
  | "error"

export interface PropertyOption {
  value: string
  name: string
}

/**
 * Presentation metadata for a property row. Icons are owned by the core icon
 * registry; this entry only carries the control type, label, and the
 * symbol-picker `renderValueAsIcon` flag. The resolved row `icon` is filled from
 * core when the entry is built.
 */
export interface PropertyRegistryEntry {
  label?: string
  /** Resolved row icon id, filled from the core registry when the entry is built. */
  icon?: string
  /** Option value is itself an icon id and renders as that glyph. */
  renderValueAsIcon?: boolean
  control?: ControlType
  subProperties?: {
    [subPropertyKey: string]: PropertyRegistryEntry
  }
}

export interface PropertyRegistry {
  [propertyKey: string]: PropertyRegistryEntry
}

/**
 * Editor-only row icons for synthetic inspector rows that are not core property
 * catalog keys. `board` is an inspector grouping; `reference` and `repeat` are
 * prototyping rows. Real properties get their icon from the core registry.
 */
const EDITOR_ROW_ICON_OVERLAY: Record<string, string> = {
  board: "seldon-component",
  reference: "material-dataObject",
  repeat: "material-copyAll",
}

/**
 * Editor-local device icon per board preset value. Default ("") uses the
 * desktop icon and "fit" uses the four-arrow align icon. These are
 * `icon-custom-device-*` ids, not `@seldon/core` catalog ids, so the board
 * picker stays decoupled from the shipped icon set.
 */
const BOARD_PRESET_OPTION_ICONS: Record<string, string> = {
  "": "icon-custom-device-desktop",
  fit: "seldon-align",
  iphone: "icon-custom-device-mobile",
  androidPhone: "icon-custom-device-mobile",
  ipad: "icon-custom-device-tablet",
  androidTablet: "icon-custom-device-tablet",
  macBook: "icon-custom-device-laptop",
  windowsLaptop: "icon-custom-device-laptop",
  desktop: "icon-custom-device-desktop",
  appleWatch: "icon-custom-device-watch",
  wearOS: "icon-custom-device-watch",
  television: "icon-custom-device-tv",
}

/**
 * Editor-only per-option icon overrides for synthetic rows whose option icons
 * are not core ids (board preset device icons). Consulted before the core
 * registry in `getOptionIcon`.
 */
export const EDITOR_OPTION_ICON_OVERLAY: Record<
  string,
  Record<string, string>
> = {
  board: BOARD_PRESET_OPTION_ICONS,
}

/**
 * Resolves the icon for a property row path: an editor overlay for synthetic
 * keys first, then the core registry, then the generic token icon.
 */
function resolveRowIcon(path: string): string {
  return (
    EDITOR_ROW_ICON_OVERLAY[path] ?? coreGetPropertyIcon(path) ?? "seldon-theme"
  )
}

/**
 * Presentation entry for one revealed border side. Mirrors the `border` row's
 * facet controls so a side reads like the shorthand it splits from. Icons come
 * from the core registry by catalog key.
 */
function BORDER_SIDE_REGISTRY_ENTRY(label: string): PropertyRegistryEntry {
  return {
    label,
    subProperties: {
      preset: { control: "combo" },
      style: { control: "menu" },
      color: { control: "combo" },
      width: { control: "combo" },
      brightness: { control: "number" },
      opacity: { control: "number" },
    },
  }
}

/**
 * Runtime UI params for the property registry. Defines presentation-only
 * concerns (control type, label, symbol glyph flag) and is deep-merged with the
 * core-sourced icons when an entry is built.
 */
const UI_OVERRIDES: PropertyRegistry = {
  // 1. ATTRIBUTES
  content: { control: "text" },
  altText: { control: "text" },
  ariaLabel: { control: "text" },
  ariaHidden: { control: "menu" },
  placeholder: { control: "text" },
  checked: { control: "menu" },
  inputType: { control: "menu" },
  htmlElement: { label: "HTML Element", control: "menu" },
  wrapperElement: { label: "Wrapper", control: "menu" },
  reference: { label: "Reference", control: "text" },
  repeat: { label: "Repeat", control: "number" },
  symbol: { control: "combo", renderValueAsIcon: true },
  source: { control: "combo" },
  imageFit: { control: "menu" },
  display: { control: "menu" },
  size: { control: "combo" },
  buttonSize: { control: "combo" },
  board: {
    control: "menu",
    subProperties: {
      preset: { control: "menu" },
      width: { control: "combo" },
      height: { control: "combo" },
    },
  },

  // 2. LAYOUT
  direction: { control: "menu" },
  position: {
    control: "combo",
    subProperties: {
      top: { label: "Top", control: "combo" },
      right: { label: "Right", control: "combo" },
      bottom: { label: "Bottom", control: "combo" },
      left: { label: "Left", control: "combo" },
    },
  },
  orientation: { control: "menu" },
  align: { control: "menu" },
  placement: { control: "menu" },
  cellAlign: { control: "menu" },
  width: { control: "combo" },
  height: { control: "combo" },
  screenWidth: { control: "combo" },
  screenHeight: { control: "combo" },
  margin: {
    control: "combo",
    subProperties: {
      top: { control: "combo" },
      right: { control: "combo" },
      bottom: { control: "combo" },
      left: { control: "combo" },
    },
  },
  padding: {
    control: "combo",
    subProperties: {
      top: { control: "combo" },
      right: { control: "combo" },
      bottom: { control: "combo" },
      left: { control: "combo" },
    },
  },
  gap: { control: "combo" },
  rotation: { control: "number" },
  listStyleType: { control: "menu" },
  listStylePosition: { control: "menu" },
  cursor: { control: "menu" },
  columnStart: { control: "number" },
  columnSpan: { control: "number" },
  rowStart: { control: "number" },
  rowSpan: { control: "number" },
  columns: { control: "number" },
  rows: { control: "number" },

  // 3. APPEARANCE
  color: { control: "combo" },
  accentColor: { control: "combo" },
  brightness: { control: "number" },
  opacity: { control: "number" },
  background: {
    subProperties: {
      preset: { control: "combo" },
      color: { control: "combo" },
      brightness: { control: "number" },
      opacity: { control: "number" },
      image: { label: "Source", control: "combo" },
      position: { control: "menu" },
      size: { control: "menu" },
      repeat: { control: "menu" },
      blendMode: { control: "menu" },
      filter: { control: "combo" },
      angle: { control: "number" },
      positionX: { label: "Position X", control: "combo" },
      positionY: { label: "Position Y", control: "combo" },
      shape: { control: "menu" },
      radialSize: { label: "Size", control: "menu" },
      conicRepeat: { label: "Repeat", control: "menu" },
      startColor: { control: "combo" },
      startBrightness: { control: "number" },
      startOpacity: { control: "number" },
      startPosition: { control: "number" },
      endColor: { control: "combo" },
      endBrightness: { control: "number" },
      endOpacity: { control: "number" },
      endPosition: { control: "number" },
    },
  },
  border: {
    subProperties: {
      preset: { control: "combo" },
      style: { control: "menu" },
      color: { control: "combo" },
      width: { control: "combo" },
      brightness: { control: "number" },
      opacity: { control: "number" },
      topStyle: { control: "menu" },
      topColor: { control: "combo" },
      topWidth: { control: "combo" },
      topBrightness: { control: "number" },
      topOpacity: { control: "number" },
      rightStyle: { control: "menu" },
      rightColor: { control: "combo" },
      rightWidth: { control: "combo" },
      rightBrightness: { control: "number" },
      rightOpacity: { control: "number" },
      bottomStyle: { control: "menu" },
      bottomColor: { control: "combo" },
      bottomWidth: { control: "combo" },
      bottomBrightness: { control: "number" },
      bottomOpacity: { control: "number" },
      leftStyle: { control: "menu" },
      leftColor: { control: "combo" },
      leftWidth: { control: "combo" },
      leftBrightness: { control: "number" },
      leftOpacity: { control: "number" },
    },
  },
  borderTop: BORDER_SIDE_REGISTRY_ENTRY("Border Top"),
  borderRight: BORDER_SIDE_REGISTRY_ENTRY("Border Right"),
  borderBottom: BORDER_SIDE_REGISTRY_ENTRY("Border Bottom"),
  borderLeft: BORDER_SIDE_REGISTRY_ENTRY("Border Left"),
  borderCollapse: { control: "menu" },
  corners: {
    control: "combo",
    subProperties: {
      topLeft: { control: "combo" },
      topRight: { control: "combo" },
      bottomRight: { control: "combo" },
      bottomLeft: { control: "combo" },
    },
  },

  // 4. TYPOGRAPHY
  font: {
    subProperties: {
      preset: { control: "combo" },
      family: { control: "combo" },
      style: { control: "menu" },
      weight: { control: "combo" },
      size: { control: "combo" },
      lineHeight: { control: "combo" },
      textCase: { control: "menu" },
      letterSpacing: { control: "number" },
    },
  },
  textAlign: { control: "menu" },
  textDecoration: { control: "menu" },
  wrapText: { control: "menu" },
  lines: { control: "number" },

  // 5. EFFECTS
  shadow: {
    subProperties: {
      preset: { control: "combo" },
      style: { control: "menu" },
      offsetX: { control: "number" },
      offsetY: { control: "number" },
      blur: { control: "combo" },
      spread: { control: "combo" },
      color: { control: "combo" },
      brightness: { control: "number" },
      opacity: { control: "number" },
    },
  },
  scroll: { control: "menu" },
  scrollbarStyle: { control: "menu" },

  // 6. ACCESSIBILITY
  role: { label: "Role", control: "menu" },
  ariaDisabled: { control: "menu" },
  ariaExpanded: { control: "menu" },
  ariaSelected: { control: "menu" },
  ariaChecked: { control: "menu" },
  ariaPressed: { control: "menu" },
  ariaCurrent: { control: "menu" },
  ariaHasPopup: { control: "menu" },
  ariaInvalid: { control: "menu" },
  ariaRequired: { control: "menu" },
  ariaReadonly: { control: "menu" },
  ariaLive: { control: "menu" },
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
    renderValueAsIcon: override.renderValueAsIcon ?? base.renderValueAsIcon,
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
    icon: resolveRowIcon(propertyKey),
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
          icon: resolveRowIcon(`${propertyKey}.${subKey}`),
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
 * supplies the default control and the core registry supplies the icon.
 */
function getRootEntry(rootKey: string): PropertyRegistryEntry {
  let entry = __rootEntryCache.get(rootKey)
  if (!entry) {
    entry = buildBaseEntry(rootKey)
    __rootEntryCache.set(rootKey, entry)
  }
  return entry
}

/**
 * A property is a binary on/off toggle when its schema presets are exactly
 * `[true, false]`. These rows use the `switch` control regardless of any
 * registry default, so every boolean renders as a toggle. Tristate aria states
 * (`true`/`false`/`mixed`) and option enums are not boolean and keep their menu.
 */
function isBooleanControlPath(propertyPath: string): boolean {
  const parsed = parsePropertyPath(propertyPath)
  const schema =
    parsed.kind === "layered-facet" || parsed.kind === "facet"
      ? getCompoundSubPropertySchema(parsed.root, parsed.facet)
      : getPropertySchema(propertyPath.split(".")[0]!)
  const presets = schema?.presetOptions?.()
  return (
    Array.isArray(presets) &&
    presets.length === 2 &&
    presets.every((option) => typeof option === "boolean")
  )
}

export function getPropertyRegistryEntry(
  propertyPath: string,
): PropertyRegistryEntry | undefined {
  const parsed = parsePropertyPath(propertyPath)

  let entry: PropertyRegistryEntry | undefined
  if (parsed.kind === "layered-facet" || parsed.kind === "facet") {
    entry = getRootEntry(parsed.root).subProperties?.[parsed.facet]
  } else {
    const parts = propertyPath.split(".")
    let current: PropertyRegistryEntry | undefined = getRootEntry(parts[0]!)
    for (let i = 1; i < parts.length && current; i++) {
      current = current.subProperties?.[parts[i]!]
    }
    entry = current
  }

  // Route every binary on/off property to the toggle switch, overriding the
  // registry default. Copy so the cached entry is not mutated.
  if (
    entry &&
    entry.control !== "switch" &&
    isBooleanControlPath(propertyPath)
  ) {
    return { ...entry, control: "switch" }
  }

  return entry
}
