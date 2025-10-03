import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { getNodeOrientation } from "./get-node-orientation"

describe("getNodeOrientation", () => {
  it("should return orientation for board", () => {
    const orientation = getNodeOrientation(
      ComponentId.BUTTON,
      WORKSPACE_FIXTURE,
    )
    expect(orientation).toBe("vertical")
  })

  it("should return orientation for variant", () => {
    const orientation = getNodeOrientation(
      "variant-button-default",
      WORKSPACE_FIXTURE,
    )
    expect(orientation).toBe("horizontal")
  })

  it("should return orientation for instance", () => {
    const orientation = getNodeOrientation(
      "child-icon-K3GlMKHA",
      WORKSPACE_FIXTURE,
    )
    expect(orientation).toBe("horizontal")
  })

  it("should return horizontal as default when no orientation found", () => {
    const orientation = getNodeOrientation(
      "child-label-wCHRir3I",
      WORKSPACE_FIXTURE,
    )
    expect(orientation).toBe("horizontal")
  })
})
