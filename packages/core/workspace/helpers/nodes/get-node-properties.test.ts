import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ComponentBoard, ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { getNodeById } from "./get-node-by-id"
import { getNodeProperties } from "./get-node-properties"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as ComponentBoard).variants[0].id as string

describe("getNodeById", () => {
  it("returns a node and throws for a missing id", () => {
    expect(getNodeById(rootId, ws).id).toBe(rootId)
    expect(() => getNodeById("missing", ws)).toThrow()
  })
})

describe("getNodeProperties", () => {
  it("merges schema and override chain for a node", () => {
    const props = getNodeProperties(ws.nodes[rootId]!, ws)
    expect(typeof props).toBe("object")
    expect(Object.keys(props).length).toBeGreaterThan(0)
  })

  it("merges component defaults for a board", () => {
    const props = getNodeProperties(board, ws)
    expect(typeof props).toBe("object")
  })
})
