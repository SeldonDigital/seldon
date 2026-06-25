import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../../index"
import { getBoardOrder } from "../../../helpers/components/board-sort-order"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { reorderBoard } from "./reorder-board"
import { reorderVariantInBoard } from "./reorder-variant-in-board"

const boardKey = ComponentId.BUTTON

const componentWorkspace = () =>
  addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

describe("reorderBoard", () => {
  it("moves a board to the front of the order", () => {
    const ws = componentWorkspace()
    const moved = reorderBoard(
      { boardKey, newIndex: 0 } as ExtractPayload<"reorder_board">,
      ws,
    )
    const movedOrder = getBoardOrder((moved.boards[boardKey] as any))
    const others = Object.entries(moved.boards)
      .filter(([k]) => k !== boardKey)
      .map(([, b]) => getBoardOrder(b as any))
    expect(Math.min(movedOrder, ...others)).toBe(movedOrder)
  })

  it("is a no-op for an out-of-range index", () => {
    const ws = componentWorkspace()
    const result = reorderBoard(
      { boardKey, newIndex: -1 } as ExtractPayload<"reorder_board">,
      ws,
    )
    expect(result).toEqual(ws)
  })
})

describe("reorderVariantInBoard", () => {
  it("is a no-op for the default variant (pinned at index 0)", () => {
    const ws = componentWorkspace()
    const rootId = (ws.boards[boardKey] as any).variants[0].id as string
    const result = reorderVariantInBoard(
      { variantRootId: rootId, newIndex: 1 } as ExtractPayload<"reorder_variant_in_board">,
      ws,
    )
    expect(result).toBe(ws)
  })

  it("is a no-op for a non-variant node", () => {
    const ws = componentWorkspace()
    const instanceId = Object.values(ws.nodes).find(
      (n: any) => n.type === "instance",
    )!.id as string
    const result = reorderVariantInBoard(
      { variantRootId: instanceId, newIndex: 1 } as ExtractPayload<"reorder_variant_in_board">,
      ws,
    )
    expect(result).toBe(ws)
  })
})
