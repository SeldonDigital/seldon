import { MouseEvent, RefObject } from "react"
import { Board, Instance, Theme, Variant } from "@seldon/core"
import {
  LinkValue,
  SwatchValueRow,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import { PropertyControl } from "./PropertyControl"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { FlatProperty } from "./helpers/properties-data"
import { resolveThemeSwatchColors } from "./helpers/resolve-theme-swatch-colors"

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
      <LinkValue href={property.linkHref} onClick={stopLinkPropagation}>
        {value || "View"}
      </LinkValue>
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
      <SwatchValueRow
        swatch={
          <ThemeSwatches colors={resolveThemeSwatchColors(themeForSwatches)} />
        }
      >
        {valueContent}
      </SwatchValueRow>
    )
  }

  return valueContent
}

function stopLinkPropagation(event: MouseEvent): void {
  event.stopPropagation()
}
