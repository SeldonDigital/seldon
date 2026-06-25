import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { Board, ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { collectExternalVariantUsage } from "./collect-external-variant-usage"
import { getAllVariants } from "./get-all-variants"
import { getCompositionContainers } from "./get-composition-containers"
import { getSpecialBoardVariantLabel } from "./get-special-board-variant-label"
import { getVariantById } from "./get-variant-by-id"
import { isVariantInUse } from "./is-variant-in-use"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const rootId = (ws.boards[boardKey] as any).variants[0].id as string
const childId = (ws.boards[boardKey] as any).variants[0].children[0].id as string

describe("getAllVariants", () => {
  it("collects component/playground variant roots", () => {
    const ids = getAllVariants(ws).map((v) => v.id)
    expect(ids).toContain(rootId)
  })
})

describe("getVariantById", () => {
  it("returns a variant node and throws on an instance", () => {
    expect(getVariantById(rootId, ws).type).toBe("default")
    expect(() => getVariantById(childId, ws)).toThrow()
  })
})

describe("getCompositionContainers", () => {
  it("returns boards and playgrounds", () => {
    expect(getCompositionContainers(ws).length).toBeGreaterThan(0)
  })
})

describe("isVariantInUse", () => {
  it("is true for a child ref and false for an unreferenced root", () => {
    expect(isVariantInUse(childId, ws)).toBe(true)
    expect(isVariantInUse(rootId, ws)).toBe(false)
  })
})

describe("getSpecialBoardVariantLabel", () => {
  it("labels special boards and returns null for components", () => {
    expect(getSpecialBoardVariantLabel({ type: "theme" } as Board, true)).toBe("Clean")
    expect(getSpecialBoardVariantLabel({ type: "icon-set" } as Board, false)).toBe(
      "custom icon set",
    )
    expect(getSpecialBoardVariantLabel({ type: "component" } as Board, true)).toBeNull()
  })
})

describe("collectExternalVariantUsage", () => {
  it("returns no usage for a freshly added board", () => {
    expect(collectExternalVariantUsage(boardKey, ws)).toEqual([])
  })
})
