import { buildDecomposeStage } from "../../prompt/stages/decompose"
import type { ChatMessage } from "../../types"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

const ORDINAL_WORDS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
] as const

/** Word-boundary test, so "first" never matches inside "thirst". */
function containsWord(text: string, word: string): boolean {
  return new RegExp(`\\b${word}\\b`, "i").test(text)
}

/**
 * Detects the one split shape that must never survive: a counted group
 * ("the two texts about cars") rewritten into per-member steps whose only
 * difference is an ordinal the user never spoke ("...the FIRST text about
 * cars" / "...the SECOND text about cars"). The model is inventing member
 * identities off a board it cannot see; the resolver counts members against
 * the real board, so the count must reach it as spoken. The prompt forbids
 * this and the model does it anyway on some frames, deterministically --
 * so the guard is code, the same stance the count extraction takes.
 *
 * Creation verbs are exempt: "add two cards" legitimately becomes one step
 * per created thing, because the members do not exist yet -- there is
 * nothing on the board for a resolver to count.
 */
function stepsInventMembersOfACountedGroup(
  message: string,
  steps: readonly string[],
): boolean {
  const splitIntoSeveralSteps = steps.length > 1
  if (!splitIntoSeveralSteps) return false

  const messageNamesACount =
    /\b(two|three|four|five|six|seven|eight|nine|ten|\d{1,2})\b/i.test(message)
  if (!messageNamesACount) return false

  const messageCreatesNewElements = /\b(add|insert|create|duplicate)\b/i.test(
    message,
  )
  if (messageCreatesNewElements) return false

  const someStepCarriesAnInventedOrdinal = steps.some((step) =>
    ORDINAL_WORDS.some(
      (ordinal) => containsWord(step, ordinal) && !containsWord(message, ordinal),
    ),
  )
  if (!someStepCarriesAnInventedOrdinal) return false

  // Identical steps modulo the ordinal words = one edit fanned per member.
  const stripOrdinals = (step: string) =>
    ORDINAL_WORDS.reduce(
      (text, ordinal) => text.replace(new RegExp(`\\b${ordinal}\\b`, "gi"), ""),
      step.toLowerCase(),
    )
      .replace(/[.\s]+/g, " ")
      .trim()
  const strippedSteps = new Set(steps.map(stripOrdinals))
  return strippedSteps.size === 1
}

/**
 * Splits one message into self-contained instructions -- the heart of the
 * hari flow, and the one genuinely hard model task in the whole pipeline.
 * The model REWRITES each step as a complete imperative sentence with
 * pronouns resolved ("Add a card", "Make the title in the new card red");
 * it never cuts the string, which is what made naive splitting produce
 * verb-less fragments and orphaned pronouns. A single-instruction message
 * comes back as one step, making the compound path a strict superset of the
 * old single-action behavior.
 */

export async function decompose(
  context: TurnContext,
  history?: ChatMessage[],
): Promise<string[]> {
  const { prompt, schema } = buildDecomposeStage({
    message: context.message,
    history,
  })
  const { value: decomposition, metrics } = await callOllamaFormat<{
    steps: string[]
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  const rewrittenSteps = decomposition.steps
    .map((step) => step.trim())
    .filter((step) => step !== "")

  const countedGroupWasSplitPerMember = stepsInventMembersOfACountedGroup(
    context.message,
    rewrittenSteps,
  )
  if (countedGroupWasSplitPerMember) {
    recordStep(context, "decompose", {
      ok: true,
      prompt,
      output: `The model split a counted group into per-member steps with invented ordinals (${JSON.stringify(rewrittenSteps)}). Collapsed back to the message as one step, so the count resolves against the real board (deterministic).`,
    })
    return [context.message]
  }

  const messageProducedSteps = rewrittenSteps.length > 0
  recordStep(context, "decompose", {
    ok: messageProducedSteps,
    prompt,
    output: JSON.stringify({ steps: rewrittenSteps }, null, 2),
  })

  // A degenerate answer degrades to the original message as one step --
  // exactly the old single-action behavior, never a dead end.
  return messageProducedSteps ? rewrittenSteps : [context.message]
}
