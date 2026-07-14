import { Workspace } from "@seldon/core"
import {
  type NodeParentIndex,
  buildNodeParentIndex,
  computeNodeProperties,
  getNodeComputeContext,
  resolveLayoutMode,
} from "@seldon/core/workspace/compute"
import type { NodeState } from "@seldon/core/workspace/model/node-state"
import { workspaceThemeService } from "@seldon/core/workspace/services"

import { StyleGenerationContext } from "../styles/types"

export type ExportContext = {
  parentIndex: NodeParentIndex
}

export function buildExportContext(workspace: Workspace): ExportContext {
  return {
    // The factory only composes board trees. Passing boards alone keeps the
    // `playgrounds` section (and its Sandbox content) out of every export pass.
    parentIndex: buildNodeParentIndex({ boards: workspace.boards }),
  }
}

export function getStyleContext(
  nodeId: string,
  workspace: Workspace,
  parentIndex: NodeParentIndex,
  state?: NodeState,
): StyleGenerationContext {
  const properties = computeNodeProperties(nodeId, workspace, {
    stage: "computed",
    parentIndex,
    state,
  })

  // The effective compute context core resolves computed values against. Style
  // helpers reuse it in variable mode to detect a `COMPUTED` cell and resolve its
  // source the same way core does, so the theme variable matches the baked value.
  const computeContext = getNodeComputeContext(nodeId, workspace, {
    parentIndex,
    state,
  })

  const parentId = parentIndex.get(nodeId)
  const parentContext = parentId
    ? getStyleContext(parentId, workspace, parentIndex, state)
    : null

  const theme = workspaceThemeService.getNodeTheme(nodeId, workspace)

  const node = workspace.nodes?.[nodeId]
  const layoutMode = node ? resolveLayoutMode(node, workspace) : undefined

  return { properties, computeContext, parentContext, theme, layoutMode }
}
