import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"

import { type TurnContext, isClarification, recordStep } from "../turn-context"
import { extractTargetHint } from "./extract-target"
import { findNodeSemantic } from "./find-node"
import { type TargetResolution, resolveNodeTarget } from "./resolve-target"

/** Filler words stripped before comparing a phrase to a created node's name. */
const FILLER_WORDS =
  /\b(the|a|an|new|newly|that|this|just|added|created|made|inserted)\b/g

/** Separates the part from its container in an "X of Y" phrase. */
const OF_SEPARATOR = " of "

/** A phrase reduced to its content words, for name comparison. */
function stripFillerWords(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(FILLER_WORDS, "")
    .replace(/\s+/g, " ")
    .trim()
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
    const createdNode = context.state.workspace.nodes[nodeId]
    const nodeIsMissing = createdNode === undefined
    if (nodeIsMissing) continue
    const candidateNames = [
      getNodeCatalogId(createdNode, context.state.workspace) ?? "",
      (createdNode as { label?: string }).label ?? "",
    ].map((candidateName) => candidateName.toLowerCase())
    const nameMatchesThisNode = candidateNames.includes(name)
    if (nameMatchesThisNode) return nodeId
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
  const nothingCreatedYetThisTurn = context.state.createdIds.size === 0
  if (nothingCreatedYetThisTurn) return undefined

  const contentPhrase = stripFillerWords(match)
  const phraseWasAllFillerWords = contentPhrase === ""
  if (phraseWasAllFillerWords) return undefined

  // "X of Y": Y names the container, X the part to find inside it.
  const ofSeparatorIndex = contentPhrase.lastIndexOf(OF_SEPARATOR)
  const phraseNamesAPartOfAContainer = ofSeparatorIndex !== -1
  if (phraseNamesAPartOfAContainer) {
    const containerName = contentPhrase
      .slice(ofSeparatorIndex + OF_SEPARATOR.length)
      .trim()
    const partName = contentPhrase.slice(0, ofSeparatorIndex).trim()
    const containerNodeId = findCreatedByName(context, containerName)
    const containerWasCreatedThisTurn =
      containerNodeId !== undefined && partName !== ""
    if (containerWasCreatedThisTurn)
      return { kind: "within", nodeId: containerNodeId, remainder: partName }
  }

  // Plain reference: the whole phrase names the created thing.
  const exactMatchNodeId = findCreatedByName(context, contentPhrase)
  if (exactMatchNodeId) return { kind: "exact", nodeId: exactMatchNodeId }

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
  // The phrase survives whether or not the message also points at the
  // selection. Priority between the two lives in resolveNodeTarget's ladder
  // (selection subtree -> selection -> widen -> ask), so a hint that leans the
  // wrong way costs accuracy, never the phrase itself.
  const targetHint = await extractTargetHint(context)
  const searchPhrase = targetHint.match

  // Created-this-turn shortcut: a reference to something an earlier step
  // just made resolves without search, and a part-reference searches only
  // inside the created subtree.
  const messageNamedANode = searchPhrase !== undefined
  if (messageNamedANode) {
    const createdMention = resolveCreatedMention(context, searchPhrase)
    const mentionNamesTheCreatedNode = createdMention?.kind === "exact"
    if (mentionNamesTheCreatedNode) {
      recordStep(context, "resolve_target", {
        ok: true,
        output: `Matched "${searchPhrase}" to node ${createdMention.nodeId}, created earlier this turn (deterministic, no model call).`,
      })
      return { kind: "resolved", nodeId: createdMention.nodeId }
    }
    const mentionNamesAPartOfTheCreatedNode = createdMention?.kind === "within"
    if (mentionNamesAPartOfTheCreatedNode) {
      const nodeWithinCreated = resolveNodeTarget(
        context.state.workspace,
        context.resolved.resolvedKey,
        createdMention.nodeId,
        undefined,
        "selection",
        createdMention.remainder,
        context.resolved.scope,
      )
      const partWasFoundInsideCreatedNode = !isClarification(nodeWithinCreated)
      if (partWasFoundInsideCreatedNode) {
        recordStep(context, "resolve_target", {
          ok: true,
          output: `Matched "${searchPhrase}" to node ${nodeWithinCreated.nodeId}, found inside ${createdMention.nodeId} created earlier this turn (deterministic, no model call).`,
        })
        return nodeWithinCreated
      }
    }
  }

  const deterministicResolution = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    context.resolved.selectedNodeId,
    context.resolved.selectedBoardId,
    "selection",
    searchPhrase,
    context.resolved.scope,
  )
  const deterministicPassNeedsClarification = isClarification(
    deterministicResolution,
  )
  const noSearchPhraseToFallBackOn = searchPhrase === undefined
  if (!deterministicPassNeedsClarification || noSearchPhraseToFallBackOn) {
    recordStep(context, "resolve_target", {
      ok: !deterministicPassNeedsClarification,
      output: deterministicPassNeedsClarification
        ? deterministicResolution.text
        : `Resolved to node ${deterministicResolution.nodeId} (deterministic: selection/label search, no model call).`,
    })
    return deterministicResolution
  }

  // The deterministic pass missed or found several matches: let the semantic
  // pipeline try the phrase before surfacing the miss.
  const semanticResolution = await findNodeSemantic(context, searchPhrase)
  const semanticSearchNeedsClarification = isClarification(semanticResolution)
  recordStep(context, "resolve_target", {
    ok: !semanticSearchNeedsClarification,
    output: semanticSearchNeedsClarification
      ? semanticResolution.text
      : `Resolved "${searchPhrase}" to node ${semanticResolution.nodeId} via semantic search.`,
  })
  if (!semanticSearchNeedsClarification) return semanticResolution

  // Prefer the deterministic message when it carried a useful pick list;
  // otherwise the semantic one, which names the closest candidates.
  const deterministicMessageListedCandidates =
    deterministicResolution.text.includes("Several")
  return deterministicMessageListedCandidates
    ? deterministicResolution
    : semanticResolution
}
