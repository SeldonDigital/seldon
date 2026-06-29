import { describe, expect, it } from "vitest"

import type { ComponentBoard, ExtractPayload, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { buildExportContext, getStyleContext } from "./build-export-context"

const workspace: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON] as ComponentBoard
const rootId = board.variants[0].id as string
const childId = board.variants[0].children![0].id as string

describe("buildExportContext", () => {
  it("returns a parent index map", () => {
    const { parentIndex } = buildExportContext(workspace)
    expect(parentIndex).toBeInstanceOf(Map)
  })

  it("maps a child node to its parent", () => {
    const { parentIndex } = buildExportContext(workspace)
    expect(parentIndex.get(childId)).toBe(rootId)
  })

  it("has no parent for the root variant", () => {
    const { parentIndex } = buildExportContext(workspace)
    expect(parentIndex.get(rootId)).toBeUndefined()
  })
})

describe("getStyleContext", () => {
  it("builds a style context with computed properties and a theme", () => {
    const { parentIndex } = buildExportContext(workspace)
    const context = getStyleContext(rootId, workspace, parentIndex)
    expect(context.properties).toBeTruthy()
    expect(context.theme).toBeTruthy()
    expect(context.parentContext).toBeNull()
  })

  it("links a child context to its parent context", () => {
    const { parentIndex } = buildExportContext(workspace)
    const context = getStyleContext(childId, workspace, parentIndex)
    expect(context.parentContext).not.toBeNull()
  })
})
