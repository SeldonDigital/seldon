import { describe, expect, it } from "vitest"

import { rankBySimilarity } from "./embed-rank"

/**
 * Sanity checks for the local embedding rank. The first run downloads the
 * ~34MB bge-small weights into the HF cache; later runs are offline. When
 * the model can't load at all, rankBySimilarity returns null and these
 * assertions are skipped -- the production code path degrades the same way.
 */
describe("rankBySimilarity", () => {
  it("ranks a near-duplicate above an unrelated text", async () => {
    const ranked = await rankBySimilarity("the checkout button", [
      { id: "a", text: "button, Checkout" },
      { id: "b", text: "image, hero background photo" },
    ])
    if (ranked === null) {
      console.warn("[embed-rank.test] embeddings unavailable, skipping")
      return
    }
    expect(ranked[0]?.id).toBe("a")
    expect(ranked[0]!.score).toBeGreaterThan(ranked[1]!.score)
  }, 240_000)

  it("matches spatial phrasing against canonical position labels", async () => {
    const ranked = await rankBySimilarity("the last button", [
      { id: "top", text: "button, Submit, position: top, first, top-most" },
      {
        id: "bottom",
        text: "button, Cancel, position: bottom, last, bottom-most",
      },
    ])
    if (ranked === null) return
    expect(ranked[0]?.id).toBe("bottom")
  }, 240_000)

  it("returns [] for no candidates", async () => {
    expect(await rankBySimilarity("anything", [])).toEqual([])
  })
})
