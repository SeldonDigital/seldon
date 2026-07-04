import { describe, expect, it } from "vitest"

import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import {
  CURRENT_WORKSPACE_VERSION,
  migrateWorkspace,
} from "./migrate-workspace"

describe("migrateWorkspace", () => {
  it("exposes the current version constant", () => {
    expect(CURRENT_WORKSPACE_VERSION).toBe(9)
  })

  it("leaves a workspace already at the current version unchanged", () => {
    const workspace = createEmptyWorkspace()
    expect(migrateWorkspace(workspace)).toBe(workspace)
  })

  it("runs the baseline step for an older stored version", () => {
    const base = createEmptyWorkspace()
    const stored = { ...base, metadata: { ...base.metadata, version: 0 } }
    expect(migrateWorkspace(stored)).toBe(stored)
  })
})
