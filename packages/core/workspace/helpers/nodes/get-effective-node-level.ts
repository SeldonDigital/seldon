import { findComponentSchema } from "../../../components/catalog"
import { ComponentLevel } from "../../../components/constants"
import { isAuthoredBoard } from "../../model/components"
import { parseNodeTemplate } from "../../model/template-ref"
import type { EntryNode, Workspace } from "../../types"
import { getBoardByNodeId } from "../components/get-board-by-node-id"
import { getNodeCatalogId } from "./get-node-catalog-id"

/**
 * Resolves the level and authored classification for a node by walking its
 * `template` chain to the terminal catalog root. When the chain passes through
 * an `authored` root, the effective level is the owning authored board's
 * declared level, so an authored component is treated as its declared level for
 * containment regardless of its Container/Frame template. Otherwise the level
 * comes from the resolved catalog schema.
 */
function resolveEffective(
  node: EntryNode,
  workspace: Workspace,
): { level: ComponentLevel; authored: boolean } {
  const visited = new Set<string>()
  let current: EntryNode | undefined = node

  while (current && !visited.has(current.id)) {
    visited.add(current.id)

    if (current.type === "authored") {
      const board = getBoardByNodeId(workspace, current.id)
      if (board && isAuthoredBoard(board)) {
        return { level: board.level as ComponentLevel, authored: true }
      }
    }

    const parsed = parseNodeTemplate(current.template)
    if (!parsed) break
    if (parsed.kind === "catalog") {
      const schema = findComponentSchema(parsed.componentId)
      if (schema) return { level: schema.level, authored: false }
      break
    }
    current = workspace.nodes[parsed.nodeId]
  }

  const catalogId = getNodeCatalogId(node, workspace)
  const schema = catalogId ? findComponentSchema(catalogId) : undefined
  return {
    level: schema?.level ?? ComponentLevel.FRAME,
    authored: false,
  }
}

/** Effective containment level of a node, authored-aware. */
export function getEffectiveNodeLevel(
  node: EntryNode,
  workspace: Workspace,
): ComponentLevel {
  return resolveEffective(node, workspace).level
}

/** True when a node's template chain resolves through an authored root. */
export function isEffectivelyAuthoredNode(
  node: EntryNode,
  workspace: Workspace,
): boolean {
  return resolveEffective(node, workspace).authored
}
