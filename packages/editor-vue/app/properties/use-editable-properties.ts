import { computed, type ComputedRef } from "vue"
import type { Board, Instance, Theme, Variant } from "@seldon/core"
import { PROPERTY_DISPLAY_META } from "@seldon/core/properties/constants/property-display"
import { PropertyDisplayCategory } from "@seldon/core/properties/constants/property-display"
import { getPresetOptionsAsLabelValue } from "@seldon/core/properties/schemas/helpers/property-options"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import type { PropertyKey as CorePropertyKey } from "@seldon/core/properties/types/property-keys"
import type { Workspace } from "@seldon/core/workspace/types"
import { getCurrentOptionValue } from "@seldon/editor/lib/icons/resolve-option-icon"
import { getComboboxStoredValue } from "@seldon/editor/lib/properties/combobox-stored-value"
import { buildPropertyOptions } from "@seldon/editor/lib/properties/inspector/build-property-options"
import {
  flattenNodeProperties,
  type FlatProperty,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "@seldon/editor/lib/themes/theme-token-icon-color"

export type PropertyControl =
  | { kind: "text"; value: string }
  | {
      kind: "option"
      value: string
      options: Array<{ label: string; value: string }>
    }
  | { kind: "readonly"; value: string }
  | { kind: "link"; value: string; href: string }
  | { kind: "color"; value: string; swatch?: string }

export type PropertyRow = {
  key: string
  label: string
  valueType: string
  control: PropertyControl
  isFacet: boolean
  isHeader: boolean
  canReset: boolean
  dimmed: boolean
  /** Layered-paint root ("background"/"shadow") when this row can add a layer. */
  layerAdd?: string
  /** Layered-paint layer this row can remove. */
  layerRemove?: { property: string; index: number }
  /** Source row, so the commit path can reuse the shared computed handler. */
  flat: FlatProperty
}

export type PropertySection = {
  category: PropertyDisplayCategory
  label: string
  rows: PropertyRow[]
}

const CATEGORY_LABELS: Record<PropertyDisplayCategory, string> = {
  [PropertyDisplayCategory.ATTRIBUTES]: "Attributes",
  [PropertyDisplayCategory.LAYOUT]: "Layout",
  [PropertyDisplayCategory.APPEARANCE]: "Appearance",
  [PropertyDisplayCategory.TYPOGRAPHY]: "Typography",
  [PropertyDisplayCategory.EFFECTS]: "Effects",
  [PropertyDisplayCategory.ACCESSIBILITY]: "Accessibility",
}

const CATEGORY_ORDER: PropertyDisplayCategory[] = [
  PropertyDisplayCategory.ATTRIBUTES,
  PropertyDisplayCategory.LAYOUT,
  PropertyDisplayCategory.APPEARANCE,
  PropertyDisplayCategory.TYPOGRAPHY,
  PropertyDisplayCategory.EFFECTS,
  PropertyDisplayCategory.ACCESSIBILITY,
]

const LAYERED_FACET_RE = /^[a-zA-Z]+\.\d+\.[a-zA-Z]+$/
const LAYERED_PARENT_RE = /^[a-zA-Z]+(\.\d+)?$/

function rootKey(key: string): string {
  return key.split(".")[0]
}

/**
 * Maps one rich `FlatProperty` onto the simplified row the Vue `PropertyRow`
 * renders. Headers (compound, shorthand, look parents, layered-paint parents)
 * render read-only; leaf atomic rows expose a preset menu when the schema has
 * options, otherwise an inline text field. Layered-paint parent rows carry the
 * add/remove-layer affordances.
 */
function toRow(
  property: FlatProperty,
  workspace: Workspace,
  theme: Theme | undefined,
  subject: Variant | Instance | Board,
): PropertyRow {
  const root = rootKey(property.key)
  const isLayeredRoot = isLayeredPaintProperty(root as CorePropertyKey)
  const isLayeredParent =
    isLayeredRoot &&
    LAYERED_PARENT_RE.test(property.key) &&
    !LAYERED_FACET_RE.test(property.key)

  const isFacet = property.isSubProperty && !isLayeredParent
  const isHeader =
    property.isCompound ||
    property.isShorthand ||
    !!property.isLookParent ||
    isLayeredParent

  let control: PropertyControl
  if (property.linkHref) {
    control = {
      kind: "link",
      value: property.actualValue,
      href: property.linkHref,
    }
  } else if (isHeader) {
    control = { kind: "readonly", value: property.actualValue }
  } else if (isSwatchIconPropertyKey(property.key)) {
    control = {
      kind: "color",
      value: getComboboxStoredValue(property.value),
      swatch: getThemeTokenIconColorFromPropertyValue(property.value, theme),
    }
  } else {
    // Rich, framework-neutral option source: theme tokens, computed functions,
    // symbol pickers, etc. Falls back to schema preset options for top-level
    // rows the picker builder does not cover (non-combo controls).
    const grouped = buildPropertyOptions({ property, theme, workspace, subject })
    let options = grouped
      ? grouped
          .flat()
          .map((option) => ({ label: option.name, value: String(option.value) }))
      : []
    if (options.length === 0 && !isFacet) {
      options = getPresetOptionsAsLabelValue(property.key, workspace).map(
        (option) => ({ label: option.label, value: String(option.value) }),
      )
    }
    control =
      options.length > 0
        ? {
            kind: "option",
            value: getCurrentOptionValue(property.key, property.value),
            options,
          }
        : { kind: "text", value: property.actualValue }
  }

  return {
    key: property.key,
    label: property.label,
    valueType: property.valueType,
    control,
    isFacet,
    isHeader,
    canReset: property.status === "override",
    dimmed: !!property.isDimmed,
    layerAdd: isLayeredParent && property.layerIndex === 0 ? root : undefined,
    layerRemove: isLayeredParent
      ? { property: root, index: property.layerIndex ?? 0 }
      : undefined,
    flat: property,
  }
}

/**
 * Reactive node property sections for the properties sidebar. Sources the rich,
 * framework-neutral `flattenNodeProperties` (the same builder the React editor
 * uses) and groups its rows into inspector sections. Rows the subject schema
 * does not expose ("not used") are dropped. Editing fidelity beyond text/menu
 * controls is layered on in later slices.
 */
export function useEditableProperties(
  node: ComputedRef<Variant | Instance | Board | null>,
  workspace: ComputedRef<Workspace>,
  theme: ComputedRef<Theme | undefined>,
): ComputedRef<PropertySection[]> {
  return computed(() => {
    const subject = node.value
    if (!subject) return []

    const flat = flattenNodeProperties(
      subject,
      workspace.value,
      theme.value,
    ).filter((property) => property.status !== "not used")

    const byCategory = new Map<PropertyDisplayCategory, PropertyRow[]>()
    for (const property of flat) {
      const meta = PROPERTY_DISPLAY_META[rootKey(property.key)]
      if (!meta) continue
      const rows = byCategory.get(meta.displayCategory) ?? []
      rows.push(toRow(property, workspace.value, theme.value, subject))
      byCategory.set(meta.displayCategory, rows)
    }

    const sections: PropertySection[] = []
    for (const category of CATEGORY_ORDER) {
      const rows = byCategory.get(category)
      if (!rows || rows.length === 0) continue
      sections.push({ category, label: CATEGORY_LABELS[category], rows })
    }
    return sections
  })
}
