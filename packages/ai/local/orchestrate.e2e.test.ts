import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

import type { AgentStreamEvent } from "../types"
import { isOllamaReachable } from "./ollama-client"
import { chatToActions } from "./orchestrate"

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
const LIVE_TIMEOUT_MS = 120_000

function findDefaultVariantChild(
  workspace: Workspace,
  catalogId: string,
): string | undefined {
  const board = workspace.boards[ComponentId.BUTTON]
  if (!board || !isComponentBoard(board)) return undefined
  let found: string | undefined
  walkBoardTreeRefs([board.variants[0]!], (ref) => {
    const node = workspace.nodes[ref.id]
    if (node && getNodeCatalogId(node, workspace) === catalogId) {
      found = ref.id
      return true
    }
  })
  return found
}

describeIfOllama("chatToActions (live)", () => {
  it(
    "runs a full property-edit turn: classify, resolve, commit, reply",
    async () => {
      const workspace = addComponent(
        { boardKey: ComponentId.BUTTON } as never,
        createEmptyWorkspace(),
      )
      const textNodeId = findDefaultVariantChild(workspace, "text")
      const events: AgentStreamEvent[] = []

      const result = await chatToActions({
        workspace,
        message: 'set the text to "Checkout"',
        activeBoardKey: ComponentId.BUTTON,
        selectedNodeId: textNodeId,
        scope: "instance",
        model: MODEL,
        onEvent: (event) => events.push(event),
      })

      expect(result.actions).toHaveLength(1)
      expect(result.actions[0]?.type).toBe("set_node_properties")
      // Assert the committed VALUE, not the reply text: replies are
      // model-phrased now, so asserting their wording would be flaky.
      const payload = (
        result.actions[0] as { payload: { properties: Record<string, unknown> } }
      ).payload
      expect(JSON.stringify(payload.properties)).toContain("Checkout")
      expect(result.reply.length).toBeGreaterThan(0)
      expect(result.workspace).not.toBe(workspace)
      expect(result.debug.metrics?.calls).toBeGreaterThanOrEqual(4)
      // The stream carried the staged pipeline and one final text event.
      const toolNames = events
        .filter((event) => event.type === "tool")
        .map((event) => event.name)
      expect(toolNames).toContain("route")
      expect(toolNames).toContain("decompose")
      expect(events.filter((event) => event.type === "text")).toHaveLength(1)
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "terminates a non-edit message with a reply and no actions",
    async () => {
      const workspace = addComponent(
        { boardKey: ComponentId.BUTTON } as never,
        createEmptyWorkspace(),
      )
      const result = await chatToActions({
        workspace,
        message: "thanks, looks great!",
        activeBoardKey: ComponentId.BUTTON,
        model: MODEL,
      })
      expect(result.actions).toHaveLength(0)
      expect(result.workspace).toBe(workspace)
      expect(result.reply.length).toBeGreaterThan(0)
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "executes a compound message as sequential steps on the working copy",
    async () => {
      const workspace = addComponent(
        { boardKey: ComponentId.BUTTON } as never,
        createEmptyWorkspace(),
      )
      const textNodeId = findDefaultVariantChild(workspace, "text")

      const result = await chatToActions({
        workspace,
        message: 'rename this to "CTA" and set its text to "Go"',
        activeBoardKey: ComponentId.BUTTON,
        selectedNodeId: textNodeId,
        scope: "instance",
        model: MODEL,
      })

      // Tolerant of model variance: the plan may fully apply (2 actions) or
      // stop at a clarification -- but it must never crash, must report
      // something, and anything committed must be one of the two edits.
      expect(result.reply.length).toBeGreaterThan(0)
      for (const action of result.actions) {
        expect(["set_node_label", "set_node_properties"]).toContain(action.type)
      }
      if (result.actions.length >= 2) {
        expect(result.workspace).not.toBe(workspace)
      }
    },
    LIVE_TIMEOUT_MS,
  )
})
