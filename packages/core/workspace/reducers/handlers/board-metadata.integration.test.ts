import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { resetBoardAuthor } from "./reset/reset-board-author"
import { resetBoardCredentials } from "./reset/reset-board-credentials"
import { resetBoardEditorData } from "./reset/reset-board-editor-data"
import { resetBoardIntent } from "./reset/reset-board-intent"
import { resetBoardLabel } from "./reset/reset-board-label"
import { resetBoardLicense } from "./reset/reset-board-license"
import { resetBoardPreview } from "./reset/reset-board-preview"
import { resetBoardTags } from "./reset/reset-board-tags"
import { setBoardAuthor } from "./set/set-board-author"
import { setBoardCredentials } from "./set/set-board-credentials"
import { setBoardEditorData } from "./set/set-board-editor-data"
import { setBoardIntent } from "./set/set-board-intent"
import { setBoardLabel } from "./set/set-board-label"
import { setBoardLicense } from "./set/set-board-license"
import { setBoardPreview } from "./set/set-board-preview"
import { setBoardTags } from "./set/set-board-tags"

const boardKey = ComponentId.BUTTON

const componentWorkspace = () =>
  addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const boardKeyByType = (ws: Workspace, type: string) =>
  Object.keys(ws.boards).find((k) => ws.boards[k].type === type)!

const board = (ws: Workspace, key: string) =>
  ws.boards[key] as unknown as Record<string, unknown>

const pay = (extra: Record<string, unknown>) =>
  ({ boardKey, ...extra }) as never

describe("board label", () => {
  it("sets a label and resets to the catalog default", () => {
    const set = setBoardLabel(pay({ label: "Custom" }), componentWorkspace())
    expect(board(set, boardKey).label).toBe("Custom")
    expect(board(resetBoardLabel(pay({}), set), boardKey).label).not.toBe(
      "Custom",
    )
  })
})

describe("board tags", () => {
  it("sets, clears, and resets tags", () => {
    const set = setBoardTags(pay({ tags: ["x"] }), componentWorkspace())
    expect(board(set, boardKey).tags).toEqual(["x"])
    expect(
      board(setBoardTags(pay({ tags: undefined }), set), boardKey).tags,
    ).toBeUndefined()
    expect(board(resetBoardTags(pay({}), set), boardKey).tags).toBeUndefined()
  })
})

describe("board author", () => {
  it("sets an author and resets to the default", () => {
    const set = setBoardAuthor(pay({ author: "Me" }), componentWorkspace())
    expect(board(set, boardKey).author).toBe("Me")
    expect(board(resetBoardAuthor(pay({}), set), boardKey).author).not.toBe(
      "Me",
    )
  })
})

describe("board intent", () => {
  it("sets, clears, and resets intent", () => {
    const set = setBoardIntent(pay({ intent: "purpose" }), componentWorkspace())
    expect(board(set, boardKey).intent).toBe("purpose")
    expect(
      board(setBoardIntent(pay({ intent: undefined }), set), boardKey).intent,
    ).toBeUndefined()
    expect(
      board(resetBoardIntent(pay({}), set), boardKey).intent,
    ).toBeUndefined()
  })
})

describe("board license", () => {
  it("sets, clears, and resets license", () => {
    const set = setBoardLicense(
      pay({ license: { spdx: "MIT" } }),
      componentWorkspace(),
    )
    expect(board(set, boardKey).license).toEqual({ spdx: "MIT" })
    expect(
      board(setBoardLicense(pay({ license: undefined }), set), boardKey)
        .license,
    ).toBeUndefined()
    expect(
      board(resetBoardLicense(pay({}), set), boardKey).license,
    ).toBeUndefined()
  })
})

describe("board editor data", () => {
  it("sets, clears, and resets editor data", () => {
    const set = setBoardEditorData(
      pay({ editorData: { note: "x" } }),
      componentWorkspace(),
    )
    expect(board(set, boardKey).__editor).toEqual({ note: "x" })
    expect(
      board(setBoardEditorData(pay({ editorData: undefined }), set), boardKey)
        .__editor,
    ).toBeUndefined()
    expect(
      board(resetBoardEditorData(pay({}), set), boardKey).__editor,
    ).toBeUndefined()
  })
})

describe("board credentials (resource boards)", () => {
  it("sets and resets credentials on a font-collection board", () => {
    const ws = createEmptyWorkspace()
    const key = boardKeyByType(ws, "font-collection")
    const payload = (extra: Record<string, unknown>) =>
      ({ boardKey: key, ...extra }) as never
    const set = setBoardCredentials(
      payload({ credentials: { token: "t" } }),
      ws,
    )
    expect(board(set, key).credentials).toEqual({ token: "t" })
    expect(
      board(resetBoardCredentials(payload({}), set), key).credentials,
    ).toBeUndefined()
  })
})

describe("board preview (theme/resource boards)", () => {
  it("sets and resets the component preview on a theme board", () => {
    const ws = createEmptyWorkspace()
    const key = boardKeyByType(ws, "theme")
    const payload = (extra: Record<string, unknown>) =>
      ({ boardKey: key, ...extra }) as never
    const set = setBoardPreview(payload({ preview: "customPreview" }), ws)
    expect(board(set, key).componentPreview).toBe("customPreview")
    expect(
      board(resetBoardPreview(payload({}), set), key).componentPreview,
    ).toBe("seldonThemePreview")
  })
})
