import { getCurrentWorkspace, useHistoryStore } from "@app/workspace/history-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { findActiveBoardKey } from "@seldon/editor/lib/ai/apply-report"
import {
  BRIDGE_EVENTS_PATH,
  BRIDGE_RESULT_PATH,
} from "@seldon/editor/lib/mcp/bridge-protocol"
import { resolveSelectionScope } from "@seldon/editor/lib/workspace/selection-scope"
import { getComponent, getNode } from "@seldon/editor/lib/workspace/workspace-accessors"
import { onUnmounted, watch } from "vue"

import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import { nodeRelationshipService } from "@seldon/core/workspace/services"

import type { BridgeCommand, BridgeContext, BridgeResult } from "@seldon/editor/lib/mcp/bridge-protocol"
import type { Action } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"
import type { Ref } from "vue"

type Dispatch = ReturnType<typeof useDispatch>

/** Resource entry id to edit for a theme/font/icon/media scope, or undefined. */
function resolveResourceTargetId(workspace: Workspace): string | undefined {
  const selection = useSelectionStore()

  if (selection.selectedResourceEntry) return selection.selectedResourceEntry.id
  if (selection.selectedResourceItemKey) {
    return selection.selectedResourceItemKey.split(":")[2] || undefined
  }

  if (selection.selectedBoardId) {
    const board = getComponent(workspace, selection.selectedBoardId)

    if (
      board &&
      (isThemeBoard(board) ||
        isFontCollectionBoard(board) ||
        isIconSetBoard(board) ||
        isMediaBoard(board))
    ) {
      return board.variants[0]?.id
    }
  }

  return undefined
}

/** Builds the context a `context` command returns: workspace plus live selection. */
function readContext(): BridgeContext {
  const workspace = getCurrentWorkspace()
  const selection = useSelectionStore()
  const node = selection.selectedNodeId ? getNode(workspace, selection.selectedNodeId) : null
  const board = selection.selectedBoardId ? getComponent(workspace, selection.selectedBoardId) : null
  const selected = node ?? board
  const activeBoard = selected
    ? isBoard(selected)
      ? selected
      : nodeRelationshipService.findBoardForNode(selected, workspace)
    : null

  const scope = resolveSelectionScope(
    {
      selectedNodeId: selection.selectedNodeId,
      selectedBoardId: selection.selectedBoardId,
      selectedResourceEntry: selection.selectedResourceEntry,
      selectedResourceItemKey: selection.selectedResourceItemKey,
      workspaceSelected: selection.workspaceSelected,
    },
    workspace,
  )

  return {
    workspace,
    version: useHistoryStore().currentIndex,
    selectedNodeId: selection.selectedNodeId ?? undefined,
    selectedNodeRootId: selection.selectedNodeRootId ?? undefined,
    selectedBoardId: selection.selectedBoardId ?? undefined,
    activeBoardKey: findActiveBoardKey(workspace, activeBoard) ?? undefined,
    scope,
    resourceTargetId: resolveResourceTargetId(workspace),
  }
}

/** Folds a batch of actions over the current workspace, then adopts it as one undo step. */
function applyActions(dispatch: Dispatch, actions: Action[]): void {
  let workspace: Workspace = getCurrentWorkspace()

  for (const action of actions) workspace = workspaceReducer(workspace, action)
  dispatch({ type: "set_workspace", payload: { workspace } })
}

/** Runs one command against the live editor stores and returns the wire result. */
function runCommand(dispatch: Dispatch, command: BridgeCommand): BridgeResult {
  const version = () => useHistoryStore().currentIndex

  switch (command.type) {
    case "context":
      return { id: command.id, ok: true, context: readContext() }
    case "apply":
      applyActions(dispatch, (command.actions ?? []) as Action[])

      return { id: command.id, ok: true, version: version() }
    case "adopt":
      if (command.workspace) {
        dispatch({ type: "set_workspace", payload: { workspace: command.workspace } })
      }

      return { id: command.id, ok: true, version: version() }
    case "undo":
      useHistoryStore().undo()

      return { id: command.id, ok: true, version: version() }
    case "redo":
      useHistoryStore().redo()

      return { id: command.id, ok: true, version: version() }
  }
}

async function postResult(result: BridgeResult): Promise<void> {
  await fetch(BRIDGE_RESULT_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  })
}

/**
 * Connects this tab to the MCP bridge for the open workspace. It subscribes to
 * the server's SSE stream and runs each command the server pushes against the
 * tab's own reducer, history, and selection, then posts the result back. An
 * external agent that targets this workspace edits exactly what the user sees,
 * and every change lands as one entry in the tab's undo stack. Call it once from
 * the editor page setup with the open workspace id.
 */
export function useMcpBridge(workspaceId: Ref<string>): void {
  const dispatch = useDispatch()
  let source: EventSource | null = null

  function disconnect(): void {
    source?.close()
    source = null
  }

  function connect(id: string): void {
    disconnect()
    if (!id) return
    source = new EventSource(`${BRIDGE_EVENTS_PATH}?workspace=${encodeURIComponent(id)}`)

    source.onmessage = (event: MessageEvent<string>) => {
      let result: BridgeResult

      try {
        result = runCommand(dispatch, JSON.parse(event.data) as BridgeCommand)
      } catch (error) {
        const command = JSON.parse(event.data) as BridgeCommand

        result = {
          id: command.id,
          ok: false,
          error: error instanceof Error ? error.message : "Command failed.",
        }
      }

      void postResult(result)
    }
  }

  watch(workspaceId, (id) => connect(id), { immediate: true })
  onUnmounted(disconnect)
}
