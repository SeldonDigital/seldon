/**
 * Full-document assembly (styles.css + the target's theme stylesheet +
 * remote-font links + rendered body).
 */
import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { getAllVariants } from "@seldon/core/workspace/helpers/general/get-all-variants"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import {
  assembleDocument,
  assembleStyles,
  extractFontLinks,
} from "./assemble-html"
import { COMPONENTS_FOLDER, getCachedExport, toFileMap } from "./export-cache"
import { bundleAndRender, findComponentFile } from "./factory-ssr"

function buildFixtureWorkspace(): Workspace {
  let ws = createEmptyWorkspace()
  const dispatch = (action: WorkspaceAction) => {
    ws = workspaceReducer(ws, action)
  }
  dispatch({ type: "add_component", payload: { boardKey: ComponentId.BUTTON } })
  return ws
}

describe("assembleStyles / assembleDocument", () => {
  const workspace = buildFixtureWorkspace()
  const variant = getAllVariants(workspace).find(
    (v) => getNodeCatalogId(v, workspace) === ComponentId.BUTTON,
  )!
  const themeId = Object.keys(workspace.themes)[0]!

  it("concatenates the shared stylesheet and the matched theme stylesheet", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    const css = assembleStyles(files, [themeId], workspace, COMPONENTS_FOLDER)
    expect(css).toContain(".sdn-button")
    expect(css).toContain("--sdn-") // theme custom properties present
  })

  it("assembles a full document containing the rendered body and styles", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    const { entryPath, exportName } = findComponentFile(
      files,
      workspace,
      variant,
      COMPONENTS_FOLDER,
    )
    const body = await bundleAndRender(files, entryPath, exportName)
    const doc = assembleDocument(
      files,
      body,
      [themeId],
      workspace,
      COMPONENTS_FOLDER,
    )
    expect(doc).toContain("<!doctype html>")
    expect(doc).toContain(body)
    expect(doc).toContain(".sdn-button")
    expect(doc).toContain("--sdn-")
  })

  it("extracts remote-font links referenced by the theme's font slots", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    // The default theme's font slots reference remote Google Fonts families,
    // so with enableRemoteFonts (VIEW_EXPORT_OPTIONS) these load even though
    // no font-collection board explicitly enables them.
    const links = extractFontLinks(files, COMPONENTS_FOLDER)
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link).toMatch(
        /^<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com/,
      )
    }
  })

  it("throws a descriptive error for an unknown theme id", async () => {
    const files = toFileMap(await getCachedExport(workspace))
    expect(() =>
      assembleStyles(files, ["not-a-real-theme"], workspace, COMPONENTS_FOLDER),
    ).toThrow(/missing expected file/)
  })
})
