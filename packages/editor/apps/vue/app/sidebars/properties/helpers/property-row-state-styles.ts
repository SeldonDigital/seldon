import type { CSSProperties } from "vue"

/**
 * Per-slot state styles for a property row, ported from the React
 * `property-row-state-styles`. Each function maps row state (expansion, control
 * type, status color) to the inline style of one generated `ItemProperty` slot.
 */

function iconStateStyle(
  labelColor: string | undefined,
  opacity?: number,
): CSSProperties {
  return {
    ...(labelColor ? { color: labelColor } : {}),
    ...(opacity !== undefined ? { opacity } : {}),
  }
}

/** Leading disclosure button. Lifts the button above row-level click layers. */
export function getDisclosureButtonStyle(): CSSProperties {
  return { position: "relative", zIndex: 10 }
}

/** Disclosure chevron: rotates on expansion, hidden on leaf rows. */
export function getDisclosureIconStyle({
  isExpanded,
  hasChildren,
  labelColor,
}: {
  isExpanded: boolean
  hasChildren: boolean
  labelColor: string | undefined
}): CSSProperties {
  return {
    transition: "transform 0.2s ease",
    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
    ...iconStateStyle(labelColor, hasChildren ? 1 : 0),
  }
}

/** Property name label: interaction affordances plus row-state styling. */
export function getNameLabelStyle({
  labelColor,
  isDimmed,
  hasChildren,
}: {
  labelColor: string | undefined
  isDimmed: boolean
  hasChildren: boolean
}): CSSProperties {
  return {
    ...(labelColor ? { color: labelColor } : {}),
    ...(isDimmed ? { opacity: 0.5 } : {}),
    cursor: hasChildren ? "pointer" : "default",
    userSelect: "none",
    WebkitUserSelect: "none",
    pointerEvents: "none",
  }
}

/** Value type icon inside the form control. Hidden for look-parent rows. */
export function getValueIconStyle({
  hidden,
  labelColor,
}: {
  hidden: boolean
  labelColor: string | undefined
}): CSSProperties {
  if (hidden) return { display: "none" }
  return iconStateStyle(labelColor)
}

/** Menu/upload button inside the form control: interactive, hidden, or inert. */
export function getMenuButtonStyle({
  supportsUpload,
  isCalculated,
  isMenuOrCombo,
}: {
  supportsUpload: boolean
  isCalculated: boolean
  isMenuOrCombo: boolean
}): CSSProperties {
  if (supportsUpload) return { pointerEvents: "auto" }
  if (isCalculated) return { display: "none" }
  if (isMenuOrCombo) return { pointerEvents: "auto" }
  return { pointerEvents: "none" }
}

/** Menu/upload icon: visible for upload and open-menu affordances only. */
export function getMenuIconStyle({
  isCalculated,
  supportsUpload,
  hasControl,
  showMenuIcon,
  labelColor,
}: {
  isCalculated: boolean
  supportsUpload: boolean
  hasControl: boolean
  showMenuIcon: boolean
  labelColor: string | undefined
}): CSSProperties {
  const opacity = resolveMenuIconOpacity({
    isCalculated,
    supportsUpload,
    hasControl,
    showMenuIcon,
  })
  return { fontSize: "0.6rem", ...iconStateStyle(labelColor, opacity) }
}

function resolveMenuIconOpacity({
  isCalculated,
  supportsUpload,
  hasControl,
  showMenuIcon,
}: {
  isCalculated: boolean
  supportsUpload: boolean
  hasControl: boolean
  showMenuIcon: boolean
}): number {
  if (isCalculated) return 0
  if (supportsUpload) return 1
  if (!hasControl) return 0
  return showMenuIcon ? 0 : 1
}
