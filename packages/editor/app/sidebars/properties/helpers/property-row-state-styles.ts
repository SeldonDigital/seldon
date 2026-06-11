import { CSSProperties } from "react"

/**
 * Per-slot state styles for a property row.
 *
 * Each function maps row state (expansion, hover, edit mode, control type,
 * status color) to the inline style of one `ItemInputRow` slot. Generated
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

/** Property name label: status color tokens plus interaction affordances. */
export function getNameLabelStyle({
  labelStyle,
  hasChildren,
}: {
  labelStyle: CSSProperties
  hasChildren: boolean
}): CSSProperties {
  return {
    ...labelStyle,
    cursor: hasChildren ? "pointer" : "default",
    userSelect: "none",
    WebkitUserSelect: "none",
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

/** Value cell label wrapping the injected `PropertyValueCell` node. */
export function getValueCellStyle({
  labelColor,
  isEditingProperty,
  isInteractive,
}: {
  labelColor: string | undefined
  isEditingProperty: boolean
  isInteractive: boolean
}): CSSProperties {
  return {
    flex: 1,
    flexShrink: 1,
    width: 0,
    color: labelColor && !isEditingProperty ? labelColor : "hsl(0 0% 96%)",
    fontSize: "0.75rem",
    fontWeight: 300,
    cursor: isInteractive ? "pointer" : "default",
    pointerEvents: "auto",
    display: "block",
    minWidth: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    userSelect: "none",
    WebkitUserSelect: "none",
  }
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
  return iconStateStyle(labelColor, opacity)
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

/**
 * Form control shell around the value cell. Width comes from the generated
 * form-control classes, so no width is set here. Position anchors the
 * value-cell edit overlay.
 */
export function getFormControlStyle({
  cursor,
  hoverStyle,
}: {
  cursor: CSSProperties["cursor"]
  hoverStyle: CSSProperties
}): CSSProperties {
  return {
    position: "relative",
    cursor,
    userSelect: "none",
    WebkitUserSelect: "none",
    ...hoverStyle,
  }
}

/** Row root: status color tokens plus interaction affordances. */
export function getRowStyle({
  rowStyle,
  hasChildren,
}: {
  rowStyle: CSSProperties
  hasChildren: boolean
}): CSSProperties {
  return {
    ...rowStyle,
    width: "100%",
    justifyContent: "flex-start",
    cursor: hasChildren ? "pointer" : "default",
    userSelect: "none",
    WebkitUserSelect: "none",
  }
}
