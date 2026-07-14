/**
 * The render infrastructure that
 * `view_node`/`apply_actions`'s render param build on. Exercises the same
 * fixtures as the spike (spike/factory-ssr.spike.test.ts) — this
 * supersedes it as the production path; the spike stays as the standalone
 * feasibility record.
 */
import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { getAllVariants } from "@seldon/core/workspace/helpers/general/get-all-variants"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { COMPONENTS_FOLDER, getCachedExport, toFileMap } from "./export-cache"
import { bundleAndRender, findComponentFile } from "./factory-ssr"

function buildFixtureWorkspace(): Workspace {
  let ws = createEmptyWorkspace()
  const dispatch = (action: WorkspaceAction) => {
    ws = workspaceReducer(ws, action)
  }
  dispatch({ type: "add_component", payload: { boardKey: ComponentId.TEXT } })
  dispatch({ type: "add_component", payload: { boardKey: ComponentId.BUTTON } })
  dispatch({
    type: "add_component",
    payload: { boardKey: ComponentId.PRODUCT_CARD },
  })
  return ws
}

function findVariant(workspace: Workspace, componentId: ComponentId) {
  const variant = getAllVariants(workspace).find(
    (v) => getNodeCatalogId(v, workspace) === componentId,
  )
  if (!variant) {
    throw new Error(`No variant found for component "${componentId}"`)
  }
  return variant
}

describe("export cache", () => {
  const workspace = buildFixtureWorkspace()

  it("exports once per workspace object identity", async () => {
    const first = getCachedExport(workspace)
    const second = getCachedExport(workspace)
    expect(first).toBe(second) // same in-flight/completed promise, not just equal
    await first
  })

  it("does not share the cache across different workspace objects", async () => {
    const other = buildFixtureWorkspace()
    const a = await getCachedExport(workspace)
    const b = await getCachedExport(other)
    expect(a).not.toBe(b)
  })
})

describe("Factory-SSR bundle + render (production path)", () => {
  const workspace = buildFixtureWorkspace()

  it("renders the Text primitive to HTML", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    const variant = findVariant(workspace, ComponentId.TEXT)
    const { entryPath, exportName } = findComponentFile(
      files,
      workspace,
      variant,
      COMPONENTS_FOLDER,
    )
    const html = await bundleAndRender(files, entryPath, exportName)
    expect(html).not.toBe("")
    expect(html).toContain("sdn-text")
  })

  it("renders the Button composite including its inlined icon child", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    const variant = findVariant(workspace, ComponentId.BUTTON)
    const { entryPath, exportName } = findComponentFile(
      files,
      workspace,
      variant,
      COMPONENTS_FOLDER,
    )
    const html = await bundleAndRender(files, entryPath, exportName)
    expect(html).toContain("sdn-button")
    expect(html).toMatch(/<svg/)
    expect(html).toContain("sdn-icon")
  })

  it("renders the ProductCard composite to HTML", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    const variant = findVariant(workspace, ComponentId.PRODUCT_CARD)
    const { entryPath, exportName } = findComponentFile(
      files,
      workspace,
      variant,
      COMPONENTS_FOLDER,
    )
    const html = await bundleAndRender(files, entryPath, exportName)
    expect(html).not.toBe("")
    expect(html.length).toBeGreaterThan(200)
  })

  it("throws a descriptive error when the entry path isn't in the export", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    await expect(
      bundleAndRender(
        files,
        "/components/elements/DoesNotExist.tsx",
        "DoesNotExist",
      ),
    ).rejects.toThrow(/not in the virtual export/)
  })

  it("findComponentFile throws a descriptive error for an unresolvable path", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    const variant = findVariant(workspace, ComponentId.TEXT)
    expect(() =>
      findComponentFile(files, workspace, variant, "/nonexistent-folder"),
    ).toThrow(/Export produced no file/)
  })
})
