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
const ollamaIsReachable = await isOllamaReachable()
const describeWhenOllamaReachable = ollamaIsReachable ? describe : describe.skip

if (!ollamaIsReachable) {
  console.warn(
    "[ollama-client.test] No Ollama server reachable at localhost:11434 -- skipping live-model tests.",
  )
}

const TEST_MODEL_ID = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
// Cold model loads can take several seconds beyond vitest's 5s default.
const LIVE_TIMEOUT_MS = 30_000

describeWhenOllamaReachable("callOllamaFormat (live)", () => {
  it(
    "constrains output to a flat enum",
    async () => {
      const candidateNodeIds = ["n1", "n2", "n3", "n4", "n5"]
      const { value: chosenNode, metrics: callMetrics } =
        await callOllamaFormat<{ id: string }>({
          model: TEST_MODEL_ID,
          prompt:
            'Candidates:\nn1: Primary Button\nn2: Secondary Button\nn3: Card Title\nn4: Hero Heading\nn5: Footer Link\n\nFind the node for: "Hero Heading". Respond with the matching id.',
          schema: {
            type: "object",
            properties: { id: { type: "string", enum: candidateNodeIds } },
            required: ["id"],
          },
        })
      expect(candidateNodeIds).toContain(chosenNode.id)
      expect(chosenNode.id).toBe("n4")
      expect(callMetrics.outputTokens).toBeGreaterThan(0)
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "constrains output to a shallow tagged union",
    async () => {
      const gapValueSchema = {
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
      const { value: gapValue } = await callOllamaFormat<{
        type: "exact" | "option"
        value: number | string
      }>({
        model: TEST_MODEL_ID,
        prompt:
          'A "gap" property accepts {"type":"exact","value":<number>} or {"type":"option","value":"auto"|"none"}. Instruction: "Set the gap to 16 pixels." Respond with the value object.',
        schema: gapValueSchema,
      })
      expect(["exact", "option"]).toContain(gapValue.type)
      expect(gapValue).toEqual({ type: "exact", value: 16 })
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "throws OllamaCallError for an unreachable host",
    async () => {
      await expect(
        callOllamaFormat({
          model: TEST_MODEL_ID,
          host: "http://127.0.0.1:1",
          prompt: "unused",
          schema: { type: "object", properties: {} },
        }),
      ).rejects.toBeInstanceOf(OllamaCallError)
    },
    LIVE_TIMEOUT_MS,
  )
})
