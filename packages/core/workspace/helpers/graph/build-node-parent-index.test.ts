import { describe, expect, it } from "vitest"

import {
  buildNodeParentIndex,
  getNodeParentIndex,
} from "./build-node-parent-index"

describe("buildNodeParentIndex", () => {
  it("maps each child to its composition parent depth-first", () => {
    const index = buildNodeParentIndex({
      boards: {
        button: {
          type: "component",
          variants: [
            {
              id: "root",
              children: [
                { id: "child1", children: [{ id: "grandchild" }] },
                "child2",
              ],
            },
          ],
        },
      },
    })

    expect(index.get("child1")).toBe("root")
    expect(index.get("grandchild")).toBe("child1")
    expect(index.get("child2")).toBe("root")
  })

  it("keeps the first parent when an id appears under multiple boards", () => {
    const index = buildNodeParentIndex({
      boards: {
        aaa: {
          type: "component",
          variants: [{ id: "pa", children: [{ id: "shared" }] }],
        },
        zzz: {
          type: "component",
          variants: [{ id: "pz", children: [{ id: "shared" }] }],
        },
      },
    })

    expect(index.get("shared")).toBe("pa")
  })

  it("skips non-composition rows", () => {
    const index = buildNodeParentIndex({
      boards: {
        theme: {
          type: "theme",
          variants: [{ id: "tRoot", children: [{ id: "tChild" }] }],
        },
      },
    })

    expect(index.has("tChild")).toBe(false)
  })
})

describe("getNodeParentIndex", () => {
  it("caches by source reference", () => {
    const source = {
      boards: {
        button: {
          type: "component",
          variants: [{ id: "root", children: [{ id: "child" }] }],
        },
      },
    }

    expect(getNodeParentIndex(source)).toBe(getNodeParentIndex(source))
    expect(getNodeParentIndex({ ...source })).not.toBe(
      getNodeParentIndex(source),
    )
  })
})
