"use client"

import { useDispatch } from "@app/workspace/hooks/use-dispatch"
import { getCurrentWorkspace, useHistoryStore } from "@app/workspace/hooks/use-history"
import {
  getCurrentSelection,
  useStore as useSelectionStore,
} from "@app/workspace/hooks/use-selection"
import { getResourceTargetId, getSelectionScope } from "@app/workspace/hooks/use-selection-scope"
import { findActiveBoardKey } from "@seldon/editor/lib/ai/apply-report"
import { BRIDGE_EVENTS_PATH, BRIDGE_RESULT_PATH } from "@seldon/editor/lib/mcp/bridge-protocol"
import { useEffect } from "react"

import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import { nodeRelationshipService } from "@seldon/core/workspace/services"

import type { Action } from "@seldon/core/index"
import type { Workspace } from "@seldon/core/workspace/types"
import type {
  BridgeCommand,
  BridgeContext,
  BridgeResult,
} from "@seldon/editor/lib/mcp/bridge-protocol"

type Dispatch = ReturnType<typeof useDispatch>

/** The current revision index, the version the bridge reports back to the agent. */
function currentVersion(): number {
  return useHistoryStore.getState().currentIndex
}

/** Builds the context a `context` command returns: workspace plus live selection. */
function readContext(): BridgeContext {
  const workspace = getCurrentWorkspace()
  const selection = getCurrentSelection()
  const activeBoard = selection
    ? isBoard(selection)
      ? selection
      : nodeRelationshipService.findBoardForNode(selection, workspace)
    : null
  const { selectedNodeId, selectedNodeRootId, selectedBoardId } = useSelectionStore.getState()

  return {
    workspace,
    version: currentVersion(),
    selectedNodeId: selectedNodeId ?? undefined,
    selectedNodeRootId: selectedNodeRootId ?? undefined,
    selectedBoardId: selectedBoardId ?? undefined,
    activeBoardKey: findActiveBoardKey(workspace, activeBoard) ?? undefined,
    scope: getSelectionScope(workspace),
    resourceTargetId: getResourceTargetId(workspace),
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
  switch (command.type) {
    case "context":
      return { id: command.id, ok: true, context: readContext() }
    case "apply":
      applyActions(dispatch, (command.actions ?? []) as Action[])

      return { id: command.id, ok: true, version: currentVersion() }
    case "adopt":
      if (command.workspace) {
        dispatch({ type: "set_workspace", payload: { workspace: command.workspace } })
      }

      return { id: command.id, ok: true, version: currentVersion() }
    case "undo":
      useHistoryStore.getState().undo()

      return { id: command.id, ok: true, version: currentVersion() }
    case "redo":
      useHistoryStore.getState().redo()

      return { id: command.id, ok: true, version: currentVersion() }
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
 * and every change lands as one entry in the tab's undo stack. Mount it once in
 * the workspace shell.
 */
export function useMcpBridge(workspaceId: string): void {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!workspaceId) return
    const source = new EventSource(
      `${BRIDGE_EVENTS_PATH}?workspace=${encodeURIComponent(workspaceId)}`,
    )

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

    return () => source.close()
  }, [workspaceId, dispatch])
}
