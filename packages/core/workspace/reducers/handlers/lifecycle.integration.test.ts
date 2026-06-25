import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import {
  ICON_SET_BOARD_CATALOG_IDS,
  THEME_BOARD_CATALOG_IDS,
} from "../../helpers/components/resource-board-catalog-ids"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { addFontCollection } from "./add/add-font-collection"
import { addIconSet } from "./add/add-icon-set"
import { addMedia } from "./add/add-media"
import { addPlayground } from "./add/add-playground"
import { addTheme } from "./add/add-theme"
import { duplicateTheme } from "./duplicate/duplicate-theme"
import { deleteTheme } from "./remove/delete-theme"
import { removeComponent } from "./remove/remove-component"
import { removeMedia } from "./remove/remove-media"
import { removePlayground } from "./remove/remove-playground"
import { removeTheme } from "./remove/remove-theme"

const empty = () => createEmptyWorkspace()
const freeId = (ids: Iterable<string>, ws: Workspace) =>
  [...ids].find((id) => !ws.boards[id])!

describe("addTheme", () => {
  it("creates a theme board and default entry", () => {
    const ws = empty()
    const boardKey = freeId(THEME_BOARD_CATALOG_IDS, ws)
    const next = addTheme({ boardKey } as ExtractPayload<"add_theme">, ws)
    expect(next.boards[boardKey]?.type).toBe("theme")
    expect(next.themes[`theme-${boardKey}-default`]).toBeDefined()
  })

  it("is a no-op when the board already exists", () => {
    const ws = empty()
    const boardKey = freeId(THEME_BOARD_CATALOG_IDS, ws)
    const once = addTheme({ boardKey } as ExtractPayload<"add_theme">, ws)
    expect(addTheme({ boardKey } as ExtractPayload<"add_theme">, once)).toEqual(once)
  })
})

describe("addFontCollection", () => {
  it("is a no-op for an already-seeded packaged board", () => {
    const ws = empty()
    const next = addFontCollection(
      { catalogId: "googleFonts" } as ExtractPayload<"add_font_collection">,
      ws,
    )
    expect(next.boards.googleFonts).toEqual(ws.boards.googleFonts)
  })

  it("is a no-op for an unknown catalog id", () => {
    const ws = empty()
    const next = addFontCollection(
      { catalogId: "not-a-real-collection" } as ExtractPayload<"add_font_collection">,
      ws,
    )
    expect(next.boards["not-a-real-collection"]).toBeUndefined()
  })
})

describe("addIconSet", () => {
  it("creates an icon-set board for a packaged catalog id", () => {
    const ws = empty()
    const catalogId = freeId(ICON_SET_BOARD_CATALOG_IDS, ws)
    const next = addIconSet(
      { catalogId } as ExtractPayload<"add_icon_set">,
      ws,
    )
    expect(next.boards[catalogId]?.type).toBe("icon-set")
  })
})

describe("addMedia / removeMedia", () => {
  it("creates a media board with default and custom rows, then removes it", () => {
    const catalogId = "seldonMedia"
    const added = addMedia({ catalogId } as ExtractPayload<"add_media">, empty())
    expect(added.boards[catalogId]?.type).toBe("media")
    expect(added.boards[catalogId]?.variants).toHaveLength(2)

    const removed = removeMedia({ catalogId } as ExtractPayload<"remove_media">, added)
    expect(removed.boards[catalogId]).toBeUndefined()
  })
})

describe("addPlayground / removePlayground", () => {
  it("creates a playground container, then removes it", () => {
    const boardKey = "playground-1"
    const added = addPlayground(
      { boardKey } as ExtractPayload<"add_playground">,
      empty(),
    )
    expect(added.playgrounds[boardKey]).toBeDefined()

    const removed = removePlayground(
      { boardKey } as ExtractPayload<"remove_playground">,
      added,
    )
    expect(removed.playgrounds[boardKey]).toBeUndefined()
  })
})

describe("removeComponent", () => {
  it("removes a component board and its nodes", () => {
    const boardKey = ComponentId.BUTTON
    const added = addComponent({ boardKey } as ExtractPayload<"add_component">, empty())
    const removed = removeComponent(
      { boardKey } as ExtractPayload<"remove_component">,
      added,
    )
    expect(removed.boards[boardKey]).toBeUndefined()
  })
})

describe("removeTheme", () => {
  it("removes an added theme board", () => {
    const ws = empty()
    const boardKey = freeId(THEME_BOARD_CATALOG_IDS, ws)
    const added = addTheme({ boardKey } as ExtractPayload<"add_theme">, ws)
    const removed = removeTheme({ boardKey } as ExtractPayload<"remove_theme">, added)
    expect(removed.boards[boardKey]).toBeUndefined()
  })
})

describe("deleteTheme", () => {
  it("drops a variant theme entry and its board ref", () => {
    const variant = duplicateTheme(
      { themeId: "theme-seldon-default", newThemeId: "theme-seldon-copy" } as ExtractPayload<"duplicate_theme">,
      empty(),
    )
    const next = deleteTheme(
      { themeId: "theme-seldon-copy" } as ExtractPayload<"delete_theme">,
      variant,
    )
    expect(next.themes["theme-seldon-copy"]).toBeUndefined()
  })

  it("is a no-op for a default theme entry", () => {
    const ws = empty()
    expect(
      deleteTheme(
        { themeId: "theme-seldon-default" } as ExtractPayload<"delete_theme">,
        ws,
      ),
    ).toBe(ws)
  })
})
