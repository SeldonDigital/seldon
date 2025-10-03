import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { getComponentDescendantIds } from "./get-descendant-ids"

describe("getComponentDescendantIds", () => {
  it("should return the components to add for CARD_PRODUCT", () => {
    expect(getComponentDescendantIds(ComponentId.CARD_PRODUCT)).toEqual([
      ComponentId.CARD_PRODUCT,
      ComponentId.TEXTBLOCK_DETAILS,
      ComponentId.TAGLINE,
      ComponentId.TITLE,
      ComponentId.DESCRIPTION,
      ComponentId.BAR_BUTTONS,
      ComponentId.BUTTON,
      ComponentId.ICON,
      ComponentId.LABEL,
    ])
  })

  it("should return single component for primitive components", () => {
    expect(getComponentDescendantIds(ComponentId.LABEL)).toEqual([
      ComponentId.LABEL,
    ])
  })

  it("should return component and its children for element components", () => {
    expect(getComponentDescendantIds(ComponentId.BUTTON)).toEqual([
      ComponentId.BUTTON,
      ComponentId.ICON,
      ComponentId.LABEL,
    ])
  })

  it("should return component and its children for part components", () => {
    expect(getComponentDescendantIds(ComponentId.BAR_BUTTONS)).toEqual([
      ComponentId.BAR_BUTTONS,
      ComponentId.BUTTON,
      ComponentId.ICON,
      ComponentId.LABEL,
    ])
  })
})
