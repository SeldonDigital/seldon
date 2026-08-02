import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { resolveClassTarget, resolveNodeTarget } from "./resolve-target"

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
    const resolution = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      BUTTON_DEFAULT_NODE_ID,
      undefined,
      "selection",
      undefined,
      "instance",
    )
    expect(resolution).toEqual({
      kind: "resolved",
      nodeId: BUTTON_DEFAULT_NODE_ID,
    })
  })

  it("resolves an explicit nodeId that exists", () => {
    const workspace = seededWorkspace()
    const resolution = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      undefined,
      undefined,
      { nodeId: BUTTON_DEFAULT_NODE_ID },
      undefined,
      "instance",
    )
    expect(resolution).toEqual({
      kind: "resolved",
      nodeId: BUTTON_DEFAULT_NODE_ID,
    })
  })

  it("returns a terminal message when nothing is selected and there is no match hint", () => {
    const workspace = seededWorkspace()
    const resolution = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      undefined,
      ComponentId.BUTTON,
      "selection",
      undefined,
      "board",
    )
    expect(resolution.kind).toBe("message")
    if (resolution.kind === "message") {
      expect(resolution.text).toContain("board")
    }
  })

  it("returns a not-found message rather than guessing, for an unknown id with no matches", () => {
    const workspace = seededWorkspace()
    const resolution = resolveNodeTarget(
      workspace,
      ComponentId.BUTTON,
      undefined,
      undefined,
      { nodeId: "does-not-exist" },
      undefined,
      "instance",
    )
    expect(resolution.kind).toBe("message")
    if (resolution.kind === "message") {
      expect(resolution.text).toContain("No node matches")
    }
  })
})

describe("resolveClassTarget: texts include authored content", () => {
  it("counts a typed sentence on a list item as a text, but never catalog boilerplate", async () => {
    const { seedChipRowWorkspace, CHIP_ROW_BOARD } = await import("../../eval/seed")
    const { applyActions } = await import(
      "@seldon/core/workspace/reducers/apply-actions"
    )
    const { isComponentBoard } = await import(
      "@seldon/core/workspace/model/components"
    )
    let { workspace } = seedChipRowWorkspace()
    const board = workspace.boards[CHIP_ROW_BOARD]
    if (!board || !isComponentBoard(board)) throw new Error("no board")
    // The ordered variant (index 1) is catalog-made but NOT the template
    // column; typing a sentence onto one of its items is authorship.
    const orderedItemId = board.variants[1]!.children![0]!.id
    workspace = applyActions(workspace, [
      {
        type: "set_node_properties",
        payload: {
          nodeId: orderedItemId,
          properties: {
            content: { type: "exact", value: "A sentence someone typed" },
          },
        },
      } as never,
    ])

    const resolution = resolveClassTarget(
      workspace,
      CHIP_ROW_BOARD as never,
      "texts",
    )
    expect(resolution.kind).toBe("resolved-many")
    if (resolution.kind !== "resolved-many") return
    // The typed sentence counts...
    expect(resolution.nodeIds).toContain(orderedItemId)
    // ...its untouched sibling (boilerplate repeating the inherited text)
    // does not, and nothing from the catalog's template column does.
    const otherOrderedItemId = board.variants[1]!.children![1]!.id
    expect(resolution.nodeIds).not.toContain(otherOrderedItemId)
    const templateItemId = board.variants[0]!.children![0]!.id
    expect(resolution.nodeIds).not.toContain(templateItemId)
  })
})
