import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getChildNodeById } from "./get-child-node-by-id"

describe("getChildNodeById", () => {
  it("should return child node by id", () => {
    const childNode = getChildNodeById("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)

    expect(childNode.id).toEqual("child-icon-K3GlMKHA")
    expect(childNode.component).toEqual(ComponentId.ICON)
    expect(childNode.level).toEqual(ComponentLevel.PRIMITIVE)
    expect(childNode.isChild).toBe(true)
  })

  it("should return different child node", () => {
    const childNode = getChildNodeById(
      "child-label-wCHRir3I",
      WORKSPACE_FIXTURE,
    )

    expect(childNode.id).toEqual("child-label-wCHRir3I")
    expect(childNode.component).toEqual(ComponentId.LABEL)
    expect(childNode.level).toEqual(ComponentLevel.PRIMITIVE)
    expect(childNode.isChild).toBe(true)
  })

  it("should throw error for non-existent child", () => {
    expect(() => {
      getChildNodeById("child-button-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })

  it("should throw error for variant node", () => {
    expect(() => {
      getChildNodeById("variant-button-default", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
