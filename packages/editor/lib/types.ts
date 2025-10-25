import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"

export type Placement = "before" | "after" | "inside"

export interface Target {
  nodeId: VariantId | InstanceId | ComponentId
  index: number
}
