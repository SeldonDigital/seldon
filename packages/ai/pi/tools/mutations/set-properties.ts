import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

import type { ResolvedContext } from "../../editor-context"
import { type TargetSpec, resolveNodeTarget } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** The component board key whose variant trees list this node id, if any. */
function boardKeyOfNode(
  workspace: Workspace,
  nodeId: string,
): BoardKey | undefined {
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue
    let found = false
    walkBoardTreeRefs(board.variants, (ref) => {
      if (ref.id !== nodeId) return
      found = true
      return true
    })
    if (found) return key as BoardKey
  }
  return undefined
}

/** Arguments for one property edit, shared by set_properties and the verb tools. */
export interface PropertyEditArgs {
  target: TargetSpec
  scope?: "instance" | "all"
  properties: Record<string, unknown>
  match?: string
}

/**
 * Resolves a target through the scope ladder, then writes either a local
 * instance override or the shared component source depending on the effective
 * scope, and returns a message describing which reach it used. Shared by the
 * `set_properties` tool and the intent verb tools so every property edit goes
 * through one target resolution, scope decision, and cascade guard.
 *
 * The write stays local by default. A cascade ("all") writes the node's shared
 * source, so it only becomes the default when the selection is broad and that
 * source sits on the active board. When "all" would write a source on another
 * board, the edit would change every instance of a shared element across the
 * workspace, so the tool stops and asks the model to confirm the reach instead
 * of bleeding the change silently.
 */
export function applyPropertyEdit(
  state: PiTurnState,
  resolved: ResolvedContext,
  args: PropertyEditArgs,
): string {
  const resolution = resolveNodeTarget(
    state.workspace,
    resolved.resolvedKey,
    resolved.selectedNodeId,
    resolved.selectedBoardId,
    args.target,
    args.match,
    resolved.scope,
    resolved.isolation?.allowedBoardKeys,
  )
  if (resolution.kind === "message") return resolution.text

  const sourceId = getSourceNodeId(state.workspace, resolution.nodeId)
  const sourceBoardKey = boardKeyOfNode(state.workspace, sourceId)
  const isWorkspaceScope = resolved.scope === "workspace"
  // A cascade stays "in view" when the source it writes belongs to the board
  // the user is looking at. Editing a child whose source lives on another
  // board is the case that bled every instance, so it is not a safe default.
  const sourceOnActiveBoard =
    resolved.resolvedKey !== undefined &&
    sourceBoardKey === resolved.resolvedKey

  // The write stays local by default, even in workspace scope. A cascade only
  // becomes the default when a broad selection targets a node whose source is
  // on the active board. A targeted node whose source lives elsewhere, such as
  // a card's title that resolves from a shared Text variant, defaults to a
  // local override so the edit lands on the node the model named instead of a
  // shared source that a variant preset would then override.
  const scope =
    args.scope ??
    (resolved.scope !== "instance" && sourceOnActiveBoard ? "all" : "instance")

  // Guard the one reach that silently changes unrelated components: an "all"
  // write to a source on another board. Workspace scope is exempt because the
  // user deliberately chose to act across the whole file.
  if (
    scope === "all" &&
    !isWorkspaceScope &&
    !sourceOnActiveBoard &&
    sourceId !== resolution.nodeId
  ) {
    return (
      `Scope "all" on ${resolution.nodeId} would write its shared source ${sourceId}${
        sourceBoardKey ? ` on board ${sourceBoardKey}` : ""
      }, which every instance across the workspace resolves from, not just this one. ` +
      `To change only this node, call again with scope "instance". ` +
      `To change every instance on purpose, call again with target { "nodeId": "${sourceId}" } and scope "instance".`
    )
  }

  const writeNodeId = scope === "all" ? sourceId : resolution.nodeId

  const outcome = commit(state, {
    type: "set_node_properties",
    payload: { nodeId: writeNodeId, properties: args.properties },
  } as WorkspaceAction)

  const scopeNote =
    scope === "all"
      ? `Scope all: wrote the component source ${writeNodeId}; every instance without its own override for these properties now follows.`
      : `Scope instance: wrote ${writeNodeId} as a local override.`
  return `${outcome}\n${scopeNote}`
}

/**
 * The primary edit tool: change a node's properties. It delegates to
 * {@link applyPropertyEdit} for target resolution, scope decision, and the
 * cascade guard, so the model rarely reasons about `src=`: omitting `scope`
 * lets the tool pick the local-versus-source reach from the selection scope.
 */
export function createSetPropertiesTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_properties",
    label: "Set Properties",
    description:
      'Primary tool to change a node\'s properties. Values may be loose: a bare string or number becomes an exact value, a descriptive size or color word ("big", "primary") resolves to the matching theme token, and an "@scope.key" string becomes a theme reference. Omit scope to let the tool pick the reach; pass scope "all" only to change the shared source on purpose.',
    parameters: Type.Object({
      target: Type.Union(
        [Type.Literal("selection"), Type.Object({ nodeId: Type.String() })],
        {
          description:
            '"selection" for the selected node, or { "nodeId" } from the context.',
        },
      ),
      scope: Type.Optional(
        Type.Union([Type.Literal("instance"), Type.Literal("all")], {
          description:
            'Optional. "instance" overrides just this node; "all" edits the shared component source so every instance follows. Omit it and the tool decides from the selection scope, defaulting to a local override.',
        }),
      ),
      properties: Type.Record(Type.String(), Type.Unknown()),
      match: Type.Optional(
        Type.String({
          description:
            "Label or catalog id to locate the node when out of scope.",
        }),
      ),
    }),
    execute: async (_id, params) =>
      textResult(
        applyPropertyEdit(state, resolved, {
          target: params.target as TargetSpec,
          scope: params.scope,
          properties: params.properties,
          match: params.match,
        }),
      ),
  })
}
