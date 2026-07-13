import { describe, expect, it } from "vitest"

import { ComponentId } from "../../components/constants"
import type { ExtractPayload } from "../../index"
import { ValueType } from "../../properties/constants"
import type { Properties } from "../../properties/types/properties"
import { createEmptyWorkspace } from "../helpers/create-empty-workspace"
import { addComponent } from "../reducers/handlers/add/add-component"
import {
  computeNodeProperties,
  getNodeComputeContext,
  mergeEffectiveProperties,
} from "./compute-node-properties"

const exact = (value: unknown) =>
  ({ type: ValueType.EXACT, value }) as unknown as Properties[keyof Properties]

describe("mergeEffectiveProperties", () => {
  it("returns an empty object for no sources", () => {
    expect(mergeEffectiveProperties([])).toEqual({})
  })

  it("layers sources left to right so later values win", () => {
    const merged = mergeEffectiveProperties([
      { opacity: exact(1) } as Properties,
      { color: exact("#fff") } as Properties,
      { opacity: exact(2) } as Properties,
    ])

    expect(merged).toEqual({ opacity: exact(2), color: exact("#fff") })
  })
})

describe("computeNodeProperties", () => {
  const workspace = addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )
  const defaultNodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

  it("resolves a non-empty property bag with no lingering computed values", () => {
    const computed = computeNodeProperties(defaultNodeId, workspace)

    expect(Object.keys(computed).length).toBeGreaterThan(0)

    const lingering = Object.values(computed).filter(
      (value) =>
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (value as { type?: unknown }).type === ValueType.COMPUTED,
    )
    expect(lingering).toEqual([])
  })

  it("returns effective properties before computed resolution", () => {
    const effective = computeNodeProperties(defaultNodeId, workspace, {
      stage: "effective",
    })

    expect(Object.keys(effective).length).toBeGreaterThan(0)
  })
})

describe("getNodeComputeContext", () => {
  const workspace = addComponent(
    { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )
  const defaultNodeId = workspace.boards[ComponentId.BUTTON]!.variants[0]!.id

  it("resolves a theme and properties for a variant root", () => {
    const context = getNodeComputeContext(defaultNodeId, workspace)

    expect(typeof context.theme.id).toBe("string")
    expect(Object.keys(context.properties).length).toBeGreaterThan(0)
  })

  it("uses the owning board as the parent context for a variant root", () => {
    const context = getNodeComputeContext(defaultNodeId, workspace)

    expect(context.parentContext).not.toBeNull()
    expect(typeof context.parentContext!.theme.id).toBe("string")
  })
})
