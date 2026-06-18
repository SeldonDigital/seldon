/**
 * Hand-written view code for the value cell of a property row.
 *
 * The cell renders inside the generated row's `textLabel2` slot. The slot is
 * styled as a flex row, so the chip, the value, and the unit lay out as flex
 * items. The value item carries the ellipsis truncation.
 */
import { MouseEvent, ReactNode, RefObject } from "react"
import { Board, Instance, Theme, Variant } from "@seldon/core"
import {
  Icon,
  LinkValue,
  SwatchValueRow,
  Text,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import { ValueChip } from "./helpers/build-property-row-props"
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
  /** Dynamic color chip rendered before the value when set. */
  valueChip?: ValueChip | null
  /** Unit label (e.g. PX) rendered after the value when set. */
  unitLabel?: string
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
  valueChip,
  unitLabel,
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

  return decorateValueContent(valueContent, valueChip, unitLabel, labelColor)
}

/**
 * Lays out the value as flex items: the optional dynamic color chip, the
 * truncating value content, and the optional unit label. Dynamic
 * `icon-custom-*` icons cannot render through the generated row's icon slot,
 * so the chip lives here.
 */
function decorateValueContent(
  valueContent: ReactNode,
  valueChip: ValueChip | null | undefined,
  unitLabel: string | undefined,
  labelColor: string | undefined,
): ReactNode {
  return (
    <>
      {valueChip && (
        <Icon
          icon="icon-custom-color-value"
          color={valueChip.color}
          style={{
            flexShrink: 0,
            marginRight: "0.25rem",
            ...valueChip.style,
          }}
        />
      )}
      <Text
        as="span"
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {valueContent}
      </Text>
      {unitLabel && (
        <Text
          as="span"
          style={{
            flexShrink: 0,
            marginLeft: "0.25rem",
            fontSize: "0.5rem",
            ...(labelColor ? { color: labelColor } : {}),
          }}
        >
          {unitLabel}
        </Text>
      )}
    </>
  )
}

function stopLinkPropagation(event: MouseEvent): void {
  event.stopPropagation()
}
