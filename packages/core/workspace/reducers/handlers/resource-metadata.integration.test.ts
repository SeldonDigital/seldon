import { describe, expect, it } from "vitest"

import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addFontCollectionCustomFamily } from "./add/add-font-collection-custom-family"
import { duplicateFontCollection } from "./duplicate/duplicate-font-collection"
import { duplicateTheme } from "./duplicate/duplicate-theme"
import { removeFontCollectionCustomFamily } from "./remove/remove-font-collection-custom-family"
import { resetFontCollection } from "./reset/reset-font-collection"
import { resetFontCollectionEditorData } from "./reset/reset-font-collection-editor-data"
import { resetFontCollectionLabel } from "./reset/reset-font-collection-label"
import { resetFontCollectionOverride } from "./reset/reset-font-collection-override"
import { resetIconSet } from "./reset/reset-icon-set"
import { resetIconSetOverride } from "./reset/reset-icon-set-override"
import { resetThemeEditorData } from "./reset/reset-theme-editor-data"
import { resetThemeLabel } from "./reset/reset-theme-label"
import { resetThemeOverride } from "./reset/reset-theme-override"
import { resetThemeTokens } from "./reset/reset-theme-tokens"
import { setFontCollectionEditorData } from "./set/set-font-collection-editor-data"
import { setFontCollectionLabel } from "./set/set-font-collection-label"
import { setFontCollectionOverride } from "./set/set-font-collection-override"
import { setIconSetLabel } from "./set/set-icon-set-label"
import { setIconSetOverride } from "./set/set-icon-set-override"
import { setThemeCustomTokenName } from "./set/set-theme-custom-token-name"
import { setThemeEditorData } from "./set/set-theme-editor-data"
import { setThemeLabel } from "./set/set-theme-label"
import { setThemeScaleSlot } from "./set/set-theme-scale-slot"

const defaultThemeId = "theme-seldon-default"
const variantThemeId = "theme-seldon-copy"

const empty = () => createEmptyWorkspace()
const fcId = (ws: Workspace) => Object.keys(ws["font-collections"])[0]!
const iconId = (ws: Workspace) => Object.keys(ws["icon-sets"])[0]!
const themeEntry = (ws: Workspace, id: string) => (ws.themes as any)[id]
const fcEntry = (ws: Workspace, id: string) =>
  (ws["font-collections"] as any)[id]
const iconEntry = (ws: Workspace, id: string) => (ws["icon-sets"] as any)[id]

const variantTheme = () =>
  duplicateTheme(
    {
      themeId: defaultThemeId,
      newThemeId: variantThemeId,
    } as ExtractPayload<"duplicate_theme">,
    empty(),
  )

describe("theme entry metadata", () => {
  it("sets and resets the label", () => {
    const set = setThemeLabel(
      {
        themeId: defaultThemeId,
        label: "Renamed",
      } as ExtractPayload<"set_theme_label">,
      empty(),
    )
    expect(themeEntry(set, defaultThemeId).label).toBe("Renamed")
    const reset = resetThemeLabel(
      { themeId: defaultThemeId } as ExtractPayload<"reset_theme_label">,
      set,
    )
    expect(themeEntry(reset, defaultThemeId).label).not.toBe("Renamed")
  })

  it("sets, clears, and resets editor data", () => {
    const set = setThemeEditorData(
      {
        themeId: defaultThemeId,
        editorData: { note: "x" },
      } as ExtractPayload<"set_theme_editor_data">,
      empty(),
    )
    expect(themeEntry(set, defaultThemeId).__editor).toEqual({ note: "x" })
    const reset = resetThemeEditorData(
      { themeId: defaultThemeId } as ExtractPayload<"reset_theme_editor_data">,
      set,
    )
    expect(themeEntry(reset, defaultThemeId).__editor).toBeUndefined()
  })
})

describe("theme tokens (variant entry)", () => {
  const seedSlot = (ws: Workspace) =>
    setThemeScaleSlot(
      {
        themeId: variantThemeId,
        section: "size",
        key: "custom1",
        value: { kind: "exact", parameters: {} },
      } as never,
      ws,
    )

  it("writes a scale slot, renames it, and clears it", () => {
    const seeded = seedSlot(variantTheme())
    expect(
      (themeEntry(seeded, variantThemeId).overrides.size ?? {}).custom1,
    ).toBeDefined()

    const renamed = setThemeCustomTokenName(
      {
        themeId: variantThemeId,
        section: "size",
        key: "custom1",
        name: "Renamed Token",
      } as ExtractPayload<"set_theme_custom_token_name">,
      seeded,
    )
    expect(
      themeEntry(renamed, variantThemeId).overrides.size.custom1.name,
    ).toBe("Renamed Token")

    const removed = resetThemeOverride(
      {
        themeId: variantThemeId,
        path: "size.custom1",
      } as ExtractPayload<"reset_theme_override">,
      seeded,
    )
    expect(
      (themeEntry(removed, variantThemeId).overrides.size ?? {}).custom1,
    ).toBeUndefined()

    const cleared = resetThemeTokens(
      { themeId: variantThemeId } as ExtractPayload<"reset_theme_tokens">,
      seeded,
    )
    expect(themeEntry(cleared, variantThemeId).overrides).toEqual({})
  })

  it("renaming an unknown token is a no-op", () => {
    const ws = variantTheme()
    expect(
      setThemeCustomTokenName(
        {
          themeId: variantThemeId,
          section: "size",
          key: "custom9",
          name: "x",
        } as ExtractPayload<"set_theme_custom_token_name">,
        ws,
      ),
    ).toBe(ws)
  })
})

describe("font collection entry metadata", () => {
  it("sets and resets the label", () => {
    const ws = empty()
    const id = fcId(ws)
    const set = setFontCollectionLabel(
      {
        fontCollectionId: id,
        label: "Fonts X",
      } as ExtractPayload<"set_font_collection_label">,
      ws,
    )
    expect(fcEntry(set, id).label).toBe("Fonts X")
    resetFontCollectionLabel(
      { fontCollectionId: id } as ExtractPayload<"reset_font_collection_label">,
      set,
    )
  })

  it("sets, clears, and resets editor data", () => {
    const ws = empty()
    const id = fcId(ws)
    const set = setFontCollectionEditorData(
      { fontCollectionId: id, editorData: { n: 1 } } as never,
      ws,
    )
    expect(fcEntry(set, id).__editor).toEqual({ n: 1 })
    const reset = resetFontCollectionEditorData(
      {
        fontCollectionId: id,
      } as ExtractPayload<"reset_font_collection_editor_data">,
      set,
    )
    expect(fcEntry(reset, id).__editor).toBeUndefined()
  })

  it("writes and clears an override path", () => {
    const ws = empty()
    const id = fcId(ws)
    const set = setFontCollectionOverride(
      { fontCollectionId: id, path: "a.b", value: 5 } as never,
      ws,
    )
    expect(fcEntry(set, id).overrides.a.b).toBe(5)
    const reset = resetFontCollectionOverride(
      { fontCollectionId: id, path: "a.b" } as never,
      set,
    )
    expect((fcEntry(reset, id).overrides.a ?? {}).b).toBeUndefined()
    const cleared = resetFontCollection(
      { fontCollectionId: id } as ExtractPayload<"reset_font_collection">,
      set,
    )
    expect(fcEntry(cleared, id).overrides).toEqual({})
  })

  it("adds and removes a custom family on a variant entry", () => {
    const ws = empty()
    const source = fcId(ws)
    const variant = duplicateFontCollection(
      { fontCollectionId: source, newFontCollectionId: "fc-variant" } as never,
      ws,
    )
    const added = addFontCollectionCustomFamily(
      {
        fontCollectionId: "fc-variant",
        name: "My Font",
        stack: ["My Font", "sans-serif"],
        variants: [],
      } as never,
      variant,
    )
    const families = fcEntry(added, "fc-variant").overrides.families ?? {}
    const key = Object.keys(families)[0]!
    expect(families[key].name).toBe("My Font")

    const removed = removeFontCollectionCustomFamily(
      { fontCollectionId: "fc-variant", key } as never,
      added,
    )
    expect(
      (fcEntry(removed, "fc-variant").overrides.families ?? {})[key],
    ).toBeUndefined()
  })
})

describe("icon set entry metadata", () => {
  it("sets the label", () => {
    const ws = empty()
    const id = iconId(ws)
    const set = setIconSetLabel(
      {
        iconSetId: id,
        label: "Icons X",
      } as ExtractPayload<"set_icon_set_label">,
      ws,
    )
    expect(iconEntry(set, id).label).toBe("Icons X")
  })

  it("writes, clears, and resets an override path", () => {
    const ws = empty()
    const id = iconId(ws)
    const set = setIconSetOverride(
      { iconSetId: id, path: "a.b", value: 9 } as never,
      ws,
    )
    expect(iconEntry(set, id).overrides.a.b).toBe(9)
    const reset = resetIconSetOverride(
      { iconSetId: id, path: "a.b" } as never,
      set,
    )
    expect((iconEntry(reset, id).overrides.a ?? {}).b).toBeUndefined()
    const cleared = resetIconSet(
      { iconSetId: id } as ExtractPayload<"reset_icon_set">,
      set,
    )
    expect(iconEntry(cleared, id).overrides).toEqual({})
  })
})
