import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import { getComponentDescendantIds } from "./get-descendant-ids"

function expectParentBeforeChild(
  ids: ComponentId[],
  parent: ComponentId,
  child: ComponentId,
) {
  expect(ids.indexOf(parent)).toBeGreaterThanOrEqual(0)
  expect(ids.indexOf(child)).toBeGreaterThanOrEqual(0)
  expect(ids.indexOf(parent)).toBeLessThan(ids.indexOf(child))
}

describe("getComponentDescendantIds", () => {
  it("collects primitives under nested frames in calendar composition", () => {
    const ids = getComponentDescendantIds(ComponentId.CALENDAR)

    expect(ids).toContain(ComponentId.CALENDAR)
    expect(ids).toContain(ComponentId.FRAME)
    expect(ids).toContain(ComponentId.TABLE_HEADER)
    expect(ids).toContain(ComponentId.TABLE_DATA)
    expectParentBeforeChild(ids, ComponentId.CALENDAR, ComponentId.FRAME)
  })

  it("collects primitives under nested frames in table composition", () => {
    const ids = getComponentDescendantIds(ComponentId.TABLE)

    expect(ids).toContain(ComponentId.TABLE)
    expect(ids).toContain(ComponentId.FRAME)
    expect(ids).toContain(ComponentId.TABLE_HEADER)
    expect(ids).toContain(ComponentId.TABLE_DATA)
    expectParentBeforeChild(ids, ComponentId.TABLE, ComponentId.FRAME)
  })

  it("orders parents before children for button composition", () => {
    const ids = getComponentDescendantIds(ComponentId.BUTTON)

    expect(ids).toContain(ComponentId.BUTTON)
    expect(ids).toContain(ComponentId.LABEL)
    expectParentBeforeChild(ids, ComponentId.BUTTON, ComponentId.LABEL)
  })
})
