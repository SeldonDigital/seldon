import { describe, expect, it } from "bun:test"

import { ValueType } from "../../../../properties/constants"
import { HtmlElement } from "../../../../properties/values/attributes/html-element"
import type { ComponentBoard } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { Workspace } from "../../../model/workspace"
import { migrateV5MergeTextPrimitives } from "./migrate-00005-merge-text-primitives"

function makeNode(id: string, template: string, overrides = {}): EntryNode {
  return {
    id,
    type: "instance",
    level: "primitive",
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
    level: "primitive",
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
    metadata: { version: 4, label: "" },
    boards,
    playgrounds: {},
    nodes,
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
}

describe("migrateV5MergeTextPrimitives", () => {
  it("rewrites description, codeblock, and option node templates to text", () => {
    const workspace = makeWorkspace({
      d: makeNode("d", "catalog:description"),
      c: makeNode("c", "catalog:codeblock"),
      o: makeNode("o", "catalog:option"),
    })

    const result = migrateV5MergeTextPrimitives(workspace)

    expect(result.nodes.d.template).toBe("catalog:text")
    expect(result.nodes.c.template).toBe("catalog:text")
    expect(result.nodes.o.template).toBe("catalog:text")
  })

  it("rewrites tableInput node templates to tableData", () => {
    const workspace = makeWorkspace({
      t: makeNode("t", "catalog:tableInput"),
    })

    const result = migrateV5MergeTextPrimitives(workspace)

    expect(result.nodes.t.template).toBe("catalog:tableData")
  })

  it("layers signature overrides beneath existing overrides", () => {
    const workspace = makeWorkspace({
      o: makeNode("o", "catalog:option"),
    })

    const result = migrateV5MergeTextPrimitives(workspace)
    const overrides = result.nodes.o.overrides as Record<string, unknown>

    expect(overrides.htmlElement).toEqual({
      type: ValueType.OPTION,
      value: HtmlElement.OPTION,
    })
    expect(overrides.lines).toEqual({ type: ValueType.EXACT, value: 2 })
  })

  it("keeps a node's own overrides over the signature", () => {
    const ownHtmlElement = { type: ValueType.OPTION, value: HtmlElement.SPAN }
    const workspace = makeWorkspace({
      o: makeNode("o", "catalog:option", { htmlElement: ownHtmlElement }),
    })

    const result = migrateV5MergeTextPrimitives(workspace)
    const overrides = result.nodes.o.overrides as Record<string, unknown>

    expect(overrides.htmlElement).toEqual(ownHtmlElement)
  })

  it("leaves unrelated catalog templates unchanged", () => {
    const workspace = makeWorkspace({
      b: makeNode("b", "catalog:button"),
      n: makeNode("n", "node:other-node"),
    })

    const result = migrateV5MergeTextPrimitives(workspace)

    expect(result.nodes.b.template).toBe("catalog:button")
    expect(result.nodes.n.template).toBe("node:other-node")
  })

  it("rewrites component board catalogId for dropped ids", () => {
    const workspace = makeWorkspace(
      {},
      {
        "board-description": makeComponentBoard("description"),
        "board-tableInput": makeComponentBoard("tableInput"),
        "board-button": makeComponentBoard("button"),
      },
    )

    const result = migrateV5MergeTextPrimitives(workspace)
    const boards = result.boards as Record<string, ComponentBoard>

    expect(boards["board-description"].catalogId).toBe("text")
    expect(boards["board-tableInput"].catalogId).toBe("tableData")
    expect(boards["board-button"].catalogId).toBe("button")
  })
})
