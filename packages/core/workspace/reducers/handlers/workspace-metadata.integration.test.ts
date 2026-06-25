import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { resetWorkspaceIntent } from "./reset/reset-workspace-intent"
import { resetWorkspaceLabel } from "./reset/reset-workspace-label"
import { resetWorkspaceLastUpdate } from "./reset/reset-workspace-last-update"
import { resetWorkspaceLicense } from "./reset/reset-workspace-license"
import { resetWorkspaceOwner } from "./reset/reset-workspace-owner"
import { resetWorkspaceTags } from "./reset/reset-workspace-tags"
import { setWorkspaceIntent } from "./set/set-workspace-intent"
import { setWorkspaceLabel } from "./set/set-workspace-label"
import { setWorkspaceLastUpdate } from "./set/set-workspace-last-update"
import { setWorkspaceLicense } from "./set/set-workspace-license"
import { setWorkspaceOwner } from "./set/set-workspace-owner"
import { setWorkspaceTags } from "./set/set-workspace-tags"
import { setWorkspaceVersion } from "./set/set-workspace-version"

const empty = () => createEmptyWorkspace()
const p = <T>(value: T) => ({ value }) as never

describe("workspace metadata string fields", () => {
  const cases: Array<{
    field: "owner" | "label" | "intent" | "lastUpdate"
    set: (v: string | undefined, ws: ReturnType<typeof empty>) => ReturnType<typeof empty>
    reset: (ws: ReturnType<typeof empty>) => ReturnType<typeof empty>
  }> = [
    {
      field: "owner",
      set: (v, ws) => setWorkspaceOwner(p(v), ws),
      reset: (ws) => resetWorkspaceOwner({} as ExtractPayload<"reset_workspace_owner">, ws),
    },
    {
      field: "label",
      set: (v, ws) => setWorkspaceLabel(p(v), ws),
      reset: (ws) => resetWorkspaceLabel({} as ExtractPayload<"reset_workspace_label">, ws),
    },
    {
      field: "intent",
      set: (v, ws) => setWorkspaceIntent(p(v), ws),
      reset: (ws) => resetWorkspaceIntent({} as ExtractPayload<"reset_workspace_intent">, ws),
    },
    {
      field: "lastUpdate",
      set: (v, ws) => setWorkspaceLastUpdate(p(v), ws),
      reset: (ws) => resetWorkspaceLastUpdate({} as ExtractPayload<"reset_workspace_last_update">, ws),
    },
  ]

  it.each(cases)("$field sets, clears, and resets", ({ field, set, reset }) => {
    const assigned = set("value-x", empty())
    expect(assigned.metadata[field]).toBe("value-x")

    const cleared = set(undefined, assigned)
    expect(cleared.metadata[field]).toBeUndefined()

    expect(reset(assigned).metadata[field]).toBeUndefined()
  })
})

describe("setWorkspaceTags", () => {
  it("sets and clears tags", () => {
    const assigned = setWorkspaceTags(p(["a", "b"]), empty())
    expect(assigned.metadata.tags).toEqual(["a", "b"])
    expect(setWorkspaceTags(p(undefined), assigned).metadata.tags).toBeUndefined()
    expect(
      resetWorkspaceTags({} as ExtractPayload<"reset_workspace_tags">, assigned).metadata.tags,
    ).toBeUndefined()
  })
})

describe("setWorkspaceLicense", () => {
  it("sets and clears license", () => {
    const assigned = setWorkspaceLicense(p({ spdx: "MIT" }), empty())
    expect(assigned.metadata.license).toEqual({ spdx: "MIT" })
    expect(setWorkspaceLicense(p(undefined), assigned).metadata.license).toBeUndefined()
    expect(
      resetWorkspaceLicense({} as ExtractPayload<"reset_workspace_license">, assigned).metadata
        .license,
    ).toBeUndefined()
  })
})

describe("setWorkspaceVersion", () => {
  it("sets the version number", () => {
    expect(setWorkspaceVersion(p(7), empty()).metadata.version).toBe(7)
  })
})
