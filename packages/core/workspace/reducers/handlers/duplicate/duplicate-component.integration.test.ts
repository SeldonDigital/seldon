import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../types"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { duplicateComponent } from "./duplicate-component"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const sourceDefaultId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

describe("duplicateComponent", () => {
  it("clones a board under a new key with remapped node ids", () => {
    const next = duplicateComponent(
      {
        sourceBoardKey: ComponentId.BUTTON,
        newBoardKey: "buttonCopy",
        label: "Button Copy",
      } as ExtractPayload<"duplicate_component">,
      workspace,
    )

    const copy = next.boards["buttonCopy"]
    expect(copy).toBeDefined()
    expect(copy!.variants.length).toBeGreaterThan(0)

    const newDefaultId = copy!.variants[0]!.id
    expect(newDefaultId).not.toBe(sourceDefaultId)
    expect(next.nodes[newDefaultId]).toBeDefined()
    expect(next).not.toBe(workspace)
  })
})
