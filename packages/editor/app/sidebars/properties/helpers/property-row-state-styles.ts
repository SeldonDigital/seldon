import { CSSProperties } from "react"

/**
 * Per-slot state styles for a property row.
 *
 * Each function maps row state (expansion, hover, edit mode, control type,
 * status color) to the inline style of one `ItemProperty` slot. Generated
 * components do not support states yet, so these styles live app-side. When
 * state support lands in the generator, each function is a candidate to move
 * into the generated component as state data.
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
  return {
    position: "relative",
    zIndex: 10,
  }
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

/**
 * Property name label: interaction affordances plus row-state styling. The
 * label's typography comes from the generated `.sdn-input` CSS; only the
 * debug-mode status color, the dimmed opacity, and the sub-property indent
 * are applied inline.
 */
export function getNameLabelStyle({
  labelColor,
  isDimmed,
  isSubProperty,
  hasChildren,
}: {
  labelColor: string | undefined
  isDimmed: boolean
  isSubProperty: boolean
  hasChildren: boolean
}): CSSProperties {
  return {
    ...(labelColor ? { color: labelColor } : {}),
    ...(isDimmed ? { opacity: 0.5 } : {}),
    ...(isSubProperty ? { paddingLeft: "var(--sdn-paddings-compact)" } : {}),
    cursor: hasChildren ? "pointer" : "default",
    userSelect: "none",
    WebkitUserSelect: "none",
    // The name is a non-interactive label, so keep it inert to the pointer. This
    // stops the generated `.sdn-text-label:hover` tint from firing on it while
    // leaving hover to the value field. The inline-rename branch restores
    // pointer events so its input stays usable.
    pointerEvents: "none",
  }
}

/** Value type icon inside the form control. Hidden for theme-assignment and look-parent rows. */
export function getValueIconStyle({
  hidden,
  labelColor,
}: {
  hidden: boolean
  labelColor: string | undefined
}): CSSProperties {
  if (hidden) {
    return { display: "none" }
  }
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
  if (supportsUpload) {
    return { pointerEvents: "auto" }
  }
  if (isCalculated) {
    return { display: "none" }
  }
  if (isMenuOrCombo) {
    return { pointerEvents: "auto" }
  }
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
  if (isCalculated) return 0 // Hide chevron for calculated properties
  if (supportsUpload) return 1 // Always show upload icon for image properties
  if (!hasControl) return 0 // Read-only rows with no control
  return showMenuIcon ? 0 : 1
}
