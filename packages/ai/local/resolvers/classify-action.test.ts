import { describe, expect, it } from "vitest"

import { isOllamaReachable } from "../ollama-client"
import {
  buildClassifierPrompt,
  buildIntentCatalog,
  classifyAction,
} from "./classify-action"

describe("buildIntentCatalog", () => {
  it("lists every intent with its description", () => {
    const catalog = buildIntentCatalog()
    expect(catalog).toContain("- set_node_properties:")
    expect(catalog).toContain("- translate:")
    expect(catalog).toContain("- none:")
  })
})

describe("buildClassifierPrompt", () => {
  it("carries the message and the selection hint, but no workspace tree", () => {
    const prompt = buildClassifierPrompt("make it red", "instance", true)
    expect(prompt).toContain('"make it red"')
    expect(prompt).toContain("has a node selected")
    expect(prompt).toContain("scope: instance")
  })

  it("hints when nothing is selected", () => {
    const prompt = buildClassifierPrompt("add a button", undefined, false)
    expect(prompt).toContain("Nothing specific is selected")
  })
})

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
const LIVE_TIMEOUT_MS = 30_000

describeIfOllama("classifyAction (live)", () => {
  it(
    "classifies a property edit",
    async () => {
      const result = await classifyAction({
        message: "make the title red",
        scope: "instance",
        hasSelectedNode: true,
        model: MODEL,
      })
      expect(result.kind).toBe("classified")
      if (result.kind === "classified") {
        expect(result.intent.intent).toBe("set_node_properties")
      }
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "classifies adding a component",
    async () => {
      const result = await classifyAction({
        message: "add a card to the board",
        scope: "board",
        hasSelectedNode: false,
        model: MODEL,
      })
      expect(result.kind).toBe("classified")
      if (result.kind === "classified") {
        expect(result.intent.intent).toBe("add_component")
      }
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "routes a greeting to the none escape",
    async () => {
      const result = await classifyAction({
        message: "hey, how are you?",
        model: MODEL,
      })
      expect(result.kind).toBe("message")
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "classifies a translation request",
    async () => {
      const result = await classifyAction({
        message: "translate this card to Spanish",
        scope: "instance",
        hasSelectedNode: true,
        model: MODEL,
      })
      expect(result.kind).toBe("classified")
      if (result.kind === "classified") {
        expect(result.intent.intent).toBe("translate")
      }
    },
    LIVE_TIMEOUT_MS,
  )
})
