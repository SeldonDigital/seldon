import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getNodeById } from "./get-node-by-id"

describe("getNodeById", () => {
  it("should find the correct node by id", () => {
    const iconNode = getNodeById("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)
    const variantNode = getNodeById("variant-button-default", WORKSPACE_FIXTURE)

    expect(iconNode.id).toEqual("child-icon-K3GlMKHA")
    expect(iconNode.component).toEqual(ComponentId.ICON)
    expect(iconNode.level).toEqual(ComponentLevel.PRIMITIVE)

    expect(variantNode.id).toEqual("variant-button-default")
    expect(variantNode.component).toEqual(ComponentId.BUTTON)
    expect(variantNode.level).toEqual(ComponentLevel.ELEMENT)
  })

  it("should throw error for non-existent node", () => {
    expect(() => {
      getNodeById("child-button-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })

  it("should find child nodes correctly", () => {
    const childNode = getNodeById("child-button-4eo3qAPb", WORKSPACE_FIXTURE)

    expect(childNode.id).toEqual("child-button-4eo3qAPb")
    expect(childNode.isChild).toBe(true)

    if (childNode.isChild) {
      expect(childNode.variant).toEqual("variant-button-default")
      expect(childNode.instanceOf).toEqual("child-button-5Q6oG09m")
    }
  })
})
