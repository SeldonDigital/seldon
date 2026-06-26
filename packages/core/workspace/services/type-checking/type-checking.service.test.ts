import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { typeCheckingService as svc } from "./type-checking.service"

const boardKey = ComponentId.BUTTON
const ws: Workspace = addComponent(
  { boardKey } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = ws.boards[boardKey]!
const rootId = (board as any).variants[0].id as string
const childId = (board as any).variants[0].children[0].id as string
const variant = ws.nodes[rootId]!
const instance = ws.nodes[childId]!

describe("getEntityType", () => {
  it("classifies boards, default variants, and instances", () => {
    expect(svc.getEntityType(board as any)).toBe("board")
    expect(svc.getEntityType(variant as any)).toBe("defaultVariant")
    expect(svc.getEntityType(instance as any)).toBe("instance")
  })
})

describe("type guards", () => {
  it("isBoard / isNode", () => {
    expect(svc.isBoard(board as any)).toBe(true)
    expect(svc.isBoard(variant as any)).toBe(false)
    expect(svc.isBoard(undefined)).toBe(false)
    expect(svc.isNode(variant as any)).toBe(true)
    expect(svc.isNode(board as any)).toBe(false)
  })

  it("isVariant / isDefaultVariant / isUserVariant", () => {
    expect(svc.isVariant(variant as any)).toBe(true)
    expect(svc.isVariant(instance as any)).toBe(false)
    expect(svc.isVariant(undefined)).toBe(false)
    expect(svc.isDefaultVariant(variant as any)).toBe(true)
    expect(svc.isDefaultVariant(instance as any)).toBe(false)
    expect(svc.isUserVariant(variant as any)).toBe(false)
  })

  it("isInstance", () => {
    expect(svc.isInstance(instance as any)).toBe(true)
    expect(svc.isInstance(variant as any)).toBe(false)
    expect(svc.isInstance(undefined)).toBe(false)
  })
})

describe("capability checks", () => {
  it("canNodeHaveChildren follows the catalog template", () => {
    expect(svc.canNodeHaveChildren(variant as any)).toBe(true)
    expect(svc.canNodeHaveChildren(board as any)).toBe(false)
  })

  it("canComponentBeParentOf consults component level rules", () => {
    expect(
      svc.canComponentBeParentOf(ComponentId.BUTTON, ComponentId.BUTTON),
    ).toBe(true)
    expect(
      svc.canComponentBeParentOf(
        "bogus" as ComponentId,
        "bogus" as ComponentId,
      ),
    ).toBe(false)
  })

  it("isSchemaDefinedInstance reads the origin classification", () => {
    expect(typeof svc.isSchemaDefinedInstance(instance as any)).toBe("boolean")
  })
})
