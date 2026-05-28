import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { isComplexSchema, type SchemaChild } from "../../../components/types"
import {
  formatSchemaVariantLabel,
  getSchemaVariantSlotKey,
  walkSchemaComposition,
} from "./schema-composition-children"

export type MissingSchemaVariantIssue = {
  componentId: ComponentId
  componentName: string
  variantId: string
  variantLabel: string
  slotKey: string
}

export function getMissingSchemaVariantMessage(
  issue: MissingSchemaVariantIssue,
): string {
  return `${issue.componentName} ${issue.variantLabel} does not exist. Use Default ${issue.componentName}?`
}

export function getMissingSchemaVariantIssueForSlot(
  slot: SchemaChild,
): MissingSchemaVariantIssue | null {
  if (!slot.variant) {
    return null
  }

  const childSchema = getComponentSchema(slot.component)
  if (!isComplexSchema(childSchema)) {
    return null
  }

  const variantExists = childSchema.variants?.some(
    (candidate) => candidate.id === slot.variant,
  )
  if (variantExists) {
    return null
  }

  return {
    componentId: slot.component,
    componentName: childSchema.name,
    variantId: slot.variant,
    variantLabel: formatSchemaVariantLabel(slot.variant),
    slotKey: getSchemaVariantSlotKey(slot.component, slot.variant),
  }
}

/**
 * Walks a root component's composition tree and returns slots that reference a
 * catalog variant id missing from the child component schema.
 */
export function collectMissingSchemaVariants(
  componentId: ComponentId,
): MissingSchemaVariantIssue[] {
  const issues: MissingSchemaVariantIssue[] = []
  const seenSlotKeys = new Set<string>()

  walkSchemaComposition(componentId, (slot) => {
    const issue = getMissingSchemaVariantIssueForSlot(slot)
    if (!issue || seenSlotKeys.has(issue.slotKey)) {
      return
    }
    seenSlotKeys.add(issue.slotKey)
    issues.push(issue)
  })

  return issues
}
