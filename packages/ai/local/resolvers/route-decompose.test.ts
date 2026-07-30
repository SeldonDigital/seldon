import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { resolveContext } from "../editor-context"
import { isOllamaReachable } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import { decompose } from "./decompose"
import { route } from "./route"

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
const LIVE_TIMEOUT_MS = 60_000

function buildContext(message: string): TurnContext {
  const workspace = addComponent(
    { boardKey: ComponentId.BUTTON } as never,
    createEmptyWorkspace(),
  )
  return {
    state: createTurnState(workspace),
    resolved: resolveContext({ workspace, activeBoardKey: ComponentId.BUTTON }),
    message,
    model: MODEL,
    calls: [],
    steps: [],
  }
}

describeIfOllama("route (live)", () => {
  it(
    "routes an edit request to process",
    async () => {
      const decision = await route(buildContext("make the title red"))
      expect(decision.kind).toBe("process")
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "answers a greeting directly",
    async () => {
      const decision = await route(buildContext("hey, what can you do?"))
      expect(decision.kind).toBe("reply")
      if (decision.kind === "reply") {
        expect(decision.message.length).toBeGreaterThan(0)
      }
    },
    LIVE_TIMEOUT_MS,
  )
})

describeIfOllama("decompose (live)", () => {
  it(
    "keeps a single instruction as one step",
    async () => {
      const steps = await decompose(buildContext("make the title red"))
      expect(steps).toHaveLength(1)
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "splits a compound request into self-contained sentences",
    async () => {
      const steps = await decompose(
        buildContext("add a card and make its title red"),
      )
      expect(steps.length).toBe(2)
      // The second step must be self-contained: no dangling pronoun as the
      // subject -- it should mention the card explicitly.
      expect(steps[1]!.toLowerCase()).toContain("card")
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "does not over-split a single multi-value edit",
    async () => {
      const steps = await decompose(
        buildContext("make the title bold and italic"),
      )
      expect(steps).toHaveLength(1)
    },
    LIVE_TIMEOUT_MS,
  )
})
