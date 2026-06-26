import { describe, expect, it } from "vitest"

import { CURRENT_WORKSPACE_VERSION } from "../middleware/migration/migrate-workspace"
import { createEmptyWorkspace } from "./create-empty-workspace"

describe("createEmptyWorkspace", () => {
  it("stamps the current version and seeds resource boards", () => {
    const workspace = createEmptyWorkspace()

    expect(workspace.metadata.version).toBe(CURRENT_WORKSPACE_VERSION)
    expect(Object.keys(workspace.themes).length).toBeGreaterThan(0)
    expect(workspace.nodes).toEqual({})
  })
})
