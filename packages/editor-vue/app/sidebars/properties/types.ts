import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

/** A property category section: its key, label, and the top-level rows it holds. */
export interface PropertySection {
  category: string
  label: string
  properties: FlatProperty[]
}
