import { findComponentSchema } from "@seldon/core/components/catalog"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import { resolveIntentProperty } from "@seldon/core/rules/config/design-semantics.resolve"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { isTaggedValue } from "../prompt/property-taxonomy"

/** Actions that carry a `properties` map keyed by a node id the linter can check. */
const PROPERTY_ACTION_TYPES = new Set([
  "set_node_properties",
  "set_node_state_properties",
])

/** The component identity, level, and settable keys a design check needs. */
interface Vocabulary {
  catalogId: string
  level?: string
  validKeys: Set<string>
}

/** The node id a property action edits, when it carries one. */
function targetNodeId(action: WorkspaceAction): string | undefined {
  const payload = action.payload as { nodeId?: unknown }
  return typeof payload?.nodeId === "string" ? payload.nodeId : undefined
}

/** The target component's catalog id and settable keys, or undefined. */
function resolveVocabulary(
  workspace: Workspace,
  action: WorkspaceAction,
): Vocabulary | undefined {
  const id = targetNodeId(action)
  const node = id ? workspace.nodes?.[id] : undefined
  if (!node) return undefined
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId) return undefined
  const schema = findComponentSchema(catalogId)
  if (!schema?.properties) return undefined
  return {
    catalogId,
    level: schema.level,
    validKeys: new Set(Object.keys(schema.properties)),
  }
}

/**
 * Walks a property value and reports every option-typed leaf with its dot path,
 * so each option can be validated against the schema for the exact key it lands
 * on, whether atomic, a compound facet, or a paint layer.
 */
function walkOptionLeaves(
  path: string,
  value: unknown,
  visit: (path: string, optionValue: unknown) => void,
): void {
  if (isTaggedValue(value)) {
    if (value.type === "option") visit(path, value.value)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      walkOptionLeaves(`${path}.${index}`, item, visit),
    )
    return
  }
  if (value && typeof value === "object") {
    for (const [facet, facetValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      walkOptionLeaves(`${path}.${facet}`, facetValue, visit)
    }
  }
}

/** A violation when an option value is not one the schema key accepts, else undefined. */
function optionViolation(
  catalogId: string,
  path: string,
  optionValue: unknown,
): string | undefined {
  const schemaKey = getCatalogKeyForPropertyPath(path) ?? path
  const options = getPresetOptions(schemaKey)
  if (options.length === 0) return undefined
  if (options.some((option) => option === optionValue)) return undefined
  const shown = options.slice(0, 8).map(String).join(", ")
  const more = options.length > 8 ? ", …" : ""
  return `${catalogId}.${path}: "${String(optionValue)}" is not a valid option (expected: ${shown}${more}).`
}

/** The violations for one set property: an unknown key, or a bad option value. */
function propertyViolations(
  vocab: Vocabulary,
  key: string,
  value: unknown,
): string[] {
  if (!vocab.validKeys.has(key)) {
    const routed = resolveIntentProperty(key, vocab.validKeys, {
      level: vocab.level,
      componentId: vocab.catalogId,
    })
    let hint = " Call get_component_vocabulary for the keys it exposes."
    if (routed?.status === "resolved") {
      hint = ` Set "${routed.propertyPath}" instead.`
    } else if (routed?.status === "ambiguous") {
      hint = ` Set one of "${routed.candidates.join('", "')}" instead, depending on what you mean.`
    }
    return [
      `${vocab.catalogId}: "${key}" is not a settable property on this component, so the edit would be silently dropped.${hint}`,
    ]
  }
  const violations: string[] = []
  walkOptionLeaves(key, value, (path, optionValue) => {
    const violation = optionViolation(vocab.catalogId, path, optionValue)
    if (violation) violations.push(violation)
  })
  return violations
}

/**
 * Design-rule check for one normalized property action, driven by the target
 * component's live schema. It flags the silent class of malformed edit: a key
 * the component cannot take (core drops it, so the turn looks applied while the
 * value never lands) and an option value outside the key's allowed set. It reads
 * the schema live, so the rules can never drift from core. Returns [] when the
 * action is not a property action or carries no violation.
 */
export function collectDesignViolations(
  workspace: Workspace,
  action: WorkspaceAction,
): string[] {
  if (!PROPERTY_ACTION_TYPES.has(action.type)) return []
  const payload = action.payload as { properties?: unknown }
  if (!payload?.properties || typeof payload.properties !== "object") return []
  const vocab = resolveVocabulary(workspace, action)
  if (!vocab) return []

  const violations: string[] = []
  for (const [key, value] of Object.entries(
    payload.properties as Record<string, unknown>,
  )) {
    violations.push(...propertyViolations(vocab, key, value))
  }
  return violations
}
