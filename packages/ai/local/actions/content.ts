import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { commit } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { settablePropertyKeys } from "../resolvers/resolve-property-name"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import { collectTextProperties } from "../resolvers/translate/collect-text-properties"
import { resolveTextDirection } from "../resolvers/translate/text-direction"
import { translateBatch } from "../resolvers/translate/translate-batch"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/**
 * Handles the `translate` intent: resolve the target subtree, collect its
 * translatable strings deterministically, translate them in one validated
 * batch call, and emit one property edit per translated string (composing
 * into set_node_properties -- no dedicated action type). Text direction is
 * set on the target when its component supports a direction property and the
 * language needs a change.
 */
export async function executeTranslate(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const { value: languageAnswer, metrics } = await callOllamaFormat<{
    language: string
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "Which language does the user want the text translated into?",
      `Message: ${JSON.stringify(context.message)}`,
      'Answer with the language name, like "Spanish" or "Japanese".',
    ].join("\n"),
    schema: {
      type: "object",
      properties: { language: { type: "string", minLength: 2 } },
      required: ["language"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_language", true)
  const language = languageAnswer.language

  const texts = collectTextProperties(
    context.state.workspace,
    context.resolved.resolvedKey,
    target.nodeId,
  )
  if (texts.length === 0) {
    return {
      kind: "message",
      text: `${target.nodeId} has no text content to translate.`,
    }
  }

  const translations = await translateBatch(
    context,
    texts.map((entry) => entry.text),
    language,
  )
  if (translations === null) {
    return {
      kind: "message",
      text: `Translating to ${language} failed: the model returned a malformed batch. Nothing was changed -- try again.`,
    }
  }

  let applied = 0
  for (let i = 0; i < texts.length; i++) {
    const entry = texts[i]!
    const translation = translations[i]!
    if (translation === entry.text) continue
    try {
      commit(context.state, {
        type: "set_node_properties",
        payload: {
          nodeId: entry.nodeId,
          properties: { [entry.propertyKey]: translation },
        },
      } as unknown as WorkspaceAction)
      applied++
    } catch {
      // One node refusing (e.g. a schema child that rejects the override)
      // should not lose the rest of the batch; the skip is visible in the
      // reply count and the turn state's rejected list.
    }
  }
  recordStep(context, "commit", applied > 0)

  if (applied === 0) {
    return {
      kind: "message",
      text: `Nothing changed: the ${texts.length} translated value(s) were either identical or rejected.`,
    }
  }

  // Direction: only when the target's component supports it, and non-fatally.
  let directionNote = ""
  const node = context.state.workspace.nodes[target.nodeId]
  const catalogId = node
    ? getNodeCatalogId(node, context.state.workspace)
    : undefined
  if (catalogId && settablePropertyKeys(catalogId).includes("direction")) {
    const direction = await resolveTextDirection(context, language)
    if (direction === "rtl") {
      try {
        commit(context.state, {
          type: "set_node_properties",
          payload: {
            nodeId: target.nodeId,
            properties: { direction: "rtl" },
          },
        } as unknown as WorkspaceAction)
        directionNote = " and set right-to-left text direction"
      } catch {
        // Direction is a nicety; a rejection must not undo the translation.
      }
    }
  }

  return {
    kind: "applied",
    reply: `Translated ${applied} text value(s) to ${language}${directionNote}.`,
  }
}
