import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import type { Action } from "../../types"
import { check } from "./check"
import { validateAction } from "./validate-action"
import { WorkspaceValidationError } from "./workspace-validation-error"

const addComponentAction = {
  type: "add_component",
  payload: { boardKey: ComponentId.BUTTON },
} as unknown as Action

describe("check", () => {
  it("passes for a truthy condition and throws otherwise", () => {
    expect(() => check(1, "ok")).not.toThrow()
    expect(() => check(0, "boom")).toThrow("boom")
  })
})

describe("WorkspaceValidationError", () => {
  it("carries the offending action and a name", () => {
    const error = new WorkspaceValidationError("bad", addComponentAction)
    expect(error.name).toBe("WorkspaceValidationError")
    expect(error.action).toBe(addComponentAction)
  })
})

describe("validateAction", () => {
  it("allows adding a component when its board is free", () => {
    expect(() =>
      validateAction(createEmptyWorkspace(), addComponentAction),
    ).not.toThrow()
  })

  it("rejects adding a component whose board already exists", () => {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    expect(() => validateAction(workspace, addComponentAction)).toThrow()
  })
})
