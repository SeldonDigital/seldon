import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { setIconSetSubcategoryPreset } from "./set-icon-set-subcategory-preset"

const baseWorkspace = createEmptyWorkspace()
const iconSetId = Object.keys(baseWorkspace["icon-sets"])[0]!
const subcategory = "user-interface/text"
const sampleIcon = "seldon-lines"

const applyPreset = (preset: "all" | "none", ws = baseWorkspace) =>
  setIconSetSubcategoryPreset(
    { iconSetId, subcategory, preset } as ExtractPayload<"set_icon_set_subcategory_preset">,
    ws,
  )

describe("setIconSetSubcategoryPreset", () => {
  it("includes every icon under the subcategory for the all preset", () => {
    const next = applyPreset("all")
    const overrides = next["icon-sets"][iconSetId]!.overrides as Record<
      string,
      any
    >
    expect(overrides.includedIcons[sampleIcon]).toBe(true)
  })

  it("excludes every icon under the subcategory for the none preset", () => {
    const next = applyPreset("none")
    const overrides = next["icon-sets"][iconSetId]!.overrides as Record<
      string,
      any
    >
    expect(overrides.includedIcons[sampleIcon]).toBe(false)
  })

  it("is a no-op for an unknown icon set id", () => {
    const result = setIconSetSubcategoryPreset(
      {
        iconSetId: "ghost-icon-set",
        subcategory,
        preset: "all",
      } as ExtractPayload<"set_icon_set_subcategory_preset">,
      baseWorkspace,
    )
    expect(result).toBe(baseWorkspace)
  })
})
