/**
 * Pins phase 2a of the descriptor/count work: queries whose describing words
 * ("last", "recipe", "the two ... about cars") used to die in the ask or
 * over-match now resolve to the RIGHT nodes, not merely the right number of
 * nodes. Identity assertions on purpose: the eval harness scores resolution
 * by count, so a wrong-node pick with the right cardinality would read as a
 * pass there. Env-gated on SELDON_AI_LIVE; needs Ollama and the embedding
 * model.
 */
import { describe, expect, it } from "vitest"
import type { BoardKey } from "@seldon/core/workspace/types"

import { resolveContext } from "../local/editor-context"
import { resolveTargetWithHint } from "../local/resolvers/resolve-target-with-hint"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import {
  TEXT_LIST_BOARD,
  TEXT_LIST_TOPICS,
  seedTextListWorkspace,
} from "./seed"

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b"

/** Topic index of the recipe text in {@link TEXT_LIST_TOPICS}. */
const RECIPE_INDEX = TEXT_LIST_TOPICS.findIndex((topic) =>
  topic.includes("recipe"),
)

describe.skipIf(!process.env.SELDON_AI_LIVE)(
  "live target resolution: descriptors and bounded counts",
  () => {
    async function resolveFor(message: string) {
      const { workspace, textNodeIds } = seedTextListWorkspace()
      const context: TurnContext = {
        state: createTurnState(workspace),
        resolved: resolveContext({
          workspace,
          activeBoardKey: TEXT_LIST_BOARD as BoardKey,
          scope: "board",
        }),
        message,
        model: MODEL,
        calls: [],
        steps: [],
      }
      const resolution = await resolveTargetWithHint(context)
      return { resolution, textNodeIds }
    }

    it(
      'resolves "the last text" to the bottom text of the column',
      async () => {
        const { resolution, textNodeIds } = await resolveFor(
          "make the last text bold",
        )
        expect(resolution.kind).toBe("resolved")
        if (resolution.kind !== "resolved") return
        expect(resolution.nodeId).toBe(textNodeIds[textNodeIds.length - 1])
      },
      120_000,
    )

    it(
      'resolves "translate the recipe text" to the text about the recipe',
      async () => {
        const { resolution, textNodeIds } = await resolveFor(
          "translate the recipe text into Dutch",
        )
        expect(resolution.kind).toBe("resolved")
        if (resolution.kind !== "resolved") return
        expect(resolution.nodeId).toBe(textNodeIds[RECIPE_INDEX])
      },
      120_000,
    )

    it(
      'narrows "the top two texts" to exactly the first two, in order',
      async () => {
        const { resolution, textNodeIds } = await resolveFor(
          "make the top two texts bold",
        )
        expect(resolution.kind).toBe("resolved-many")
        if (resolution.kind !== "resolved-many") return
        expect(resolution.nodeIds).toEqual([textNodeIds[0], textNodeIds[1]])
      },
      120_000,
    )

    it(
      'narrows "the two texts about cars" to two of the car texts',
      async () => {
        const { resolution, textNodeIds } = await resolveFor(
          "make the two texts about cars bold",
        )
        expect(resolution.kind).toBe("resolved-many")
        if (resolution.kind !== "resolved-many") return
        expect(resolution.nodeIds).toHaveLength(2)
        const carTextIds = textNodeIds.filter((_, index) =>
          /sedan|SUV|vehicle/i.test(TEXT_LIST_TOPICS[index]!),
        )
        for (const nodeId of resolution.nodeIds) {
          expect(carTextIds).toContain(nodeId)
        }
      },
      120_000,
    )
  },
)
