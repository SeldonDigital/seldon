import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { isAuthoredBoard, isComponentBoard } from "@seldon/core/workspace/model/components"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"

import { collectDesignViolations } from "../repair/design-lint"
import { normalizeActions } from "../repair/normalize-actions"
import { resolveNodeTarget } from "./resolve-target"

import type { ActionRepair } from "../repair/normalize-actions"
import type { RejectedActionResult } from "../types"
import type { CommitResult, PropertyEditArgs, SelectionContext, ToolContext } from "./context"
import type { TargetResolution, TargetSpec } from "./resolve-target"
import type { BoardKey, Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

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
  const p = action.payload as Record<string, string> & Record<string, { parentId?: string }>

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
function boardKeyOfNode(workspace: Workspace, nodeId: string): BoardKey | undefined {
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

/** The outcome of applying one action against a working copy, before recording. */
type ApplyOutcome =
  | {
      status: "applied"
      workspace: Workspace
      normalized: WorkspaceAction[]
      repairs: ActionRepair[]
    }
  | { status: "ineffective" }
  | { status: "rejected"; reason: string }

/**
 * Runs the shared enforcement core for one action against a working copy: shape
 * repair and token resolution, then the design linter, then the reducer
 * dry-run. It never mutates the input workspace; it returns the next copy on
 * success. This is the single chokepoint both {@link EditSession.propose} and
 * {@link safeApply} route through, so a raw action from an external agent gets
 * the same treatment the local model gets.
 */
function applyOneAction(workspace: Workspace, rawAction: WorkspaceAction): ApplyOutcome {
  const { actions: normalized, repairs } = normalizeActions([rawAction], workspace)

  const violations = normalized.flatMap((action) => collectDesignViolations(workspace, action))

  if (violations.length > 0) {
    return { status: "rejected", reason: violations.join(" ") }
  }

  let next: Workspace

  try {
    next = applyActions(workspace, normalized)
  } catch (caught) {
    return {
      status: "rejected",
      reason: caught instanceof Error ? caught.message : "invalid action",
    }
  }

  if (isUnchanged(workspace, next)) return { status: "ineffective" }

  return { status: "applied", workspace: next, normalized, repairs }
}

/** The batch result of {@link safeApply}, with exact rule text on any rejection. */
export interface SafeApplyResult {
  workspace: Workspace
  applied: WorkspaceAction[]
  ineffective: string[]
  rejected: RejectedActionResult[]
  repairs: ActionRepair[]
}

/**
 * Applies a batch of raw actions in order through the shared enforcement core,
 * folding each accepted action into a fresh working copy. It never mutates the
 * input workspace and never throws: a rejected action is recorded with the exact
 * reducer or linter reason and skipped, so a caller adopts the partial result
 * and feeds the reasons back to the agent. This is the write primitive an MCP
 * host uses for a bare `apply_actions`.
 */
export function safeApply(
  workspace: Workspace,
  actions: readonly WorkspaceAction[],
): SafeApplyResult {
  let current = workspace
  const applied: WorkspaceAction[] = []
  const ineffective: string[] = []
  const rejected: RejectedActionResult[] = []
  const repairs: ActionRepair[] = []

  for (const action of actions) {
    const outcome = applyOneAction(current, action)

    if (outcome.status === "rejected") {
      rejected.push({ type: action.type, reason: outcome.reason })
      continue
    }

    if (outcome.status === "ineffective") {
      ineffective.push(action.type)
      continue
    }

    current = outcome.workspace
    applied.push(...outcome.normalized)
    repairs.push(...outcome.repairs)
  }

  return { workspace: current, applied, ineffective, rejected, repairs }
}

/**
 * Validates a batch against the full stack without committing. It reuses
 * {@link safeApply} on a copy and reports the diagnostics only, so an agent can
 * check an edit before it lands. `wouldChange` is true when at least one action
 * would apply.
 */
export function dryRun(
  workspace: Workspace,
  actions: readonly WorkspaceAction[],
): { wouldChange: boolean; ineffective: string[]; rejected: RejectedActionResult[] } {
  const result = safeApply(workspace, actions)

  return {
    wouldChange: result.applied.length > 0,
    ineffective: result.ineffective,
    rejected: result.rejected,
  }
}

/**
 * The shared write model, generalized from the Pi turn state. It holds a working
 * copy seeded from a base workspace, the accepted actions accumulated over the
 * session, and the per-action outcomes for the transcript. `propose` validates
 * one action against the working copy and advances it; `commit` returns the
 * accumulated result for a host to adopt; `rollback` discards the working copy
 * back to the base. Pi opens one session per turn and commits once; an MCP
 * connection opens one per transaction, or an implicit one per bare write.
 *
 * `allowedNodeIds` and `allowedBoardKeys` are the Isolation closure, present
 * only when the session was seeded with one. `propose` rejects an action whose
 * anchor node or board falls outside these sets and grows them as inserts mint
 * new ids in scope.
 */
export class EditSession implements ToolContext {
  workspace: Workspace
  readonly baseWorkspace: Workspace
  actions: WorkspaceAction[] = []
  repairs: ActionRepair[] = []
  ineffective: string[] = []
  rejected: RejectedActionResult[] = []
  selection: SelectionContext
  allowedNodeIds: Set<string> | undefined = undefined
  allowedBoardKeys: Set<string> | undefined = undefined

  constructor(workspace: Workspace, selection: SelectionContext = {}) {
    this.workspace = workspace
    this.baseWorkspace = workspace
    this.selection = selection

    if (selection.isolation) {
      this.allowedNodeIds = new Set(selection.isolation.allowedNodeIds)
      this.allowedBoardKeys = new Set(selection.isolation.allowedBoardKeys)
    }
  }

  getWorkspace(): Workspace {
    return this.workspace
  }

  setSelection(patch: Partial<SelectionContext>): void {
    this.selection = { ...this.selection, ...patch }

    if (this.selection.isolation) {
      this.allowedNodeIds = new Set(this.selection.isolation.allowedNodeIds)
      this.allowedBoardKeys = new Set(this.selection.isolation.allowedBoardKeys)
    }
  }

  resolveTarget(target: TargetSpec, match?: string): TargetResolution {
    return resolveNodeTarget(
      this.workspace,
      this.selection.resolvedKey,
      this.selection.selectedNodeId,
      this.selection.selectedBoardId,
      target,
      match,
      this.selection.scope,
      this.selection.isolation?.allowedBoardKeys,
    )
  }

  commit(): CommitResult {
    return { workspace: this.workspace, actions: this.actions }
  }

  rollback(): void {
    this.workspace = this.baseWorkspace
    this.actions = []
    this.repairs = []
    this.ineffective = []
    this.rejected = []
  }

  /**
   * Validates one proposed action against the working copy and records it. Runs
   * the isolation gate, then the shared enforcement core. A rejection is
   * recorded and rethrown so an adapter feeds the exact reason back as a tool
   * error, which is how a model self-corrects. A validated action that changes
   * nothing is reported without recording it, so the model retargets instead of
   * applying a no-op.
   */
  propose(rawAction: WorkspaceAction): string {
    const outOfScope = this.isolationRejection(rawAction)

    if (outOfScope) {
      this.rejected.push({ type: rawAction.type, reason: outOfScope })
      throw new Error(outOfScope)
    }

    const before = this.workspace
    const outcome = applyOneAction(before, rawAction)

    if (outcome.status === "rejected") {
      this.rejected.push({ type: rawAction.type, reason: outcome.reason })
      throw new Error(outcome.reason)
    }

    if (outcome.status === "ineffective") {
      this.ineffective.push(rawAction.type)

      return `Action "${rawAction.type}" validated but changed nothing. It likely matched no node or set a value already in place. Check the target id and try a different edit.`
    }

    this.workspace = outcome.workspace
    this.actions.push(...outcome.normalized)
    this.repairs.push(...outcome.repairs)
    this.growClosure(before, outcome.workspace)

    return `Applied ${rawAction.type}.`
  }

  /**
   * Resolves a target through the scope ladder, then writes either a local
   * instance override or the shared component source depending on the effective
   * scope, and returns a message describing which reach it used. Shared by the
   * set_properties tool and the intent verb tools so every property edit goes
   * through one target resolution, scope decision, and cascade guard.
   */
  applyPropertyEdit(args: PropertyEditArgs): string {
    const resolution = this.resolveTarget(args.target, args.match)

    if (resolution.kind === "message") return resolution.text

    const sourceId = getSourceNodeId(this.workspace, resolution.nodeId)
    const sourceBoardKey = boardKeyOfNode(this.workspace, sourceId)
    const isWorkspaceScope = this.selection.scope === "workspace"
    // A cascade stays "in view" when the source it writes belongs to the board
    // the user is looking at. Editing a child whose source lives on another
    // board is the case that bled every instance, so it is not a safe default.
    const sourceOnActiveBoard =
      this.selection.resolvedKey !== undefined && sourceBoardKey === this.selection.resolvedKey

    // The write stays local by default, even in workspace scope. A cascade only
    // becomes the default when a broad selection targets a node whose source is
    // on the active board.
    const scope =
      args.scope ??
      (this.selection.scope !== "instance" && sourceOnActiveBoard ? "all" : "instance")

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

    const outcome = this.propose({
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
   * The reason an action is out of the isolation closure, or null when it is in
   * scope or isolation is off. A node anchor passes when its board is in scope,
   * or when it is a fresh id minted in scope this session.
   */
  private isolationRejection(action: WorkspaceAction): string | null {
    const { allowedNodeIds, allowedBoardKeys } = this

    if (!allowedNodeIds || !allowedBoardKeys) return null
    const anchor = getActionAnchor(action)

    if (!anchor) return null

    if (anchor.kind === "node") {
      if (!anchor.id || allowedNodeIds.has(anchor.id)) return null
      const owner = boardKeyOfNode(this.workspace, anchor.id)

      if (owner && allowedBoardKeys.has(owner)) return null

      return `Isolation Mode: node ${anchor.id} is on a board outside the isolated closure, so "${action.type}" is rejected. Target a node on the isolated board or one of the dependency components in scope, or tell the user this needs exiting Isolation Mode.`
    }

    if (!anchor.key || allowedBoardKeys.has(anchor.key)) return null

    return `Isolation Mode: board ${anchor.key} is outside the isolated closure, so "${action.type}" is rejected. Target the isolated board or a dependency component in scope, or tell the user this needs exiting Isolation Mode.`
  }

  /** Grows the isolation closure by the ids an accepted action minted. */
  private growClosure(before: Workspace, after: Workspace): void {
    if (!this.allowedNodeIds || !this.allowedBoardKeys) return

    for (const id of Object.keys(after.nodes)) {
      if (!before.nodes[id]) this.allowedNodeIds.add(id)
    }

    for (const key of Object.keys(after.boards)) {
      if (!before.boards[key]) this.allowedBoardKeys.add(key)
    }
  }
}
