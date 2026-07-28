import { type TurnContext, recordStep } from "../turn-context"
import { extractTargetHint } from "./extract-target"
import { findNodeSemantic } from "./find-node"
import { type TargetResolution, resolveNodeTarget } from "./resolve-target"

/**
 * The one target-resolution path every family handler uses: extract a hint
 * from the message, resolve it deterministically (selection, subtree, then
 * label/id substring search), and only when that misses or is ambiguous,
 * upgrade to the embedding-based find_node. Deterministic-first keeps the
 * common cases free; the semantic pass handles the phrasing substring
 * matching can't ("the last button", "the big heading"). The outcome always
 * follows the uniform contract.
 */
export async function resolveTargetWithHint(
  context: TurnContext,
): Promise<TargetResolution> {
  const hint = await extractTargetHint(context)
  const match = hint.kind === "search" ? hint.match : undefined

  const resolution = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    context.resolved.selectedNodeId,
    context.resolved.selectedBoardId,
    "selection",
    match,
    context.resolved.scope,
  )
  if (resolution.kind === "resolved" || match === undefined) {
    recordStep(context, "resolve_target", resolution.kind === "resolved")
    return resolution
  }

  // The deterministic pass missed or found several matches: let the semantic
  // pipeline try the phrase before surfacing the miss.
  const semantic = await findNodeSemantic(context, match)
  recordStep(context, "resolve_target", semantic.kind === "resolved")
  if (semantic.kind === "resolved") return semantic

  // Prefer the deterministic message when it carried a useful pick list;
  // otherwise the semantic one, which names the closest candidates.
  return resolution.text.includes("Several") ? resolution : semantic
}
