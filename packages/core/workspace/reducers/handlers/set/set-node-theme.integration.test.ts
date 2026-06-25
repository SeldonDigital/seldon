import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { setNodeTheme } from "./set-node-theme"

const themeId = "theme-seldon-default"

describe("setNodeTheme", () => {
  it("assigns a theme reference to a variant node", () => {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
      createEmptyWorkspace(),
    )
    const nodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

    const next = setNodeTheme(
      { nodeId, theme: themeId } as ExtractPayload<"set_node_theme">,
      workspace,
    )

    expect(next.nodes[nodeId]!.theme).toBe(themeId)
  })
})
