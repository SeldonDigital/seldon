import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { workspaceReducer } from "../../reducers/reducer"
import { getComponentDescendantIds } from "./get-descendant-ids"

describe("getComponentDescendantIds", () => {
  it("includes nested default.children from catalog schemas", () => {
    const ids = getComponentDescendantIds(ComponentId.PANEL_SIDEBAR)

    expect(ids).toContain(ComponentId.PANEL_SIDEBAR)
    expect(ids).toContain(ComponentId.BAR_TABS)
    expect(ids).toContain(ComponentId.BUTTON)
    expect(ids).toContain(ComponentId.ICON)
    expect(ids.indexOf(ComponentId.PANEL_SIDEBAR)).toBeLessThan(
      ids.indexOf(ComponentId.BAR_TABS),
    )
  })

  it("add_component for Sidebar creates boards for all descendants", () => {
    const workspace = workspaceReducer(createEmptyWorkspace(), {
      type: "add_component",
      payload: { componentId: ComponentId.PANEL_SIDEBAR },
    })

    expect(workspace.components[ComponentId.ICON]).toBeDefined()
    expect(workspace.components[ComponentId.PANEL_SIDEBAR]).toBeDefined()

    const treeIds = new Set<string>()
    for (const board of Object.values(workspace.components)) {
      const walk = (refs: { id: string; children?: { id: string }[] }[]) => {
        for (const ref of refs) {
          treeIds.add(ref.id)
          if (ref.children?.length) walk(ref.children)
        }
      }
      walk(board.variants)
    }

    for (const node of Object.values(workspace.nodes)) {
      if (node.type !== "default" && node.type !== "variant") continue
      expect(treeIds.has(node.id)).toBe(true)
    }
  })

  it("add_component for Button creates default and all catalog schema variants", () => {
    const workspace = workspaceReducer(createEmptyWorkspace(), {
      type: "add_component",
      payload: { componentId: ComponentId.BUTTON },
    })

    const board = workspace.components[ComponentId.BUTTON]
    expect(board).toBeDefined()
    expect(board!.variants).toHaveLength(4)

    const variantRootIds = board!.variants.map((ref) => ref.id)
    expect(variantRootIds).toContain("component-button-default")
    expect(variantRootIds).toContain("component-button-social")
    expect(variantRootIds).toContain("component-button-tools")
    expect(variantRootIds).toContain("component-button-segmented")
  })

  it("add_component for IAB creates default and all IAB size catalog variants", () => {
    const workspace = workspaceReducer(createEmptyWorkspace(), {
      type: "add_component",
      payload: { componentId: ComponentId.AD_IAB },
    })

    const board = workspace.components[ComponentId.AD_IAB]
    expect(board).toBeDefined()
    expect(board!.variants).toHaveLength(12)

    const variantRootIds = board!.variants.map((ref) => ref.id)
    expect(variantRootIds).toContain("component-adIab-default")
    expect(variantRootIds).toContain("component-adIab-billboard")
    expect(variantRootIds).toContain("component-adIab-smartphoneBanner")
  })
})
