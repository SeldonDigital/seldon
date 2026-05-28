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

  it("does not include default-only children when a narrower variant is selected", () => {
    const ids = getComponentDescendantIds(ComponentId.SIDEBAR)

    expect(ids).toContain(ComponentId.BUTTON)
    expect(ids).toContain(ComponentId.LABEL)
    expect(ids).not.toContain(ComponentId.ICON)
  })

  it("orders icon before barHeader when dialog uses a partial barHeader slot", () => {
    const loopOrder = getComponentDescendantIds(ComponentId.DIALOG).reverse()

    expect(loopOrder.indexOf(ComponentId.ICON)).toBeLessThan(
      loopOrder.indexOf(ComponentId.BAR_HEADER),
    )
  })

  it("orders icon before section when footer repeats section slots", () => {
    const loopOrder = getComponentDescendantIds(ComponentId.FOOTER).reverse()

    expect(loopOrder.indexOf(ComponentId.ICON)).toBeLessThan(
      loopOrder.indexOf(ComponentId.SECTION),
    )
  })

  it("includes frame and image when full-catalog boards embed them only in catalog variants", () => {
    const ids = getComponentDescendantIds(ComponentId.FOOTER)

    expect(ids).toContain(ComponentId.FRAME)
    expect(ids).toContain(ComponentId.IMAGE)
  })

  it("orders parents before children for button composition", () => {
    const ids = getComponentDescendantIds(ComponentId.BUTTON)

    expect(ids).toContain(ComponentId.BUTTON)
    expect(ids).toContain(ComponentId.LABEL)
    expectParentBeforeChild(ids, ComponentId.BUTTON, ComponentId.LABEL)
  })
})
