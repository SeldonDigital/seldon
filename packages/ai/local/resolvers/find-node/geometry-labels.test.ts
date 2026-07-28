import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { spatialLabels } from "./geometry-labels"

describe("spatialLabels", () => {
  it("labels siblings by position with edge synonyms", () => {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    const board = workspace.boards[ComponentId.BUTTON]
    expect(board && isComponentBoard(board)).toBe(true)
    if (!board || !isComponentBoard(board)) return

    // The default button variant has two children (icon, text).
    const children = (board.variants[0]?.children ?? []).map((ref) => ref.id)
    expect(children.length).toBeGreaterThanOrEqual(2)

    const labels = spatialLabels(workspace, ComponentId.BUTTON, children)

    const first = labels.get(children[0]!)
    const last = labels.get(children[children.length - 1]!)
    expect(first).toContain("first")
    expect(first).toContain("top")
    expect(last).toContain("last")
    expect(last).toContain("bottom")
  })

  it("labels a variant root (no reorderable siblings context) as empty when it is an only child", () => {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    const board = workspace.boards[ComponentId.BUTTON]
    if (!board || !isComponentBoard(board)) return
    // A variant with exactly one child labels that child empty.
    const single = board.variants.find(
      (variant) => (variant.children ?? []).length === 1,
    )
    if (!single) return
    const childId = single.children![0]!.id
    const labels = spatialLabels(workspace, ComponentId.BUTTON, [childId])
    expect(labels.get(childId)).toBe("")
  })

  it("returns empty labels without a board", () => {
    const workspace = createEmptyWorkspace()
    const labels = spatialLabels(workspace, undefined, ["x"])
    expect(labels.get("x")).toBe("")
  })
})
