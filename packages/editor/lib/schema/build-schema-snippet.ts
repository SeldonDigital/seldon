import { camelCase } from "change-case"
import { getComponentSchema } from "@seldon/core/components/catalog"
import type { ComponentId } from "@seldon/core/components/constants"
import { isComplexSchema } from "@seldon/core/components/types"
import { Display } from "@seldon/core/properties"
import { mergeProperties } from "@seldon/core/properties/helpers/merge-properties"
import type { Properties } from "@seldon/core/properties/types/properties"
import { componentBoardSchemaVariantNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { parseNodeLink } from "@seldon/core/workspace/model/template-ref"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "../workspace/node-tree"

export type SchemaChildSnippet = {
  component: ComponentId
  variant?: string
  overrides?: Properties
  children?: SchemaChildSnippet[]
}

export type DefaultSchemaSnippet = {
  kind: "default"
  properties: Properties
  default?: { children?: SchemaChildSnippet[] }
}

export type VariantSchemaSnippet = {
  kind: "variant"
  id: string
  label: string
  intent: string
  overrides?: Properties
  children?: SchemaChildSnippet[]
}

export type SchemaSnippet = DefaultSchemaSnippet | VariantSchemaSnippet

function isDisplayExcluded(properties: Properties): boolean {
  const display = (properties as Record<string, unknown>).display
  return !!(
    display &&
    typeof display === "object" &&
    "value" in display &&
    display.value === Display.EXCLUDE
  )
}

function hasProperties(properties: Properties): boolean {
  return Object.keys(properties).length > 0
}

/**
 * Catalog variant id for a board-root variant node, or null when the node is a
 * user variant with no catalog counterpart.
 */
function getCatalogVariantId(
  variantNode: EntryNode,
  workspace: Workspace,
): string | null {
  const componentId = getNodeCatalogComponentId(variantNode, workspace)
  if (!componentId) return null
  const schema = getComponentSchema(componentId)
  const match = (schema.variants ?? []).find(
    (variant) =>
      componentBoardSchemaVariantNodeId(componentId, variant.id) ===
      variantNode.id,
  )
  return match?.id ?? null
}

/**
 * Own-override snapshots for an instance node's template chain, ordered base
 * first. Walks `node:` links through instance ancestors and stops at a board
 * root. A catalog schema variant root becomes the child's `variant` id. A user
 * variant root has no catalog id, so its overrides join the baseline instead.
 */
function collectChildOverrideSources(
  node: EntryNode,
  workspace: Workspace,
): { sources: Properties[]; variantId?: string } {
  const sources: Properties[] = [node.overrides]
  const visited = new Set<string>([node.id])
  let current: EntryNode = node

  while (true) {
    const link = parseNodeLink(current.template)
    if (!link) break
    const target = workspace.nodes[link.nodeId]
    if (!target || visited.has(target.id)) break
    visited.add(target.id)

    if (target.type === "default") break

    if (target.type === "variant") {
      const variantId = getCatalogVariantId(target, workspace)
      if (variantId) {
        return { sources, variantId }
      }
      sources.unshift(target.overrides)
      break
    }

    sources.unshift(target.overrides)
    current = target
  }

  return { sources }
}

function buildSchemaChild(
  node: EntryNode,
  workspace: Workspace,
): SchemaChildSnippet | null {
  const component = getNodeCatalogComponentId(node, workspace)
  if (!component) return null

  const { sources, variantId } = collectChildOverrideSources(node, workspace)
  const overrides = sources.reduce<Properties>(
    (merged, source) => mergeProperties(merged, source),
    {},
  )

  if (isDisplayExcluded(overrides)) return null

  const children = buildSchemaChildren(node, workspace)

  const child: SchemaChildSnippet = { component }
  if (variantId) child.variant = variantId
  if (hasProperties(overrides)) child.overrides = overrides
  if (children.length) child.children = children
  return child
}

function buildSchemaChildren(
  parent: EntryNode,
  workspace: Workspace,
): SchemaChildSnippet[] {
  const childIds = getNodeChildIds(parent, workspace)
  const children: SchemaChildSnippet[] = []

  for (const childId of childIds) {
    const childNode = workspace.nodes[childId]
    if (!childNode) continue
    const child = buildSchemaChild(childNode, workspace)
    if (child) children.push(child)
  }

  return children
}

/**
 * Root override snapshots for a user variant, ordered base first. Walks
 * `node:` links through variant ancestors and stops at the default node, whose
 * overrides stay on the board and never join the variant snippet.
 */
function collectVariantRootOverrideSources(
  node: EntryNode,
  workspace: Workspace,
): Properties[] {
  const sources: Properties[] = [node.overrides]
  const visited = new Set<string>([node.id])
  let current: EntryNode = node

  while (true) {
    const link = parseNodeLink(current.template)
    if (!link) break
    const target = workspace.nodes[link.nodeId]
    if (!target || visited.has(target.id) || target.type !== "variant") break
    visited.add(target.id)
    sources.unshift(target.overrides)
    current = target
  }

  return sources
}

/** Schema snippet for a selected default node: `properties` plus `default` tree. */
export function buildDefaultSnippet(
  node: EntryNode,
  workspace: Workspace,
): DefaultSchemaSnippet | null {
  const componentId = getNodeCatalogComponentId(node, workspace)
  if (!componentId) return null

  const schema = getComponentSchema(componentId)
  const properties = mergeProperties(
    structuredClone(schema.properties) as Properties,
    node.overrides,
  )

  const snippet: DefaultSchemaSnippet = { kind: "default", properties }
  if (isComplexSchema(schema)) {
    const children = buildSchemaChildren(node, workspace)
    snippet.default = children.length ? { children } : {}
  }
  return snippet
}

/** Schema variant snippet for a selected user variant node. */
export function buildVariantSnippet(
  node: EntryNode,
  workspace: Workspace,
): VariantSchemaSnippet | null {
  const componentId = getNodeCatalogComponentId(node, workspace)
  if (!componentId) return null

  const sources = collectVariantRootOverrideSources(node, workspace)
  const overrides = sources.reduce<Properties>(
    (merged, source) => mergeProperties(merged, source),
    {},
  )
  const children = buildSchemaChildren(node, workspace)

  const snippet: VariantSchemaSnippet = {
    kind: "variant",
    id: camelCase(node.label),
    label: node.label,
    intent: "TODO: describe the intent of this variant.",
  }
  if (hasProperties(overrides)) snippet.overrides = overrides
  if (children.length) snippet.children = children
  return snippet
}
