import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addCustomState } from "./add/add-custom-state"
import { renameCustomState } from "./set/rename-custom-state"

const addWarning = (workspace = createEmptyWorkspace()) =>
  addCustomState(
    { key: "warning", label: "Warning" } as ExtractPayload<"add_custom_state">,
    workspace,
  )

describe("addCustomState", () => {
  it("registers a new custom state entry", () => {
    const workspace = addWarning()
    expect(workspace.metadata.customStates).toContainEqual({
      key: "warning",
      label: "Warning",
    })
  })

  it("is a no-op for a reserved state name", () => {
    const workspace = createEmptyWorkspace()
    const result = addCustomState(
      { key: "hover", label: "Hover" } as ExtractPayload<"add_custom_state">,
      workspace,
    )
    expect(result).toBe(workspace)
  })

  it("is a no-op when the key already exists", () => {
    const once = addWarning()
    expect(addWarning(once)).toBe(once)
  })
})

describe("renameCustomState", () => {
  it("updates the label while keeping the key", () => {
    const workspace = addWarning()
    const renamed = renameCustomState(
      { key: "warning", label: "Caution" } as ExtractPayload<"rename_custom_state">,
      workspace,
    )
    expect(renamed.metadata.customStates).toContainEqual({
      key: "warning",
      label: "Caution",
    })
  })

  it("is a no-op for an unknown key", () => {
    const workspace = addWarning()
    const result = renameCustomState(
      { key: "ghost", label: "Ghost" } as ExtractPayload<"rename_custom_state">,
      workspace,
    )
    expect(result).toBe(workspace)
  })
})
