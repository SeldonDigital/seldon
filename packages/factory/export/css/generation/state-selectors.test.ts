import { describe, expect, it } from "vitest"

import {
  STATE_CLASS_PREFIX,
  getAncestorStateSelectorSuffixes,
  getStateSelectorSuffixes,
} from "./state-selectors"

describe("getStateSelectorSuffixes", () => {
  it("maps single-suffix reserved states", () => {
    expect(getStateSelectorSuffixes("hover")).toEqual([":hover"])
    expect(getStateSelectorSuffixes("focused")).toEqual([":focus-visible"])
    expect(getStateSelectorSuffixes("active")).toEqual([":active"])
    expect(getStateSelectorSuffixes("checked")).toEqual([":checked"])
  })

  it("maps multi-suffix reserved states", () => {
    expect(getStateSelectorSuffixes("disabled")).toEqual([
      ":disabled",
      '[aria-disabled="true"]',
    ])
  })

  it("maps attribute-backed reserved states", () => {
    expect(getStateSelectorSuffixes("error")).toEqual(['[aria-invalid="true"]'])
    expect(getStateSelectorSuffixes("selected")).toEqual([
      '[aria-selected="true"]',
    ])
  })

  it("maps class-backed reserved states", () => {
    expect(getStateSelectorSuffixes("dragged")).toEqual([".sdn-state-dragged"])
  })

  it("maps a custom state to a runtime-toggled class", () => {
    expect(getStateSelectorSuffixes("myState")).toEqual([
      `.${STATE_CLASS_PREFIX}myState`,
    ])
  })
})

describe("getAncestorStateSelectorSuffixes", () => {
  it("uses focus-within for focused on an ancestor", () => {
    expect(getAncestorStateSelectorSuffixes("focused")).toEqual([
      ":focus-within",
    ])
  })

  it("uses :has(:checked) for checked on an ancestor", () => {
    expect(getAncestorStateSelectorSuffixes("checked")).toEqual([
      ":has(:checked)",
    ])
  })

  it("matches the self binding for hover", () => {
    expect(getAncestorStateSelectorSuffixes("hover")).toEqual([":hover"])
  })

  it("maps a custom state to the same runtime-toggled class", () => {
    expect(getAncestorStateSelectorSuffixes("myState")).toEqual([
      `.${STATE_CLASS_PREFIX}myState`,
    ])
  })
})
