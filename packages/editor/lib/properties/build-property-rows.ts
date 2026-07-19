import { ValueType, type Value, type Workspace } from "@seldon/core"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import {
  PROPERTY_DISPLAY_META,
  PropertyDisplayCategory,
} from "@seldon/core/properties/constants/property-display"
import { getPresetOptionsAsLabelValue } from "@seldon/core/properties/schemas/helpers/property-options"

export type PropertyControl =
  | { kind: "text"; value: string }
  | {
      kind: "option"
      value: unknown
      options: Array<{ label: string; value: unknown }>
    }
  | { kind: "readonly"; value: string }

export type PropertyRow = {
  key: string
  label: string
  valueType: string
  control: PropertyControl
  isFacet: boolean
  isHeader: boolean
  canReset: boolean
  /** Layered-paint root ("background"/"shadow") when this header can add a layer. */
  layerAdd?: string
  /** Layered-paint layer this row can remove. */
  layerRemove?: { property: string; index: number }
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

type AtomicEntry = { type: string; value: unknown }

function isAtomicEntry(entry: unknown): entry is AtomicEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "type" in entry &&
    typeof (entry as { type: unknown }).type === "string"
  )
}

function isCompoundEntry(entry: unknown): entry is Record<string, unknown> {
  return (
    typeof entry === "object" &&
    entry !== null &&
    !Array.isArray(entry) &&
    !("type" in entry)
  )
}

function safeStringify(value: unknown): string {
  try {
    return stringifyValue(value as Value) ?? ""
  } catch {
    return ""
  }
}

function buildControl(
  key: string,
  entry: AtomicEntry,
  workspace: Workspace,
): PropertyControl {
  const options = getPresetOptionsAsLabelValue(key, workspace)
  if (options.length > 0) {
    return { kind: "option", value: entry.value, options }
  }
  return { kind: "text", value: safeStringify(entry) }
}

/**
 * Groups a node's merged properties into inspector sections with an editable
 * control per row. Atomic properties edit inline; compound properties expand
 * into facet rows (e.g. `margin.top`, `border.color`) that merge back through
 * `mergeSubProperties`. Layered paint stacks render read-only. A pragmatic
 * subset of the full properties inspector.
 *
 * Framework-neutral: the React and Vue property panels wrap this with their own
 * reactivity (memo/computed) and dispatch the edits it describes.
 */
export function buildPropertyRows(
  properties: Record<string, unknown>,
  workspace: Workspace,
  overrideKeys: Set<string>,
): PropertySection[] {
  const byCategory = new Map<PropertyDisplayCategory, PropertyRow[]>()

  function pushRow(category: PropertyDisplayCategory, row: PropertyRow): void {
    const rows = byCategory.get(category) ?? []
    rows.push(row)
    byCategory.set(category, rows)
  }

  const orderedKeys = Object.keys(properties)
    .filter((key) => PROPERTY_DISPLAY_META[key])
    .sort(
      (a, b) =>
        PROPERTY_DISPLAY_META[a].displayOrder -
        PROPERTY_DISPLAY_META[b].displayOrder,
    )

  for (const key of orderedKeys) {
    const entry = properties[key]
    const meta = PROPERTY_DISPLAY_META[key]
    const category = meta.displayCategory
    const canReset = overrideKeys.has(key)

    if (isAtomicEntry(entry)) {
      pushRow(category, {
        key,
        label: key,
        valueType: entry.type,
        control: buildControl(key, entry, workspace),
        isFacet: false,
        isHeader: false,
        canReset,
      })
      continue
    }

    if (isCompoundEntry(entry)) {
      pushRow(category, {
        key,
        label: key,
        valueType: ValueType.EMPTY,
        control: { kind: "readonly", value: safeStringify(entry) },
        isFacet: false,
        isHeader: true,
        canReset,
      })
      for (const [facet, facetValue] of Object.entries(entry)) {
        if (!isAtomicEntry(facetValue)) continue
        pushRow(category, {
          key: `${key}.${facet}`,
          label: facet,
          valueType: facetValue.type,
          control: { kind: "text", value: safeStringify(facetValue) },
          isFacet: true,
          isHeader: false,
          canReset: false,
        })
      }
      continue
    }

    // Layered paint stacks (background, shadow) expand into per-layer facet
    // rows keyed `root.<index>.<facet>`, edited through the layered-facet merge.
    if (Array.isArray(entry)) {
      pushRow(category, {
        key,
        label: key,
        valueType: ValueType.EMPTY,
        control: { kind: "readonly", value: "" },
        isFacet: false,
        isHeader: true,
        canReset,
        layerAdd: key,
      })
      entry.forEach((layer, index) => {
        if (!layer || typeof layer !== "object") return
        pushRow(category, {
          key: `${key}.${index}`,
          label: `Layer ${index}`,
          valueType: ValueType.EMPTY,
          control: { kind: "readonly", value: "" },
          isFacet: false,
          isHeader: true,
          canReset: false,
          layerRemove: { property: key, index },
        })
        for (const [facet, facetValue] of Object.entries(layer)) {
          if (!isAtomicEntry(facetValue)) continue
          pushRow(category, {
            key: `${key}.${index}.${facet}`,
            label: facet,
            valueType: facetValue.type,
            control: { kind: "text", value: safeStringify(facetValue) },
            isFacet: true,
            isHeader: false,
            canReset: false,
          })
        }
      })
      continue
    }

    // Any other shape renders read-only.
    pushRow(category, {
      key,
      label: key,
      valueType: ValueType.EMPTY,
      control: { kind: "readonly", value: safeStringify(entry) },
      isFacet: false,
      isHeader: false,
      canReset,
    })
  }

  const sections: PropertySection[] = []
  for (const category of CATEGORY_ORDER) {
    const rows = byCategory.get(category)
    if (!rows || rows.length === 0) continue
    sections.push({ category, label: CATEGORY_LABELS[category], rows })
  }
  return sections
}
