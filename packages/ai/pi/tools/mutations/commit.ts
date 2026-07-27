import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { normalizeActions } from "../../../repair/normalize-actions"
import type { PiTurnState } from "../turn-state"

/** Wraps a plain string in the tool result shape Pi expects. */
export function textResult(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} }
}

/** True when applying an action left the working copy effectively unchanged. */
function isUnchanged(before: unknown, after: unknown): boolean {
  if (before === after) return true
  return JSON.stringify(before) === JSON.stringify(after)
}

/**
 * The existing node or board an action edits. Isolation checks this anchor
 * against the closure. Inserts anchor at their destination parent, so a new
 * component may be pulled in only under a node already in scope. Additive
 * board/node creation, resource, theme, and workspace-metadata actions return
 * null and are never gated: they create new in-scope ids or target global
 * resources the user can adjust from any scope.
 */
type ActionAnchor =
  | { kind: "node"; id: string | undefined }
  | { kind: "board"; key: string | undefined }
  | null

function getActionAnchor(action: WorkspaceAction): ActionAnchor {
  const p = action.payload as Record<string, string> &
    Record<string, { parentId?: string }>
  switch (action.type) {
    case "set_node_properties":
    case "paste_node_properties":
    case "reset_node_property":
    case "reset_node":
    case "set_node_state_properties":
    case "reset_node_state_property":
    case "reset_node_state":
    case "add_node_layer":
    case "remove_node_layer":
    case "reorder_node_layer":
    case "set_node_layer_kind":
    case "set_node_label":
    case "set_node_ref":
    case "set_node_theme":
    case "set_node_editor_data":
    case "set_node_repeat":
    case "reset_node_label":
    case "reset_node_editor_data":
    case "duplicate_node":
      return { kind: "node", id: p.nodeId }
    case "remove_instance":
    case "move_instance":
    case "reorder_instance_in_parent":
    case "move_instance_directional":
    case "reset_instance_to_source":
    case "reset_instance_to_original":
      return { kind: "node", id: p.instanceId }
    case "remove_variant":
    case "reset_variant_to_catalog":
    case "reset_variant_instances":
      return { kind: "node", id: p.variantRootId }
    case "reset_default_variant_to_catalog":
      return { kind: "node", id: p.defaultVariantRootId }
    case "insert_variant_instance":
    case "insert_duplicate_instance":
    case "add_component_and_insert_default_instance":
      return { kind: "node", id: p.target?.parentId }
    case "insert_default_instance":
      return { kind: "node", id: p.parentId }
    case "add_variant":
    case "reorder_variant_in_board":
    case "set_component_properties":
    case "reset_component_property":
    case "reset_component_board":
    case "reset_component_to_catalog":
    case "set_component_theme":
    case "set_board_label":
    case "set_board_intent":
    case "set_board_tags":
    case "set_board_license":
    case "set_board_author":
    case "set_board_credentials":
    case "set_board_preview":
    case "set_board_editor_data":
    case "reset_board_label":
    case "reset_board_intent":
    case "reset_board_tags":
    case "reset_board_license":
    case "reset_board_author":
    case "reset_board_credentials":
    case "reset_board_preview":
    case "reset_board_editor_data":
    case "remove_board":
      return { kind: "board", key: p.boardKey }
    case "apply_component_properties_to_all_boards":
      return { kind: "board", key: p.sourceBoardKey }
    default:
      return null
  }
}

/** The workspace board map key whose variant trees list this node id, if any. */
function boardKeyOfNode(
  workspace: Workspace,
  nodeId: string,
): string | undefined {
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue
    let found = false
    walkBoardTreeRefs(board.variants, (ref) => {
      if (ref.id !== nodeId) return
      found = true
      return true
    })
    if (found) return key
  }
  return undefined
}

/**
 * The reason an action is out of the isolation closure, or null when it is in
 * scope or isolation is off. Additive and resource actions (null anchor) always
 * pass.
 *
 * A node anchor is judged by its owning board, not by exact id membership: the
 * closure's `allowedNodeIds` only covers the specific variant subtrees the
 * isolated variant instantiates, but a "scope all" edit legitimately targets a
 * dependency's source variant root (e.g. a component's default variant), which
 * lives on an in-scope board even though that exact id was never instantiated.
 * So a node passes when its board is in scope, or when it is a fresh id minted
 * in scope this turn (tracked in `allowedNodeIds`).
 */
function isolationRejection(
  state: PiTurnState,
  action: WorkspaceAction,
): string | null {
  const { allowedNodeIds, allowedBoardKeys } = state
  if (!allowedNodeIds || !allowedBoardKeys) return null
  const anchor = getActionAnchor(action)
  if (!anchor) return null
  if (anchor.kind === "node") {
    if (!anchor.id || allowedNodeIds.has(anchor.id)) return null
    const owner = boardKeyOfNode(state.workspace, anchor.id)
    if (owner && allowedBoardKeys.has(owner)) return null
    return `Isolation Mode: node ${anchor.id} is on a board outside the isolated closure, so "${action.type}" is rejected. Target a node on the isolated board or one of the dependency components in scope, or tell the user this needs exiting Isolation Mode.`
  }
  if (!anchor.key || allowedBoardKeys.has(anchor.key)) return null
  return `Isolation Mode: board ${anchor.key} is outside the isolated closure, so "${action.type}" is rejected. Target the isolated board or a dependency component in scope, or tell the user this needs exiting Isolation Mode.`
}

/**
 * Grows the isolation closure by the ids an accepted action minted, so a
 * follow-up edit to a node or board just inserted in scope passes the gate. A
 * no-op when isolation is off.
 */
function growClosure(
  state: PiTurnState,
  before: Workspace,
  after: Workspace,
): void {
  if (!state.allowedNodeIds || !state.allowedBoardKeys) return
  for (const id of Object.keys(after.nodes)) {
    if (!before.nodes[id]) state.allowedNodeIds.add(id)
  }
  for (const key of Object.keys(after.boards)) {
    if (!before.boards[key]) state.allowedBoardKeys.add(key)
  }
}

/**
 * Validates one proposed action against the turn's working copy and records it.
 * Runs the deterministic shape repair, then dry-runs the action through the
 * reducer. A reducer rejection is recorded and rethrown so Pi feeds the exact
 * reason back to the model as a tool error, which is how the model self-corrects.
 * A validated action that changes nothing is reported without recording it, so
 * the model can retarget instead of the caller applying a no-op. Both are also
 * captured on the turn state so the transcript's outcome stays truthful.
 */
export function commit(state: PiTurnState, rawAction: WorkspaceAction): string {
  // Isolation Mode gate: reject an edit whose anchor node or board lies outside
  // the frozen closure before the dry-run, and record the reason so the model
  // reads it as a tool error and retargets or asks the user to exit isolation.
  const outOfScope = isolationRejection(state, rawAction)
  if (outOfScope) {
    state.rejected.push({ type: rawAction.type, reason: outOfScope })
    throw new Error(outOfScope)
  }

  const before = state.workspace
  const { actions: normalized, repairs } = normalizeActions([rawAction])
  let next
  try {
    next = applyActions(before, normalized)
  } catch (caught) {
    state.rejected.push({
      type: rawAction.type,
      reason: caught instanceof Error ? caught.message : "invalid action",
    })
    throw caught
  }
  if (isUnchanged(before, next)) {
    state.ineffective.push(rawAction.type)
    return `Action "${rawAction.type}" validated but changed nothing. It likely matched no node or set a value already in place. Check the target id and try a different edit.`
  }
  state.workspace = next
  state.actions.push(...normalized)
  state.repairs.push(...repairs)
  growClosure(state, before, next)
  return `Applied ${rawAction.type}.`
}
