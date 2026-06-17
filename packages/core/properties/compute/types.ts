import type { Theme } from "../../themes/types"
import type { Properties } from "../types/properties"
import type { PropertyKey, SubPropertyKey } from "../types/property-keys"

/**
 * Layout model a node arranges its children with during style generation.
 * Mirrors the `ComponentLayout` enum in `components/constants`; kept as a plain
 * string union here so `properties` does not depend on `components`. Absent or
 * `"flexbox"` means flexbox layout, `"grid"` means CSS grid.
 */
export type LayoutMode = "flexbox" | "grid"

/**
 * Holds this node's `properties`, the resolved `Theme`, and an optional parent with the same
 * shape. Engines read the parent when a based-on path targets the parent object.
 * `layoutMode` records the node's own layout model so style helpers can branch flex vs grid,
 * and children can read the parent's mode through `parentContext`.
 */
export type ComputeContext = {
  properties: Properties
  parentContext: ComputeContext | null
  theme: Theme
  layoutMode?: LayoutMode
}

/**
 * Names the catalog property being resolved and, when the value sits under a grouped key, which
 * facet name applies. Optical padding reads the facet to pick its ratio.
 */
export type ComputeKeys = {
  propertyKey: PropertyKey
  subPropertyKey?: SubPropertyKey
}
