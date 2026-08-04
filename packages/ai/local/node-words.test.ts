import { describe, expect, it } from "vitest"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"

import { seedChipRowWorkspace, seedTextListWorkspace } from "../eval/seed"
import { describeNodeInWords, replaceNodeIdsWithWords } from "./node-words"

describe("describeNodeInWords", () => {
  it("names a text by the content someone typed onto it", () => {
    const { workspace, textNodeIds } = seedTextListWorkspace()
    const described = describeNodeInWords(workspace, textNodeIds[0]!)
    expect(described).toContain("The new sedan gets")
    expect(described).not.toContain(textNodeIds[0]!)
  })

  it("falls back to the catalog word for a node with no authored content", () => {
    const { workspace, chipIds } = seedChipRowWorkspace()
    expect(describeNodeInWords(workspace, chipIds[0]!)).toContain("chip")
  })

  it("does not invent a description for a node the workspace never had", () => {
    expect(
      describeNodeInWords(createEmptyWorkspace(), "component-text-gone"),
    ).toBe("that element")
  })
})

describe("replaceNodeIdsWithWords", () => {
  it("swaps a real node id inside a resolver's sentence", () => {
    const { workspace, chipIds } = seedChipRowWorkspace()
    const rewritten = replaceNodeIdsWithWords(
      workspace,
      `Node ${chipIds[0]} has no component schema, so its properties can't be resolved.`,
    )
    expect(rewritten).not.toContain(chipIds[0]!)
    expect(rewritten).toContain("chip")
    expect(rewritten).toContain("has no component schema")
  })

  it("swaps every id when a sentence names two nodes", () => {
    const { workspace, chipIds } = seedChipRowWorkspace()
    const rewritten = replaceNodeIdsWithWords(
      workspace,
      `Changing ${chipIds[0]} here would write its shared source ${chipIds[1]}.`,
    )
    expect(rewritten).not.toContain(chipIds[0]!)
    expect(rewritten).not.toContain(chipIds[1]!)
  })

  it("leaves an unknown id alone rather than guessing at it", () => {
    const { workspace } = seedChipRowWorkspace()
    const sentence = "Removed component-chip-neverExisted."
    expect(replaceNodeIdsWithWords(workspace, sentence)).toBe(sentence)
  })

  it("leaves text with no ids untouched", () => {
    const { workspace } = seedChipRowWorkspace()
    const sentence = "That matched 6 elements. Name the one you mean."
    expect(replaceNodeIdsWithWords(workspace, sentence)).toBe(sentence)
  })
})
