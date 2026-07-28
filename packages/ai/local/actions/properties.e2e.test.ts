import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

import { resolveContext } from "../editor-context"
import { isOllamaReachable } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import { executeSetProperties } from "./properties"
import { executeRemoveInstance } from "./remove-duplicate"

const ollamaUp = await isOllamaReachable()
const describeIfOllama = ollamaUp ? describe : describe.skip
const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:4b"
// A full family run is several sequential model calls.
const LIVE_TIMEOUT_MS = 120_000

/** The first descendant of the button default variant with the given catalog id. */
function findDefaultVariantChild(
  workspace: Workspace,
  catalogId: string,
): string | undefined {
  const board = workspace.boards[ComponentId.BUTTON]
  if (!board || !isComponentBoard(board)) return undefined
  const defaultVariant = board.variants[0]
  if (!defaultVariant) return undefined
  let found: string | undefined
  walkBoardTreeRefs([defaultVariant], (ref) => {
    const node = workspace.nodes[ref.id]
    if (!node) return
    if (getNodeCatalogId(node, workspace) === catalogId) {
      found = ref.id
      return true
    }
  })
  return found
}

/**
 * Builds a turn context over ONE workspace instance. Node ids are random per
 * addComponent run, so the workspace the selection id came from must be the
 * workspace the turn runs against.
 */
function buildContext(
  workspace: Workspace,
  message: string,
  selectedNodeId: string,
): TurnContext {
  return {
    state: createTurnState(workspace),
    resolved: resolveContext({
      workspace,
      activeBoardKey: ComponentId.BUTTON,
      selectedNodeId,
      scope: "instance",
    }),
    message,
    model: MODEL,
    calls: [],
    steps: [],
  }
}

describeIfOllama("properties family end-to-end (live)", () => {
  it(
    "changes the selected text node's content through the full chain",
    async () => {
      const workspace = addComponent(
        { boardKey: ComponentId.BUTTON } as never,
        createEmptyWorkspace(),
      )
      const textNodeId = findDefaultVariantChild(workspace, "text")
      expect(textNodeId).toBeDefined()

      const context = buildContext(
        workspace,
        'change the text to "Buy now"',
        textNodeId!,
      )
      const outcome = await executeSetProperties(context)

      expect(outcome.kind).toBe("applied")
      expect(context.state.actions).toHaveLength(1)
      const action = context.state.actions[0] as {
        type: string
        payload: { nodeId: string; properties: Record<string, unknown> }
      }
      expect(action.type).toBe("set_node_properties")
      const content = action.payload.properties.content as {
        type: string
        value: string
      }
      expect(content.value).toContain("Buy now")
      // Several narrow calls ran; each recorded metrics and a step.
      expect(context.calls.length).toBeGreaterThanOrEqual(3)
      expect(context.steps.map((step) => step.name)).toContain(
        "resolve_property_value",
      )
    },
    LIVE_TIMEOUT_MS,
  )

  it(
    "removes the selected icon node",
    async () => {
      const workspace = addComponent(
        { boardKey: ComponentId.BUTTON } as never,
        createEmptyWorkspace(),
      )
      const iconNodeId = findDefaultVariantChild(workspace, "icon")
      expect(iconNodeId).toBeDefined()

      const context = buildContext(workspace, "remove this icon", iconNodeId!)
      const outcome = await executeRemoveInstance(context)

      expect(outcome.kind).toBe("applied")
      expect(context.state.actions).toHaveLength(1)
      expect(context.state.actions[0]?.type).toBe("remove_instance")
      // Core hides a default variant's schema children rather than deleting
      // them, so the node may survive as an entry -- commit() already
      // guaranteed the action changed the workspace, which is the contract.
      expect(context.state.workspace).not.toBe(workspace)
    },
    LIVE_TIMEOUT_MS,
  )
})
