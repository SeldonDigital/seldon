import { describe, expect, it } from "vitest"

import { dropTargetEvidencedPicks } from "./resolve-property-name"

describe("dropTargetEvidencedPicks", () => {
  it("rejects a pick evidenced by a descriptor word", () => {
    const { surviving, rejected } = dropTargetEvidencedPicks(
      [
        { key: "position.top", evidenceWord: "top" },
        { key: "display", evidenceWord: "hide" },
      ],
      { match: "top two chips", baseNode: "chips" },
    )
    expect(rejected).toEqual([{ key: "position.top", evidenceWord: "top" }])
    expect(surviving).toEqual([{ key: "display", evidenceWord: "hide" }])
  })

  it("keeps the same word when it is not a descriptor in this message", () => {
    // "Move the chip to the top": "top" is the destination, not a descriptor.
    const { surviving, rejected } = dropTargetEvidencedPicks(
      [{ key: "position.top", evidenceWord: "top" }],
      { match: "chip", baseNode: "chip" },
    )
    expect(rejected).toEqual([])
    expect(surviving).toEqual([{ key: "position.top", evidenceWord: "top" }])
  })

  it("exempts the bare noun: a kind name may double as a property word", () => {
    // 'change the text to "Buy now"': content is evidenced by "text", the
    // very node the edit targets. Only describing words are theft candidates.
    const { surviving, rejected } = dropTargetEvidencedPicks(
      [{ key: "content", evidenceWord: "text" }],
      { match: "text", baseNode: "text" },
    )
    expect(rejected).toEqual([])
    expect(surviving).toEqual([{ key: "content", evidenceWord: "text" }])
  })

  it("exempts the noun across singular/plural transcription drift", () => {
    // extract-target came back with baseNode "chip" for "the chips" live;
    // the evidence enum carries the message's own inflection ("texts").
    const { rejected } = dropTargetEvidencedPicks(
      [{ key: "content", evidenceWord: "texts" }],
      { match: "top texts", baseNode: "text" },
    )
    expect(rejected).toEqual([])
  })

  it("still rejects descriptor words when the noun was transcribed oddly", () => {
    const { rejected } = dropTargetEvidencedPicks(
      [{ key: "position.top", evidenceWord: "top" }],
      { match: "top chip", baseNode: "chips" },
    )
    expect(rejected).toEqual([{ key: "position.top", evidenceWord: "top" }])
  })

  it("compares case-insensitively", () => {
    const { rejected } = dropTargetEvidencedPicks(
      [{ key: "position.top", evidenceWord: "Top" }],
      { match: "TOP two chips", baseNode: "chips" },
    )
    expect(rejected).toHaveLength(1)
  })

  it("is a no-op without a target hint", () => {
    const picks = [{ key: "position.top", evidenceWord: "top" }]
    const { surviving, rejected } = dropTargetEvidencedPicks(picks, undefined)
    expect(rejected).toEqual([])
    expect(surviving).toEqual(picks)
  })
})
