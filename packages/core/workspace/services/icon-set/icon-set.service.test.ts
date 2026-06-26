import { produce } from "immer"
import { describe, expect, it } from "vitest"

import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { workspaceReducer } from "../../reducers/reducer"
import type { Workspace, WorkspaceAction } from "../../types"
import { workspaceIconSetService as service } from "./icon-set.service"

const dispatch = (ws: Workspace, action: WorkspaceAction): Workspace =>
  workspaceReducer(ws, action)

const act = (type: string, payload: unknown): WorkspaceAction =>
  ({ type, payload }) as unknown as WorkspaceAction

const ICON_BOARD = "seldonIcons"

function defaultEntryId(ws: Workspace): string {
  return ws.boards[ICON_BOARD]!.variants[0]!.id
}

describe("WorkspaceIconSetService.getIconSet", () => {
  it("resolves a catalog-templated entry to its computed icon set", () => {
    const ws = createEmptyWorkspace()
    const set = service.getIconSet(defaultEntryId(ws), ws)
    expect(set?.id).toBe(ICON_BOARD)
    expect(set!.icons.length).toBeGreaterThan(0)
  })

  it("returns null for a missing entry", () => {
    expect(service.getIconSet("ghost", createEmptyWorkspace())).toBeNull()
  })

  it("walks a variant entry's parent link and merges overrides", () => {
    const base = createEmptyWorkspace()
    const ws = dispatch(
      base,
      act("duplicate_icon_set", {
        iconSetId: defaultEntryId(base),
        newIconSetId: "is-copy",
      }),
    )
    const variant = service.getIconSet("is-copy", ws)
    expect(variant?.id).toBe(ICON_BOARD)
    expect(variant!.icons.length).toBeGreaterThan(0)
  })
})

describe("WorkspaceIconSetService.getInclusion", () => {
  it("returns an empty map when no inclusion is stored", () => {
    const base = createEmptyWorkspace()
    const dup = dispatch(
      base,
      act("duplicate_icon_set", {
        iconSetId: defaultEntryId(base),
        newIconSetId: "is-copy",
      }),
    )
    const ws = produce(dup, (draft) => {
      delete (
        draft["icon-sets"]["is-copy"]!.overrides as Record<string, unknown>
      ).includedIcons
    })
    expect(service.getInclusion("is-copy", ws)).toEqual({})
  })

  it("returns the stored per-icon inclusion", () => {
    const base = createEmptyWorkspace()
    const entryId = defaultEntryId(base)
    const sampleIcon = service.getIconSet(entryId, base)!.icons[0]!
    const ws = produce(base, (draft) => {
      const entry = draft["icon-sets"][entryId]!
      entry.overrides = {
        ...(entry.overrides ?? {}),
        includedIcons: { [sampleIcon]: false },
      }
    })
    expect(service.getInclusion(entryId, ws)).toEqual({ [sampleIcon]: false })
  })
})

describe("WorkspaceIconSetService.getIncludedIcons", () => {
  it("returns the default included icons and applies an override", () => {
    const base = createEmptyWorkspace()
    const entryId = defaultEntryId(base)
    const defaults = service.getIncludedIcons(entryId, base)
    expect(defaults.length).toBeGreaterThan(0)

    const excluded = defaults[0]!
    const ws = produce(base, (draft) => {
      const entry = draft["icon-sets"][entryId]!
      entry.overrides = {
        ...(entry.overrides ?? {}),
        includedIcons: { [excluded]: false },
      }
    })
    expect(service.getIncludedIcons(entryId, ws)).not.toContain(excluded)
  })

  it("returns an empty list for a missing entry", () => {
    expect(service.getIncludedIcons("ghost", createEmptyWorkspace())).toEqual(
      [],
    )
  })
})

describe("WorkspaceIconSetService.getBoardIconSet", () => {
  it("resolves the icon set through a board's default variant", () => {
    const ws = createEmptyWorkspace()
    expect(service.getBoardIconSet(ICON_BOARD, ws)?.id).toBe(ICON_BOARD)
  })

  it("returns null for a non-icon-set board", () => {
    const ws = dispatch(
      createEmptyWorkspace(),
      act("add_playground", { boardKey: "pg-1" }),
    )
    expect(service.getBoardIconSet("pg-1", ws)).toBeNull()
  })
})
