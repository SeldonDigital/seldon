import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import { workspaceService } from "../../../services/workspace.service"
import { Workspace } from "../../../types"

// Performance optimization: Memoization caches
const schemaStructureCache = new Map<string, ComponentStructure>()
const variantStructureCache = new Map<string, ComponentStructure>()
const reconciliationCache = new Map<string, ReconciliationResult>()
const requiredStructuresCache = new Map<
  string,
  Map<ComponentId, ComponentStructure>
>()

// Cache keys for different operations
function getSchemaStructureKey(componentId: ComponentId): string {
  return `schema:${componentId}`
}

function getVariantStructureKey(
  variantId: string,
  workspaceVersion: number,
): string {
  return `variant:${variantId}:v${workspaceVersion}`
}

function getReconciliationKey(
  componentId: ComponentId,
  workspaceVersion: number,
): string {
  return `reconciliation:${componentId}:v${workspaceVersion}`
}

function getRequiredStructuresKey(actionsHash: string): string {
  return `required:${actionsHash}`
}

// Simple hash function for action arrays
function hashActions(actions: any[]): string {
  return actions
    .map((action) => `${action.type}:${JSON.stringify(action.payload)}`)
    .join("|")
}

// Cache management functions
export function clearReconciliationCaches(): void {
  schemaStructureCache.clear()
  variantStructureCache.clear()
  reconciliationCache.clear()
  requiredStructuresCache.clear()
}

// Cache size limits to prevent memory issues
const MAX_CACHE_SIZE = 1000

function enforceCacheSizeLimit(cache: Map<string, any>): void {
  if (cache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries (simple FIFO)
    const entries = Array.from(cache.entries())
    const toRemove = entries.slice(0, cache.size - MAX_CACHE_SIZE)
    toRemove.forEach(([key]) => cache.delete(key))
  }
}

// Performance monitoring
export function getCacheStats(): {
  schemaStructureCache: number
  variantStructureCache: number
  reconciliationCache: number
  requiredStructuresCache: number
  total: number
} {
  return {
    schemaStructureCache: schemaStructureCache.size,
    variantStructureCache: variantStructureCache.size,
    reconciliationCache: reconciliationCache.size,
    requiredStructuresCache: requiredStructuresCache.size,
    total:
      schemaStructureCache.size +
      variantStructureCache.size +
      reconciliationCache.size +
      requiredStructuresCache.size,
  }
}

export function invalidateVariantCache(variantId: string): void {
  // Remove all cached entries for this variant
  for (const [key] of variantStructureCache) {
    if (key.includes(variantId)) {
      variantStructureCache.delete(key)
    }
  }
}

export function invalidateComponentCache(componentId: ComponentId): void {
  // Remove all cached entries for this component
  for (const [key] of reconciliationCache) {
    if (key.includes(componentId)) {
      reconciliationCache.delete(key)
    }
  }
  schemaStructureCache.delete(getSchemaStructureKey(componentId))
}

export interface ComponentStructure {
  component: ComponentId
  children: ComponentStructure[]
  properties?: Record<string, any>
}

export interface ReconciliationResult {
  useSchema: boolean
  structure: ComponentStructure | null
  needsNewVariant: boolean
  suggestedVariantId?: string
}

/**
 * Compare a component schema with its actual workspace structure
 */
export function reconcileSchemaWithWorkspace(
  componentId: ComponentId,
  workspace: Workspace,
): ReconciliationResult {
  // Check cache first
  const cacheKey = getReconciliationKey(componentId, workspace.version)
  const cached = reconciliationCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const schema = getComponentSchema(componentId)
  const workspaceStructure = getWorkspaceStructure(componentId, workspace)
  const schemaStructure = convertSchemaToStructure(schema)

  const matches = compareStructures(schemaStructure, workspaceStructure)

  if (matches) {
    // When workspace matches schema, use the existing variant
    const board = workspace.boards[componentId]
    const existingVariantId = board?.variants[0] // Use the first (default) variant

    const result = {
      useSchema: true,
      structure: schemaStructure,
      needsNewVariant: false,
      suggestedVariantId: existingVariantId,
    }
    reconciliationCache.set(cacheKey, result)
    enforceCacheSizeLimit(reconciliationCache)
    return result
  } else {
    // Check if there's a suitable existing variant
    const bestMatch = findBestMatchingVariant(
      componentId,
      workspace,
      schemaStructure,
    )

    if (bestMatch) {
      // Get the structure of the existing variant we'll use
      const existingVariant = workspace.byId[bestMatch]
      const existingStructure = existingVariant
        ? convertVariantToStructure(existingVariant, workspace)
        : null

      const result = {
        useSchema: false,
        structure: existingStructure,
        needsNewVariant: false,
        suggestedVariantId: bestMatch,
      }
      reconciliationCache.set(cacheKey, result)
      enforceCacheSizeLimit(reconciliationCache)
      return result
    } else {
      // Only create new variants if there are NO existing variants at all
      const board = workspace.boards[componentId]
      const hasExistingVariants = board && board.variants.length > 0

      if (hasExistingVariants) {
        // No suitable existing variant found, create a new one
        const result = {
          useSchema: true,
          structure: schemaStructure,
          needsNewVariant: true,
        }
        reconciliationCache.set(cacheKey, result)
        enforceCacheSizeLimit(reconciliationCache)
        return result
      } else {
        // No boards exist at all, handle gracefully
        const result = {
          useSchema: false,
          structure: null,
          needsNewVariant: true,
        }
        reconciliationCache.set(cacheKey, result)
        enforceCacheSizeLimit(reconciliationCache)
        return result
      }
    }
  }
}

/**
 * Get the actual structure of a component from the workspace
 */
function getWorkspaceStructure(
  componentId: ComponentId,
  workspace: Workspace,
): ComponentStructure | null {
  const board = workspace.boards[componentId]
  if (!board || board.variants.length === 0) {
    return null
  }

  // Use the default variant to determine the structure
  const defaultVariantId = board.variants[0]
  const defaultVariant = workspace.byId[defaultVariantId]

  if (!defaultVariant) {
    return null
  }

  return convertVariantToStructure(defaultVariant, workspace)
}

/**
 * Convert a schema to a component structure
 */
function convertSchemaToStructure(schema: any): ComponentStructure {
  // Check cache first
  const cacheKey = getSchemaStructureKey(schema.id)
  const cached = schemaStructureCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const structure: ComponentStructure = {
    component: schema.id,
    children: [],
  }

  if (schema.children) {
    structure.children = schema.children.map((child: any, idx1: number) => {
      const childStructure: ComponentStructure = {
        component: child.component,
        children: [],
        properties: child.overrides || {},
      }

      // Get the child's schema to understand its structure and find nestedOverrides
      const childSchema = getComponentSchema(child.component)

      if (childSchema && "children" in childSchema && childSchema.children) {
        // Check for nestedOverrides in the child schema's children
        childStructure.children = childSchema.children.map(
          (level2: any, idx2: number) => {
            // Find the nestedOverride properties for this level2 component
            // First check if the parent child definition has nestedOverrides
            let nestedOverrideProps = {}

            if (child.nestedOverrides) {
              // Try to find the nestedOverride by matching component names
              // Use multiple matching strategies to be as general as possible
              for (const [overrideKey, overrideValue] of Object.entries(
                child.nestedOverrides,
              )) {
                // Get the component name from the component ID (e.g., "ICON" from "ComponentId.ICON")
                const componentName =
                  level2.component.split(".").pop()?.toLowerCase() ||
                  level2.component.toLowerCase()

                // Multiple matching strategies for maximum compatibility:
                // 1. Exact lowercase match (e.g., "icon" matches "icon")
                // 2. Exact component ID match (e.g., "ComponentId.ICON" matches "ComponentId.ICON")
                // 3. Case-insensitive match (e.g., "Icon" matches "icon")
                if (
                  overrideKey.toLowerCase() === componentName ||
                  overrideKey === level2.component ||
                  overrideKey.toLowerCase() === level2.component.toLowerCase()
                ) {
                  nestedOverrideProps = overrideValue as Record<string, any>
                  break
                }
              }

              // If no match found by name, try to apply by index as fallback
              if (Object.keys(nestedOverrideProps).length === 0) {
                const overrideKeys = Object.keys(child.nestedOverrides)
                if (overrideKeys[idx2]) {
                  nestedOverrideProps = child.nestedOverrides[
                    overrideKeys[idx2]
                  ] as Record<string, any>
                }
              }
            }

            // Also check if the level2 itself has nestedOverrides (from the child schema)
            if (level2.nestedOverrides) {
              // Merge with any existing nestedOverrideProps
              nestedOverrideProps = {
                ...nestedOverrideProps,
                ...level2.nestedOverrides,
              }
            }

            // Always create children based on the level2's schema, regardless of nestedOverrides
            // This ensures all components get their proper structure from their schema
            let level2Children: ComponentStructure[] = []
            const level2Schema = getComponentSchema(level2.component)
            if (
              level2Schema &&
              "children" in level2Schema &&
              level2Schema.children
            ) {
              level2Children = level2Schema.children.map(
                (level3: any, idx3: number) => {
                  // Find the properties for this level3 from nestedOverrideProps
                  // Use multiple matching strategies to be as general as possible
                  let level3Props = {}
                  for (const [overrideKey, overrideValue] of Object.entries(
                    nestedOverrideProps,
                  )) {
                    const componentName =
                      level3.component.split(".").pop()?.toLowerCase() ||
                      level3.component.toLowerCase()

                    // Multiple matching strategies for maximum compatibility:
                    // 1. Exact lowercase match (e.g., "icon" matches "icon")
                    // 2. Exact component ID match (e.g., "ComponentId.ICON" matches "ComponentId.ICON")
                    // 3. Case-insensitive match (e.g., "Icon" matches "icon")
                    // 4. Fallback: try to match by index if no other match found
                    if (
                      overrideKey.toLowerCase() === componentName ||
                      overrideKey === level3.component ||
                      overrideKey.toLowerCase() ===
                        level3.component.toLowerCase()
                    ) {
                      level3Props = overrideValue as Record<string, any>
                      break
                    }
                  }

                  // If no match found by name, try to apply by index as fallback
                  if (Object.keys(level3Props).length === 0) {
                    const overrideKeys = Object.keys(nestedOverrideProps)
                    if (overrideKeys[idx3]) {
                      level3Props = (nestedOverrideProps as any)[
                        overrideKeys[idx3]
                      ] as Record<string, any>
                    }
                  }

                  const result = {
                    component: level3.component,
                    children: [], // Limit depth for comparison
                    properties: {
                      ...(level3.overrides || {}),
                      ...level3Props,
                    },
                  }

                  return result
                },
              )
            }

            const result = {
              component: level2.component,
              children: level2Children, // Use the created children
              properties: {
                ...(level2.overrides || {}),
                // Don't include nestedOverrideProps in properties since we used them to create children
              },
            }

            return result
          },
        )
      }

      return childStructure
    })
  }

  // Cache the result
  schemaStructureCache.set(cacheKey, structure)
  enforceCacheSizeLimit(schemaStructureCache)
  return structure
}

/**
 * Compare two component structures for equality
 * Optimized with early exits and memoization
 */
function compareStructures(
  schema: ComponentStructure,
  workspace: ComponentStructure | null,
): boolean {
  if (!workspace) {
    return false
  }

  // Early exit: component types must match
  if (schema.component !== workspace.component) {
    return false
  }

  // Early exit: children count must match
  if (schema.children.length !== workspace.children.length) {
    return false
  }

  // Early exit: if no children, structures match
  if (schema.children.length === 0) {
    return true
  }

  // Compare children with early exits
  for (let i = 0; i < schema.children.length; i++) {
    const schemaChild = schema.children[i]
    const workspaceChild = workspace.children[i]

    // Early exit: child component types must match
    if (schemaChild.component !== workspaceChild.component) {
      return false
    }

    // Recursively compare children (only if needed)
    if (!compareStructures(schemaChild, workspaceChild)) {
      return false
    }
  }

  return true
}

/**
 * Find the best matching variant for a desired structure
 */
function findBestMatchingVariant(
  componentId: ComponentId,
  workspace: Workspace,
  desiredStructure: ComponentStructure,
): string | null {
  const board = workspace.boards[componentId]
  if (!board) {
    return null
  }

  // If there are any existing variants, prefer using them over creating new ones
  // This prevents unnecessary duplicate variants
  if (board.variants.length > 0) {
    // First, try to find an exact match
    for (const variantId of board.variants) {
      const variant = workspace.byId[variantId]
      if (!variant) continue

      // Quick check: if variant has no children and desired structure has no children, it's a match
      if (!variant.children && desiredStructure.children.length === 0) {
        return variantId
      }

      // Quick check: if children count doesn't match, skip expensive conversion
      if (
        variant.children &&
        variant.children.length !== desiredStructure.children.length
      ) {
        continue
      }

      const variantStructure = convertVariantToStructure(variant, workspace)

      // Check if this variant matches the desired structure exactly
      if (compareStructures(desiredStructure, variantStructure)) {
        return variantId
      }
    }

    // If no exact match, check if any existing variant can be used
    // (e.g., if AI wants ICON+LABEL but workspace has ICON-only, use the ICON-only)
    for (const variantId of board.variants) {
      const variant = workspace.byId[variantId]
      if (!variant) continue

      const variantStructure = convertVariantToStructure(variant, workspace)

      // Check if the existing variant is a subset of what's needed
      // This allows using simpler variants when the AI's requirements are more complex
      if (isVariantSuitableForStructure(variantStructure, desiredStructure)) {
        return variantId
      }
    }

    // If we have existing variants but none are suitable, still prefer using them
    // This prevents unnecessary duplicate variants and respects user modifications
    return board.variants[0] // Return the first existing variant
  }

  return null
}

/**
 * Check if an existing variant structure is suitable for a desired structure
 * This allows using simpler variants when the AI's requirements are more complex
 */
function isVariantSuitableForStructure(
  existingStructure: ComponentStructure,
  desiredStructure: ComponentStructure,
): boolean {
  // If the existing structure has fewer or different children than desired,
  // it might still be usable (e.g., ICON-only button when AI wants ICON+LABEL)

  // Check if the existing structure is a subset of the desired structure
  // This allows using simpler variants when the AI's requirements are more complex

  // First check if the component types match
  if (existingStructure.component !== desiredStructure.component) {
    return false
  }

  // Check if the existing children are a subset of the desired children
  // We need to check if all existing children exist in the desired structure at the same positions
  if (existingStructure.children.length > desiredStructure.children.length) {
    return false // Existing has more children than desired
  }

  // Check if each existing child matches the corresponding desired child
  for (let i = 0; i < existingStructure.children.length; i++) {
    const existingChild = existingStructure.children[i]
    const desiredChild = desiredStructure.children[i]

    if (existingChild.component !== desiredChild.component) {
      return false // Component types don't match
    }

    // Recursively check children
    if (!isVariantSuitableForStructure(existingChild, desiredChild)) {
      return false
    }
  }

  return true
}

/**
 * Analyze AI actions to determine what component structures are needed
 */
export function analyzeRequiredStructures(
  actions: any[],
): Map<ComponentId, ComponentStructure> {
  // Check cache first
  const actionsHash = hashActions(actions)
  const cacheKey = getRequiredStructuresKey(actionsHash)
  const cached = requiredStructuresCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const requiredStructures = new Map<ComponentId, ComponentStructure>()

  for (const action of actions) {
    if (
      action.type === "ai_add_component" ||
      action.type === "ai_add_variant"
    ) {
      const componentId = action.payload.componentId

      // Analyze the complete set of actions to understand the desired structure
      const structure = analyzeDesiredStructure(componentId, actions)
      requiredStructures.set(componentId, structure)
    } else if (action.type === "ai_insert_node") {
      // For insert_node actions, we need to determine the component type from the nodeId
      const nodeId = action.payload.nodeId
      if (nodeId && typeof nodeId === "string") {
        // Parse nodeId to determine component type
        // e.g., $cref0.1.2.0 where 1 is the component index
        const match = nodeId.match(/\$cref0\.(\d+)\./)
        if (match) {
          const componentIndex = parseInt(match[1], 10)
          // We need to determine what component this index refers to
          // For now, let's assume it's cardProduct if we see insert_node actions
          const componentId = ComponentId.CARD_PRODUCT

          if (!requiredStructures.has(componentId)) {
            const structure = analyzeDesiredStructure(componentId, actions)
            requiredStructures.set(componentId, structure)
          }
        }
      }
    } else if (
      action.type === "ai_reorder_node" ||
      action.type === "ai_remove_node"
    ) {
      // If we see structural changes, we need to analyze the desired structure
      // For now, assume cardProduct when we see structural changes
      const componentId = ComponentId.CARD_PRODUCT

      if (!requiredStructures.has(componentId)) {
        const structure = analyzeDesiredStructure(componentId, actions)
        requiredStructures.set(componentId, structure)
      }
    } else if (action.type === "ai_set_node_properties") {
      // For property setting actions, we need to determine the component type from the nodeId
      if (action.payload && action.payload.nodeId) {
        const nodeId = action.payload.nodeId
        if (typeof nodeId === "string") {
          // Parse nodeId to determine component type
          // e.g., $cref0.0.0 = component.child[0], $cref0.1.0.0 = component.child[1].child[0].child[0]
          const match = nodeId.match(/\$cref0\.(\d+)/)
          if (match) {
            // We need to determine what component this refers to
            // For now, we'll analyze all actions to find the component being referenced
            const componentId = determineComponentFromActions(actions)

            if (componentId && !requiredStructures.has(componentId)) {
              const structure = analyzeDesiredStructure(componentId, actions)
              requiredStructures.set(componentId, structure)
            }
          }
        }
      }
    }
  }

  // Cache the result
  requiredStructuresCache.set(cacheKey, requiredStructures)
  enforceCacheSizeLimit(requiredStructuresCache)
  return requiredStructures
}

/**
 * Determine the component ID from AI actions by looking for ai_add_variant or ai_add_component actions
 */
function determineComponentFromActions(actions: any[]): ComponentId | null {
  for (const action of actions) {
    if (
      action.type === "ai_add_variant" ||
      action.type === "ai_add_component"
    ) {
      return action.payload.componentId
    }
  }
  return null
}

/**
 * Analyze the complete set of AI actions to determine the desired structure for a component
 */
function analyzeDesiredStructure(
  componentId: ComponentId,
  actions: any[],
): ComponentStructure {
  try {
    // Start with the default schema structure
    const schema = getComponentSchema(componentId)
    if (!schema) {
      throw new Error(`Component schema not found for ${componentId}`)
    }
    const baseStructure = convertSchemaToStructure(schema)

    // Apply AI actions to modify the structure based on what the AI is trying to do
    return applyAIActionsToStructure(baseStructure, actions, componentId)
  } catch (error) {
    // Handle invalid component IDs gracefully
    return {
      component: componentId,
      children: [],
      properties: {},
    }
  }
}

/**
 * Apply AI actions to modify a component structure based on what the AI is trying to do
 */
function applyAIActionsToStructure(
  baseStructure: ComponentStructure,
  actions: any[],
  componentId: ComponentId,
): ComponentStructure {
  // Create a deep copy of the base structure to modify

  const updatedStructure = {
    ...baseStructure,
    children: baseStructure.children.map((child) => ({
      ...child,
      children: child.children
        ? child.children.map((level2) => ({
            ...level2,
            children: level2.children
              ? level2.children.map((level3) => ({
                  ...level3,
                  children: level3.children
                    ? level3.children.map((level4) => ({
                        ...level4,
                        children: level4.children || [],
                      }))
                    : [],
                }))
              : [],
          }))
        : [],
    })),
  }

  // Analyze AI actions to understand the desired structure
  for (const action of actions) {
    if (
      action.type === "ai_set_node_properties" &&
      action.payload &&
      action.payload.nodeId
    ) {
      const nodeId = action.payload.nodeId
      const properties = action.payload.properties

      // Parse nodeId to find the target component
      // e.g., $cref0.0.0 = component.child[0], $cref0.0.1 = component.child[1]
      // e.g., $cref0.1.0.0 = component.child[1].child[0].child[0] (3 levels deep)
      const match = nodeId.match(/\$cref0\.(\d+)\.(\d+)(?:\.(\d+))?/)
      if (match) {
        const idx1 = parseInt(match[1], 10)
        const idx2 = parseInt(match[2], 10)
        const idx3 = match[3] ? parseInt(match[3], 10) : undefined

        const level1 = updatedStructure.children[idx1]

        if (level1 && properties) {
          // If this is targeting level 3 (great-grandchild), update its properties
          if (
            idx3 !== undefined &&
            level1.children &&
            level1.children[idx2] &&
            level1.children[idx2].children &&
            level1.children[idx2].children[idx3]
          ) {
            const level2 = level1.children[idx2]
            const level3 = level2.children[idx3]
            const validatedProperties = validatePropertiesAgainstSchema(
              level3.component,
              properties,
            )
            level3.properties = {
              ...level3.properties,
              ...validatedProperties,
            }
          }
          // If this is targeting level 2 (grandchild), update its properties
          else if (idx2 !== undefined && level1.children) {
            // Create missing child if it doesn't exist
            if (!level1.children[idx2]) {
              // Get the schema for the parent component to determine child type
              const parentSchema = getComponentSchema(level1.component)
              if (
                parentSchema &&
                "children" in parentSchema &&
                parentSchema.children &&
                parentSchema.children[idx2]
              ) {
                level1.children[idx2] = {
                  component: parentSchema.children[idx2].component,
                  children: [],
                  properties: parentSchema.children[idx2].overrides || {},
                }
              }
            }

            const level2 = level1.children[idx2]
            if (level2) {
              const validatedProperties = validatePropertiesAgainstSchema(
                level2.component,
                properties,
              )
              level2.properties = {
                ...level2.properties,
                ...validatedProperties,
              }
            }
          } else {
            // Otherwise, update level 1 (child) properties
            const validatedProperties = validatePropertiesAgainstSchema(
              level1.component,
              properties,
            )
            level1.properties = {
              ...level1.properties,
              ...validatedProperties,
            }
          }
        }
      }
    } else if (action.type === "ai_remove_node") {
      // Handle node removal directly
      const nodeId = action.payload.nodeId
      const match = nodeId.match(/\$cref0\.(\d+)\.(\d+)(?:\.(\d+))?/)
      if (match) {
        const idx1 = parseInt(match[1], 10)
        const idx2 = parseInt(match[2], 10)
        const idx3 = match[3] ? parseInt(match[3], 10) : undefined

        const level1 = updatedStructure.children[idx1]
        if (level1 && level1.children) {
          if (
            idx3 !== undefined &&
            level1.children[idx2] &&
            level1.children[idx2].children
          ) {
            // Remove level 3 child (great-grandchild) - e.g., $cref0.1.0.1 removes child 1 from button 0
            level1.children[idx2].children.splice(idx3, 1)
          } else if (idx2 !== undefined) {
            // Remove level 2 child (grandchild) - e.g., $cref0.1.0 removes button 0
            level1.children.splice(idx2, 1)
          }
        }
      }
    } else if (
      action.type === "ai_insert_node" ||
      action.type === "ai_reorder_node"
    ) {
      // For other structural changes, we need to analyze the desired structure
      // This is more complex and may require component-specific logic
      updatedStructure.children = analyzeStructuralChanges(
        updatedStructure.children,
        actions,
        componentId,
      )
    }
  }

  return updatedStructure
}

/**
 * Analyze structural changes from AI actions to determine the desired child structure
 */
function analyzeStructuralChanges(
  currentChildren: ComponentStructure[],
  actions: any[],
  componentId: ComponentId,
): ComponentStructure[] {
  // For now, we'll use a simplified approach that works for most cases
  // This can be extended with component-specific logic as needed

  // Look for actions that suggest adding/removing children
  const childCounts = new Map<ComponentId, number>()

  for (const action of actions) {
    if (action.payload && action.payload.nodeId) {
      const nodeId = action.payload.nodeId

      // Parse reference IDs to understand the structure
      // e.g., $cref0.1.2.0 where 1 = child index, 2 = grandchild index, 0 = great-grandchild index
      const match = nodeId.match(/\$cref0\.(\d+)\.(\d+)/)
      if (match) {
        const idx1 = parseInt(match[1], 10)
        const idx2 = parseInt(match[2], 10)

        // Find the component type at this level
        if (currentChildren[idx1]) {
          const childComponent = currentChildren[idx1].component
          const currentCount = childCounts.get(childComponent) || 0
          childCounts.set(childComponent, Math.max(currentCount, idx2 + 1))
        }
      }
    }
  }

  // Update children based on the analysis
  const updatedChildren = currentChildren.map((child) => {
    const desiredCount = childCounts.get(child.component)
    if (desiredCount && desiredCount > 0) {
      // Create the desired number of children for this component
      const childSchema = getComponentSchema(child.component)
      if (childSchema && "children" in childSchema && childSchema.children) {
        const newChildren: ComponentStructure[] = []
        for (let i = 0; i < desiredCount; i++) {
          const schemaChild =
            childSchema.children[i % childSchema.children.length]

          // Preserve existing children if they exist, otherwise create new ones
          const existingChild =
            child.children && child.children[i] ? child.children[i] : null

          newChildren.push({
            component: schemaChild.component,
            children: existingChild ? existingChild.children : [],
            properties: {
              ...(schemaChild.overrides || {}),
              ...(existingChild ? existingChild.properties : {}),
            },
          })
        }
        return {
          ...child,
          children: newChildren,
        }
      }
    }
    return child
  })

  return updatedChildren
}

/**
 * Validate properties against component schema restrictions
 * Only applies properties that are allowed for the specific component
 */
function validatePropertiesAgainstSchema(
  componentId: ComponentId,
  properties: Record<string, any>,
): Record<string, any> {
  const schema = getComponentSchema(componentId)
  const validatedProperties: Record<string, any> = {}

  for (const [propertyKey, propertyValue] of Object.entries(properties)) {
    // Get the property definition from the schema
    const propertyDefinition =
      schema.properties?.[propertyKey as keyof typeof schema.properties]

    if (!propertyDefinition) {
      // Property doesn't exist in schema, skip it
      continue
    }

    // Validate the property value against schema restrictions
    const isValidProperty = validatePropertyValue(
      propertyKey,
      propertyValue,
      propertyDefinition,
      componentId,
    )

    if (isValidProperty) {
      validatedProperties[propertyKey] = propertyValue
    }
  }

  return validatedProperties
}

/**
 * Validate a single property value against its schema definition
 */
function validatePropertyValue(
  propertyKey: string,
  propertyValue: any,
  propertyDefinition: any,
  componentId: ComponentId,
): boolean {
  // Handle compound properties (like font, background, etc.)
  if (typeof propertyValue === "object" && propertyValue !== null) {
    return validateCompoundProperty(
      propertyKey,
      propertyValue,
      propertyDefinition,
      componentId,
    )
  }

  // Handle simple properties with direct allowedValues
  if (propertyDefinition.restrictions?.allowedValues) {
    const allowedValues = propertyDefinition.restrictions.allowedValues

    // Extract the actual value to compare
    let valueToCompare = propertyValue

    // Handle property objects that have { type, value } structure
    if (
      typeof propertyValue === "object" &&
      propertyValue !== null &&
      "value" in propertyValue
    ) {
      valueToCompare = propertyValue.value
    }

    if (!allowedValues.includes(valueToCompare)) {
      return false
    }
  }

  return true
}

/**
 * Validate compound properties (like font, background, etc.) against their schema restrictions
 */
function validateCompoundProperty(
  propertyKey: string,
  propertyValue: Record<string, any>,
  propertyDefinition: any,
  componentId: ComponentId,
): boolean {
  // Check each sub-property of the compound property
  for (const [subPropertyKey, subPropertyValue] of Object.entries(
    propertyValue,
  )) {
    const subPropertyDefinition = propertyDefinition[subPropertyKey]

    if (!subPropertyDefinition) {
      // Sub-property doesn't exist in schema, skip it
      continue
    }

    // Check if this sub-property has allowedValues restrictions
    if (subPropertyDefinition.restrictions?.allowedValues) {
      const allowedValues = subPropertyDefinition.restrictions.allowedValues

      // Extract the actual value to compare
      let valueToCompare = subPropertyValue

      // Handle font preset objects that have { type, value } structure
      if (
        typeof subPropertyValue === "object" &&
        subPropertyValue !== null &&
        "value" in subPropertyValue
      ) {
        valueToCompare = subPropertyValue.value
      }

      if (!allowedValues.includes(valueToCompare)) {
        return false
      }
    }
  }

  return true
}

/**
 * Determine the correct variant to use for a component structure
 * This function looks for existing variants in the workspace that match the structure
 */
function getVariantForStructure(
  structure: ComponentStructure,
  workspace: Workspace,
): { variant: string; instanceOf: string; label: string } {
  const componentId = structure.component
  const schema = getComponentSchema(componentId)

  // Look for existing variants that match this structure
  const matchingVariant = findMatchingVariant(componentId, structure, workspace)

  if (matchingVariant) {
    return {
      variant: matchingVariant.id,
      instanceOf: matchingVariant.id,
      label: matchingVariant.label,
    }
  }

  // Fallback to default variant if no match found
  const defaultVariantId = `variant-${componentId}-default`
  return {
    variant: defaultVariantId,
    instanceOf: defaultVariantId,
    label: schema.name,
  }
}

/**
 * Find an existing variant that matches the given structure
 */
function findMatchingVariant(
  componentId: ComponentId,
  structure: ComponentStructure,
  workspace: Workspace,
): any | null {
  const board = workspace.boards[componentId]
  if (!board) {
    return null
  }

  // Get all existing variants for this component
  const existingVariants = board.variants
    .map((variantId) => workspace.byId[variantId])
    .filter(Boolean)

  // Step 1: Exact Match - If workspace matches schema → use existing variant
  for (const variant of existingVariants) {
    if (variant && variant.children) {
      const variantStructure = convertVariantToStructure(variant, workspace)

      if (compareComponentStructures(structure, variantStructure)) {
        return variant
      }
    }
  }

  // Step 2: Partial Match - If existing variant can be used → reuse it
  for (const variant of existingVariants) {
    if (variant && variant.children) {
      const variantStructure = convertVariantToStructure(variant, workspace)

      if (isVariantSuitableForStructure(variantStructure, structure)) {
        return variant
      }
    }
  }

  // Step 3: Instance Analysis - Check if existing instances can be reused
  const reusableInstance = findReusableInstance(
    componentId,
    structure,
    workspace,
  )
  if (reusableInstance) {
    return reusableInstance
  }

  // Step 4: No Match - Return null to create new custom variant
  return null
}

/**
 * Step 3: Instance Analysis - Check if existing instances can be reused
 * Analyze existing instance structures for reuse opportunities
 */
function findReusableInstance(
  componentId: ComponentId,
  desiredStructure: ComponentStructure,
  workspace: Workspace,
): any | null {
  const board = workspace.boards[componentId]
  if (!board) {
    return null
  }

  // Get all existing variants and their instances
  for (const variantId of board.variants) {
    const variant = workspace.byId[variantId]
    if (!variant || !variant.children) continue

    // Analyze each instance of this variant
    for (const instanceId of variant.children) {
      const instance = workspace.byId[instanceId]
      if (!instance) continue

      // Check if this instance structure can be reused
      const instanceStructure = convertInstanceToStructure(instance, workspace)

      // Check if the instance structure matches what we need
      if (isInstanceReusable(instanceStructure, desiredStructure)) {
        // Return the variant that contains this reusable instance
        return variant
      }
    }
  }

  return null
}

/**
 * Convert an instance to a ComponentStructure for analysis
 */
function convertInstanceToStructure(
  instance: any,
  workspace: Workspace,
  visited: Set<string> = new Set(),
): ComponentStructure {
  if (visited.has(instance.id)) {
    return {
      component: instance.component,
      children: [],
      properties: {},
    }
  }

  visited.add(instance.id)

  const children: ComponentStructure[] = []
  if (instance.children) {
    for (const childId of instance.children) {
      const child = workspace.byId[childId]
      if (child) {
        children.push(convertInstanceToStructure(child, workspace, visited))
      }
    }
  }

  return {
    component: instance.component,
    children,
    properties: instance.properties || {},
  }
}

/**
 * Check if an existing instance can be reused for the desired structure
 */
function isInstanceReusable(
  instanceStructure: ComponentStructure,
  desiredStructure: ComponentStructure,
): boolean {
  // Check if the instance has the same component type
  if (instanceStructure.component !== desiredStructure.component) {
    return false
  }

  // Check if the instance has the required children structure
  // This allows reusing instances that have the right components in the right positions
  if (instanceStructure.children.length < desiredStructure.children.length) {
    return false // Instance has fewer children than needed
  }

  // Check if the existing children match the desired children at the same positions
  for (let i = 0; i < desiredStructure.children.length; i++) {
    const desiredChild = desiredStructure.children[i]
    const instanceChild = instanceStructure.children[i]

    if (desiredChild.component !== instanceChild.component) {
      return false // Component types don't match
    }

    // Recursively check children
    if (!isInstanceReusable(instanceChild, desiredChild)) {
      return false
    }
  }

  return true
}

/**
 * Compare component structures focusing on component types and children, ignoring properties
 */
function compareComponentStructures(
  structure1: ComponentStructure,
  structure2: ComponentStructure,
): boolean {
  // Compare component types
  if (structure1.component !== structure2.component) {
    return false
  }

  // Compare children count
  if (structure1.children.length !== structure2.children.length) {
    return false
  }

  // Compare children component types (order matters)
  for (let i = 0; i < structure1.children.length; i++) {
    const child1 = structure1.children[i]
    const child2 = structure2.children[i]

    if (child1.component !== child2.component) {
      return false
    }

    // Recursively compare children
    if (!compareComponentStructures(child1, child2)) {
      return false
    }
  }

  return true
}

/**
 * Convert a variant node to a ComponentStructure for comparison
 */
function convertVariantToStructure(
  variant: any,
  workspace: Workspace,
  visited: Set<string> = new Set(),
): ComponentStructure {
  // Check cache first (only if not in recursion)
  if (visited.size === 0) {
    const cacheKey = getVariantStructureKey(variant.id, workspace.version)
    const cached = variantStructureCache.get(cacheKey)
    if (cached) {
      return cached
    }
  }

  // Prevent infinite recursion with circular references
  if (visited.has(variant.id)) {
    return {
      component: variant.component,
      children: [],
      properties: variant.properties || {},
    }
  }

  visited.add(variant.id)
  const children: ComponentStructure[] = []

  if (variant.children) {
    for (const childId of variant.children) {
      const child = workspace.byId[childId]
      if (child) {
        children.push({
          component: child.component,
          children: child.children
            ? convertVariantToStructure(child, workspace, new Set(visited))
                .children
            : [],
          properties: child.properties || {},
        })
      }
    }
  }

  const result = {
    component: variant.component,
    children,
    properties: variant.properties || {},
  }

  // Cache the result (only if not in recursion)
  if (visited.size === 1) {
    // Only cache the top-level call
    const cacheKey = getVariantStructureKey(variant.id, workspace.version)
    variantStructureCache.set(cacheKey, result)
    enforceCacheSizeLimit(variantStructureCache)
  }

  return result
}

/**
 * Create missing variants when workspace doesn't match desired structure
 */
export function createMissingVariants(
  requiredStructures: Map<ComponentId, ComponentStructure>,
  workspace: Workspace,
): { workspace: Workspace; createdVariants: Map<ComponentId, string> } {
  const createdVariants = new Map<ComponentId, string>()
  let updatedWorkspace = workspace

  for (const [componentId, desiredStructure] of requiredStructures) {
    try {
      // Validate the desired structure before processing
      if (!validateComponentStructure(componentId, desiredStructure)) {
        continue
      }

      // Check if the desired structure matches any existing variant
      const matchingVariant = findMatchingVariant(
        componentId,
        desiredStructure,
        updatedWorkspace,
      )

      if (!matchingVariant) {
        // Create a new custom variant with the desired structure
        const { variantId: newVariantId, workspace: workspaceWithVariant } =
          createCustomVariant(componentId, desiredStructure, updatedWorkspace)

        // Validate that the created variant actually matches the desired structure
        if (
          validateCreatedVariant(
            componentId,
            newVariantId,
            desiredStructure,
            workspaceWithVariant,
          )
        ) {
          createdVariants.set(componentId, newVariantId)

          // Update workspace with the new variant added to the board
          updatedWorkspace = addVariantToBoard(
            componentId,
            newVariantId,
            workspaceWithVariant,
          )
        } else {
        }
      }
    } catch (error) {
      // Continue processing other components instead of failing completely
    }
  }

  return { workspace: updatedWorkspace, createdVariants }
}

/**
 * Validate that a component structure is valid for the given component
 */
function validateComponentStructure(
  componentId: ComponentId,
  structure: ComponentStructure,
): boolean {
  try {
    // Check if the structure component matches the expected component
    if (structure.component !== componentId) {
      return false
    }

    // Validate that the component schema exists
    const schema = getComponentSchema(componentId)
    if (!schema) {
      return false
    }

    // Validate children recursively
    for (const child of structure.children) {
      if (!validateComponentStructure(child.component, child)) {
        return false
      }
    }

    return true
  } catch (error) {
    return false
  }
}

/**
 * Validate that a created variant matches the desired structure
 */
function validateCreatedVariant(
  componentId: ComponentId,
  variantId: string,
  desiredStructure: ComponentStructure,
  workspace: Workspace,
): boolean {
  try {
    const variant = workspace.byId[variantId]
    if (!variant) {
      return false
    }

    // Convert the created variant to a structure for comparison
    const createdStructure = convertVariantToStructure(variant, workspace)

    // Compare the created structure with the desired structure
    return compareComponentStructures(desiredStructure, createdStructure)
  } catch (error) {
    return false
  }
}

/**
 * Create a custom variant with a specific structure
 */
function createCustomVariant(
  componentId: ComponentId,
  structure: ComponentStructure,
  workspace: Workspace,
): { variantId: string; workspace: Workspace } {
  try {
    const variantId = `variant-${componentId}-custom-${Date.now()}` as any

    // Get component schema with error handling
    const schema = getComponentSchema(componentId)
    if (!schema) {
      throw new Error(`Component schema not found for ${componentId}`)
    }

    // Create the variant with the desired structure
    const newVariant = {
      id: variantId,
      type: "userVariant" as const,
      component: componentId,
      level: schema.level,
      theme: null,
      isChild: false,
      fromSchema: false,
      properties: {},
      __editor: { initialOverrides: {} },
      instanceOf: `variant-${componentId}-default`,
      label: `${schema.name} (Custom)`,
      children: [] as string[],
    }

    // Create child instances based on the desired structure
    const childInstances: any[] = []
    const childIds: string[] = []

    for (let i = 0; i < structure.children.length; i++) {
      const childStructure = structure.children[i]
      const childId =
        `child-${childStructure.component}-${Date.now()}-${i}` as any

      try {
        // Determine the correct variant to use based on the component and structure
        const variantInfo = getVariantForStructure(childStructure, workspace)

        // Get child component schema with error handling
        const childSchema = getComponentSchema(childStructure.component)
        if (!childSchema) {
          throw new Error(
            `Component schema not found for child ${childStructure.component}`,
          )
        }

        const childInstance = {
          id: childId,
          type: "defaultVariant" as const,
          component: childStructure.component,
          level: childSchema.level,
          theme: null,
          isChild: true,
          fromSchema: false,
          variant: variantInfo.variant,
          instanceOf: variantInfo.instanceOf,
          label: variantInfo.label,
          properties: childStructure.properties || {},
          __editor: { initialOverrides: childStructure.properties || {} },
          children: [] as string[],
        }

        // Recursively create grandchildren if needed
        if (childStructure.children.length > 0) {
          const level2Ids: string[] = []
          for (let j = 0; j < childStructure.children.length; j++) {
            const level2Structure = childStructure.children[j]
            const level2Id =
              `child-${level2Structure.component}-${Date.now()}-${i}-${j}` as any

            try {
              // Determine the correct variant for level2
              const level2VariantInfo = getVariantForStructure(
                level2Structure,
                workspace,
              )

              // Get level2 component schema with error handling
              const level2Schema = getComponentSchema(level2Structure.component)
              if (!level2Schema) {
                throw new Error(
                  `Component schema not found for level2 ${level2Structure.component}`,
                )
              }

              const level2Instance = {
                id: level2Id,
                type: "defaultVariant" as const,
                component: level2Structure.component,
                level: level2Schema.level,
                theme: null,
                isChild: true,
                fromSchema: false,
                variant: level2VariantInfo.variant,
                instanceOf: level2VariantInfo.instanceOf,
                label: level2VariantInfo.label,
                properties: level2Structure.properties || {},
                __editor: {
                  initialOverrides: level2Structure.properties || {},
                },
                children: [] as string[],
              }

              // Recursively create level3 children if needed
              if (level2Structure.children.length > 0) {
                const level3Ids: string[] = []
                for (let k = 0; k < level2Structure.children.length; k++) {
                  const level3Structure = level2Structure.children[k]
                  const level3Id =
                    `child-${level3Structure.component}-${Date.now()}-${i}-${j}-${k}` as any

                  try {
                    // Determine the correct variant for level3
                    const level3VariantInfo = getVariantForStructure(
                      level3Structure,
                      workspace,
                    )

                    // Get level3 component schema with error handling
                    const level3Schema = getComponentSchema(
                      level3Structure.component,
                    )
                    if (!level3Schema) {
                      throw new Error(
                        `Component schema not found for level3 ${level3Structure.component}`,
                      )
                    }

                    const level3Instance = {
                      id: level3Id,
                      type: "defaultVariant" as const,
                      component: level3Structure.component,
                      level: level3Schema.level,
                      theme: null,
                      isChild: true,
                      fromSchema: false,
                      variant: level3VariantInfo.variant,
                      instanceOf: level3VariantInfo.instanceOf,
                      label: level3VariantInfo.label,
                      properties: level3Structure.properties || {},
                      __editor: {
                        initialOverrides: level3Structure.properties || {},
                      },
                      children: [] as string[],
                    }

                    childInstances.push(level3Instance)
                    level3Ids.push(level3Id)
                  } catch (error) {
                    // Continue with other children
                  }
                }
                level2Instance.children = level3Ids
              }

              childInstances.push(level2Instance)
              level2Ids.push(level2Id)
            } catch (error) {
              // Continue with other children
            }
          }
          childInstance.children = level2Ids
        }

        childInstances.push(childInstance)
        childIds.push(childId)
      } catch (error) {
        // Continue with other children
      }
    }

    newVariant.children = childIds

    // Add all instances to the workspace
    const updatedById = {
      ...workspace.byId,
      [variantId]: newVariant,
      ...childInstances.reduce((acc, instance) => {
        acc[instance.id] = instance
        return acc
      }, {} as any),
    }

    // Return the updated workspace and variant ID
    const updatedWorkspace = {
      ...workspace,
      byId: updatedById,
    }

    return { variantId, workspace: updatedWorkspace }
  } catch (error) {
    // Return the original workspace if variant creation fails
    return {
      variantId: `variant-${componentId}-failed-${Date.now()}`,
      workspace,
    }
  }
}

/**
 * Add a variant to a board
 */
function addVariantToBoard(
  componentId: ComponentId,
  variantId: string,
  workspace: Workspace,
): Workspace {
  const board = workspace.boards[componentId]

  if (!board) {
    // Create the board if it doesn't exist
    const schema = getComponentSchema(componentId)
    const newBoard = {
      id: componentId,
      label: schema.name + "s", // Pluralize the name
      order: 0, // Default order
      theme: "default" as const,
      variants: [variantId],
      properties: {
        screenWidth: {
          type: "exact" as const,
          value: {
            unit: "px" as const,
            value: 400,
          },
        },
        screenHeight: {
          type: "exact" as const,
          value: {
            unit: "px" as const,
            value: 400,
          },
        },
      },
    }

    return {
      ...workspace,
      boards: {
        ...workspace.boards,
        [componentId]: newBoard,
      },
    }
  }

  return {
    ...workspace,
    boards: {
      ...workspace.boards,
      [componentId]: {
        ...board,
        variants: [...board.variants, variantId],
      },
    },
  }
}
