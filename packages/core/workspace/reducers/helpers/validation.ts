import type { ComponentId } from "../../../components/constants"
import { validateComponentCanBeInserted } from "../../middleware/validation/validators"
import type { InstanceId, VariantId, Workspace } from "../../types"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate that a component can be inserted into a target node for UI filtering.
 */
export function validateComponentInsertionForUI(
  componentId: ComponentId,
  targetNodeId: VariantId | InstanceId,
  workspace: Workspace,
): ValidationResult {
  const result = validateComponentCanBeInserted(
    componentId,
    targetNodeId,
    workspace,
  )
  return {
    isValid: result.isValid,
    errors: result.errors,
    warnings: [],
  }
}
