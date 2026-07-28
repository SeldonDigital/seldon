import { catalog } from "@seldon/core/components/catalog"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, WorkspaceAction } from "@seldon/core/workspace/types"

import { resolveCatalogId } from "../../shared/catalog-ids"
import { withCreatedIdentity } from "../../shared/created-nodes"
import { commit } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolveNodeTarget } from "../resolvers/resolve-target"
import {
  type FamilyOutcome,
  type TurnContext,
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
  const ids = allCatalogIds()
  const { value, metrics } = await callOllamaFormat<{
    component: string
    destination: string
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to add a component in a design editor.",
      `Message: ${JSON.stringify(context.message)}`,
      "",
      "Available component ids:",
      ids.join(", "),
      "",
      'Pick the component id that best matches what the user asked to add. For "destination", extract the shortest phrase naming where it should go, or an empty string when the message names no destination.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        component: { type: "string", enum: ids },
        destination: { type: "string" },
      },
      required: ["component", "destination"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_component", true)
  const destination = value.destination.trim()
  return {
    catalogId: value.component,
    destination: destination === "" ? null : destination,
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
  const request = await extractAddRequest(context)
  const { workspace } = context.state

  // Insertion parent: an explicitly named destination wins; otherwise the
  // selected node when the user is working inside a component.
  let parentId: string | undefined
  if (request.destination) {
    const destination = resolveNodeTarget(
      workspace,
      context.resolved.resolvedKey,
      context.resolved.selectedNodeId,
      context.resolved.selectedBoardId,
      { nodeId: request.destination },
      request.destination,
      context.resolved.scope,
    )
    recordStep(context, "resolve_destination", destination.kind === "resolved")
    if (destination.kind === "message")
      return { kind: "message", text: destination.text }
    parentId = destination.nodeId
  } else if (
    context.resolved.selectedNodeId &&
    (context.resolved.scope === "instance" ||
      context.resolved.scope === "variant")
  ) {
    parentId = context.resolved.selectedNodeId
  }

  const before = workspace
  try {
    if (parentId) {
      const action: WorkspaceAction = workspace.boards[request.catalogId]
        ? ({
            type: "insert_default_instance",
            payload: { boardKey: request.catalogId, parentId },
          } as WorkspaceAction)
        : ({
            type: "add_component_and_insert_default_instance",
            payload: { boardKey: request.catalogId, target: { parentId } },
          } as WorkspaceAction)
      commit(context.state, action)
    } else {
      if (workspace.boards[request.catalogId]) {
        return {
          kind: "message",
          text: `The ${request.catalogId} component is already in the workspace. Tell me where to insert an instance of it.`,
        }
      }
      commit(context.state, {
        type: "add_component",
        payload: { boardKey: request.catalogId },
      } as WorkspaceAction)
    }
  } catch (caught) {
    return {
      kind: "message",
      text: `Adding ${request.catalogId} was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)

  const summary = parentId
    ? `Added a ${request.catalogId} inside ${parentId}.`
    : `Added the ${request.catalogId} component as its own board.`
  return {
    kind: "applied",
    reply: withCreatedIdentity(before, context.state.workspace, summary),
  }
}

/**
 * Handles the `add_variant` intent: the active board by default, or a named
 * component's board. The reducer owns validity.
 */
export async function executeAddVariant(
  context: TurnContext,
): Promise<FamilyOutcome> {
  let boardKey = context.resolved.resolvedKey
  // A named component overrides the active board ("add a variant to the card").
  const resolved = resolveCatalogId(
    context.message.toLowerCase().includes(String(boardKey).toLowerCase())
      ? String(boardKey)
      : context.message,
  )
  if (resolved.id && context.state.workspace.boards[resolved.id]) {
    boardKey = resolved.id as BoardKey
  }
  if (boardKey === undefined) {
    return {
      kind: "message",
      text: "No board is active. Open the component you want a new variant of, or name it.",
    }
  }

  const before = context.state.workspace
  try {
    commit(context.state, {
      type: "add_variant",
      payload: { boardKey },
    } as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Adding a variant was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: withCreatedIdentity(
      before,
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
  const board = boardKey ? context.state.workspace.boards[boardKey] : undefined
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board))) {
    return {
      kind: "message",
      text: "No component board is active, so there are no variants to insert from.",
    }
  }

  const variants = board.variants.map((ref) => {
    const node = context.state.workspace.nodes[ref.id]
    return { id: ref.id, label: node?.label ?? ref.id }
  })

  const { value, metrics } = await callOllamaFormat<{
    variantId: string
    destination: string
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to insert an instance of one of these variants:",
      variants.map((entry) => `- ${entry.id}: "${entry.label}"`).join("\n"),
      "",
      `Message: ${JSON.stringify(context.message)}`,
      "",
      'Pick the variant and extract the shortest phrase naming where it goes ("destination" -- empty string when the message means the current selection).',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        variantId: {
          type: "string",
          enum: variants.map((entry) => entry.id),
        },
        destination: { type: "string" },
      },
      required: ["variantId", "destination"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_variant", true)

  const destination = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    context.resolved.selectedNodeId,
    context.resolved.selectedBoardId,
    "selection",
    value.destination.trim() === "" ? undefined : value.destination,
    context.resolved.scope,
  )
  recordStep(context, "resolve_destination", destination.kind === "resolved")
  if (destination.kind === "message")
    return { kind: "message", text: destination.text }

  const before = context.state.workspace
  try {
    commit(context.state, {
      type: "insert_variant_instance",
      payload: {
        variantId: value.variantId,
        target: { parentId: destination.nodeId },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Inserting the variant was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: withCreatedIdentity(
      before,
      context.state.workspace,
      `Inserted variant ${value.variantId} into ${destination.nodeId}.`,
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
