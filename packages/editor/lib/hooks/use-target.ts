import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"

/**
 * Represents where the user clicked and intends to add a component
 */
export interface Target {
  nodeId: VariantId | InstanceId | ComponentId
  index: number
}
