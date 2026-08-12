import { describe, expect, it } from "vitest"

import { ValueType } from "@seldon/core"

import { getOverflowStyles } from "./get-overflow-styles"

import type { Properties } from "@seldon/core"

const props = (partial: Record<string, unknown>): Properties => partial as unknown as Properties

const scrollValue = (value: string) => ({ type: ValueType.OPTION, value })

const clipValue = (value: unknown) => ({ type: ValueType.EXACT, value })

describe("getOverflowStyles", () => {
  describe("scroll only", () => {
    it("maps none to hidden overflow", () => {
      expect(getOverflowStyles({ properties: props({ scroll: scrollValue("none") }) })).toEqual({
        overflow: "hidden",
      })
    })

    it("maps horizontal to axis longhands", () => {
      expect(
        getOverflowStyles({ properties: props({ scroll: scrollValue("horizontal") }) }),
      ).toEqual({
        overflowX: "auto",
        overflowY: "hidden",
      })
    })

    it("maps vertical to axis longhands", () => {
      expect(getOverflowStyles({ properties: props({ scroll: scrollValue("vertical") }) })).toEqual(
        {
          overflowX: "hidden",
          overflowY: "auto",
        },
      )
    })

    it("maps both to auto overflow", () => {
      expect(getOverflowStyles({ properties: props({ scroll: scrollValue("both") }) })).toEqual({
        overflow: "auto",
      })
    })

    it("falls back to auto overflow for any other option", () => {
      expect(getOverflowStyles({ properties: props({ scroll: scrollValue("weird") }) })).toEqual({
        overflow: "auto",
      })
    })
  })

  describe("clip only", () => {
    it("hides overflow for boolean true", () => {
      expect(getOverflowStyles({ properties: props({ clip: clipValue(true) }) })).toEqual({
        overflow: "hidden",
      })
    })

    it("hides overflow for numeric 1", () => {
      expect(getOverflowStyles({ properties: props({ clip: clipValue(1) }) })).toEqual({
        overflow: "hidden",
      })
    })

    it("hides overflow for the string 'true' or 'on'", () => {
      expect(getOverflowStyles({ properties: props({ clip: clipValue("TRUE") }) })).toEqual({
        overflow: "hidden",
      })
      expect(getOverflowStyles({ properties: props({ clip: clipValue("on") }) })).toEqual({
        overflow: "hidden",
      })
    })

    it("returns no styles for falsey or unrelated clip values", () => {
      expect(getOverflowStyles({ properties: props({ clip: clipValue(false) }) })).toEqual({})
      expect(getOverflowStyles({ properties: props({ clip: clipValue("off") }) })).toEqual({})
      expect(getOverflowStyles({ properties: props({ clip: clipValue(0) }) })).toEqual({})
    })
  })

  describe("clip combined with scroll", () => {
    it("keeps the vertical scrolling axis open when clip is set", () => {
      expect(
        getOverflowStyles({
          properties: props({ scroll: scrollValue("vertical"), clip: clipValue(true) }),
        }),
      ).toEqual({
        overflowX: "hidden",
        overflowY: "auto",
      })
    })

    it("keeps the horizontal scrolling axis open when clip is set", () => {
      expect(
        getOverflowStyles({
          properties: props({ scroll: scrollValue("horizontal"), clip: clipValue(true) }),
        }),
      ).toEqual({
        overflowX: "auto",
        overflowY: "hidden",
      })
    })

    it("lets scroll both win over clip", () => {
      expect(
        getOverflowStyles({
          properties: props({ scroll: scrollValue("both"), clip: clipValue(true) }),
        }),
      ).toEqual({
        overflow: "auto",
      })
    })

    it("hides both axes when scroll is none and clip is set", () => {
      expect(
        getOverflowStyles({
          properties: props({ scroll: scrollValue("none"), clip: clipValue(true) }),
        }),
      ).toEqual({
        overflow: "hidden",
      })
    })
  })

  it("returns no styles when neither scroll nor clip is set", () => {
    expect(getOverflowStyles({ properties: props({}) })).toEqual({})
  })
})
