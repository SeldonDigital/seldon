import { describe, expect, it } from "bun:test"

import { ValueType } from "../../../../properties/constants"
import { HtmlElement } from "../../../../properties/values/attributes/html-element"
import { ListStyleType } from "../../../../properties/values/layout/list-style-type"
import type { ComponentBoard } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { Workspace } from "../../../model/workspace"
import { migrateV6MergeElements } from "./migrate-00006-merge-elements"

function makeNode(id: string, template: string, overrides = {}): EntryNode {
  return {
    id,
    type: "instance",
    level: "element",
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
    level: "element",
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
    metadata: { version: 5, label: "" },
    boards,
    playgrounds: {},
    nodes,
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
}

describe("migrateV6MergeElements", () => {
  it("rewrites ordered and unordered list node templates to list", () => {
    const workspace = makeWorkspace({
      o: makeNode("o", "catalog:orderedList"),
      u: makeNode("u", "catalog:unorderedList"),
    })

    const result = migrateV6MergeElements(workspace)

    expect(result.nodes.o.template).toBe("catalog:list")
    expect(result.nodes.u.template).toBe("catalog:list")
  })

  it("rewrites list-text primitive templates to listText", () => {
    const workspace = makeWorkspace({
      li: makeNode("li", "catalog:listItem"),
      dt: makeNode("dt", "catalog:descriptionTerm"),
      dd: makeNode("dd", "catalog:descriptionDetails"),
    })

    const result = migrateV6MergeElements(workspace)

    expect(result.nodes.li.template).toBe("catalog:listText")
    expect(result.nodes.dt.template).toBe("catalog:listText")
    expect(result.nodes.dd.template).toBe("catalog:listText")
  })

  it("rewrites header card and action templates to header", () => {
    const workspace = makeWorkspace({
      c: makeNode("c", "catalog:headerCard"),
      a: makeNode("a", "catalog:headerAction"),
    })

    const result = migrateV6MergeElements(workspace)

    expect(result.nodes.c.template).toBe("catalog:header")
    expect(result.nodes.a.template).toBe("catalog:header")
  })

  it("layers signature overrides beneath existing overrides", () => {
    const workspace = makeWorkspace({
      o: makeNode("o", "catalog:orderedList"),
      dt: makeNode("dt", "catalog:descriptionTerm"),
    })

    const result = migrateV6MergeElements(workspace)
    const ordered = result.nodes.o.overrides as Record<string, unknown>
    const term = result.nodes.dt.overrides as Record<string, unknown>

    expect(ordered.htmlElement).toEqual({
      type: ValueType.OPTION,
      value: HtmlElement.OL,
    })
    expect(ordered.listStyleType).toEqual({
      type: ValueType.OPTION,
      value: ListStyleType.DECIMAL,
    })
    expect(term.htmlElement).toEqual({
      type: ValueType.OPTION,
      value: HtmlElement.DT,
    })
  })

  it("keeps a node's own overrides over the signature", () => {
    const ownHtmlElement = { type: ValueType.OPTION, value: HtmlElement.UL }
    const workspace = makeWorkspace({
      o: makeNode("o", "catalog:orderedList", { htmlElement: ownHtmlElement }),
    })

    const result = migrateV6MergeElements(workspace)
    const overrides = result.nodes.o.overrides as Record<string, unknown>

    expect(overrides.htmlElement).toEqual(ownHtmlElement)
  })

  it("leaves unrelated catalog and node templates unchanged", () => {
    const workspace = makeWorkspace({
      b: makeNode("b", "catalog:button"),
      n: makeNode("n", "node:other-node"),
    })

    const result = migrateV6MergeElements(workspace)

    expect(result.nodes.b.template).toBe("catalog:button")
    expect(result.nodes.n.template).toBe("node:other-node")
  })

  it("rewrites component board catalogId for dropped ids", () => {
    const workspace = makeWorkspace(
      {},
      {
        "board-orderedList": makeComponentBoard("orderedList"),
        "board-listItem": makeComponentBoard("listItem"),
        "board-headerAction": makeComponentBoard("headerAction"),
        "board-button": makeComponentBoard("button"),
      },
    )

    const result = migrateV6MergeElements(workspace)
    const boards = result.boards as Record<string, ComponentBoard>

    expect(boards["board-orderedList"].catalogId).toBe("list")
    expect(boards["board-listItem"].catalogId).toBe("listText")
    expect(boards["board-headerAction"].catalogId).toBe("header")
    expect(boards["board-button"].catalogId).toBe("button")
  })
})
