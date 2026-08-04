import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { markedBoardTree } from "./marked-board"

const BUTTON_DEFAULT_NODE_ID = "component-button-default"

function seededWorkspace() {
  return addComponent(
    { boardKey: ComponentId.BUTTON } as never,
    createEmptyWorkspace(),
  )
}

function treeFor(selectedNodeId: string | undefined) {
  const workspace = seededWorkspace()
  return markedBoardTree({
    workspace,
    activeBoard: workspace.boards[ComponentId.BUTTON]!,
    selectedNodeId,
  })
}

describe("markedBoardTree", () => {
  it("lists every id in the tree, so the pick's enum covers the board", () => {
    const tree = treeFor(undefined)
    expect(tree.nodeIds).toContain(BUTTON_DEFAULT_NODE_ID)
    expect(tree.lines.join("\n")).toContain(BUTTON_DEFAULT_NODE_ID)
  })

  it("marks the selected node and everything under it", () => {
    const tree = treeFor(BUTTON_DEFAULT_NODE_ID)
    const selectedLine = tree.lines.find((line) =>
      line.includes(`- ${BUTTON_DEFAULT_NODE_ID}:`),
    )
    expect(selectedLine).toContain("<- SELECTED")
    const boardHasDescendants =
      tree.nodeIds.filter((nodeId) => nodeId !== BUTTON_DEFAULT_NODE_ID).length >
      0
    expect(boardHasDescendants).toBe(true)
    expect(tree.lines.join("\n")).toContain("<- inside the selection")
  })

  it("marks nothing when the user has no selection", () => {
    expect(treeFor(undefined).lines.join("\n")).not.toContain("<-")
  })

  it("states each node's position among its same-kind siblings", () => {
    const renderedTree = treeFor(undefined).lines.join("\n")
    const everyLineCarriesAPosition = renderedTree
      .split("\n")
      .filter((line) => line.trim().startsWith("- "))
      .every(
        (line) =>
          line.includes("of") || line.includes("(the only one here)"),
      )
    expect(everyLineCarriesAPosition).toBe(true)
  })
})
