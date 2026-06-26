import { describe, expect, it } from "vitest"

import { ComponentId } from "../../components/constants"
import type { ExtractPayload, Workspace } from "../../index"
import { createEmptyWorkspace } from "../helpers/create-empty-workspace"
import { addComponent } from "../reducers/handlers/add/add-component"
import type { Board } from "./components"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "./components"
import type { EntryNode } from "./entry-node"
import {
  isEntryNodeDefault,
  isEntryNodeInstance,
  isEntryNodeVariant,
} from "./entry-node"

const ws: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)

const boardGuards: Record<string, (b: Board) => boolean> = {
  component: isComponentBoard,
  playground: isPlaygroundBoard,
  theme: isThemeBoard,
  "font-collection": isFontCollectionBoard,
  "icon-set": isIconSetBoard,
  media: isMediaBoard,
}

describe("board type guards", () => {
  it("matches exactly one guard per real board entry", () => {
    const boards = Object.values(ws.boards) as Board[]
    expect(boards.length).toBeGreaterThan(0)

    for (const board of boards) {
      for (const [type, guard] of Object.entries(boardGuards)) {
        expect(guard(board)).toBe(board.type === type)
      }
    }
  })
})

const nodeGuards: Record<string, (n: EntryNode) => boolean> = {
  default: isEntryNodeDefault,
  variant: isEntryNodeVariant,
  instance: isEntryNodeInstance,
}

describe("entry node type guards", () => {
  it("matches exactly one guard per real node entry", () => {
    const nodes = Object.values(ws.nodes) as EntryNode[]
    expect(nodes.length).toBeGreaterThan(0)

    for (const node of nodes) {
      for (const [type, guard] of Object.entries(nodeGuards)) {
        expect(guard(node)).toBe(node.type === type)
      }
    }
  })
})
