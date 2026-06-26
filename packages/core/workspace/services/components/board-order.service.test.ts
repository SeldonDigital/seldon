import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { getBoardOrder } from "../../helpers/components/board-sort-order"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { boardOrderService as svc } from "./board-order.service"

const seed = (): Workspace => {
  let ws = createEmptyWorkspace()
  ws = addComponent({ boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">, ws)
  ws = addComponent({ boardKey: ComponentId.TEXT } as ExtractPayload<"add_component">, ws)
  return ws
}

describe("getBoards", () => {
  it("returns every board sorted by stored order", () => {
    const ws = seed()
    const boards = svc.getBoards(ws)
    expect(boards.length).toBe(Object.keys(ws.boards).length)
    const orders = boards.map(getBoardOrder)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })
})

describe("realignBoardOrder", () => {
  it("assigns a contiguous, ascending order to all boards", () => {
    const ws = svc.realignBoardOrder(seed())
    const orders = svc.getBoards(ws).map(getBoardOrder)
    expect(orders).toEqual(orders.map((_, index) => index))
  })
})

describe("getPlaygrounds", () => {
  it("returns an array", () => {
    expect(Array.isArray(svc.getPlaygrounds(seed()))).toBe(true)
  })
})
