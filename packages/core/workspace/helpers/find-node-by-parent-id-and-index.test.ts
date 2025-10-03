import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { findNodeByParentIdAndIndex } from "./find-node-by-parent-id-and-index"

describe("findNodeByParentIdAndIndex", () => {
  it("should find child node by parent id and index", () => {
    const childNode = findNodeByParentIdAndIndex(
      "variant-button-default",
      0,
      WORKSPACE_FIXTURE,
    )

    expect(childNode.id).toEqual("child-icon-K3GlMKHA")
    expect(childNode.component).toEqual(ComponentId.ICON)
    expect(childNode.level).toEqual(ComponentLevel.PRIMITIVE)
  })

  it("should find child node at different index", () => {
    const childNode = findNodeByParentIdAndIndex(
      "variant-button-default",
      1,
      WORKSPACE_FIXTURE,
    )

    expect(childNode.id).toEqual("child-label-wCHRir3I")
    expect(childNode.component).toEqual(ComponentId.LABEL)
    expect(childNode.level).toEqual(ComponentLevel.PRIMITIVE)
  })

  it("should throw error for invalid index", () => {
    expect(() => {
      findNodeByParentIdAndIndex("variant-button-default", 5, WORKSPACE_FIXTURE)
    }).toThrow()
  })

  it("should throw error for parent with no children", () => {
    expect(() => {
      findNodeByParentIdAndIndex(
        "variant-tagline-default",
        0,
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })
})
