import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useCallback } from "react"

import {
  type InstanceId,
  type RepeatEditorData,
  type VariantId,
  getNodeRepeat,
  resolveNodeRepeat,
} from "@seldon/core"

type NodeId = VariantId | InstanceId

/**
 * Repeat-assignment commands for the editor-only repeat preview. Owns the
 * `set_node_repeat` dispatch so property controls stay binding shells. Reads the
 * node's current repeat so a count change trims stale echo data and a data edit
 * preserves the rest.
 */
export function useSetNodeRepeat() {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })

  const setCount = useCallback(
    (nodeId: NodeId, count: number) => {
      if (!Number.isFinite(count) || count <= 1) {
        dispatch({
          type: "set_node_repeat",
          payload: { nodeId, repeat: undefined },
        })
        return
      }

      const current = getNodeRepeat(workspace.nodes[nodeId] ?? {})
      const echoSlots = count - 1
      let data: RepeatEditorData["data"]
      if (current?.data) {
        const trimmed: Record<string, string[]> = {}
        for (const [key, values] of Object.entries(current.data)) {
          trimmed[key] = values.slice(0, echoSlots)
        }
        data = trimmed
      }

      dispatch({
        type: "set_node_repeat",
        payload: { nodeId, repeat: { count, ...(data ? { data } : {}) } },
      })
    },
    [workspace, dispatch],
  )

  const setDataValue = useCallback(
    (
      nodeId: NodeId,
      descendantId: string,
      echoIndex: number,
      value: string,
    ) => {
      // Echo count is the effective (possibly inherited) value, but the edit is
      // stored as an override on this node only.
      const resolved = resolveNodeRepeat(nodeId, workspace)
      if (!resolved || resolved.count <= 1) return

      const echoSlots = resolved.count - 1
      const own = getNodeRepeat(workspace.nodes[nodeId] ?? {})
      const data: Record<string, string[]> = {}
      for (const [key, values] of Object.entries(own?.data ?? {})) {
        data[key] = [...values]
      }

      const slotValues = data[descendantId] ? [...data[descendantId]] : []
      while (slotValues.length < echoSlots) slotValues.push("")
      slotValues[echoIndex - 1] = value
      data[descendantId] = slotValues.slice(0, echoSlots)

      // Keep an explicit own count only when this node already set one. A node
      // that inherits its count stores a data-only override so the count keeps
      // tracking the template.
      const repeat: RepeatEditorData =
        own?.count != null ? { count: own.count, data } : { data }

      dispatch({
        type: "set_node_repeat",
        payload: { nodeId, repeat },
      })
    },
    [workspace, dispatch],
  )

  return { setCount, setDataValue }
}
