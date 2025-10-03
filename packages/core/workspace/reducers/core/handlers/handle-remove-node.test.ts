import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { Display } from "../../../../properties/constants"
import { InstanceId, VariantId, Workspace } from "../../../types"
import { handleRemoveNode } from "./handle-remove-node"

describe("handleRemoveNode", () => {
  it("should hide schema-defined instances and delete manually added instances", () => {
    const workspace = { ...WORKSPACE_FIXTURE } as Workspace

    const buttonId = "variant-button-default" as VariantId
    const button = workspace.byId[buttonId]
    const buttonIconId = button.children![0] as InstanceId
    const buttonBarId = "variant-barButtons-default" as VariantId
    const buttonBar = workspace.byId[buttonBarId]
    const buttonBarButtonId = buttonBar.children![0] as InstanceId
    const buttonBarButton = workspace.byId[buttonBarButtonId]
    const bbButtonIconId = buttonBarButton.children![0] as InstanceId

    // Removing button.icon (schema-defined instance - fromSchema is true)
    const result = handleRemoveNode({ nodeId: buttonIconId }, workspace)

    // The icon inside button should be hidden since it's schema-defined (fromSchema is true)
    expect(workspace.byId[buttonId].children).toContain(buttonIconId) // was there
    expect(result.byId[buttonId].children).toContain(buttonIconId) // still there (hidden, not removed)
    expect(workspace.byId[buttonIconId]).toBeDefined() // was there
    expect(result.byId[buttonIconId]).toBeDefined() // still there (hidden, not deleted)
    // Check that the display property is set to EXCLUDE (hidden)
    expect(result.byId[buttonIconId].properties.display?.value).toBe(
      Display.EXCLUDE,
    )

    // The icon inside button bar buttons should also be hidden since they're schema-defined
    expect(workspace.byId[buttonBarButtonId].children).toContain(bbButtonIconId) // was there
    expect(result.byId[buttonBarButtonId].children).toContain(bbButtonIconId) // still there (hidden, not removed)
    expect(workspace.byId[bbButtonIconId]).toBeDefined() // was there
    expect(result.byId[bbButtonIconId]).toBeDefined() // still there (hidden, not deleted)
    // Check that the display property is set to EXCLUDE (hidden)
    expect(result.byId[bbButtonIconId].properties.display?.value).toBe(
      Display.EXCLUDE,
    )
  })

  it("should remove a variant and all its child nodes while preserving other variants", () => {
    const workspace = { ...WORKSPACE_FIXTURE } as Workspace

    const result = handleRemoveNode(
      {
        nodeId: "variant-button-user",
      },
      workspace,
    )

    // Button variant should be removed
    expect(result.byId["variant-button-user"]).toBeUndefined()
    // Button children should be removed
    expect(result.byId["child-icon-user"]).toBeUndefined()
    expect(result.byId["child-label-user"]).toBeUndefined()
    // Other variants should remain
    expect(result.byId["variant-icon-default"]).toBeDefined()
    expect(result.byId["variant-label-default"]).toBeDefined()
    // Button board should be updated
    const buttonBoard = result.boards.button
    expect(buttonBoard).toBeDefined()
    expect(buttonBoard!.variants).not.toContain("variant-button-user")
  })
})
