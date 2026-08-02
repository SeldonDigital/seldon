import { catalog } from "@seldon/core/components/catalog"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, WorkspaceAction } from "@seldon/core/workspace/types"

import {
  buildExtractAddRequestStage,
  buildPickVariantStage,
} from "../../prompt/stages/add-insert"
import { resolveCatalogId } from "../../shared/catalog-ids"
import { withCreatedIdentity } from "../../shared/created-nodes"
import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { countNamedBeforeNoun } from "../resolvers/extract-target"
import { resolveNodeTarget } from "../resolvers/resolve-target"
import {
  type FamilyOutcome,
  type TurnContext,
  forwardClarification,
  isClarification,
  recordStep,
  refuseSetTarget,
} from "../turn-context"

/** Every component catalog id, across all levels. */
function allCatalogIds(): string[] {
  return [
    ...catalog.frames,
    ...catalog.primitives,
    ...catalog.elements,
    ...catalog.parts,
    ...catalog.modules,
    ...catalog.screens,
  ].map((schema) => schema.id)
}

/** Hard cap on inserts per request -- a safety valve, like decompose's MAX_STEPS. */
const MAX_INSERTS_PER_TURN = 10

/** Articles/pointers stripped before checking a destination against the message. */
const DESTINATION_FILLER_WORDS =
  /\b(the|a|an|this|that|these|those|my|new|current)\b/g

/**
 * Whether the extracted destination's content words all literally appear in
 * the message. The model invents destinations for messages that name none --
 * "Add four chips" answered destination "container", which then failed
 * resolution and killed the turn. A destination the user never spoke can
 * only be an invention, so it is checked against the message and dropped;
 * an all-filler phrase ("this") names nothing to search for either.
 */
function destinationWasSpoken(
  message: string,
  destinationPhrase: string,
): boolean {
  const contentWords = destinationPhrase
    .toLowerCase()
    .replace(DESTINATION_FILLER_WORDS, " ")
    .split(/\s+/)
    .filter((word) => word !== "")
  if (contentWords.length === 0) return false
  return contentWords.every((word) =>
    new RegExp(
      `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "i",
    ).test(message),
  )
}

/**
 * Extracts which component to add and where, in one shallow call constrained
 * to real catalog ids. "none" covers a message that names no destination.
 */
async function extractAddRequest(
  context: TurnContext,
): Promise<{ catalogId: string; destination: string | null }> {
  const { prompt, schema } = buildExtractAddRequestStage({
    message: context.message,
    catalogIds: allCatalogIds(),
  })
  const { value: addRequestAnswer, metrics } = await callOllamaFormat<{
    component: string
    destination: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_component", {
    ok: true,
    prompt,
    output: JSON.stringify(addRequestAnswer, null, 2),
  })
  const destinationPhrase = addRequestAnswer.destination.trim()
  const messageNamedNoDestination = destinationPhrase === ""
  if (messageNamedNoDestination) {
    return { catalogId: addRequestAnswer.component, destination: null }
  }
  const destinationIsInvented = !destinationWasSpoken(
    context.message,
    destinationPhrase,
  )
  if (destinationIsInvented) {
    recordStep(context, "resolve_destination", {
      ok: true,
      output: `The model answered destination "${destinationPhrase}", which the message never says -- discarded as invented; treating the message as naming no destination (deterministic).`,
    })
    return { catalogId: addRequestAnswer.component, destination: null }
  }
  return {
    catalogId: addRequestAnswer.component,
    destination: destinationPhrase,
  }
}

/**
 * Handles the `add_component` intent. Routing is code, not model judgment:
 * a named destination (or a selected node in a narrow scope) becomes an
 * insertion under that parent -- creating the component's board on the way
 * when it doesn't exist yet -- and no destination becomes a board-level add.
 */
export async function executeAddComponent(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const addRequest = await extractAddRequest(context)
  const { workspace } = context.state

  // Insertion parent: an explicitly named destination wins; otherwise the
  // selected node when the user is working inside a component.
  let parentId: string | undefined
  const destinationPhrase = addRequest.destination
  const messageNamedADestination = destinationPhrase !== null
  const selectionIsInsideAComponent =
    Boolean(context.resolved.selectedNodeId) &&
    (context.resolved.scope === "instance" ||
      context.resolved.scope === "variant")
  if (messageNamedADestination) {
    const destinationResolution = resolveNodeTarget(
      workspace,
      context.resolved.resolvedKey,
      context.resolved.selectedNodeId,
      context.resolved.selectedBoardId,
      { nodeId: destinationPhrase },
      destinationPhrase,
      context.resolved.scope,
    )
    const destinationNeedsClarification = isClarification(destinationResolution)
    recordStep(context, "resolve_destination", {
      ok: !destinationNeedsClarification,
      output: isClarification(destinationResolution)
        ? destinationResolution.text
        : destinationResolution.kind === "resolved"
          ? `Resolved "${addRequest.destination}" to node ${destinationResolution.nodeId} (deterministic, no model call).`
          : `Resolved ${destinationResolution.nodeIds.length} destinations.`,
    })
    if (destinationNeedsClarification)
      return forwardClarification(destinationResolution)
    if (destinationResolution.kind === "resolved-many")
      return refuseSetTarget("insert into", destinationResolution.nodeIds.length)
    parentId = destinationResolution.nodeId
  } else if (selectionIsInsideAComponent) {
    parentId = context.resolved.selectedNodeId
  }

  // "add four chips" is one instruction with a count, read off the message
  // in code -- never one decompose step per chip, and never a model number.
  const requestedCount = countNamedBeforeNoun(
    context.message,
    addRequest.catalogId,
  )
  const insertCount = requestedCount ?? 1
  const countExceedsTheSafetyValve = insertCount > MAX_INSERTS_PER_TURN
  if (countExceedsTheSafetyValve) {
    return {
      kind: "message",
      text: `That asks for ${insertCount} ${addRequest.catalogId}s at once; I can add up to ${MAX_INSERTS_PER_TURN} per request. Ask again with a smaller number.`,
    }
  }

  const workspaceBeforeCommit = workspace
  try {
    const insertUnderAParent = parentId !== undefined
    if (insertUnderAParent) {
      for (let insertIndex = 0; insertIndex < insertCount; insertIndex++) {
        // Re-derived each pass: the first insert may create the board.
        const componentBoardAlreadyExists = Boolean(
          context.state.workspace.boards[addRequest.catalogId],
        )
        const insertAction: WorkspaceAction = componentBoardAlreadyExists
          ? ({
              type: "insert_default_instance",
              payload: { boardKey: addRequest.catalogId, parentId },
            } as WorkspaceAction)
          : ({
              type: "add_component_and_insert_default_instance",
              payload: { boardKey: addRequest.catalogId, target: { parentId } },
            } as WorkspaceAction)
        try {
          commit(context.state, insertAction)
        } catch (caught) {
          const someInsertsLanded = insertIndex > 0
          if (someInsertsLanded) {
            // The landed inserts are already committed; report the honest
            // partial outcome rather than pretending all-or-nothing.
            return {
              kind: "message",
              text: `Added ${insertIndex} of ${insertCount} ${addRequest.catalogId}s inside ${parentId}, then failed: ${commitFailureReason(caught)}`,
            }
          }
          throw caught
        }
      }
    } else {
      const componentBoardAlreadyExists = Boolean(
        workspace.boards[addRequest.catalogId],
      )
      const severalNeedAPlaceToGo = insertCount > 1
      if (severalNeedAPlaceToGo) {
        return {
          kind: "message",
          text: `Adding ${insertCount} ${addRequest.catalogId}s needs a place to put them. Select a container on the canvas, or name one.`,
        }
      }
      if (componentBoardAlreadyExists) {
        return {
          kind: "message",
          text: `The ${addRequest.catalogId} component is already in the workspace. Tell me where to insert an instance of it.`,
        }
      }
      commit(context.state, {
        type: "add_component",
        payload: { boardKey: addRequest.catalogId },
      } as WorkspaceAction)
    }
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't add ${addRequest.catalogId}: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })

  const summaryReply = parentId
    ? insertCount > 1
      ? `Added ${insertCount} ${addRequest.catalogId}s inside ${parentId}.`
      : `Added a ${addRequest.catalogId} inside ${parentId}.`
    : `Added the ${addRequest.catalogId} component as its own board.`
  return {
    kind: "applied",
    reply: withCreatedIdentity(
      workspaceBeforeCommit,
      context.state.workspace,
      summaryReply,
    ),
  }
}

/**
 * Handles the `add_variant` intent: the active board by default, or a named
 * component's board. The reducer owns validity.
 */
export async function executeAddVariant(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const activeBoardKey = context.resolved.resolvedKey
  // A named component overrides the active board ("add a variant to the card").
  const messageMentionsTheActiveBoard = context.message
    .toLowerCase()
    .includes(String(activeBoardKey).toLowerCase())
  const catalogMatch = resolveCatalogId(
    messageMentionsTheActiveBoard ? String(activeBoardKey) : context.message,
  )
  const namedComponentHasABoard = Boolean(
    catalogMatch.id && context.state.workspace.boards[catalogMatch.id],
  )
  const boardKey = namedComponentHasABoard
    ? (catalogMatch.id as BoardKey)
    : activeBoardKey
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) {
    return {
      kind: "message",
      text: "No board is active. Open the component you want a new variant of, or name it.",
    }
  }

  const workspaceBeforeCommit = context.state.workspace
  try {
    commit(context.state, {
      type: "add_variant",
      payload: { boardKey },
    } as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't add a variant: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: withCreatedIdentity(
      workspaceBeforeCommit,
      context.state.workspace,
      `Added a new variant to ${boardKey}.`,
    ),
  }
}

/**
 * Handles the `insert_variant_instance` intent: pick one of the active
 * board's variants by enum, resolve the destination, commit.
 */
export async function executeInsertVariantInstance(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const boardKey = context.resolved.resolvedKey
  const activeBoard = boardKey
    ? context.state.workspace.boards[boardKey]
    : undefined
  const noComponentBoardIsActive =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard))
  if (noComponentBoardIsActive) {
    return {
      kind: "message",
      text: "No component board is active, so there are no variants to insert from.",
    }
  }

  const variantChoices = activeBoard.variants.map((ref) => {
    const variantNode = context.state.workspace.nodes[ref.id]
    return { id: ref.id, label: variantNode?.label ?? ref.id }
  })

  const { prompt, schema } = buildPickVariantStage({
    message: context.message,
    variants: variantChoices,
  })
  const { value: variantAnswer, metrics } = await callOllamaFormat<{
    variantId: string
    destination: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_variant", {
    ok: true,
    prompt,
    output: JSON.stringify(variantAnswer, null, 2),
  })

  const destinationPhraseIsBlank = variantAnswer.destination.trim() === ""
  const destinationResolution = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    context.resolved.selectedNodeId,
    context.resolved.selectedBoardId,
    "selection",
    destinationPhraseIsBlank ? undefined : variantAnswer.destination,
    context.resolved.scope,
  )
  const destinationNeedsClarification = isClarification(destinationResolution)
  recordStep(context, "resolve_destination", {
    ok: !destinationNeedsClarification,
  })
  if (destinationNeedsClarification)
    return forwardClarification(destinationResolution)
  if (destinationResolution.kind === "resolved-many")
    return refuseSetTarget("insert into", destinationResolution.nodeIds.length)

  const workspaceBeforeCommit = context.state.workspace
  try {
    commit(context.state, {
      type: "insert_variant_instance",
      payload: {
        variantId: variantAnswer.variantId,
        target: { parentId: destinationResolution.nodeId },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't insert the variant: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: withCreatedIdentity(
      workspaceBeforeCommit,
      context.state.workspace,
      `Inserted variant ${variantAnswer.variantId} into ${destinationResolution.nodeId}.`,
    ),
  }
}

/**
 * `add_sandbox` stays in the vocabulary so the classifier routes it here, but
 * the payload's playgroundKey semantics are unverified against Core's handler,
 * so v1 terminates cleanly instead of guessing at key construction.
 */
export async function executeAddSandbox(
  _context: TurnContext,
): Promise<FamilyOutcome> {
  return {
    kind: "message",
    text: "Creating sandboxes from chat isn't supported yet. Use the editor's add-sandbox control.",
  }
}
