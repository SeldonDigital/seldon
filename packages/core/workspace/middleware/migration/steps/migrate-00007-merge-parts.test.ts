import { describe, expect, it } from "bun:test"

import { ValueType } from "../../../../properties/constants"
import { Align } from "../../../../properties/values/layout/align"
import { Orientation } from "../../../../properties/values/layout/orientation"
import { Resize } from "../../../../properties/values/layout/resize"
import type { ComponentBoard } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { Workspace } from "../../../model/workspace"
import { migrateV7MergeParts } from "./migrate-00007-merge-parts"

function makeNode(id: string, template: string, overrides = {}): EntryNode {
  return {
    id,
    type: "instance",
    level: "part",
    label: id,
    theme: null,
    template,
    overrides,
    origin: "user",
  }
}

function makeComponentBoard(catalogId: string): ComponentBoard {
  return {
    type: "component",
    level: "part",
    catalogId,
    label: catalogId,
    author: "test",
    componentTheme: "theme:default",
    componentProperties: {},
    variants: [],
  }
}

function makeWorkspace(
  nodes: Record<string, EntryNode>,
  boards: Record<string, ComponentBoard> = {},
): Workspace {
  return {
    metadata: { version: 6, label: "" },
    boards,
    playgrounds: {},
    nodes,
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
}

describe("migrateV7MergeParts", () => {
  it("rewrites list part node templates to listStandard", () => {
    const workspace = makeWorkspace({
      c: makeNode("c", "catalog:listContacts"),
      p: makeNode("p", "catalog:listProducts"),
      g: makeNode("g", "catalog:listGrid"),
      t: makeNode("t", "catalog:listTodo"),
    })

    const result = migrateV7MergeParts(workspace)

    expect(result.nodes.c.template).toBe("catalog:listStandard")
    expect(result.nodes.p.template).toBe("catalog:listStandard")
    expect(result.nodes.g.template).toBe("catalog:listStandard")
    expect(result.nodes.t.template).toBe("catalog:listStandard")
  })

  it("rewrites card part node templates to cardStacked", () => {
    const workspace = makeWorkspace({
      h: makeNode("h", "catalog:cardHorizontal"),
      p: makeNode("p", "catalog:cardProduct"),
    })

    const result = migrateV7MergeParts(workspace)

    expect(result.nodes.h.template).toBe("catalog:cardStacked")
    expect(result.nodes.p.template).toBe("catalog:cardStacked")
  })

  it("layers grid orientation signature beneath existing overrides", () => {
    const workspace = makeWorkspace({
      g: makeNode("g", "catalog:listGrid"),
    })

    const result = migrateV7MergeParts(workspace)
    const grid = result.nodes.g.overrides as Record<string, unknown>

    expect(grid.orientation).toEqual({
      type: ValueType.OPTION,
      value: Orientation.HORIZONTAL,
    })
    expect(grid.align).toEqual({
      type: ValueType.OPTION,
      value: Align.TOP_LEFT,
    })
  })

  it("layers card horizontal signature", () => {
    const workspace = makeWorkspace({
      h: makeNode("h", "catalog:cardHorizontal"),
    })

    const result = migrateV7MergeParts(workspace)
    const card = result.nodes.h.overrides as Record<string, unknown>

    expect(card.orientation).toEqual({
      type: ValueType.OPTION,
      value: Orientation.HORIZONTAL,
    })
    expect(card.width).toEqual({
      type: ValueType.OPTION,
      value: Resize.FILL,
    })
  })

  it("keeps a node's own overrides over the signature", () => {
    const ownOrientation = {
      type: ValueType.OPTION,
      value: Orientation.VERTICAL,
    }
    const workspace = makeWorkspace({
      g: makeNode("g", "catalog:listGrid", { orientation: ownOrientation }),
    })

    const result = migrateV7MergeParts(workspace)
    const overrides = result.nodes.g.overrides as Record<string, unknown>

    expect(overrides.orientation).toEqual(ownOrientation)
  })

  it("leaves unrelated catalog and node templates unchanged", () => {
    const workspace = makeWorkspace({
      b: makeNode("b", "catalog:listStandard"),
      n: makeNode("n", "node:other-node"),
    })

    const result = migrateV7MergeParts(workspace)

    expect(result.nodes.b.template).toBe("catalog:listStandard")
    expect(result.nodes.n.template).toBe("node:other-node")
  })

  it("rewrites component board catalogId for dropped ids", () => {
    const workspace = makeWorkspace(
      {},
      {
        "board-listContacts": makeComponentBoard("listContacts"),
        "board-cardProduct": makeComponentBoard("cardProduct"),
        "board-listStandard": makeComponentBoard("listStandard"),
      },
    )

    const result = migrateV7MergeParts(workspace)
    const boards = result.boards as Record<string, ComponentBoard>

    expect(boards["board-listContacts"].catalogId).toBe("listStandard")
    expect(boards["board-cardProduct"].catalogId).toBe("cardStacked")
    expect(boards["board-listStandard"].catalogId).toBe("listStandard")
  })
})
