import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"

import { type TurnContext, recordStep } from "../turn-context"
import { extractTargetHint } from "./extract-target"
import { findNodeSemantic } from "./find-node"
import { type TargetResolution, resolveNodeTarget } from "./resolve-target"

/** Filler words stripped before comparing a phrase to a created node's name. */
const FILLER =
  /\b(the|a|an|new|newly|that|this|just|added|created|made|inserted)\b/g

/** A phrase reduced to its content words, for name comparison. */
function strip(phrase: string): string {
  return phrase.toLowerCase().replace(FILLER, "").replace(/\s+/g, " ").trim()
}

/**
 * Resolution of a "the new X" style reference against the ids this turn's
 * earlier steps created. `exact` means the phrase names the created thing
 * itself; `within` carries the leftover phrase for a part of it ("the title
 * of the new card" -> search "title" inside the created card).
 */
export type CreatedMention =
  | { kind: "exact"; nodeId: string }
  | { kind: "within"; nodeId: string; remainder: string }

/** The created node (newest first) whose catalog id or label matches `name`. */
function findCreatedByName(
  context: TurnContext,
  name: string,
): string | undefined {
  for (const nodeId of [...context.state.createdIds].reverse()) {
    const node = context.state.workspace.nodes[nodeId]
    if (!node) continue
    const names = [
      getNodeCatalogId(node, context.state.workspace) ?? "",
      (node as { label?: string }).label ?? "",
    ].map((entry) => entry.toLowerCase())
    if (names.includes(name)) return nodeId
  }
  return undefined
}

/**
 * Matches a search phrase against the nodes created earlier this turn.
 * Purely deterministic -- this is what lets a decomposed step like "Make the
 * title of the new card red" land on the card the previous step just created,
 * with no search and no model call.
 *
 * The container in an "X of Y" phrase is read from the phrase structure, not
 * from creation order: creating a card also creates its children, so "title
 * of the new card" must bind "card" (after the last "of") as the container
 * and search "title" within it -- never bind a created child that happens to
 * share a word with the part. Returns undefined when nothing created this
 * turn is referred to.
 */
export function resolveCreatedMention(
  context: TurnContext,
  match: string,
): CreatedMention | undefined {
  if (context.state.createdIds.size === 0) return undefined

  const phrase = strip(match)
  if (phrase === "") return undefined

  // "X of Y": Y names the container, X the part to find inside it.
  const ofIndex = phrase.lastIndexOf(" of ")
  if (ofIndex !== -1) {
    const container = phrase.slice(ofIndex + 4).trim()
    const part = phrase.slice(0, ofIndex).trim()
    const nodeId = findCreatedByName(context, container)
    if (nodeId && part !== "")
      return { kind: "within", nodeId, remainder: part }
  }

  // Plain reference: the whole phrase names the created thing.
  const exact = findCreatedByName(context, phrase)
  if (exact) return { kind: "exact", nodeId: exact }

  return undefined
}

/**
 * The one target-resolution path every family handler uses: extract a hint
 * from the message, check it against nodes created earlier this turn, resolve
 * it deterministically (selection, subtree, then label/id substring search),
 * and only when all of that misses or is ambiguous, upgrade to the
 * embedding-based find_node. Deterministic-first keeps the common cases free;
 * the semantic pass handles the phrasing substring matching can't ("the last
 * button", "the big heading"). The outcome always follows the uniform
 * contract.
 */
export async function resolveTargetWithHint(
  context: TurnContext,
): Promise<TargetResolution> {
  const hint = await extractTargetHint(context)
  const match = hint.kind === "search" ? hint.match : undefined

  // Created-this-turn shortcut: a reference to something an earlier step
  // just made resolves without search, and a part-reference searches only
  // inside the created subtree.
  if (match !== undefined) {
    const mention = resolveCreatedMention(context, match)
    if (mention?.kind === "exact") {
      recordStep(context, "resolve_target", true)
      return { kind: "resolved", nodeId: mention.nodeId }
    }
    if (mention?.kind === "within") {
      const within = resolveNodeTarget(
        context.state.workspace,
        context.resolved.resolvedKey,
        mention.nodeId,
        undefined,
        "selection",
        mention.remainder,
        context.resolved.scope,
      )
      if (within.kind === "resolved") {
        recordStep(context, "resolve_target", true)
        return within
      }
    }
  }

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
