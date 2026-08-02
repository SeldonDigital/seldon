import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"

import { type TurnContext, isClarification, recordStep } from "../turn-context"
import { extractTargetHint } from "./extract-target"
import { findNodeSemantic, labelNumberTieBreak } from "./find-node"
import {
  pickDirectionalEndpoint,
} from "./find-node/geometry-labels"
import { narrowClassTarget } from "./find-node/narrow-pool"
import {
  type TargetResolution,
  resolveClassTarget,
  resolveNodeTarget,
} from "./resolve-target"

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
 * Resolves a reference whose noun is "variant" against the active board's
 * own variants array: label number first ("the second variant" -> the node
 * LABELED "Variant 02" -- the numbering the user reads, which the catalog
 * presets sitting above it make disagree with position), then a directional
 * end ("the last variant"), then an honest ask listing exactly the variants
 * -- never the embedding search's mixed cluster. Undefined when no board is
 * active or it has fewer than two variants, letting the general path handle
 * the degenerate shapes.
 */
export function resolveVariantReference(
  context: TurnContext,
  referencePhrase: string,
): TargetResolution | undefined {
  const boardKey = context.resolved.resolvedKey
  if (boardKey === undefined) return undefined
  const activeBoard = context.state.workspace.boards[boardKey]
  const boardHasNoVariants =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard)) ||
    activeBoard.variants.length < 2
  if (boardHasNoVariants) return undefined

  const variantRootIds = activeBoard.variants.map(
    (variantRef) => variantRef.id,
  )
  const numberedWinnerId = labelNumberTieBreak(
    context.state.workspace,
    referencePhrase,
    variantRootIds,
  )
  if (numberedWinnerId !== undefined) {
    recordStep(context, "resolve_target", {
      ok: true,
      output: `Resolved the variant reference by label number to ${numberedWinnerId} (deterministic, no model call).`,
    })
    return { kind: "resolved", nodeId: numberedWinnerId }
  }
  // "The new variant" names the most recently added one -- variants append,
  // so newest is the array's end. Deterministic, and covers the natural
  // follow-up phrasing right after creating a variant in an earlier turn
  // (created-this-turn references resolve before any of this runs).
  const phraseNamesTheNewestVariant = /\b(new|newest|latest)\b/i.test(
    referencePhrase,
  )
  if (phraseNamesTheNewestVariant) {
    const newestVariantId = variantRootIds[variantRootIds.length - 1]!
    recordStep(context, "resolve_target", {
      ok: true,
      output: `Resolved "the new variant" to ${newestVariantId}, the most recently added variant (deterministic, no model call).`,
    })
    return { kind: "resolved", nodeId: newestVariantId }
  }
  const directionalWinnerId = pickDirectionalEndpoint(
    context.state.workspace,
    boardKey,
    referencePhrase,
    variantRootIds,
  )
  if (directionalWinnerId !== undefined) {
    recordStep(context, "resolve_target", {
      ok: true,
      output: `Resolved the variant reference by board order to ${directionalWinnerId} (deterministic, no model call).`,
    })
    return { kind: "resolved", nodeId: directionalWinnerId }
  }

  const variantLines = variantRootIds
    .map((nodeId) => {
      const label = context.state.workspace.nodes[nodeId]?.label ?? nodeId
      return `- ${nodeId}: "${label}"`
    })
    .join("\n")
  const askText = `This board has ${variantRootIds.length} variants and the message doesn't say which one:\n${variantLines}\nName one, or select it on the canvas and ask again.`
  recordStep(context, "resolve_target", { ok: false, output: askText })
  return {
    kind: "message",
    text: askText,
    reason: "several",
    candidateIds: variantRootIds,
  }
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

  // Class reference ("all the chips", "the tabs"): the set of matches IS the
  // answer, so it resolves by predicate over the active board -- no ranking,
  // no model call, nothing to disambiguate. Zero matches is the only miss.
  // The class matches on the bare noun: a composed phrase like "top two
  // text" names no kind on any board, and the describing words do their work
  // in the narrowing below, not here.
  if (targetHint.plural && searchPhrase !== undefined) {
    const classResolution = resolveClassTarget(
      context.state.workspace,
      context.resolved.resolvedKey,
      targetHint.baseNode ?? searchPhrase,
    )
    const requestedCount = targetHint.count
    if (
      classResolution.kind === "resolved-many" &&
      requestedCount !== undefined &&
      classResolution.nodeIds.length > requestedCount
    ) {
      const exhaustiveMatchCount = classResolution.nodeIds.length
      const narrowedResolution = await narrowClassTarget(
        context,
        classResolution.nodeIds,
        requestedCount,
        context.message,
      )
      recordStep(context, "resolve_target", {
        ok: true,
        output: `Matched "${searchPhrase}" as a class: ${exhaustiveMatchCount} nodes, narrowed to ${narrowedResolution.nodeIds.length} (count=${requestedCount}).`,
      })
      return narrowedResolution
    }
    recordStep(context, "resolve_target", {
      ok: classResolution.kind === "resolved-many",
      output:
        classResolution.kind === "resolved-many"
          ? `Matched "${searchPhrase}" as a class: ${classResolution.nodeIds.length} nodes on the active board (deterministic, no model call).`
          : isClarification(classResolution)
            ? classResolution.text
            : `Resolved to node ${classResolution.nodeId}.`,
    })
    return classResolution
  }

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
      const partWasFoundInsideCreatedNode = nodeWithinCreated.kind === "resolved"
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
      output: isClarification(deterministicResolution)
        ? deterministicResolution.text
        : deterministicResolution.kind === "resolved"
          ? `Resolved to node ${deterministicResolution.nodeId} (deterministic: selection/label search, no model call).`
          : `Resolved ${deterministicResolution.nodeIds.length} nodes.`,
    })
    return deterministicResolution
  }

  // "Variant" is a structural word, not a catalog kind (variant roots carry
  // their component's catalogId) -- and the board knows exactly which nodes
  // are its variants, so a variant reference never needs the embedding
  // search, whose margin lets stray content ride into the tie and defeat
  // the deterministic tiebreaks.
  const nounNamesAVariant = /^variants?$/i.test(targetHint.baseNode ?? "")
  if (nounNamesAVariant) {
    const variantResolution = resolveVariantReference(context, context.message)
    if (variantResolution !== undefined) return variantResolution
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
