import { collectPropertyValueErrors } from "@seldon/core/properties/schemas/helpers/validate-property-entry"
import type { Theme } from "@seldon/core/themes/types"
import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"
import { describe, expect, it } from "vitest"

import { normalizeActions } from "../../repair/normalize-actions"
import { isOllamaReachable } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import { resolveColorValue } from "./resolve-color-value"

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
const LIVE_TIMEOUT_MS = 60_000

/** An empty workspace resolves to the stock themes, so real swatches exist. */
const EMPTY_WORKSPACE = {} as Workspace
const firstStockTheme = computeWorkspaceThemes(
  EMPTY_WORKSPACE,
)[0] as unknown as Theme

function colorContext(message: string): TurnContext {
  return {
    state: createTurnState(EMPTY_WORKSPACE),
    resolved: {} as TurnContext["resolved"],
    message,
    model: MODEL,
    calls: [],
    steps: [],
  }
}

/**
 * Runs a resolved value through the exact repair-then-validate path a commit
 * takes, returning Core's errors. Passing here means the reducer would have
 * accepted the write -- the regression the color pipeline exists to prevent
 * is a resolved value that Core then rejects.
 */
function commitGauntletErrors(resolvedValue: unknown) {
  const { actions } = normalizeActions([
    {
      type: "set_node_properties",
      payload: { nodeId: "n1", properties: { color: resolvedValue } },
    } as unknown as WorkspaceAction,
  ])
  const committedAction = actions[0] as unknown as {
    payload: { properties: { color: unknown } }
  }
  return collectPropertyValueErrors(
    "color",
    committedAction.payload.properties.color,
    firstStockTheme,
  )
}

describeIfOllama("resolveColorValue (live)", () => {
  it(
    "resolves a CSS color word to a value Core accepts",
    async () => {
      const resolution = await resolveColorValue(
        colorContext("make all the chips red"),
        "color",
        "color",
      )
      expect(resolution.kind).toBe("resolved")
      if (resolution.kind === "resolved") {
        expect(commitGauntletErrors(resolution.value)).toEqual([])
      }
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "resolves a named swatch to its full @swatch reference",
    async () => {
      const resolution = await resolveColorValue(
        colorContext("use the primary swatch for the text"),
        "color",
        "color",
      )
      expect(resolution.kind).toBe("resolved")
      if (resolution.kind === "resolved") {
        expect(resolution.value).toEqual({
          type: "theme.categorical",
          value: "@swatch.primary",
        })
        expect(commitGauntletErrors(resolution.value)).toEqual([])
      }
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "resolves a fancy color name through the css fallback to a valid hex",
    async () => {
      const resolution = await resolveColorValue(
        colorContext("make it terracotta"),
        "color",
        "color",
      )
      expect(resolution.kind).toBe("resolved")
      if (resolution.kind === "resolved") {
        expect(commitGauntletErrors(resolution.value)).toEqual([])
      }
    },
    LIVE_TIMEOUT_MS,
  )
})
