import { produce } from "immer"
import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { workspaceReducer } from "../../reducers/reducer"
import type { Board, Workspace, WorkspaceAction } from "../../types"
import { workspaceThemeService as service } from "./theme.service"

const dispatch = (ws: Workspace, action: WorkspaceAction): Workspace =>
  workspaceReducer(ws, action)

const act = (type: string, payload: unknown): WorkspaceAction =>
  ({ type, payload }) as unknown as WorkspaceAction

const BOARD = ComponentId.BUTTON

function withButton(): { ws: Workspace; rootId: string } {
  const ws = dispatch(
    createEmptyWorkspace(),
    act("add_component", { boardKey: BOARD }),
  )
  return { ws, rootId: ws.boards[BOARD]!.variants[0]!.id }
}

describe("WorkspaceThemeService theme ids", () => {
  it("reads a board theme ref via getObjectThemeId", () => {
    const { ws } = withButton()
    const board = ws.boards[BOARD] as Board
    expect(typeof service.getObjectThemeId(board, ws)).toBe("string")
  })

  it("resolves a node theme id by walking up to the board ref", () => {
    const { ws, rootId } = withButton()
    const node = ws.nodes[rootId]!
    const boardId = service.getObjectThemeId(ws.boards[BOARD] as Board, ws)
    expect(service.getNodeThemeId(node.id, ws)).toBe(boardId)
  })

  it("prefers an explicit node theme over the inherited board ref", () => {
    const { ws, rootId } = withButton()
    const themed = produce(ws, (draft) => {
      draft.nodes[rootId]!.theme = "seldon"
    })
    expect(service.getNodeThemeId(rootId, themed)).toBe("seldon")
  })
})

describe("WorkspaceThemeService theme objects", () => {
  it("returns a computed theme for an id", () => {
    const { ws } = withButton()
    expect(service.getTheme("seldon", ws)).toBeTruthy()
  })

  it("returns the node and object themes", () => {
    const { ws, rootId } = withButton()
    const board = ws.boards[BOARD] as Board
    expect(service.getNodeTheme(rootId, ws)).toBeTruthy()
    expect(service.getObjectTheme(board, ws)).toBeTruthy()
  })

  it("lists every available theme", () => {
    const themes = service.getThemes(createEmptyWorkspace())
    expect(themes.length).toBeGreaterThan(0)
  })
})

describe("WorkspaceThemeService.getNextCustomTokenIdForTheme", () => {
  it("returns custom1 for an empty section and the next slot once seeded", () => {
    const base = dispatch(
      createEmptyWorkspace(),
      act("duplicate_theme", {
        themeId: "theme-seldon-default",
        newThemeId: "theme-seldon-copy",
      }),
    )
    expect(
      service.getNextCustomTokenIdForTheme(base, "theme-seldon-copy", "swatch"),
    ).toBe("custom1")

    const seeded = produce(base, (draft) => {
      const overrides = draft.themes["theme-seldon-copy"]!.overrides as Record<
        string,
        Record<string, unknown>
      >
      overrides.swatch = { custom1: { name: "seed" } }
    })
    expect(
      service.getNextCustomTokenIdForTheme(
        seeded,
        "theme-seldon-copy",
        "swatch",
      ),
    ).toBe("custom2")
  })
})

describe("WorkspaceThemeService.collectUsedThemes", () => {
  it("collects board and node theme refs", () => {
    const { ws } = withButton()
    const used = service.collectUsedThemes(ws)
    expect(used.size).toBeGreaterThan(0)
  })

  it("falls back to seldon when nothing references a theme", () => {
    const empty: Workspace = {
      ...createEmptyWorkspace(),
      boards: {},
      nodes: {},
    }
    expect(service.collectUsedThemes(empty).has("seldon")).toBe(true)
  })
})
