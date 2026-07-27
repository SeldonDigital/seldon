import { listIntents } from "@seldon/core/rules/config/design-semantics.resolve"

import { section } from "./section"

const TITLE = "Design intents (concept -> property; write the property shown):"

/**
 * Context section: Design intents.
 *
 * Routing a spoken concept to the property that carries it is the most common
 * place the model guesses, for example writing a "text" key instead of setting
 * "content", or faking direction with margins. This renders the intent map from
 * the design semantics config so the routing rule the model reads is the same
 * one the resolver and the verb tools apply. Reading it from core keeps the
 * prompt from drifting off the code.
 */
export function designRulesSection(): string[] {
  const body = listIntents().map((intent) => `- ${intent.note}`)

  return section(TITLE, body)
}
