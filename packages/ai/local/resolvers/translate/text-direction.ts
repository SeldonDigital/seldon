import { callOllamaFormat } from "../../ollama-client"
import { type TurnContext, recordStep } from "../../turn-context"

/**
 * The text direction the target language reads in, as one tiny enum call.
 * The direction value only gets applied to nodes whose component actually
 * supports a `direction` property -- that check is the caller's, this just
 * answers the language question.
 */
export async function resolveTextDirection(
  context: TurnContext,
  language: string,
): Promise<"ltr" | "rtl"> {
  const { value, metrics } = await callOllamaFormat<{
    direction: "ltr" | "rtl"
  }>({
    model: context.model,
    host: context.host,
    prompt: `Does ${language} read left-to-right ("ltr") or right-to-left ("rtl")?`,
    schema: {
      type: "object",
      properties: { direction: { type: "string", enum: ["ltr", "rtl"] } },
      required: ["direction"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_direction", true)
  return value.direction
}
