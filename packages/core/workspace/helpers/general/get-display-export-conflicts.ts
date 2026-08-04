import { Display } from "../../../properties"
import { isAuthoredBoard, isComponentBoard } from "../../model/components"
import { isEntryNodeInstance } from "../../model/entry-node"
import { parseNodeTemplate } from "../../model/template-ref"
import { getNodeProperties } from "../nodes/get-node-properties"
import { isVariantNode } from "../nodes/is-variant-node"

import type { ComponentTreeRef, EntryNode, EntryNodeId, Workspace } from "../../types"

/** Display states the factory never emits: the node is authoring-only. */
const HIDDEN_DISPLAYS: ReadonlySet<string> = new Set([Display.MOCK, Display.EXCLUDE])

/**
 * A shown node that copies a mock or exclude variant. The instance still
 * exports, so the source variant has to be kept even though its display marks
 * it authoring-only. This is the state the objects sidebar flags.
 */
export interface DisplayExportConflict {
  instanceId: EntryNodeId
  variantId: EntryNodeId
}

interface DisplayExportConflictData {
  conflicts: DisplayExportConflict[]
  conflictNodeIds: Set<EntryNodeId>
  keptMockVariantIds: Set<EntryNodeId>
}

const cache = new WeakMap<Workspace, DisplayExportConflictData>()

/**
 * Effective `display` value of a node, resolved through the same property merge
 * the exporter uses. A circular reference resolves to no value, matching how
 * the tree walk treats those nodes.
 */
function resolveDisplay(node: EntryNode, workspace: Workspace): string | undefined {
  try {
    return getNodeProperties(node, workspace).display?.value as string | undefined
  } catch {
    return undefined
  }
}

/**
 * Follows `node:` template references until reaching a default or variant node.
 * Returns null when the chain does not resolve to a variant, or hits a cycle or
 * dangling reference.
 */
function resolveSourceVariantId(node: EntryNode, workspace: Workspace): EntryNodeId | null {
  const seen = new Set<string>()
  let current: EntryNode | undefined = node

  while (current) {
    const parsed = parseNodeTemplate(current.template)

    if (parsed?.kind !== "node") return null
    if (seen.has(parsed.nodeId)) return null
    seen.add(parsed.nodeId)

    const next = workspace.nodes[parsed.nodeId]

    if (!next) return null
    if (isVariantNode(next)) return parsed.nodeId
    current = next
  }

  return null
}

function computeDisplayExportConflicts(workspace: Workspace): DisplayExportConflictData {
  const conflicts: DisplayExportConflict[] = []
  const conflictNodeIds = new Set<EntryNodeId>()
  const keptMockVariantIds = new Set<EntryNodeId>()

  function visit(ref: ComponentTreeRef, ancestorHidden: boolean) {
    const node = workspace.nodes[ref.id]

    if (!node) return

    const display = resolveDisplay(node, workspace)
    const hidden = display !== undefined && HIDDEN_DISPLAYS.has(display)
    const shown = !hidden && !ancestorHidden

    // A shown instance emits, so if the variant it copies is mock or exclude the
    // source must be kept and the divergence flagged.
    if (shown && isEntryNodeInstance(node)) {
      const variantId = resolveSourceVariantId(node, workspace)
      const source = variantId ? workspace.nodes[variantId] : undefined
      const sourceDisplay = source ? resolveDisplay(source, workspace) : undefined

      if (variantId && sourceDisplay !== undefined && HIDDEN_DISPLAYS.has(sourceDisplay)) {
        conflicts.push({ instanceId: ref.id, variantId })
        conflictNodeIds.add(ref.id)
        keptMockVariantIds.add(variantId)
      }
    }

    const childAncestorHidden = ancestorHidden || hidden

    for (const child of ref.children ?? []) {
      visit(child, childAncestorHidden)
    }
  }

  for (const board of Object.values(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue

    for (const root of board.variants) {
      visit(root as ComponentTreeRef, false)
    }
  }

  return { conflicts, conflictNodeIds, keptMockVariantIds }
}

function getConflictData(workspace: Workspace): DisplayExportConflictData {
  let data = cache.get(workspace)

  if (!data) {
    data = computeDisplayExportConflicts(workspace)
    cache.set(workspace, data)
  }

  return data
}

/**
 * Every shown instance whose source variant is mock or exclude. Both the
 * factory prune and the objects sidebar read this one computation so they
 * cannot drift.
 */
export function getDisplayExportConflicts(workspace: Workspace): DisplayExportConflict[] {
  return getConflictData(workspace).conflicts
}

/**
 * Mock or exclude variant ids that a shown instance still copies. The factory
 * keeps these variants so the export never dangles an import.
 */
export function getKeptMockVariantIds(workspace: Workspace): Set<EntryNodeId> {
  return getConflictData(workspace).keptMockVariantIds
}

/** True when the node is a shown instance that copies a mock or exclude variant. */
export function isDisplayExportConflictNode(nodeId: EntryNodeId, workspace: Workspace): boolean {
  return getConflictData(workspace).conflictNodeIds.has(nodeId)
}

/** True when the node is a mock or exclude variant a shown instance still copies. */
export function isDisplayExportConflictSource(nodeId: EntryNodeId, workspace: Workspace): boolean {
  return getConflictData(workspace).keptMockVariantIds.has(nodeId)
}
