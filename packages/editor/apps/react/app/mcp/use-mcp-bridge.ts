"use client"

import { useDispatch } from "@app/workspace/hooks/use-dispatch"
import { getCurrentWorkspace, useHistoryStore } from "@app/workspace/hooks/use-history"
import {
  getCurrentSelection,
  useStore as useSelectionStore,
} from "@app/workspace/hooks/use-selection"
import { getResourceTargetId, getSelectionScope } from "@app/workspace/hooks/use-selection-scope"
import { findActiveBoardKey } from "@seldon/editor/lib/ai/apply-report"
import {
  clearCaptureBoard,
  getCaptureBoardElement,
  startCaptureBoard,
} from "@seldon/editor/lib/canvas/capture/capture-board"
import { captureCanvasImage } from "@seldon/editor/lib/canvas/capture/capture-canvas-image"
import { resolveCaptureBoardKey } from "@seldon/editor/lib/canvas/capture/resolve-capture-board"
import { BRIDGE_EVENTS_PATH, BRIDGE_RESULT_PATH } from "@seldon/editor/lib/mcp/bridge-protocol"
import { useEffect } from "react"

import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import { nodeRelationshipService } from "@seldon/core/workspace/services"

import type { Action } from "@seldon/core/index"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"
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

/** The board the canvas is showing, derived from the live selection. */
function readActiveBoardKey(workspace: Workspace): BoardKey | undefined {
  const selection = getCurrentSelection()
  const activeBoard = selection
    ? isBoard(selection)
      ? selection
      : nodeRelationshipService.findBoardForNode(selection, workspace)
    : null

  return findActiveBoardKey(workspace, activeBoard) ?? undefined
}

/** Builds the context a `context` command returns: workspace plus live selection. */
function readContext(): BridgeContext {
  const workspace = getCurrentWorkspace()
  const { selectedNodeId, selectedNodeRootId, selectedBoardId } = useSelectionStore.getState()

  return {
    workspace,
    version: currentVersion(),
    selectedNodeId: selectedNodeId ?? undefined,
    selectedNodeRootId: selectedNodeRootId ?? undefined,
    selectedBoardId: selectedBoardId ?? undefined,
    activeBoardKey: readActiveBoardKey(workspace),
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

/**
 * Rasterizes the requested board or node without changing what the user sees.
 *
 * A target on the board the canvas already shows is read straight off the canvas.
 * Any other board is mounted on the capture surface and read there, because
 * selecting it would move the user and reset the canvas pan and zoom, which
 * nothing saves.
 */
async function runCapture(command: BridgeCommand): Promise<BridgeResult> {
  const request = command.capture ?? {}
  const workspace = getCurrentWorkspace()
  const targetBoardKey = resolveCaptureBoardKey(workspace, request)

  if (!targetBoardKey || targetBoardKey === readActiveBoardKey(workspace)) {
    const image = await captureCanvasImage(request)

    return { id: command.id, ok: true, image }
  }

  const surface = getCaptureBoardElement()

  if (!surface) {
    return { id: command.id, ok: false, error: "This tab has no capture surface mounted." }
  }

  startCaptureBoard(targetBoardKey)

  try {
    const image = await captureCanvasImage({ ...request, rootElement: surface })

    return { id: command.id, ok: true, image }
  } finally {
    clearCaptureBoard()
  }
}

/** Runs one command against the live editor stores and returns the wire result. */
async function runCommand(dispatch: Dispatch, command: BridgeCommand): Promise<BridgeResult> {
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
    case "capture":
      return runCapture(command)
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
      void (async () => {
        const command = JSON.parse(event.data) as BridgeCommand
        let result: BridgeResult

        try {
          result = await runCommand(dispatch, command)
        } catch (error) {
          result = {
            id: command.id,
            ok: false,
            error: error instanceof Error ? error.message : "Command failed.",
          }
        }

        await postResult(result)
      })()
    }

    return () => source.close()
  }, [workspaceId, dispatch])
}
