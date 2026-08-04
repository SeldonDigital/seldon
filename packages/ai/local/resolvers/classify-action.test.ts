import { describe, expect, it } from "vitest"

import { isOllamaReachable } from "../ollama-client"
import { classifyAction } from "./classify-action"

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
// Classification is two calls now (family, then member), so one case costs two
// round trips.
const LIVE_TIMEOUT_MS = 45_000

/** Asserts the family-then-member picks land on one expected intent. */
async function expectIntent(
  inputs: { message: string; scope?: "instance" | "board"; hasSelectedNode?: boolean },
  expectedIntent: string,
): Promise<void> {
  const classification = await classifyAction({
    message: inputs.message,
    scope: inputs.scope,
    hasSelectedNode: inputs.hasSelectedNode,
    model: MODEL,
  })
  expect(classification.kind).toBe("classified")
  if (classification.kind === "classified") {
    expect(classification.intent.intent).toBe(expectedIntent)
  }
}

describeIfOllama("classifyAction (live)", () => {
  it(
    "classifies a property edit",
    () =>
      expectIntent(
        { message: "make the title red", scope: "instance", hasSelectedNode: true },
        "set_node_properties",
      ),
    LIVE_TIMEOUT_MS,
  )

  it(
    "classifies adding a component",
    () =>
      expectIntent(
        { message: "add a card to the board", scope: "board", hasSelectedNode: false },
        "add_component",
      ),
    LIVE_TIMEOUT_MS,
  )

  it(
    "routes a greeting to the none escape",
    async () => {
      const classification = await classifyAction({
        message: "hey, how are you?",
        model: MODEL,
      })
      expect(classification.kind).toBe("message")
      if (classification.kind === "message") {
        // A deliberate escape, not an unknown key that failed lookup.
        expect(classification.rawIntent).toBe("none")
      }
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "classifies a translation request",
    () =>
      expectIntent(
        { message: "translate this card to Spanish", scope: "instance", hasSelectedNode: true },
        "translate",
      ),
    LIVE_TIMEOUT_MS,
  )

  // The sibling-steal battery. Each of these was a live wrong mutation that
  // executed and reported success, and the first three were repaired by tuning
  // the losing intent's description until the fourth appeared anyway. They are
  // kept together because the failure mode is cross-talk: a change that fixes
  // one must not move the failure onto another.
  describe("sibling steals", () => {
    it(
      "reads the verb, not the structural noun: renaming a variant is not adding one (issue 17)",
      () =>
        expectIntent(
          { message: "rename the second variant to Compact", scope: "board" },
          "set_node_label",
        ),
      LIVE_TIMEOUT_MS,
    )

    it(
      "reads the verb, not the destination noun: adding INTO a variant inserts a component",
      () =>
        expectIntent(
          { message: "add a chip to the new variant", scope: "board" },
          "add_component",
        ),
      LIVE_TIMEOUT_MS,
    )

    it(
      "keeps plural reset phrasing on reset, not set",
      () =>
        expectIntent(
          { message: "reset the color of the two texts about cars", scope: "board" },
          "reset_node_property",
        ),
      LIVE_TIMEOUT_MS,
    )

    it(
      "applies a theme to elements rather than editing the theme's tokens",
      () =>
        expectIntent(
          { message: "apply the dark theme to the title", scope: "instance", hasSelectedNode: true },
          "set_node_theme",
        ),
      LIVE_TIMEOUT_MS,
    )
  })
})
