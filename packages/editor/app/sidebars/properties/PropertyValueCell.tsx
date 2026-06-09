import { CSSProperties, MouseEvent, RefObject } from "react"
import { Board, Instance, Theme, Variant } from "@seldon/core"
import { ThemeSwatches } from "../../ui/ThemeSwatches"
import { PropertyControl } from "./PropertyControl"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { FlatProperty } from "./helpers/properties-data"

const linkStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "underline",
}

const swatchRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  width: "100%",
  minWidth: 0,
}

const swatchSlotStyle: CSSProperties = { flexShrink: 0 }

const swatchValueStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

interface PropertyValueCellProps {
  property: FlatProperty
  value: string
  node: Variant | Instance | Board
  theme?: Theme
  labelColor?: string
  isEditingProperty: boolean
  isThemeAssignment: boolean
  themeForSwatches: Theme | null
  frameRef: RefObject<HTMLDivElement | null>
  onEditChange: (editing: boolean) => void
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

/**
 * Renders the value cell (label2) of a property row. Resolves to an empty cell
 * for look-parent rows, an external link for license rows, the active control
 * while editing, or the read-only display value, optionally prefixed by theme
 * swatches for the theme-assignment row.
 */
export function PropertyValueCell({
  property,
  value,
  node,
  theme,
  labelColor,
  isEditingProperty,
  isThemeAssignment,
  themeForSwatches,
  frameRef,
  onEditChange,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: PropertyValueCellProps) {
  // Look parent rows are a pure disclosure grouping: label plus arrow, with an
  // empty value cell and no control.
  if (property.isLookParent) {
    return null
  }

  // License rows render their value as an external link.
  if (property.linkHref) {
    return (
      <a
        href={property.linkHref}
        target="_blank"
        rel="noreferrer"
        onClick={stopLinkPropagation}
        style={linkStyle}
      >
        {value || "View"}
      </a>
    )
  }

  const shouldShowControl = Boolean(property.controlType)
  const valueContent =
    isEditingProperty && shouldShowControl ? (
      <PropertyControl
        property={property}
        propertySubject={node}
        theme={theme}
        frameRef={frameRef}
        isEditing={isEditingProperty}
        onEditChange={onEditChange}
        onBlur={() => onEditChange(false)}
        color={labelColor}
        themeEditingContext={themeEditingContext}
        fontCollectionEditingContext={fontCollectionEditingContext}
        iconSetEditingContext={iconSetEditingContext}
      />
    ) : (
      (value ?? "")
    )

  if (isThemeAssignment && themeForSwatches) {
    return (
      <div style={swatchRowStyle}>
        <div style={swatchSlotStyle}>
          <ThemeSwatches theme={themeForSwatches} />
        </div>
        <div style={swatchValueStyle}>{valueContent}</div>
      </div>
    )
  }

  return valueContent
}

function stopLinkPropagation(event: MouseEvent): void {
  event.stopPropagation()
}
