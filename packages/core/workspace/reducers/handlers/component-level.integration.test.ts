import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ComponentBoard, ExtractPayload, Workspace } from "../../../index"
import { ValueType } from "../../../properties/constants"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addComponent } from "./add/add-component"
import { resetComponentProperty } from "./reset/reset-component-property"
import { resetComponentToCatalog } from "./reset/reset-component-to-catalog"
import { resetDefaultVariantToCatalog } from "./reset/reset-default-variant-to-catalog"
import { resetInstanceToOriginal } from "./reset/reset-instance-to-original"
import { resetInstanceToSource } from "./reset/reset-instance-to-source"
import { applyComponentPropertiesToAllBoards } from "./set/apply-component-properties-to-all-boards"
import { setBoardLabel } from "./set/set-board-label"
import { setComponentProperties } from "./set/set-component-properties"
import { setComponentTheme } from "./set/set-component-theme"
import { setNodeProperties } from "./set/set-node-properties"

const boardKey = ComponentId.BUTTON
const componentWorkspace = () =>
  addComponent(
    { boardKey } as ExtractPayload<"add_component">,
    createEmptyWorkspace(),
  )

const board = (ws: Workspace) => ws.boards[boardKey] as ComponentBoard
const rootId = (ws: Workspace) => board(ws).variants[0].id as string
const instanceId = (ws: Workspace) =>
  board(ws).variants[0].children![0].id as string

const opacity = { opacity: { type: ValueType.EXACT, value: 0.5 } }

describe("setComponentTheme", () => {
  it("sets the board's default theme reference", () => {
    const next = setComponentTheme(
      { boardKey, theme: "seldon" } as never,
      componentWorkspace(),
    )
    expect(board(next).componentTheme).toBe("seldon")
  })
})

describe("setComponentProperties / resetComponentProperty", () => {
  it("merges a property onto the board and clears it again", () => {
    const ws = componentWorkspace()
    const set = setComponentProperties(
      { boardKey, properties: opacity } as never,
      ws,
    )
    expect(board(set).componentProperties.opacity).toMatchObject({
      type: ValueType.EXACT,
      value: 0.5,
    })
    const reset = resetComponentProperty(
      { boardKey, propertyKey: "opacity" } as never,
      set,
    )
    expect(board(reset).componentProperties.opacity).toBeUndefined()
  })
})

describe("applyComponentPropertiesToAllBoards", () => {
  it("returns a workspace and preserves the source board props", () => {
    const ws = setComponentProperties(
      { boardKey, properties: opacity } as never,
      componentWorkspace(),
    )
    const next = applyComponentPropertiesToAllBoards(
      { sourceBoardKey: boardKey } as never,
      ws,
    )
    expect(board(next).componentProperties.opacity).toMatchObject({
      value: 0.5,
    })
  })
})

describe("resetDefaultVariantToCatalog", () => {
  it("drops an ad-hoc override on the default variant root", () => {
    const ws = componentWorkspace()
    const id = rootId(ws)
    const dirtied = setNodeProperties(
      { nodeId: id, properties: opacity } as never,
      ws,
    )
    const reset = resetDefaultVariantToCatalog(
      { defaultVariantRootId: id } as never,
      dirtied,
    )
    expect(
      (reset.nodes[id]!.overrides as { opacity?: unknown }).opacity,
    ).toBeUndefined()
  })

  it("is a no-op for a non-default-variant node", () => {
    const ws = componentWorkspace()
    expect(
      resetDefaultVariantToCatalog(
        { defaultVariantRootId: instanceId(ws) } as never,
        ws,
      ),
    ).toBe(ws)
  })
})

describe("resetComponentToCatalog", () => {
  it("restores board metadata to the catalog default", () => {
    const ws = setBoardLabel(
      { boardKey, label: "Custom Name" } as ExtractPayload<"set_board_label">,
      componentWorkspace(),
    )
    const reset = resetComponentToCatalog(
      { boardKey } as ExtractPayload<"reset_component_to_catalog">,
      ws,
    )
    expect(board(reset).label).not.toBe("Custom Name")
  })

  it("is a no-op for an unknown board", () => {
    const ws = componentWorkspace()
    expect(
      resetComponentToCatalog(
        {
          boardKey: "not-a-board",
        } as ExtractPayload<"reset_component_to_catalog">,
        ws,
      ),
    ).toBe(ws)
  })
})

describe("resetInstanceToSource / resetInstanceToOriginal", () => {
  it("clears instance subtree overrides", () => {
    const ws = componentWorkspace()
    const instance = instanceId(ws)
    const dirtied = setNodeProperties(
      { nodeId: instance, properties: opacity } as never,
      ws,
    )
    const source = resetInstanceToSource(
      { instanceId: instance } as ExtractPayload<"reset_instance_to_source">,
      dirtied,
    )
    expect(
      (source.nodes[instance]!.overrides as { opacity?: unknown }).opacity,
    ).toBeUndefined()
  })

  it("reverts an instance to its original template chain", () => {
    const ws = componentWorkspace()
    const instance = instanceId(ws)
    const dirtied = setNodeProperties(
      { nodeId: instance, properties: opacity } as never,
      ws,
    )
    const original = resetInstanceToOriginal(
      { instanceId: instance } as ExtractPayload<"reset_instance_to_original">,
      dirtied,
    )
    expect(
      (original.nodes[instance]!.overrides as { opacity?: unknown }).opacity,
    ).toBeUndefined()
  })
})
