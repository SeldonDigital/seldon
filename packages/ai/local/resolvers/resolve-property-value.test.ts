import { beforeEach, describe, expect, it, vi } from "vitest"

import type { BoardKey } from "@seldon/core/workspace/types"

import { CHIP_ROW_BOARD, seedChipRowWorkspace } from "../../eval/seed"
import { resolveContext } from "../editor-context"
import { callOllamaFormat } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import {
  parseExactLength,
  resolvePropertyValue,
} from "./resolve-property-value"

vi.mock("../ollama-client", () => ({
  callOllamaFormat: vi.fn(),
}))

const WIDTH_UNITS = ["px", "rem", "%"]
const ROTATION_UNITS = ["deg"]

describe("parseExactLength", () => {
  it("settles a canonical unit without escalating", () => {
    expect(parseExactLength("2rem", WIDTH_UNITS, "px")).toEqual({
      kind: "parsed",
      measure: { value: 2, unit: "rem" },
    })
    expect(parseExactLength("50%", WIDTH_UNITS, "px")).toEqual({
      kind: "parsed",
      measure: { value: 50, unit: "%" },
    })
  })

  it("falls to the schema default when no unit is spoken", () => {
    expect(parseExactLength("100", WIDTH_UNITS, "px")).toEqual({
      kind: "parsed",
      measure: { value: 100, unit: "px" },
    })
    expect(parseExactLength(100, WIDTH_UNITS, "px")).toEqual({
      kind: "parsed",
      measure: { value: 100, unit: "px" },
    })
  })

  it('derives "degrees" from the allowed suffix, costing no call', () => {
    expect(parseExactLength("45 degrees", ROTATION_UNITS, "deg")).toEqual({
      kind: "parsed",
      measure: { value: 45, unit: "deg" },
    })
  })

  it("escalates a synonym no rule can derive", () => {
    // "pixels" does not start with "px" and "percent" does not start with
    // "%", so neither is reachable from core's vocabulary by any rule.
    expect(parseExactLength("100 pixels", WIDTH_UNITS, "px")).toEqual({
      kind: "unknownUnit",
      amount: 100,
      spokenUnit: "pixels",
    })
    expect(parseExactLength("50 percent", WIDTH_UNITS, "px")).toEqual({
      kind: "unknownUnit",
      amount: 50,
      spokenUnit: "percent",
    })
  })

  it("escalates a unit this property does not measure in", () => {
    expect(parseExactLength("45 degrees", WIDTH_UNITS, "px")).toEqual({
      kind: "unknownUnit",
      amount: 45,
      spokenUnit: "degrees",
    })
  })

  it("reports a non-measurement as such, leaving the reducer the gate", () => {
    expect(parseExactLength("auto", WIDTH_UNITS, "px")).toEqual({
      kind: "notALength",
    })
  })
})

/** A turn over the seeded workspace with the chip row board active. */
function turnContext(message: string): TurnContext {
  const { workspace } = seedChipRowWorkspace()
  return {
    state: createTurnState(workspace),
    resolved: resolveContext({
      workspace,
      activeBoardKey: CHIP_ROW_BOARD as BoardKey,
      scope: "board",
    }),
    message,
    calls: [],
    steps: [],
  }
}

function modelAnswers(...answers: unknown[]) {
  const mockedCall = vi.mocked(callOllamaFormat)
  for (const answer of answers) {
    mockedCall.mockResolvedValueOnce({
      value: answer as never,
      metrics: {} as never,
    })
  }
}

describe("resolvePropertyValue", () => {
  beforeEach(() => {
    vi.mocked(callOllamaFormat).mockReset()
  })

  it("names a spoken synonym with one enum-constrained call", async () => {
    // The live failure: the model answers in prose, and core stores
    // {value, unit}. The unit it lands on comes from core's own allowed
    // list, never from a table in this package.
    modelAnswers(
      { pick: "exact", value: "100 pixels" },
      { pick: "unit", value: "px" },
    )
    const context = turnContext("set the width to 100 pixels")

    const resolution = await resolvePropertyValue(context, "width")

    expect(resolution).toEqual({
      kind: "resolved",
      value: { type: "exact", value: { value: 100, unit: "px" } },
    })
    expect(callOllamaFormat).toHaveBeenCalledTimes(2)
  })

  it("costs no second call when the unit is already canonical", async () => {
    modelAnswers({ pick: "exact", value: "100px" })
    const context = turnContext("set the width to 100px")

    const resolution = await resolvePropertyValue(context, "width")

    expect(resolution).toEqual({
      kind: "resolved",
      value: { type: "exact", value: { value: 100, unit: "px" } },
    })
    expect(callOllamaFormat).toHaveBeenCalledTimes(1)
  })

  it("stops the turn on a unit the property cannot measure in", async () => {
    // Forcing the enum would apply 45px silently. The refusal branch is what
    // keeps a meaningless request an error instead of a wrong value.
    modelAnswers(
      { pick: "exact", value: "45 degrees" },
      { pick: "unsupported" },
    )
    const context = turnContext("set the width to 45 degrees")

    const resolution = await resolvePropertyValue(context, "width")

    expect(resolution.kind).toBe("message")
    if (resolution.kind !== "message") throw new Error("expected a refusal")
    expect(resolution.text).toContain("degrees")
    expect(resolution.text).toContain("px, rem, %")
  })

  it("never offers an exact branch for a property whose schema forbids it", async () => {
    // display supports only empty/inherit/option -- an exact pick is a
    // guaranteed Core rejection, so the stage must not offer that branch.
    modelAnswers({ pick: "option", value: "hide" })
    const context = turnContext("hide it")

    const resolution = await resolvePropertyValue(context, "display")

    expect(resolution).toEqual({ kind: "resolved", value: "hide" })
    const [{ schema }] = vi.mocked(callOllamaFormat).mock.calls[0]!
    const branchPicks = (
      schema as { oneOf: Array<{ properties: { pick: { const: string } } }> }
    ).oneOf.map((branch) => branch.properties.pick.const)
    expect(branchPicks).not.toContain("exact")
  })
})
