import { describe, expect, it } from "vitest"

import type { IconId } from "../../icon-sets"
import type { IconSetId } from "../types"
import { iconBelongsToIconSet } from "./get-icon-category-from-id"

describe("iconBelongsToIconSet", () => {
  it("matches an icon id against its set prefix", () => {
    expect(
      iconBelongsToIconSet(
        "material-add" as IconId,
        "google-material" as IconSetId,
      ),
    ).toBe(true)
  })

  it("rejects an icon id from another set", () => {
    expect(
      iconBelongsToIconSet(
        "lucide-x" as IconId,
        "google-material" as IconSetId,
      ),
    ).toBe(false)
  })
})
