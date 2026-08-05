import {
  plural as pluralSpellingOf,
  singular as singularSpellingOf,
} from "pluralize"

import { findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"

import { SHORTHAND_SIDES, propertyShape } from "../../prompt/property-taxonomy"
import { buildResolvePropertyNamesStage } from "../../prompt/stages/resolve-property-name"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * Every property key a component's nodes accept, as the dotted write paths the
 * repair pass reshapes into the reducer's nested form: atomic keys as-is,
 * compound keys as `key.facet`, layered paint keys as `key.0.facet` (the index
 * marks the layer slot and makes the repair pass build an array), shorthand
 * keys as both the fan-out parent and each `key.side`. `kind` is excluded from
 * layered facets: it is the layer's discriminator, derived by the write path,
 * never a property a user names. Every path is checked against the core path
 * resolver, so a core shape this function mishandles fails here, at menu-build
 * time, instead of surfacing as a rejected commit.
 */
export function settablePropertyKeys(catalogId: string): string[] {
  const componentSchema = findComponentSchema(catalogId)
  const componentHasNoProperties = !componentSchema?.properties
  if (componentHasNoProperties) return []
  const settableKeys: string[] = []
  for (const key of Object.keys(componentSchema.properties)) {
    const keyShape = propertyShape(key)
    if (keyShape === "atomic") {
      settableKeys.push(key)
    } else if (keyShape === "compound") {
      for (const facet of COMPOUND_FACET_DISPLAY_ORDER[key] ?? []) {
        settableKeys.push(`${key}.${facet}`)
      }
    } else if (keyShape === "layered") {
      for (const facet of COMPOUND_FACET_DISPLAY_ORDER[key] ?? []) {
        if (facet === "kind") continue
        settableKeys.push(`${key}.0.${facet}`)
      }
    } else if (keyShape === "shorthand") {
      settableKeys.push(key)
      for (const side of SHORTHAND_SIDES[key] ?? []) {
        settableKeys.push(`${key}.${side}`)
      }
    }
  }
  const unresolvableKeys = settableKeys.filter(
    (key) => getCatalogKeyForPropertyPath(key) === undefined,
  )
  if (unresolvableKeys.length > 0) {
    throw new Error(
      `settablePropertyKeys(${catalogId}) built paths the core path resolver cannot place: ${unresolvableKeys.join(", ")}`,
    )
  }
  return settableKeys
}

/**
 * Outcome of resolving which properties the message wants to change, following
 * the uniform contract: keys, or one terminal clarification message.
 */
export type PropertyNameResolution =
  | { kind: "resolved"; keys: string[] }
  | { kind: "message"; text: string }

/** One key pick with the message word the model says justified it. */
export interface EvidencedPick {
  key: string
  evidenceWord: string
}

/** A phrase's words with their singular and plural spellings, lowercased. */
function wordFormsOf(phrase: string | undefined): Set<string> {
  const wordForms = new Set<string>()
  for (const word of (phrase ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)) {
    wordForms.add(word)
    wordForms.add(pluralSpellingOf(word))
    wordForms.add(singularSpellingOf(word))
  }
  return wordForms
}

/**
 * Rejects picks whose evidence is a DESCRIBING word of the target phrase: a
 * pick justified by one of those words read the target, not the edit. "Hide
 * the top two chips" picked `position.top`/`position.right` live and moved
 * the chips -- "top" names WHICH chips there, and extraction had already said
 * so. The same word stays pickable when it plays a different role ("move the
 * chip to the top" keeps `position.top`): the word set comes from this
 * message's extracted phrase, not from any word list.
 *
 * The bare noun is exempt: a kind name legitimately doubles as a property
 * word -- 'change the text to "Buy now"' must keep `content` evidenced by
 * "text", the very node the edit targets. The theft class is the describing
 * words (position, appearance, counts), which never name the property being
 * changed on the thing they describe.
 *
 * Every word is expanded with its singular and plural spellings because the
 * phrase is partly model-transcribed and qwen3 drops the plural "s"
 * inconsistently ("the chips" came back as baseNode "chip" live), while the
 * evidence enum always carries the message's own inflection.
 */
export function dropTargetEvidencedPicks(
  picks: EvidencedPick[],
  targetHint: { match?: string; baseNode?: string } | undefined,
): { surviving: EvidencedPick[]; rejected: EvidencedPick[] } {
  const describingWords = wordFormsOf(targetHint?.match)
  for (const nounForm of wordFormsOf(targetHint?.baseNode)) {
    describingWords.delete(nounForm)
  }

  const surviving: EvidencedPick[] = []
  const rejected: EvidencedPick[] = []
  for (const pick of picks) {
    const evidenceIsADescribingWord = describingWords.has(
      pick.evidenceWord.toLowerCase(),
    )
    if (evidenceIsADescribingWord) rejected.push(pick)
    else surviving.push(pick)
  }
  return { surviving, rejected }
}

/**
 * Resolves the property key(s) a message targets on one component with a
 * single enum-constrained call. One message may set several properties of one
 * node ("make it red and bold"), so the answer is an array; every pick is
 * still re-validated in code against the known key set, since the spike only
 * covered scalar enum fields, not arrays of them.
 *
 * Every pick carries the message word that names it, and picks evidenced by a
 * target-phrase word are dropped (see {@link dropTargetEvidencedPicks}). When
 * nothing survives, the turn ends in the existing ask -- a wrong write is
 * silent damage, an ask is recoverable in one message.
 */
export async function resolvePropertyNames(
  context: TurnContext,
  catalogId: string,
): Promise<PropertyNameResolution> {
  const settableKeys = settablePropertyKeys(catalogId)
  const componentHasNoSettableProperties = settableKeys.length === 0
  if (componentHasNoSettableProperties) {
    return {
      kind: "message",
      text: `Component "${catalogId}" has no settable properties.`,
    }
  }

  const { prompt, schema } = buildResolvePropertyNamesStage({
    message: context.message,
    catalogId,
    keys: settableKeys,
  })

  const { value: pickAnswer, metrics } = await callOllamaFormat<{
    picks: EvidencedPick[]
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  // Belt and braces: the grammar should already restrict picks to the enums,
  // but array-of-enum wasn't in the spike's tested envelope, so re-filter.
  const knownKeys = new Set(settableKeys)
  const validPicks = (pickAnswer.picks ?? []).filter((pick) =>
    knownKeys.has(pick.key),
  )

  const { surviving, rejected } = dropTargetEvidencedPicks(
    validPicks,
    context.targetHint,
  )
  const requestedKeys = [...new Set(surviving.map((pick) => pick.key))]
  const namesWereResolved = requestedKeys.length > 0
  recordStep(context, "resolve_property_name", {
    ok: namesWereResolved,
    prompt,
    output: JSON.stringify(pickAnswer, null, 2),
  })
  const somePicksReadTheTarget = rejected.length > 0
  if (somePicksReadTheTarget) {
    recordStep(context, "resolve_property_name_target_filter", {
      ok: true,
      output: `Rejected ${rejected
        .map((pick) => `${pick.key} (evidence "${pick.evidenceWord}")`)
        .join(
          ", ",
        )}: the evidence word is part of the target phrase "${context.targetHint?.match}", so it names WHICH elements, not a property (deterministic, no model call).`,
    })
  }

  if (!namesWereResolved) {
    return {
      kind: "message",
      text: `I couldn't tell which property of the ${catalogId} you want to change. Name it explicitly (for example: its color, size, or text).`,
    }
  }
  return { kind: "resolved", keys: requestedKeys }
}
