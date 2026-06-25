import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { duplicateFontCollection } from "./duplicate-font-collection"
import { duplicateIconSet } from "./duplicate-icon-set"
import { duplicateNode } from "./duplicate-node"

const empty = () => createEmptyWorkspace()

describe("duplicateFontCollection", () => {
  it("clones the default entry into a variant and appends it to the board", () => {
    const next = duplicateFontCollection(
      {
        fontCollectionId: "font-collection-system-default",
        newFontCollectionId: "fc-dup",
      } as never,
      empty(),
    )
    expect(next["font-collections"]["fc-dup"]?.type).toBe("variant")
    expect((next.boards.system as any).variants.map((r: any) => r.id)).toContain("fc-dup")
  })

  it("is a no-op for an unknown id", () => {
    const ws = empty()
    expect(
      duplicateFontCollection({ fontCollectionId: "missing" } as never, ws),
    ).toBe(ws)
  })
})

describe("duplicateIconSet", () => {
  it("clones the default entry into a variant and appends it to the board", () => {
    const next = duplicateIconSet(
      {
        iconSetId: "icon-set-seldonIcons-default",
        newIconSetId: "is-dup",
      } as never,
      empty(),
    )
    expect(next["icon-sets"]["is-dup"]?.type).toBe("variant")
    expect((next.boards.seldonIcons as any).variants.map((r: any) => r.id)).toContain("is-dup")
  })

  it("is a no-op for an unknown id", () => {
    const ws = empty()
    expect(duplicateIconSet({ iconSetId: "missing" } as never, ws)).toBe(ws)
  })
})

describe("duplicateNode", () => {
  const componentWorkspace = () =>
    addComponent(
      { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
      empty(),
    )

  it("duplicates a default variant root into a new board variant", () => {
    const ws = componentWorkspace()
    const board = ws.boards[ComponentId.BUTTON] as any
    const rootId = board.variants[0].id
    const before = board.variants.length

    const next = duplicateNode(
      { nodeId: rootId } as ExtractPayload<"duplicate_node">,
      ws,
    )
    expect((next.boards[ComponentId.BUTTON] as any).variants.length).toBe(before + 1)
  })
})
