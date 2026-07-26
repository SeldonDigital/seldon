import { MAX_REPEAT_COUNT, resolveNodeRepeat } from "@seldon/core"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

import { getNodeChildIds } from "../../workspace/node-tree"
import { buildEchoOverrides } from "./build-echo-overrides"

/** One rendered child slot, expanded for repeat echoes. */
export interface ChildRender {
  key: string
  nodeId: string
  rootPath: string
  repeatOverrides?: Record<string, string>
  isRepeatCopy: boolean
}

/**
 * Expands a node's children into render slots, repeating a child `count` times
 * when it has a repeat. Echo copies (index > 0) carry per-index text/icon
 * overrides and are marked as repeat copies for the dashed preview outline.
 */
export function buildChildRenders(
  node: EntryNode,
  workspace: Workspace,
  selfPath: string,
  repeatOverrides: Record<string, string> | undefined,
): ChildRender[] {
  const result: ChildRender[] = []
  for (const childId of getNodeChildIds(node, workspace)) {
    const childNode = workspace.nodes[childId]
    const childRepeat = childNode
      ? resolveNodeRepeat(childId, workspace)
      : undefined
    const childRootPath = `${selfPath}/${childId}`

    if (!childRepeat || childRepeat.count <= 1) {
      result.push({
        key: childId,
        nodeId: childId,
        rootPath: childRootPath,
        repeatOverrides,
        isRepeatCopy: false,
      })
      continue
    }

    const total = Math.min(childRepeat.count, MAX_REPEAT_COUNT)
    for (let echoIndex = 0; echoIndex < total; echoIndex++) {
      const isEcho = echoIndex > 0
      result.push({
        key: isEcho ? `${childId}#echo${echoIndex}` : childId,
        nodeId: childId,
        rootPath: childRootPath,
        repeatOverrides: isEcho
          ? { ...repeatOverrides, ...buildEchoOverrides(childRepeat.data, echoIndex) }
          : repeatOverrides,
        isRepeatCopy: isEcho,
      })
    }
  }
  return result
}
