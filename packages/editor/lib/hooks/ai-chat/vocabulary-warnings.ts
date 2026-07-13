import { findComponentSchema } from "@seldon/core/components/catalog"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import {
  changedProperties,
  isTaggedValue,
  targetIdOf,
} from "./action-helpers"

/** The component identity and settable keys a warning check needs. */
interface Vocabulary {
  catalogId: string
  validKeys: Set<string>
}

/** The target component's catalog id and settable keys, or undefined. */
function resolveVocabulary(
  workspace: Workspace,
  action: WorkspaceAction,
): Vocabulary | undefined {
  const id = targetIdOf(action.payload)
  const node = id ? workspace.nodes?.[id] : undefined
  if (!node) return undefined
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId) return undefined
  const schema = findComponentSchema(catalogId)
  if (!schema) return undefined
  const keys = schema.properties ? Object.keys(schema.properties) : []
  return { catalogId, validKeys: new Set(keys) }
}

/**
 * Walks a property value and reports every option-typed leaf with its dot path,
 * so the vocabulary check can validate each option against the schema for the
 * exact key it lands on, whether atomic, a compound facet, or a paint layer.
 */
function walkOptionLeaves(
  path: string,
  value: unknown,
  visit: (path: string, optionValue: unknown) => void,
): void {
  if (isTaggedValue(value)) {
    const tagged = value as { type?: unknown; value?: unknown }
    if (tagged.type === "option") visit(path, tagged.value)
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

/** A warning when an option value is not one the schema key accepts, else undefined. */
function optionWarning(
  catalogId: string,
  path: string,
  optionValue: unknown,
): string | undefined {
  const schemaKey = getCatalogKeyForPropertyPath(path) ?? path
  const options = getPresetOptions(schemaKey)
  if (options.length === 0) return undefined
  if (options.some((option) => option === optionValue)) return undefined
  const shown = options.slice(0, 8).join(", ")
  const more = options.length > 8 ? ", …" : ""
  return `${catalogId}.${path}: "${String(optionValue)}" is not a valid option (expected: ${shown}${more})`
}

/** Collects the warnings for one set property: an unknown key, or a bad option. */
function propertyWarnings(
  vocab: Vocabulary,
  key: string,
  value: unknown,
): string[] {
  if (!vocab.validKeys.has(key)) {
    return [
      `${vocab.catalogId}: "${key}" is not a settable property; it will be ignored`,
    ]
  }
  const warnings: string[] = []
  walkOptionLeaves(key, value, (path, optionValue) => {
    const warning = optionWarning(vocab.catalogId, path, optionValue)
    if (warning) warnings.push(warning)
  })
  return warnings
}

/**
 * Flags properties the model set that a component cannot actually take, the
 * silent class of malformed edit: core drops an unknown override key rather than
 * rejecting it, so the turn looks applied while the value never lands. For each
 * property action, this checks every top-level key against the target
 * component's schema vocabulary and every option value against the key's allowed
 * options, and returns one human-readable warning per miss. It reads the schema
 * live, so the list can never drift from core.
 */
export function collectVocabularyWarnings(
  workspace: Workspace,
  actions: WorkspaceAction[],
): string[] {
  const warnings: string[] = []
  for (const action of actions) {
    const props = changedProperties(action)
    if (props.length === 0) continue
    const vocab = resolveVocabulary(workspace, action)
    if (!vocab) continue
    for (const [key, value] of props) {
      warnings.push(...propertyWarnings(vocab, key, value))
    }
  }
  return warnings
}
