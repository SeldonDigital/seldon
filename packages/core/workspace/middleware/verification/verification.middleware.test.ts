import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import type { Action, Workspace } from "../../types"
import { WorkspaceValidationError } from "../validation/workspace-validation-error"
import { workspaceVerificationMiddleware } from "./verification.middleware"

const action = { type: "noop" } as unknown as Action

const baseWorkspace = addComponent(
  { boardKey: ComponentId.BUTTON } as never,
  createEmptyWorkspace(),
)

describe("workspaceVerificationMiddleware", () => {
  it("returns the next workspace when integrity holds", () => {
    const run = workspaceVerificationMiddleware((workspace) => workspace)
    expect(run(baseWorkspace, action)).toBe(baseWorkspace)
  })

  it("wraps an integrity failure as a WorkspaceValidationError", () => {
    const corrupt = structuredClone(baseWorkspace) as Workspace
    corrupt.boards[ComponentId.BUTTON]!.variants.push({
      id: "missing-node",
      children: [],
    } as never)

    const run = workspaceVerificationMiddleware((workspace) => workspace)
    expect(() => run(corrupt, action)).toThrow(WorkspaceValidationError)
  })
})
