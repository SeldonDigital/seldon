import { describe, expect, it } from "bun:test"
import { BUTTON_VARIANT, LABEL_CHILD } from "../../helpers/fixtures/nodes"
import { duplicateNode } from "./duplicate-node"

describe("duplicateNode", () => {
  it("should return a duplicated variant with a different id", () => {
    const duplicate = duplicateNode(BUTTON_VARIANT)

    expect(duplicate.id).not.toEqual(BUTTON_VARIANT.id)
    expect(duplicate.label).toEqual(BUTTON_VARIANT.label)
    expect(duplicate.component).toEqual(BUTTON_VARIANT.component)
    expect(duplicate.level).toEqual(BUTTON_VARIANT.level)
    expect(duplicate.children).toEqual(BUTTON_VARIANT.children)
    expect(duplicate.properties).toEqual(BUTTON_VARIANT.properties)
  })

  it("should return a duplicated instance with a different id", () => {
    const duplicate = duplicateNode(LABEL_CHILD)

    expect(duplicate.id).not.toEqual(LABEL_CHILD.id)
    expect(duplicate.label).toEqual(LABEL_CHILD.label)
    expect(duplicate.component).toEqual(LABEL_CHILD.component)
    expect(duplicate.level).toEqual(LABEL_CHILD.level)
    expect(duplicate.properties).toEqual(LABEL_CHILD.properties)
  })
})
