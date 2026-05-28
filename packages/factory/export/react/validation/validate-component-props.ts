import { ComponentId } from "@seldon/core/components/constants"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComplexSchema, SchemaChild } from "@seldon/core/components/types"
import { ComponentToExport, JSONTreeNode } from "../../types"

/**
 * Validation result for component props.
 *
 * Splits proposed children into valid (matching schema) and invalid (not matching schema) groups.
 */
export interface ComponentPropsValidation {
  /** Children that match the component's schema */
  validProps: JSONTreeNode[]
  /** Children that don't match the component's schema */
  invalidProps: JSONTreeNode[]
}

/**
 * Validates proposed direct children against the active schema branch.
 *
 * Compares proposed children with the currently active schema tree to determine which
 * are valid schema-backed props and which are inline extras.
 */
export function validateComponentProps(
  componentId: ComponentId,
  schemaVariantId: string | null,
  proposedChildren: JSONTreeNode[],
): ComponentPropsValidation {
  try {
    const expectedChildren = getActiveSchemaChildren(componentId, schemaVariantId)

    // Special handling for Frame: Frame has no schema restrictions (children: []),
    // which means any children are allowed. Treat all children as valid.
    if (componentId === ComponentId.FRAME && expectedChildren.length === 0) {
      return {
        validProps: proposedChildren,
        invalidProps: [],
      }
    }

    // Separate valid and invalid props based on type compatibility
    const validProps: JSONTreeNode[] = []
    const invalidProps: JSONTreeNode[] = []

    // Create a map of expected child signatures and their counts.
    const expectedChildCounts = new Map<string, number>()
    expectedChildren.forEach((slot) => {
      const childKey = getChildValidationKey(slot.component, slot.variant ?? null)
      expectedChildCounts.set(
        childKey,
        (expectedChildCounts.get(childKey) || 0) + 1,
      )
    })

    // Track how many of each child signature we've used
    const usedChildCounts = new Map<string, number>()

    for (const child of proposedChildren) {
      const childKey = getChildValidationKey(
        child.componentId,
        child.schemaVariantId,
      )
      const expectedCount = expectedChildCounts.get(childKey) || 0
      const usedCount = usedChildCounts.get(childKey) || 0

      // If this child signature is expected in the active schema branch and we
      // haven't exceeded the expected count, treat it as valid.
      if (expectedCount > 0 && usedCount < expectedCount) {
        validProps.push(child)
        usedChildCounts.set(childKey, usedCount + 1)
      } else {
        invalidProps.push(child)
      }
    }

    return {
      validProps,
      invalidProps,
    }
  } catch {
    // If we can't find the schema, treat all props as valid to maintain existing behavior
    return {
      validProps: proposedChildren,
      invalidProps: [],
    }
  }
}

/**
 * Validates a single exported tree node against the active schema branch encoded
 * on the node itself.
 */
export function validateTreeNodeProps(node: JSONTreeNode): ComponentPropsValidation {
  return validateComponentProps(
    node.componentId,
    node.schemaVariantId,
    Array.isArray(node.children) ? node.children : [],
  )
}

/**
 * Validates the root export tree for a component.
 */
export function validateExportedComponentProps(
  component: ComponentToExport,
): ComponentPropsValidation {
  return validateTreeNodeProps(component.tree)
}

function getActiveSchemaChildren(
  componentId: ComponentId,
  schemaVariantId: string | null,
): SchemaChild[] {
  const schema = getComponentSchema(componentId)
  if (!isComplexSchema(schema)) {
    return []
  }

  if (!schemaVariantId) {
    return schema.default.children ?? []
  }

  const selectedVariant =
    schema.variants?.find((variant) => variant.id === schemaVariantId) ?? null

  if (!selectedVariant) {
    return schema.default.children ?? []
  }

  return selectedVariant.children?.length
    ? selectedVariant.children
    : (schema.default.children ?? [])
}

function getChildValidationKey(
  componentId: ComponentId,
  schemaVariantId: string | null,
): string {
  return `${componentId}:${schemaVariantId ?? "__default__"}`
}
