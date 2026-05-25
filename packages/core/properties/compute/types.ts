import type { Theme } from "../../themes/types"
import type { Properties } from "../types/properties"
import type { PropertyKey, SubPropertyKey } from "../types/property-keys"

/**
 * Holds this node's `properties`, the resolved `Theme`, and an optional parent with the same
 * shape. Engines read the parent when a based-on path targets the parent object.
 */
export type ComputeContext = {
  properties: Properties
  parentContext: ComputeContext | null
  theme: Theme
}

/**
 * Names the catalog property being resolved and, when the value sits under a grouped key, which
 * facet name applies. Optical padding reads the facet to pick its ratio.
 */
export type ComputeKeys = {
  propertyKey: PropertyKey
  subPropertyKey?: SubPropertyKey
}
