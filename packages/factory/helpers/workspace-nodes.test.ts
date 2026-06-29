import { describe, expect, it } from "vitest"

import { getInstanceClassHash } from "./workspace-nodes"

describe("getInstanceClassHash", () => {
  it("takes the last id segment, lowercased and trimmed to four chars", () => {
    expect(getInstanceClassHash("component-button-AB12X")).toBe("ab12")
  })

  it("pads short segments to four characters with zeros", () => {
    expect(getInstanceClassHash("node-x-7")).toBe("7000")
  })

  it("strips non-alphanumeric characters then pads", () => {
    expect(getInstanceClassHash("node-a_b!c")).toBe("abc0")
  })

  it("returns four zeros when there is no usable segment", () => {
    expect(getInstanceClassHash("node-")).toBe("0000")
  })
})
