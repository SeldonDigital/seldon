import { buildTranslateBatchStage } from "../../../prompt/stages/translate"
import { callOllamaFormat } from "../../ollama-client"
import { type TurnContext, recordStep } from "../../turn-context"

/**
 * Translates a batch of strings in ONE model call and validates the response
 * strictly before anyone zips it against target nodes: the answer must be an
 * array of strings of exactly the input length, or the whole batch is
 * rejected (returns null and the caller terminates with a clean message).
 * This mirrors the guard the terminus implementation proved necessary --
 * a silently short or reordered batch would write the wrong text to the
 * wrong node.
 */
export async function translateBatch(
  context: TurnContext,
  texts: readonly string[],
  language: string,
): Promise<string[] | null> {
  const { prompt, schema } = buildTranslateBatchStage({ texts, language })

  const { value, metrics } = await callOllamaFormat<{
    translations: string[]
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  const ok =
    Array.isArray(value.translations) &&
    value.translations.length === texts.length &&
    value.translations.every((entry) => typeof entry === "string")
  recordStep(context, "translate_batch", ok, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })
  return ok ? value.translations : null
}
