import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { resolveContext } from "../../editor-context"
import { isOllamaReachable } from "../../ollama-client"
import type { TurnContext } from "../../turn-context"
import { createTurnState } from "../../turn-state"
import { findNodeSemantic } from "./index"

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
const LIVE_TIMEOUT_MS = 120_000

describeIfOllama("findNodeSemantic (live)", () => {
  it(
    "resolves a spatial phrase to a real node on the board",
    async () => {
      const workspace = addComponent(
        { boardKey: ComponentId.BUTTON } as never,
        createEmptyWorkspace(),
      )
      const board = workspace.boards[ComponentId.BUTTON]
      expect(board && isComponentBoard(board)).toBe(true)
      const boardHasNoVariantTrees = !board || !isComponentBoard(board)
      if (boardHasNoVariantTrees) return

      // The "tools" variant holds three sibling buttons; its last child is
      // the ground truth for "the last button".
      const tools = board.variants.find((variant) =>
        variant.id.includes("tools"),
      )
      expect(tools).toBeDefined()
      const siblings = (tools?.children ?? []).map((ref) => ref.id)
      expect(siblings.length).toBeGreaterThanOrEqual(3)

      const context: TurnContext = {
        state: createTurnState(workspace),
        resolved: resolveContext({
          workspace,
          activeBoardKey: ComponentId.BUTTON,
          scope: "board",
        }),
        message: "the last button in the toolbar",
        model: MODEL,
        calls: [],
        steps: [],
      }

      const findResult = await findNodeSemantic(context, "the last button")
      // The button board holds several variants, and EACH variant row has a
      // "last" button -- so "the last button" is genuinely ambiguous here.
      // The old pipeline let the LLM tie-break silently pick one; the
      // contract now returns the tied cluster and asks. (A single row's
      // "the last button" resolves deterministically -- covered by the
      // spatialTieBreak unit tests.)
      expect(findResult.kind).toBe("message")
      if (findResult.kind === "message") {
        expect(findResult.reason).toBe("several")
        // The ask must offer real, existing nodes to choose from -- but the
        // ids travel as DATA on candidateIds, because this text reaches the
        // user word for word and an id in it reads as debug output.
        const candidateIds = findResult.candidateIds ?? []
        expect(candidateIds.length).toBeGreaterThanOrEqual(2)
        for (const nodeId of candidateIds) {
          expect(workspace.nodes[nodeId]).toBeDefined()
        }
        const bulletedChoices = findResult.text
          .split("\n")
          .filter((line) => line.startsWith("- "))
        expect(bulletedChoices).toHaveLength(candidateIds.length)
        expect(findResult.text).not.toContain("component-")
      }
    },
    LIVE_TIMEOUT_MS,
  )
})
