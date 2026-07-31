import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { buildTranslateLanguagePickStage } from "../../prompt/stages/content"
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
  forwardClarification,
  isClarification,
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
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const { prompt, schema } = buildTranslateLanguagePickStage({
    message: context.message,
  })
  const { value: languageAnswer, metrics } = await callOllamaFormat<{
    language: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_language", {
    ok: true,
    prompt,
    output: languageAnswer.language,
  })
  const targetLanguage = languageAnswer.language

  // A class reference translates every member's subtree; a single reference
  // is a one-element fan. Deduped by node+property in case members nest.
  const targetNodeIds =
    resolvedTarget.kind === "resolved-many"
      ? resolvedTarget.nodeIds
      : [resolvedTarget.nodeId]
  const seenTextProperties = new Set<string>()
  const textProperties = targetNodeIds
    .flatMap((targetNodeId) =>
      collectTextProperties(
        context.state.workspace,
        context.resolved.resolvedKey,
        targetNodeId,
      ),
    )
    .filter((textProperty) => {
      const propertyIdentity = `${textProperty.nodeId}\u0000${textProperty.propertyKey}`
      if (seenTextProperties.has(propertyIdentity)) return false
      seenTextProperties.add(propertyIdentity)
      return true
    })
  const targetHasNoTranslatableText = textProperties.length === 0
  if (targetHasNoTranslatableText) {
    return {
      kind: "message",
      text:
        targetNodeIds.length === 1
          ? `${targetNodeIds[0]} has no text content to translate.`
          : `None of the ${targetNodeIds.length} matched elements have text content to translate.`,
    }
  }

  const translations = await translateBatch(
    context,
    textProperties.map((textProperty) => textProperty.text),
    targetLanguage,
  )
  const batchWasMalformed = translations === null
  if (batchWasMalformed) {
    return {
      kind: "message",
      text: `Translating to ${targetLanguage} failed: the model returned a malformed batch. Nothing was changed -- try again.`,
    }
  }

  let appliedCount = 0
  for (let textIndex = 0; textIndex < textProperties.length; textIndex++) {
    const textProperty = textProperties[textIndex]!
    const translation = translations[textIndex]!
    const translationIsUnchanged = translation === textProperty.text
    if (translationIsUnchanged) continue
    try {
      commit(context.state, {
        type: "set_node_properties",
        payload: {
          nodeId: textProperty.nodeId,
          properties: { [textProperty.propertyKey]: translation },
        },
      } as unknown as WorkspaceAction)
      appliedCount++
    } catch {
      // One node refusing (e.g. a schema child that rejects the override)
      // should not lose the rest of the batch; the skip is visible in the
      // reply count and the turn state's rejected list.
    }
  }
  const anyNodeWasTranslated = appliedCount > 0
  recordStep(context, "commit", { ok: anyNodeWasTranslated })

  if (!anyNodeWasTranslated) {
    return {
      kind: "message",
      text: `Nothing changed: the ${textProperties.length} translated value(s) were either identical or rejected.`,
    }
  }

  // Direction: only for members whose component supports it, and non-fatally.
  let directionNote = ""
  const directionCapableNodeIds = targetNodeIds.filter((targetNodeId) => {
    const targetNode = context.state.workspace.nodes[targetNodeId]
    const catalogId = targetNode
      ? getNodeCatalogId(targetNode, context.state.workspace)
      : undefined
    return catalogId
      ? settablePropertyKeys(catalogId).includes("direction")
      : false
  })
  if (directionCapableNodeIds.length > 0) {
    const textDirection = await resolveTextDirection(context, targetLanguage)
    const languageReadsRightToLeft = textDirection === "rtl"
    if (languageReadsRightToLeft) {
      for (const targetNodeId of directionCapableNodeIds) {
        try {
          commit(context.state, {
            type: "set_node_properties",
            payload: {
              nodeId: targetNodeId,
              properties: { direction: "rtl" },
            },
          } as unknown as WorkspaceAction)
          directionNote = " and set right-to-left text direction"
        } catch {
          // Direction is a nicety; a rejection must not undo the translation.
        }
      }
    }
  }

  return {
    kind: "applied",
    reply: `Translated ${appliedCount} text value(s) to ${targetLanguage}${directionNote}.`,
  }
}
