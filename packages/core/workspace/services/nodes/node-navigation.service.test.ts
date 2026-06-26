import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ComponentBoard, ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import {
  resolveFirstChildNodeId,
  resolveNextSiblingNodeId,
  resolveOriginalNodeId,
  resolveParentNodeId,
  resolvePreviousSiblingNodeId,
  resolveSourceNodeId,
} from "./node-navigation.service"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const root = (ws.boards[boardKey] as ComponentBoard).variants[0]
const rootId = root.id as string
const childIds = (root.children as { id: string }[]).map((c) => c.id)

describe("resolveParentNodeId", () => {
  it("walks one level up, null at the root", () => {
    expect(resolveParentNodeId(ws, childIds[0]!)).toBe(rootId)
    expect(resolveParentNodeId(ws, rootId)).toBeNull()
  })
})

describe("resolveFirstChildNodeId", () => {
  it("returns the first structural child", () => {
    expect(resolveFirstChildNodeId(ws, rootId)).toBe(childIds[0])
  })
})

describe("sibling navigation", () => {
  it("returns null before the first child", () => {
    expect(resolvePreviousSiblingNodeId(ws, childIds[0]!)).toBeNull()
  })

  it("returns the next sibling or null at the end", () => {
    expect(resolveNextSiblingNodeId(ws, childIds[0]!)).toBe(childIds[1] ?? null)
  })
})

describe("template chain navigation", () => {
  it("treats a catalog-rooted variant as its own original", () => {
    expect(resolveOriginalNodeId(ws, rootId)).toBe(rootId)
    expect(resolveSourceNodeId(ws, rootId)).toBeNull()
    expect(resolveOriginalNodeId(ws, "missing")).toBeNull()
  })
})
