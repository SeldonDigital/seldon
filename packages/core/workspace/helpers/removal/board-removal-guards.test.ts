import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { shouldBlockDeletableBoardRemoval } from "./board-removal-guards"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!

describe("shouldBlockDeletableBoardRemoval", () => {
  it("does not block a component board whose variants are unused", () => {
    expect(shouldBlockDeletableBoardRemoval(board, ws, boardKey)).toBe(false)
  })
})
