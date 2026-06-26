import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type {
  EntryNodeId,
  Instance,
  Variant,
  VariantId,
  Workspace,
  WorkspaceAction,
} from "../../types"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { workspaceReducer } from "../../reducers/reducer"
import { workspacePropagationService as service } from "./workspace-propagation.service"

const dispatch = (ws: Workspace, action: WorkspaceAction): Workspace =>
  workspaceReducer(ws, action)

const act = (type: string, payload: unknown): WorkspaceAction =>
  ({ type, payload }) as unknown as WorkspaceAction

const BOARD = ComponentId.BUTTON

/** Builds a workspace whose user variant holds an instance of the button default. */
function buildScenario() {
  let ws = dispatch(createEmptyWorkspace(), act("add_component", { boardKey: BOARD }))
  ws = dispatch(ws, act("add_variant", { boardKey: BOARD }))
  const defaultRootId = ws.boards[BOARD]!.variants[0]!.id as VariantId
  const uv1Id = ws.boards[BOARD]!.variants[1]!.id as VariantId
  ws = dispatch(ws, act("insert_default_instance", { boardKey: BOARD, parentId: uv1Id }))
  const childId = ws.boards[BOARD]!.variants[0]!.children![0]!.id as EntryNodeId
  return { ws, defaultRootId, uv1Id, childId }
}

describe("WorkspacePropagationService.propagateNodeOperation", () => {
  it("applies once for the none mode", () => {
    const { ws, defaultRootId } = buildScenario()
    let calls = 0
    const result = service.propagateNodeOperation({
      nodeId: defaultRootId,
      propagation: "none",
      apply: (_node, current) => {
        calls += 1
        return current
      },
      workspace: ws,
    })
    expect(calls).toBe(1)
    expect(result.boards).toBeTruthy()
  })

  it("resolves a wrapper operation result down to its workspace", () => {
    const { ws, defaultRootId } = buildScenario()
    const result = service.propagateNodeOperation({
      nodeId: defaultRootId,
      propagation: "none",
      apply: (_node, current) => ({ workspace: current, data: 7 }),
      workspace: ws,
    })
    expect(result.boards).toBeTruthy()
  })

  it("fans out to instances for the downstream mode", () => {
    const { ws, defaultRootId } = buildScenario()
    let calls = 0
    service.propagateNodeOperation({
      nodeId: defaultRootId,
      propagation: "downstream",
      apply: (_node: Variant | Instance, current) => {
        calls += 1
        return current
      },
      workspace: ws,
    })
    // The source variant plus the instance inserted into the user variant.
    expect(calls).toBeGreaterThanOrEqual(2)
  })

  it("resolves the variant root then fans out for the bidirectional mode", () => {
    const { ws, defaultRootId } = buildScenario()
    // The inserted default instance templates from the button default variant.
    const buttonInstanceId = Object.keys(ws.nodes).find((id) => {
      const node = ws.nodes[id]!
      return (
        node.type === "instance" &&
        typeof node.template === "string" &&
        node.template.includes(defaultRootId)
      )
    })!
    expect(buttonInstanceId).toBeTruthy()

    let calls = 0
    service.propagateNodeOperation({
      nodeId: buttonInstanceId as VariantId,
      propagation: "bidirectional",
      apply: (_node, current) => {
        calls += 1
        return current
      },
      workspace: ws,
    })
    expect(calls).toBeGreaterThanOrEqual(1)
  })

  it("throws for an invalid propagation mode", () => {
    const { ws, defaultRootId } = buildScenario()
    expect(() =>
      service.propagateNodeOperation({
        nodeId: defaultRootId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        propagation: "sideways" as any,
        apply: (_node, current) => current,
        workspace: ws,
      }),
    ).toThrow(/Invalid propagation/)
  })
})

describe("WorkspacePropagationService.propagatePositionalChildOperation", () => {
  it("applies directly to a root node that has no parent", () => {
    const { ws, defaultRootId } = buildScenario()
    let appliedTo: string | null = null
    service.propagatePositionalChildOperation({
      childId: defaultRootId,
      propagation: "none",
      applyToChild: (childId, current) => {
        appliedTo = childId
        return current
      },
      workspace: ws,
    })
    expect(appliedTo).toBe(defaultRootId)
  })

  it("resolves the positional child within the parent", () => {
    const { ws, childId } = buildScenario()
    let appliedTo: string | null = null
    const result = service.propagatePositionalChildOperation({
      childId,
      propagation: "none",
      applyToChild: (resolved, current) => {
        appliedTo = resolved
        return current
      },
      workspace: ws,
    })
    expect(appliedTo).toBe(childId)
    expect(result.boards).toBeTruthy()
  })
})

describe("WorkspacePropagationService.parseWorkspace", () => {
  it("parses a JSON string back into a workspace", () => {
    const ws = createEmptyWorkspace()
    expect(service.parseWorkspace(JSON.stringify(ws))).toEqual(ws)
  })
})
