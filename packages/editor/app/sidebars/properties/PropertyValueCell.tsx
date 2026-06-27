/**
 * Hand-written view code for the value cell of a property row.
 *
 * The cell renders inside the generated row's `textLabel2` slot. The slot is
 * styled as a flex row, so the chip, the value, and the unit lay out as flex
 * items. The value item carries the ellipsis truncation.
 */
import { CSSProperties, MouseEvent, ReactNode, RefObject } from "react"
import { Board, Instance, Theme, Variant } from "@seldon/core"
import {
  Icon,
  LinkValue,
  SwatchValueRow,
  Text,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import { Input } from "@seldon/components/primitives/Input"
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
  onTabNext?: () => boolean
  onTabPrev?: () => boolean
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
  onTabNext,
  onTabPrev,
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
    const linkText = value || "View"
    return (
      <LinkValue href={property.linkHref} onClick={stopLinkPropagation}>
        {linkText}
      </LinkValue>
    )
  }

  const shouldShowControl = Boolean(property.controlType)
  const handleEditBlur = () => onEditChange(false)
  const inputValue = value ?? ""
  const inputStyle: CSSProperties = {
    border: "none",
    background: "transparent",
    padding: 0,
    width: "100%",
    cursor: "inherit",
    ...(labelColor ? { color: labelColor } : {}),
  }
  // Closed rows render the value through the exported combobox `Input` as a
  // read-only display styled like a label. Single-click opens the editor via
  // the value cell's click handler, which swaps in the `PropertyControl` menu.
  const valueContent =
    isEditingProperty && shouldShowControl ? (
      <PropertyControl
        property={property}
        propertySubject={node}
        theme={theme}
        frameRef={frameRef}
        isEditing={isEditingProperty}
        onEditChange={onEditChange}
        onBlur={handleEditBlur}
        onTabNext={onTabNext}
        onTabPrev={onTabPrev}
        color={labelColor}
        themeEditingContext={themeEditingContext}
        fontCollectionEditingContext={fontCollectionEditingContext}
        iconSetEditingContext={iconSetEditingContext}
      />
    ) : (
      <Input
        readOnly
        tabIndex={-1}
        value={inputValue}
        style={inputStyle}
      />
    )

  if (isThemeAssignment && themeForSwatches) {
    const swatchColors = resolveThemeSwatchColors(themeForSwatches)
    const swatch = <ThemeSwatches colors={swatchColors} />
    return <SwatchValueRow swatch={swatch}>{valueContent}</SwatchValueRow>
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
  const chipStyle: CSSProperties = valueChip
    ? { flexShrink: 0, marginRight: "0.25rem", ...valueChip.style }
    : {}
  const chip = valueChip ? (
    <Icon icon={valueChip.iconId} color={valueChip.color} style={chipStyle} />
  ) : null

  const unitStyle: CSSProperties = {
    flexShrink: 0,
    marginLeft: "0.25rem",
    fontSize: "0.5rem",
    ...(labelColor ? { color: labelColor } : {}),
  }
  const unit = unitLabel ? (
    <Text as="span" style={unitStyle}>
      {unitLabel}
    </Text>
  ) : null

  return (
    <>
      {chip}
      <Text as="span" style={valueTextStyle}>
        {valueContent}
      </Text>
      {unit}
    </>
  )
}

const valueTextStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

function stopLinkPropagation(event: MouseEvent): void {
  event.stopPropagation()
}
