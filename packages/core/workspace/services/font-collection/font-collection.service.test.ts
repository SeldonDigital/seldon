import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { Workspace, WorkspaceAction } from "../../types"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { workspaceReducer } from "../../reducers/reducer"
import { workspaceFontCollectionService as service } from "./font-collection.service"

const dispatch = (ws: Workspace, action: WorkspaceAction): Workspace =>
  workspaceReducer(ws, action)

const act = (type: string, payload: unknown): WorkspaceAction =>
  ({ type, payload }) as unknown as WorkspaceAction

const SYSTEM_BOARD = "system"
const GOOGLE_BOARD = "googleFonts"

function systemDefaultEntryId(ws: Workspace): string {
  return ws.boards[SYSTEM_BOARD]!.variants[0]!.id
}

function googleDefaultEntryId(ws: Workspace): string {
  return ws.boards[GOOGLE_BOARD]!.variants[0]!.id
}

/** First remote family slot in the Google collection plus one of its variants. */
function firstRemoteSlot(ws: Workspace): { slot: string; name: string; variant: string } {
  const collection = service.getFontCollection(googleDefaultEntryId(ws), ws)!
  const found = Object.entries(collection.families).find(
    ([, family]) => family?.origin === "remote" && (family.variants?.length ?? 0) > 0,
  )!
  const [slot, family] = found
  return { slot, name: family!.name, variant: family!.variants![0]! }
}

describe("WorkspaceFontCollectionService.getFontCollection", () => {
  it("resolves a catalog-templated entry to its computed collection", () => {
    const ws = createEmptyWorkspace()
    const collection = service.getFontCollection(systemDefaultEntryId(ws), ws)
    expect(collection?.id).toBe(SYSTEM_BOARD)
    expect(Object.keys(collection!.families).length).toBeGreaterThan(0)
  })

  it("returns null for a missing entry", () => {
    expect(service.getFontCollection("ghost", createEmptyWorkspace())).toBeNull()
  })

  it("walks a variant entry's parent link and merges overrides", () => {
    const base = createEmptyWorkspace()
    const ws = dispatch(
      base,
      act("duplicate_font_collection", {
        fontCollectionId: systemDefaultEntryId(base),
        newFontCollectionId: "fc-copy",
      }),
    )
    const variant = service.getFontCollection("fc-copy", ws)
    // The merged variant keeps the parent collection's identity and families.
    expect(variant?.id).toBe(SYSTEM_BOARD)
    expect(variant!.families.system).toBeDefined()
  })
})

describe("WorkspaceFontCollectionService.getVariantSelection", () => {
  it("returns an empty map when no selection is stored", () => {
    const ws = createEmptyWorkspace()
    // The local System collection stores no per-variant selection.
    expect(service.getVariantSelection(systemDefaultEntryId(ws), ws)).toEqual({})
  })

  it("returns the stored per-family selection", () => {
    const base = createEmptyWorkspace()
    const entryId = googleDefaultEntryId(base)
    const { slot, variant } = firstRemoteSlot(base)
    const ws = produce(base, (draft) => {
      const entry = draft["font-collections"][entryId]!
      entry.overrides = {
        ...(entry.overrides ?? {}),
        variantSelection: { [slot]: { [variant]: true } },
      }
    })
    expect(service.getVariantSelection(entryId, ws)).toEqual({
      [slot]: { [variant]: true },
    })
  })
})

describe("WorkspaceFontCollectionService enabled-variant queries", () => {
  it("reports the default-enabled remote families for a fresh workspace", () => {
    const ws = createEmptyWorkspace()
    const byFamily = service.getEnabledVariantsByFamily(ws)
    // The seeded Google collection enables variants on its default families.
    expect(Object.values(byFamily).some((weights) => weights.length > 0)).toBe(true)
    expect(service.getEnabledRemoteFamilies(ws).length).toBeGreaterThan(0)
  })

  it("unions enabled weights per family and lists enabled remote families", () => {
    const base = createEmptyWorkspace()
    const entryId = googleDefaultEntryId(base)
    const { slot, name, variant } = firstRemoteSlot(base)
    const ws = produce(base, (draft) => {
      const entry = draft["font-collections"][entryId]!
      entry.overrides = {
        ...(entry.overrides ?? {}),
        variantSelection: { [slot]: { [variant]: true } },
      }
    })

    expect(service.getEnabledVariantsByFamily(ws)[name]).toContain(variant)

    const remote = service.getEnabledRemoteFamilies(ws)
    const family = remote.find((entry) => entry.name === name)
    expect(family).toMatchObject({ name, slot, variants: [variant] })
  })
})

describe("WorkspaceFontCollectionService family grouping", () => {
  it("groups local families and flattens to the same families", () => {
    const ws = createEmptyWorkspace()
    const groups = service.collectWorkspaceFamilyGroups(ws)
    const flat = service.collectWorkspaceFamilies(ws)
    expect(flat).toEqual(groups.flat())
    // The local System families always show even without a selection.
    expect(flat.some((family) => family.name === "System")).toBe(true)
  })

  it("includes a remote family once one of its variants is enabled", () => {
    const base = createEmptyWorkspace()
    const entryId = googleDefaultEntryId(base)
    const { slot, name, variant } = firstRemoteSlot(base)
    const ws = produce(base, (draft) => {
      const entry = draft["font-collections"][entryId]!
      entry.overrides = {
        ...(entry.overrides ?? {}),
        variantSelection: { [slot]: { [variant]: true } },
      }
    })
    expect(service.collectWorkspaceFamilies(ws).some((f) => f.name === name)).toBe(true)
  })
})

describe("WorkspaceFontCollectionService misc", () => {
  it("collects the catalog ids of present font collection boards", () => {
    const used = service.collectUsedFontCollections(createEmptyWorkspace())
    expect(used.has(SYSTEM_BOARD)).toBe(true)
    expect(used.has(GOOGLE_BOARD)).toBe(true)
  })

  it("returns the next free familyNN slot id", () => {
    const base = createEmptyWorkspace()
    const entryId = systemDefaultEntryId(base)
    expect(service.getNextCustomFamilyId(base, entryId)).toBe("family01")

    const seeded = produce(base, (draft) => {
      const entry = draft["font-collections"][entryId]!
      entry.overrides = {
        ...(entry.overrides ?? {}),
        families: { family01: { name: "Seed", origin: "custom" } },
      }
    })
    expect(service.getNextCustomFamilyId(seeded, entryId)).toBe("family02")
  })
})
