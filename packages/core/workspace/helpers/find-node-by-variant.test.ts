import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { findNodeByVariant } from "./find-node-by-variant"

describe("findNodeByVariant", () => {
  it("should find node by variant id", () => {
    const node = findNodeByVariant("variant-button-default", WORKSPACE_FIXTURE)

    expect(node).not.toBeNull()
    expect(node!.id).toEqual("child-button-4eo3qAPb")
    expect(node!.component).toEqual(ComponentId.BUTTON)
    expect(node!.level).toEqual(ComponentLevel.ELEMENT)
    expect(node!.isChild).toBe(true)
  })

  it("should return null for non-existent variant", () => {
    const node = findNodeByVariant("variant-nonexistent", WORKSPACE_FIXTURE)
    expect(node).toBeNull()
  })

  it("should find nested child nodes by variant", () => {
    const node = findNodeByVariant("variant-label-default", WORKSPACE_FIXTURE)

    expect(node).not.toBeNull()
    expect(node!.id).toEqual("child-label-uhhihiiA")
    expect(node!.component).toEqual(ComponentId.LABEL)
    expect(node!.level).toEqual(ComponentLevel.PRIMITIVE)
  })
})
