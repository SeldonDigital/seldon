import { describe, expect, it } from "bun:test"
import { useNodeRectsStore } from "./use-node-rects-store"

describe("useNodeRectsStore", () => {
  it("should update node rects", () => {
    let store = useNodeRectsStore.getState()
    const rect = { top: 100, left: 200, width: 300, height: 150 }

    store.updateRect("node-1", rect)
    store = useNodeRectsStore.getState()

    expect(store.rects["node-1"]).toEqual(rect)
  })

  it("should handle null rects", () => {
    let store = useNodeRectsStore.getState()

    store.updateRect("node-1", null)
    store = useNodeRectsStore.getState()

    expect(store.rects["node-1"]).toBeNull()
  })

  it("should handle multiple node rects", () => {
    let store = useNodeRectsStore.getState()

    // Set up multiple rects
    store.updateRect("node-1", {
      top: 100,
      left: 200,
      width: 300,
      height: 150,
    })
    store.updateRect("node-2", {
      top: 250,
      left: 300,
      width: 200,
      height: 100,
    })
    store.updateRect("node-3", null)

    store = useNodeRectsStore.getState()

    expect(store.rects["node-1"]).toEqual({
      top: 100,
      left: 200,
      width: 300,
      height: 150,
    })
    expect(store.rects["node-2"]).toEqual({
      top: 250,
      left: 300,
      width: 200,
      height: 100,
    })
    expect(store.rects["node-3"]).toBeNull()
    expect(store.rects["node-4"]).toBeUndefined() // Not set, should be undefined
  })
})
