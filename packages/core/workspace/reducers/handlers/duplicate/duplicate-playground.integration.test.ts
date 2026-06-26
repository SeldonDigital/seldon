import { describe, expect, it } from "vitest"

import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import type { ExtractPayload } from "../../../types"
import { addPlayground } from "../add/add-playground"
import { duplicatePlayground } from "./duplicate-playground"

const workspace = addPlayground(
  { boardKey: "pg-source" } as ExtractPayload<"add_playground">,
  createEmptyWorkspace(),
)

describe("duplicatePlayground", () => {
  it("clones a playground under a new key", () => {
    const next = duplicatePlayground(
      {
        sourcePlaygroundKey: "pg-source",
        newPlaygroundKey: "pg-copy",
        label: "Playground Copy",
      } as ExtractPayload<"duplicate_playground">,
      workspace,
    )

    expect(next.playgrounds["pg-copy"]).toBeDefined()
    expect(next).not.toBe(workspace)
  })
})
