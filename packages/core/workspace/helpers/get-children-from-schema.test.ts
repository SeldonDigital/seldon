import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { Component } from "../../components/types"
import { getChildrenFromSchema } from "./get-children-from-schema"

describe("getChildrenFromSchema", () => {
  it("should return children if they exist in the component", () => {
    const component: Component = {
      component: ComponentId.FRAME,
      children: [
        { component: ComponentId.BUTTON },
        { component: ComponentId.ICON },
      ],
    }

    expect(getChildrenFromSchema(component)).toEqual([
      { component: ComponentId.BUTTON },
      { component: ComponentId.ICON },
    ])
  })

  it("should return children from original schema if not in component", () => {
    const component: Component = {
      component: ComponentId.BUTTON,
    }

    const result = getChildrenFromSchema(component)
    expect(result).toEqual([
      expect.objectContaining({ component: ComponentId.ICON }),
      expect.objectContaining({ component: ComponentId.LABEL }),
    ])
  })

  it("should return empty array if no children exist", () => {
    const component: Component = {
      component: ComponentId.LABEL,
    }

    expect(getChildrenFromSchema(component)).toEqual([])
  })
})
