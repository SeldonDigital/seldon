import { describe, expect, it } from "vitest"

import {
  OllamaCallError,
  callOllamaFormat,
  isOllamaReachable,
} from "./ollama-client"

/**
 * These tests hit a real local Ollama server -- they're gated on reachability
 * rather than mocked, because the property under test (does `format` actually
 * constrain output) can only be verified against the real grammar-constrained
 * decoder, not a fake HTTP layer. Skips cleanly (not a failure) when no
 * Ollama server is running, so this doesn't block CI environments without one.
 */
const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip

if (!ollamaUp) {
  console.warn(
    "[ollama-client.test] No Ollama server reachable at localhost:11434 -- skipping live-model tests.",
  )
}

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
// Cold model loads can take several seconds beyond vitest's 5s default.
const LIVE_TIMEOUT_MS = 30_000

describeIfOllama("callOllamaFormat (live)", () => {
  it(
    "constrains output to a flat enum",
    async () => {
      const candidates = ["n1", "n2", "n3", "n4", "n5"]
      const { value, metrics } = await callOllamaFormat<{ id: string }>({
        model: MODEL,
        prompt:
          'Candidates:\nn1: Primary Button\nn2: Secondary Button\nn3: Card Title\nn4: Hero Heading\nn5: Footer Link\n\nFind the node for: "Hero Heading". Respond with the matching id.',
        schema: {
          type: "object",
          properties: { id: { type: "string", enum: candidates } },
          required: ["id"],
        },
      })
      expect(candidates).toContain(value.id)
      expect(value.id).toBe("n4")
      expect(metrics.outputTokens).toBeGreaterThan(0)
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "constrains output to a shallow tagged union",
    async () => {
      const schema = {
        type: "object",
        oneOf: [
          {
            properties: {
              type: { const: "exact" },
              value: { type: "number" },
            },
            required: ["type", "value"],
          },
          {
            properties: {
              type: { const: "option" },
              value: { type: "string", enum: ["auto", "none"] },
            },
            required: ["type", "value"],
          },
        ],
      }
      const { value } = await callOllamaFormat<{
        type: "exact" | "option"
        value: number | string
      }>({
        model: MODEL,
        prompt:
          'A "gap" property accepts {"type":"exact","value":<number>} or {"type":"option","value":"auto"|"none"}. Instruction: "Set the gap to 16 pixels." Respond with the value object.',
        schema,
      })
      expect(["exact", "option"]).toContain(value.type)
      expect(value).toEqual({ type: "exact", value: 16 })
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "throws OllamaCallError for an unreachable host",
    async () => {
      await expect(
        callOllamaFormat({
          model: MODEL,
          host: "http://127.0.0.1:1",
          prompt: "unused",
          schema: { type: "object", properties: {} },
        }),
      ).rejects.toBeInstanceOf(OllamaCallError)
    },
    LIVE_TIMEOUT_MS,
  )
})
