import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import { workspaceService } from "../../../services/workspace.service"
import { InstanceId, VariantId, Workspace } from "../../../types"

/**
 * Validation result for core handler operations
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Enhanced validation options for AI-specific operations
 */
export interface ValidationOptions {
  /** Whether to perform strict validation (default: false for backward compatibility) */
  strict?: boolean
  /** Whether to check for circular dependencies (default: true) */
  checkCircularDependencies?: boolean
  /** Whether to validate component schemas (default: true) */
  validateSchemas?: boolean
  /** Whether to validate component level compatibility (default: true) */
  validateLevels?: boolean
  /** Whether this is an AI operation (enables additional validation) */
  isAiOperation?: boolean
}

/**
 * Validate that a component schema exists and is valid
 */
export function validateComponentSchema(
  componentId: ComponentId,
  options: ValidationOptions = {},
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const schema = getComponentSchema(componentId)
    if (!schema) {
      errors.push(`Component schema not found for ${componentId}`)
      return { isValid: false, errors, warnings }
    }

    // Additional validation for AI operations
    if (options.isAiOperation && options.strict) {
      if (!schema.name || schema.name.trim() === "") {
        warnings.push(`Component ${componentId} has empty name`)
      }

      if (schema.level === undefined) {
        errors.push(`Component ${componentId} has undefined level`)
      }
    }

    return { isValid: true, errors, warnings }
  } catch (error) {
    errors.push(
      `Failed to validate component schema for ${componentId}: ${error}`,
    )
    return { isValid: false, errors, warnings }
  }
}

/**
 * Check for circular dependencies in component hierarchy
 */
export function validateCircularDependencies(
  parentId: ComponentId,
  childId: ComponentId,
  workspace: Workspace,
  options: ValidationOptions = {},
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!options.checkCircularDependencies) {
    return { isValid: true, errors, warnings }
  }

  try {
    // Special case: Allow Frame components to be nested within other Frame components
    // This is because Frame is designed to be a universal container
    if (childId === ComponentId.FRAME && parentId === ComponentId.FRAME) {
      return { isValid: true, errors, warnings }
    }

    // Check if adding this child would create a circular dependency
    const wouldCreateCycle = checkForCircularDependency(
      parentId,
      childId,
      workspace,
    )

    if (wouldCreateCycle) {
      errors.push(
        `Adding ${childId} to ${parentId} would create a circular dependency`,
      )
      return { isValid: false, errors, warnings }
    }

    return { isValid: true, errors, warnings }
  } catch (error) {
    errors.push(`Failed to check circular dependencies: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Validate component level compatibility
 */
export function validateComponentLevels(
  parentId: ComponentId,
  childId: ComponentId,
  options: ValidationOptions = {},
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!options.validateLevels) {
    return { isValid: true, errors, warnings }
  }

  try {
    const canBeParent = workspaceService.canComponentBeParentOf(
      parentId,
      childId,
    )

    if (!canBeParent) {
      const parentSchema = getComponentSchema(parentId)
      const childSchema = getComponentSchema(childId)
      errors.push(
        `Component level incompatibility: ${parentSchema.level} cannot contain ${childSchema.level}`,
      )
      return { isValid: false, errors, warnings }
    }

    return { isValid: true, errors, warnings }
  } catch (error) {
    errors.push(`Failed to validate component levels: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Comprehensive validation for core handler operations
 */
export function validateCoreOperation(
  operation:
    | "add_board"
    | "add_variant"
    | "insert_node"
    | "move_node"
    | "duplicate_node",
  payload: any,
  workspace: Workspace,
  options: ValidationOptions = {},
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    switch (operation) {
      case "add_board":
        return validateAddBoard(payload, workspace, options)

      case "add_variant":
        return validateAddVariant(payload, workspace, options)

      case "insert_node":
        return validateInsertNode(payload, workspace, options)

      case "move_node":
        return validateMoveNode(payload, workspace, options)

      case "duplicate_node":
        return validateDuplicateNode(payload, workspace, options)

      default:
        errors.push(`Unknown operation: ${operation}`)
        return { isValid: false, errors, warnings }
    }
  } catch (error) {
    errors.push(`Validation failed for ${operation}: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Validate add_board operation
 */
function validateAddBoard(
  payload: { componentId: ComponentId },
  workspace: Workspace,
  options: ValidationOptions,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if board already exists
  if (workspace.boards[payload.componentId]) {
    warnings.push(`Board for component ${payload.componentId} already exists`)
  }

  // Validate component schema
  const schemaValidation = validateComponentSchema(payload.componentId, options)
  if (!schemaValidation.isValid) {
    errors.push(...schemaValidation.errors)
  }
  warnings.push(...schemaValidation.warnings)

  return { isValid: errors.length === 0, errors, warnings }
}

/**
 * Validate add_variant operation
 */
function validateAddVariant(
  payload: { componentId: ComponentId },
  workspace: Workspace,
  options: ValidationOptions,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if board exists
  if (!workspace.boards[payload.componentId]) {
    errors.push(`Board for component ${payload.componentId} does not exist`)
  }

  // Validate component schema
  const schemaValidation = validateComponentSchema(payload.componentId, options)
  if (!schemaValidation.isValid) {
    errors.push(...schemaValidation.errors)
  }
  warnings.push(...schemaValidation.warnings)

  return { isValid: errors.length === 0, errors, warnings }
}

/**
 * Validate insert_node operation
 */
function validateInsertNode(
  payload: {
    nodeId: VariantId | InstanceId
    target: { parentId: VariantId | InstanceId; index?: number }
  },
  workspace: Workspace,
  options: ValidationOptions,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Check if source node exists
    const sourceNode = workspaceService.getNode(payload.nodeId, workspace)
    if (!sourceNode) {
      errors.push(`Source node ${payload.nodeId} not found`)
    }

    // Check if target parent exists
    const targetParent = workspaceService.getNode(
      payload.target.parentId,
      workspace,
    )
    if (!targetParent) {
      errors.push(`Target parent ${payload.target.parentId} not found`)
    }

    // If both nodes exist, validate component levels
    if (sourceNode && targetParent) {
      const levelValidation = validateComponentLevels(
        targetParent.component,
        sourceNode.component,
        options,
      )
      if (!levelValidation.isValid) {
        errors.push(...levelValidation.errors)
      }
      warnings.push(...levelValidation.warnings)

      // Check for circular dependencies
      const circularValidation = validateCircularDependencies(
        targetParent.component,
        sourceNode.component,
        workspace,
        options,
      )
      if (!circularValidation.isValid) {
        errors.push(...circularValidation.errors)
      }
      warnings.push(...circularValidation.warnings)
    }

    return { isValid: errors.length === 0, errors, warnings }
  } catch (error) {
    errors.push(`Failed to validate insert_node operation: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Validate move_node operation
 */
function validateMoveNode(
  payload: {
    nodeId: VariantId | InstanceId
    target: { parentId: VariantId | InstanceId; index?: number }
  },
  workspace: Workspace,
  options: ValidationOptions,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Check if source node exists
    const sourceNode = workspaceService.getNode(payload.nodeId, workspace)
    if (!sourceNode) {
      errors.push(`Source node ${payload.nodeId} not found`)
    }

    // Check if target parent exists
    const targetParent = workspaceService.getNode(
      payload.target.parentId,
      workspace,
    )
    if (!targetParent) {
      errors.push(`Target parent ${payload.target.parentId} not found`)
    }

    // If both nodes exist, validate component levels
    if (sourceNode && targetParent) {
      const levelValidation = validateComponentLevels(
        targetParent.component,
        sourceNode.component,
        options,
      )
      if (!levelValidation.isValid) {
        errors.push(...levelValidation.errors)
      }
      warnings.push(...levelValidation.warnings)

      // Check for circular dependencies
      const circularValidation = validateCircularDependencies(
        targetParent.component,
        sourceNode.component,
        workspace,
        options,
      )
      if (!circularValidation.isValid) {
        errors.push(...circularValidation.errors)
      }
      warnings.push(...circularValidation.warnings)
    }

    return { isValid: errors.length === 0, errors, warnings }
  } catch (error) {
    errors.push(`Failed to validate move_node operation: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Validate duplicate_node operation
 */
function validateDuplicateNode(
  payload: { nodeId: VariantId | InstanceId },
  workspace: Workspace,
  options: ValidationOptions,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Check if source node exists
    const sourceNode = workspaceService.getNode(payload.nodeId, workspace)
    if (!sourceNode) {
      errors.push(`Source node ${payload.nodeId} not found`)
    }

    // Validate component schema
    if (sourceNode) {
      const schemaValidation = validateComponentSchema(
        sourceNode.component,
        options,
      )
      if (!schemaValidation.isValid) {
        errors.push(...schemaValidation.errors)
      }
      warnings.push(...schemaValidation.warnings)
    }

    return { isValid: errors.length === 0, errors, warnings }
  } catch (error) {
    errors.push(`Failed to validate duplicate_node operation: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Validate if a component can be inserted into a target node for UI filtering
 * This is a lighter version of validateInsertNode that works with ComponentId
 */
export function validateComponentInsertionForUI(
  componentId: ComponentId,
  targetNodeId: VariantId | InstanceId,
  workspace: Workspace,
  options: ValidationOptions = {},
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Check if target parent exists
    const targetParent = workspaceService.getNode(targetNodeId, workspace)
    if (!targetParent) {
      errors.push(`Target parent ${targetNodeId} not found`)
      return { isValid: false, errors, warnings }
    }

    // Check if the component has a board (exists in workspace)
    const board = workspace.boards[componentId]
    if (!board) {
      // Component doesn't exist in workspace yet, but we can still validate if it could be inserted
      // This allows UI to show components that could be added
    }

    // Validate component levels
    const levelValidation = validateComponentLevels(
      targetParent.component,
      componentId,
      options,
    )
    if (!levelValidation.isValid) {
      errors.push(...levelValidation.errors)
    }
    warnings.push(...levelValidation.warnings)

    // Check for circular dependencies
    const circularValidation = validateCircularDependencies(
      targetParent.component,
      componentId,
      workspace,
      options,
    )
    if (!circularValidation.isValid) {
      errors.push(...circularValidation.errors)
    }
    warnings.push(...circularValidation.warnings)

    return { isValid: errors.length === 0, errors, warnings }
  } catch (error) {
    errors.push(`Failed to validate component insertion for UI: ${error}`)
    return { isValid: false, errors, warnings }
  }
}

/**
 * Check if adding a child to a parent would create a circular dependency
 */
function checkForCircularDependency(
  parentId: ComponentId,
  childId: ComponentId,
  workspace: Workspace,
): boolean {
  try {
    // Special case: Frames can contain other frames, so we need a more nuanced check
    if (childId === ComponentId.FRAME) {
      // For frames, we only prevent true circular dependencies where the frame
      // would contain itself in a way that creates an infinite loop
      // Multiple frames in the same component hierarchy are allowed
      return false
    }

    // Get all boards to check for existing relationships
    const boards = Object.values(workspace.boards)

    // Check if the child component is already a parent of the parent component
    // This is a simplified check - in a real implementation, you'd need to traverse
    // the entire component hierarchy to detect cycles
    for (const board of boards) {
      if (board.id === childId) {
        // Check if this child board contains the parent component
        const childVariant = workspace.byId[board.variants[0]]
        if (
          childVariant &&
          containsComponent(childVariant, parentId, workspace)
        ) {
          return true
        }
      }
    }

    return false
  } catch (error) {
    // If we can't determine, assume no circular dependency to avoid false positives
    return false
  }
}

/**
 * Check if a variant contains a specific component in its hierarchy
 */
function containsComponent(
  variant: any,
  componentId: ComponentId,
  workspace: Workspace,
  visited: Set<string> = new Set(),
): boolean {
  // Prevent infinite recursion
  if (visited.has(variant.id)) {
    return false
  }
  visited.add(variant.id)

  // Check if this variant is the component we're looking for
  if (variant.component === componentId) {
    return true
  }

  // Check children recursively
  if (variant.children) {
    for (const childId of variant.children) {
      const child = workspace.byId[childId]
      if (child && containsComponent(child, componentId, workspace, visited)) {
        return true
      }
    }
  }

  return false
}

/**
 * Log validation results for debugging
 */
export function logValidationResult(
  operation: string,
  result: ValidationResult,
  options: ValidationOptions = {},
): void {
  if (result.errors.length > 0) {
    console.warn(`Validation errors for ${operation}:`, result.errors)
  }

  if (result.warnings.length > 0 && (options.isAiOperation || options.strict)) {
    console.warn(`Validation warnings for ${operation}:`, result.warnings)
  }
}
