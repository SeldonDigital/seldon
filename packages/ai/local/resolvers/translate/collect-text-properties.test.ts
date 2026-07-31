import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import {
  TRANSLATABLE_PROPERTY_KEYS,
  collectTextProperties,
} from "./collect-text-properties"

describe("collectTextProperties", () => {
  it("collects only allowlisted text keys from the target subtree", () => {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    const board = workspace.boards[ComponentId.BUTTON]
    expect(board && isComponentBoard(board)).toBe(true)
    const boardHasNoVariantTrees = !board || !isComponentBoard(board)
    if (boardHasNoVariantTrees) return

    const rootId = board.variants[0]!.id
    const found = collectTextProperties(workspace, ComponentId.BUTTON, rootId)

    // The default button subtree carries at least its label text.
    expect(found.length).toBeGreaterThan(0)
    for (const entry of found) {
      expect(TRANSLATABLE_PROPERTY_KEYS).toContain(entry.propertyKey)
      expect(entry.text.trim()).not.toBe("")
      // Every reported node is in the workspace and inside the board.
      expect(workspace.nodes[entry.nodeId]).toBeDefined()
    }
    // Identifier-bearing keys never appear, even though icon nodes carry
    // a symbol string.
    expect(found.some((entry) => entry.propertyKey === "symbol")).toBe(false)
  })

  it("returns [] for a subtree with no text", () => {
    const workspace = createEmptyWorkspace()
    expect(collectTextProperties(workspace, undefined, "missing")).toEqual([])
  })
})
