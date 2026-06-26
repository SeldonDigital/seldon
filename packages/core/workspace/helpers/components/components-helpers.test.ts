import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { getBoardOrder, setBoardOrder } from "./board-sort-order"
import {
  DEFAULT_THEME_BOARD_AUTHOR,
  getDefaultBoardLabel,
} from "./default-board-metadata"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "./entry-node-ids"
import { findBoardTreeCycleId } from "./find-tree-cycle"
import { getChildrenIds } from "./get-children-ids"
import { isBoard } from "./is-board"
import { isResourceType } from "./is-resource-type"

const componentWorkspace = () =>
  addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const boardKeyByType = (ws: Workspace, type: string) =>
  Object.keys(ws.boards).find((k) => (ws.boards as any)[k].type === type)!

describe("board-sort-order", () => {
  it("defaults to 0 and round-trips a set value", () => {
    const board = { variants: [] } as any
    expect(getBoardOrder(board)).toBe(0)
    setBoardOrder(board, 5)
    expect(getBoardOrder(board)).toBe(5)
  })
})

describe("entry-node-ids", () => {
  it("formats default and schema-variant node ids", () => {
    expect(componentBoardDefaultNodeId("button")).toBe(
      "component-button-default",
    )
    expect(componentBoardSchemaVariantNodeId("button", "v1")).toBe(
      "component-button-v1",
    )
  })
})

describe("isBoard", () => {
  it("distinguishes catalog rows from node entries", () => {
    expect(isBoard({ variants: [] } as any)).toBe(true)
    expect(isBoard({ id: "n", type: "instance" } as any)).toBe(false)
  })
})

describe("isResourceType", () => {
  it("is true for resource boards and false for component boards", () => {
    const ws = componentWorkspace()
    const fcKey = boardKeyByType(ws, "font-collection")
    expect(isResourceType((ws.boards as any)[fcKey])).toBe(true)
    expect(isResourceType((ws.boards as any)[ComponentId.BUTTON])).toBe(false)
  })
})

describe("findBoardTreeCycleId", () => {
  it("returns null for an acyclic workspace", () => {
    expect(findBoardTreeCycleId(componentWorkspace())).toBeNull()
  })

  it("finds the back-edge id in a cyclic tree", () => {
    const a: any = { id: "a", children: [] }
    const b: any = { id: "b", children: [a] }
    a.children.push(b)
    const ws = { boards: { x: { variants: [a] } } } as unknown as Workspace
    expect(findBoardTreeCycleId(ws)).toBe("a")
  })
})

describe("getChildrenIds", () => {
  it("lists direct children of the default variant root", () => {
    const ws = componentWorkspace()
    const board = (ws.boards as any)[ComponentId.BUTTON]
    const rootId = board.variants[0].id
    expect(getChildrenIds(board, rootId).length).toBeGreaterThan(0)
  })

  it("returns an empty array for an unknown parent id", () => {
    const ws = componentWorkspace()
    const board = (ws.boards as any)[ComponentId.BUTTON]
    expect(getChildrenIds(board, "nope")).toEqual([])
  })
})

describe("default-board-metadata", () => {
  it("exposes the default author and a board label", () => {
    expect(DEFAULT_THEME_BOARD_AUTHOR).toBe("Seldon Digital")
    const ws = componentWorkspace()
    const label = getDefaultBoardLabel(
      ComponentId.BUTTON,
      (ws.boards as any)[ComponentId.BUTTON],
    )
    expect(typeof label).toBe("string")
    expect(label.length).toBeGreaterThan(0)
  })
})
