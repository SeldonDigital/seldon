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
import { resolveNodeTarget } from "../resolvers/resolve-target"
import {
  type FamilyOutcome,
  type TurnContext,
  forwardClarification,
  isClarification,
  recordStep,
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
  return {
    catalogId: addRequestAnswer.component,
    destination: messageNamedNoDestination ? null : destinationPhrase,
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
      output: destinationNeedsClarification
        ? destinationResolution.text
        : `Resolved "${addRequest.destination}" to node ${destinationResolution.nodeId} (deterministic, no model call).`,
    })
    if (destinationNeedsClarification)
      return forwardClarification(destinationResolution)
    parentId = destinationResolution.nodeId
  } else if (selectionIsInsideAComponent) {
    parentId = context.resolved.selectedNodeId
  }

  const workspaceBeforeCommit = workspace
  const componentBoardAlreadyExists = Boolean(
    workspace.boards[addRequest.catalogId],
  )
  try {
    const insertUnderAParent = parentId !== undefined
    if (insertUnderAParent) {
      const insertAction: WorkspaceAction = componentBoardAlreadyExists
        ? ({
            type: "insert_default_instance",
            payload: { boardKey: addRequest.catalogId, parentId },
          } as WorkspaceAction)
        : ({
            type: "add_component_and_insert_default_instance",
            payload: { boardKey: addRequest.catalogId, target: { parentId } },
          } as WorkspaceAction)
      commit(context.state, insertAction)
    } else {
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
    ? `Added a ${addRequest.catalogId} inside ${parentId}.`
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
