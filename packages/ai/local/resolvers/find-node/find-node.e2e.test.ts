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
      if (!board || !isComponentBoard(board)) return

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

      const result = await findNodeSemantic(context, "the last button")
      // The pipeline must resolve (embedding-only or via escalation), and to
      // a node that actually exists.
      expect(result.kind).toBe("resolved")
      if (result.kind === "resolved") {
        expect(workspace.nodes[result.nodeId]).toBeDefined()
      }
    },
    LIVE_TIMEOUT_MS,
  )
})
