import { VariantId } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"

/**
 * Metadata stored for each component variant during export
 * Used to look up prop keys when generating parent components
 */
export interface ComponentMetadata {
  componentId: ComponentId
  variantId: VariantId
  componentName: string
  propNamesMap: Map<string, string> // Deprecated: use propValuesMap
  propValuesMap: Map<string, string> // Prop value names (for variable names)
  propKeysMap: Map<string, string> // Prop key names (for JSX attributes and interface keys)
  interfacePropNames: Set<string> // Prop names from interface (e.g., "icon", "icon2", "text", "text2")
}

/**
 * Storage for component metadata during export
 * Keyed by VariantId to support both default and user variants
 */
export type ComponentMetadataStorage = Map<VariantId, ComponentMetadata>
