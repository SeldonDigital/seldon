import { Workspace } from "@seldon/core"
import {
  type NodeParentIndex,
  buildNodeParentIndex,
  computeNodeProperties,
} from "@seldon/core/workspace/compute"
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
): StyleGenerationContext {
  const properties = computeNodeProperties(nodeId, workspace, {
    stage: "computed",
    parentIndex,
  })

  const parentId = parentIndex.get(nodeId)
  const parentContext = parentId
    ? getStyleContext(parentId, workspace, parentIndex)
    : null

  const theme = workspaceThemeService.getNodeTheme(nodeId, workspace)

  return { properties, parentContext, theme }
}
