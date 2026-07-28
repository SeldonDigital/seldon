import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { resolveNodeTarget } from "./resolve-target"

const BUTTON_DEFAULT_NODE_ID = "component-button-default"

function seededWorkspace() {
  return addComponent(
    { boardKey: ComponentId.BUTTON } as never,
    createEmptyWorkspace(),
  )
}

describe("resolveNodeTarget", () => {
  it("resolves the selection sentinel to the selected node", () => {
    const workspace = seededWorkspace()
    const result = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      BUTTON_DEFAULT_NODE_ID,
      undefined,
      "selection",
      undefined,
      "instance",
    )
    expect(result).toEqual({ kind: "resolved", nodeId: BUTTON_DEFAULT_NODE_ID })
  })

  it("resolves an explicit nodeId that exists", () => {
    const workspace = seededWorkspace()
    const result = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      undefined,
      undefined,
      { nodeId: BUTTON_DEFAULT_NODE_ID },
      undefined,
      "instance",
    )
    expect(result).toEqual({ kind: "resolved", nodeId: BUTTON_DEFAULT_NODE_ID })
  })

  it("returns a terminal message when nothing is selected and there is no match hint", () => {
    const workspace = seededWorkspace()
    const result = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      undefined,
      ComponentId.BUTTON,
      "selection",
      undefined,
      "board",
    )
    expect(result.kind).toBe("message")
    if (result.kind === "message") {
      expect(result.text).toContain("board")
    }
  })

  it("returns a not-found message rather than guessing, for an unknown id with no matches", () => {
    const workspace = seededWorkspace()
    const result = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      undefined,
      undefined,
      { nodeId: "does-not-exist" },
      undefined,
      "instance",
    )
    expect(result.kind).toBe("message")
    if (result.kind === "message") {
      expect(result.text).toContain("No node matches")
    }
  })
})
