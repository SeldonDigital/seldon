import { describe, expect, it } from "vitest"

import {
  TEXT_LIST_BOARD,
  TEXT_LIST_TOPICS,
  seedTextListWorkspace,
} from "./seed"

describe("seedTextListWorkspace", () => {
  it("inserts one text node per topic, in order, with distinct content", () => {
    const seed = seedTextListWorkspace()
    expect(seed.boardKey).toBe(TEXT_LIST_BOARD)
    expect(seed.textNodeIds.length).toBe(TEXT_LIST_TOPICS.length)

    for (let index = 0; index < seed.textNodeIds.length; index++) {
      const node = seed.workspace.nodes[seed.textNodeIds[index]!] as {
        overrides?: Record<string, { value?: unknown }>
      }
      expect(node.overrides?.content?.value).toBe(TEXT_LIST_TOPICS[index])
    }
  })
})
