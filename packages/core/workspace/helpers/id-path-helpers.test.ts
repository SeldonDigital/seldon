import { describe, expect, it } from "vitest"

import { fontCollectionBoardKeyFromEntryId } from "./font-collections/font-collection-id"
import { iconSetBoardKeyFromEntryId } from "./icon-sets/icon-set-id"

describe("entry id parsing", () => {
  it("derives the board key from a font collection entry id", () => {
    expect(
      fontCollectionBoardKeyFromEntryId("font-collection-system-default"),
    ).toBe("system")
    expect(fontCollectionBoardKeyFromEntryId("not-an-id")).toBeNull()
  })

  it("derives the board key from an icon set entry id", () => {
    expect(iconSetBoardKeyFromEntryId("icon-set-seldonIcons-default")).toBe(
      "seldonIcons",
    )
    expect(iconSetBoardKeyFromEntryId("nope")).toBeNull()
  })
})
