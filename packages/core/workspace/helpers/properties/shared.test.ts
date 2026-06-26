import { describe, expect, it } from "vitest"

import { ValueType } from "@seldon/core"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { getPropertyStatus } from "./property-status"
import {
  compoundFacetMatches,
  compoundSubPropertyPath,
  getBackgroundFacetsForKind,
  getCompoundLayerValue,
  getLayeredPaintLayerCount,
  getPropertyOverridesBag,
  getTypedNode,
  hasSchemaSubProperty,
  isShorthandProperty,
  isValueEmpty,
  isValueSet,
  layeredParentPropertyPath,
  propertyValuesMatch,
  wrapCompoundPropertyValue,
} from "./shared"

const exact = (value: unknown) => ({ type: ValueType.EXACT, value })
const empty = { type: ValueType.EMPTY, value: null }

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as any).variants[0].id as string

describe("value emptiness", () => {
  it("classifies empty and set values", () => {
    expect(isValueEmpty(empty)).toBe(true)
    expect(isValueEmpty(null)).toBe(true)
    expect(isValueEmpty(exact(1))).toBe(false)
    expect(isValueSet(exact(1))).toBe(true)
    expect(isValueSet(empty)).toBe(false)
  })
})

describe("compound layer access", () => {
  it("reads a layer from arrays and objects", () => {
    expect(getCompoundLayerValue([{ a: 1 }], 0)).toEqual({ a: 1 })
    expect(getCompoundLayerValue({ a: 1 })).toEqual({ a: 1 })
    expect(getCompoundLayerValue(null)).toBeNull()
    expect(getCompoundLayerValue([{ a: 1 }], 5)).toBeNull()
  })

  it("counts paint layers", () => {
    expect(getLayeredPaintLayerCount([1, 2])).toBe(2)
    expect(getLayeredPaintLayerCount({ a: 1 })).toBe(1)
    expect(getLayeredPaintLayerCount(null)).toBe(0)
  })
})

describe("property path builders", () => {
  it("builds layered and plain compound paths", () => {
    expect(compoundSubPropertyPath("background", "color", 1)).toBe(
      "background.1.color",
    )
    expect(compoundSubPropertyPath("border", "width")).toBe("border.width")
    expect(layeredParentPropertyPath("background", 0)).toBe("background")
    expect(layeredParentPropertyPath("background", 2)).toBe("background.2")
  })

  it("wraps layered paint and plain compounds differently", () => {
    expect(wrapCompoundPropertyValue("background", { x: 1 })).toEqual({
      background: [{ x: 1 }],
    })
    expect(wrapCompoundPropertyValue("border", { x: 1 })).toEqual({
      border: { x: 1 },
    })
  })
})

describe("value matching", () => {
  it("matches typed values against literals and typed expectations", () => {
    expect(propertyValuesMatch(exact(5), 5)).toBe(true)
    expect(propertyValuesMatch(exact(5), exact(5))).toBe(true)
    expect(propertyValuesMatch(exact(5), 6)).toBe(false)
    expect(propertyValuesMatch("not-typed", empty)).toBe(true)
    expect(compoundFacetMatches({ color: exact("red") }, "color", "red")).toBe(
      true,
    )
  })
})

describe("schema and category helpers", () => {
  it("detects schema sub-properties and shorthand keys", () => {
    const schema = { border: { width: exact(1) } } as any
    expect(hasSchemaSubProperty(schema, "border", "width")).toBe(true)
    expect(hasSchemaSubProperty(schema, "border", "color")).toBe(false)
    expect(isShorthandProperty("margin")).toBe(true)
    expect(isShorthandProperty("color")).toBe(false)
  })

  it("lists background facets for a kind", () => {
    expect(getBackgroundFacetsForKind(undefined)).toEqual(["kind"])
    expect(getBackgroundFacetsForKind(BackgroundKind.COLOR)).toEqual([
      "kind",
      "color",
      "brightness",
      "opacity",
    ])
  })
})

describe("subject resolution", () => {
  it("resolves overrides bag and typed node", () => {
    expect(getPropertyOverridesBag(board)).toBe(board.componentProperties)
    expect(getTypedNode(boardKey, ws)).toBe(board)
    expect(getTypedNode(rootId, ws)).toBe(ws.nodes[rootId])
  })
})

describe("getPropertyStatus", () => {
  it("returns valid statuses for every key on a node", () => {
    const status = getPropertyStatus(rootId, ws)
    const keys = Object.keys(status)
    expect(keys.length).toBeGreaterThan(0)
    for (const value of Object.values(status)) {
      expect(["set", "unset", "override", "not used"]).toContain(value)
    }
  })
})
