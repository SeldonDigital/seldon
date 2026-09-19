import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/**
 * The wire contract between the MCP bridge server and a live editor tab. The
 * server pushes one {@link BridgeCommand} over SSE; the tab runs it against its
 * own reducer and history, then posts one {@link BridgeResult} back. Keeping the
 * shapes here lets the Vite plugin and both app hooks share one definition.
 */

/** The SSE path a tab subscribes to, carrying its open workspace id. */
export const BRIDGE_EVENTS_PATH = "/api/mcp/bridge/events"

/** The path a tab posts command results to. */
export const BRIDGE_RESULT_PATH = "/api/mcp/bridge/result"

/** The MCP Streamable HTTP endpoint an external agent client connects to. */
export const MCP_PATH = "/api/mcp"

/** Proxies a cross-origin image so the tab can embed it in a canvas capture. */
export const BRIDGE_ASSET_PATH = "/api/mcp/bridge/asset"

/** The command kinds the server sends to a tab. */
export type BridgeCommandType = "context" | "apply" | "adopt" | "undo" | "redo" | "capture"

/**
 * Options a `capture` command sends to the tab. An omitted target captures the
 * board the canvas is currently showing.
 */
export interface BridgeCaptureRequest {
  nodeId?: string
  boardKey?: string
  rootPath?: string
  maxSize?: number
  quality?: number
}

/**
 * One command from the server to a tab. `context` reads the current workspace
 * and selection; `apply` folds actions through the reducer as one undo step;
 * `adopt` replaces the workspace with a given one; `undo` and `redo` step the
 * history; `capture` rasterizes a board or node on the live canvas. `id`
 * correlates the matching {@link BridgeResult}.
 */
export interface BridgeCommand {
  id: string
  type: BridgeCommandType
  actions?: WorkspaceAction[]
  workspace?: Workspace
  capture?: BridgeCaptureRequest
}

/** The current workspace and selection a tab returns for a `context` command. */
export interface BridgeContext {
  workspace: Workspace
  version: number
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: string
  activeBoardKey?: string
  scope?: string
  resourceTargetId?: string
}

/** A JPEG the tab captured from the live canvas. */
export interface BridgeCapturedImage {
  data: string
  mimeType: string
  width: number
  height: number
  label?: string
}

/** A tab's reply to one command, correlated by `id`. */
export interface BridgeResult {
  id: string
  ok: boolean
  context?: BridgeContext
  version?: number
  error?: string
  image?: BridgeCapturedImage
}
