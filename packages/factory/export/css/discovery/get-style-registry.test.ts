import type { ComponentBoard, ExtractPayload, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import { describe, expect, it } from "vitest"

import { buildExportContext } from "../../../helpers/build-export-context"
import { buildStyleRegistry } from "./get-style-registry"

const workspace: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON] as ComponentBoard
const rootId = board.variants[0].id as string

describe("buildStyleRegistry", () => {
  it("assigns the default variant the bare component class", () => {
    const { parentIndex } = buildExportContext(workspace)
    const { nodeIdToClass } = buildStyleRegistry(workspace, false, parentIndex)
    expect(nodeIdToClass[rootId]).toBe("sdn-button")
  })

  it("produces a class table and a reverse lookup", () => {
    const { parentIndex } = buildExportContext(workspace)
    const { classes, classNameToNodeId } = buildStyleRegistry(
      workspace,
      false,
      parentIndex,
    )
    expect(Object.keys(classes).length).toBeGreaterThan(0)
    expect(classNameToNodeId["sdn-button"]).toBe(rootId)
  })

  it("records a tree depth for the root variant", () => {
    const { parentIndex } = buildExportContext(workspace)
    const { nodeTreeDepths } = buildStyleRegistry(workspace, false, parentIndex)
    expect(nodeTreeDepths[rootId]).toBe(0)
  })
})
