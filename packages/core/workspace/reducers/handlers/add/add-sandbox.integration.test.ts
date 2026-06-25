import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addPlayground } from "./add-playground"
import { addSandbox } from "./add-sandbox"

const workspace = addPlayground(
  { boardKey: "pg-main" } as ExtractPayload<"add_playground">,
  createEmptyWorkspace(),
)

describe("addSandbox", () => {
  it("mints a sandbox node and appends it to the playground", () => {
    const before = workspace.playgrounds["pg-main"]!.variants.length

    const next = addSandbox(
      { playgroundKey: "pg-main" } as ExtractPayload<"add_sandbox">,
      workspace,
    )

    const variants = next.playgrounds["pg-main"]!.variants
    expect(variants).toHaveLength(before + 1)
    expect(next.nodes[variants[variants.length - 1]!.id]).toBeDefined()
  })

  it("is a no-op for an unknown playground", () => {
    const result = addSandbox(
      { playgroundKey: "ghost" } as ExtractPayload<"add_sandbox">,
      workspace,
    )
    expect(result).toBe(workspace)
  })
})
