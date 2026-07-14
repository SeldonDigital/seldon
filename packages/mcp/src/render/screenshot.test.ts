/**
 * The image format's fallback ladder
 * and preview persistence.
 *
 * - Playwright absent → silent null (view_node degrades to html).
 * - Playwright broken → loud once, then null.
 * - Playwright present (installed in this repo) → real PNG; view_node
 *   returns image + writes .seldon/previews/<target>-<seq>.png.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterAll, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"

import { Session } from "../session"
import { applyActions } from "../tools/apply-actions"
import type { ToolContext } from "../tools/context"
import { getWorkspaceOutline } from "../tools/get-workspace-outline"
import { viewNode } from "../tools/view-node"
import { workspaceOpen } from "../tools/workspace-open"
import { createScreenshotProvider } from "./screenshot"

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47])

const tmpDirs: string[] = []
afterAll(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

async function openButtonFixture(screenshots?: ToolContext["screenshots"]) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-shot-"))
  tmpDirs.push(root)
  const ctx: ToolContext = {
    session: new Session(),
    config: { roots: [root] },
    ...(screenshots ? { screenshots } : {}),
  }
  workspaceOpen(ctx, {
    path: path.join(root, "workspace.json"),
    createIfMissing: true,
  })
  await applyActions(ctx, {
    actions: [
      { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
    ],
  })
  const variantId = getWorkspaceOutline(ctx).boards.find(
    (board) => board.key === ComponentId.BUTTON,
  )!.variants![0]!.id
  return { ctx, root, variantId }
}

describe("screenshot provider fallback ladder", () => {
  it("is silent when playwright is not installed", async () => {
    const errors: string[] = []
    const provider = createScreenshotProvider({
      importPlaywright: () =>
        Promise.reject(new Error("Cannot find module 'playwright'")),
      reportError: (message) => errors.push(message),
    })
    expect(await provider.capture("<html></html>")).toBeNull()
    expect(errors).toEqual([])
  })

  it("is loud exactly once when playwright is installed but broken", async () => {
    const errors: string[] = []
    const provider = createScreenshotProvider({
      importPlaywright: async () => ({
        chromium: {
          launch: () =>
            Promise.reject(new Error("browserType.launch: executable missing")),
        },
      }),
      reportError: (message) => errors.push(message),
    })
    expect(await provider.capture("<html></html>")).toBeNull()
    expect(await provider.capture("<html></html>")).toBeNull()
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain("playwright install")
  })
})

describe("view_node format image", () => {
  it("degrades to html (flagged, not thrown) when screenshots are unavailable", async () => {
    const { ctx, variantId } = await openButtonFixture(/* no provider */)
    const result = await viewNode(ctx, { target: variantId, format: "image" })
    expect(result.format).toBe("html")
    expect(result.requestedFormat).toBe("image")
    expect(result.imageFallback).toContain("Playwright")
    expect(result.html).toContain("sdn-button")
    expect(result.imageBase64).toBeUndefined()
  })

  it("returns a real PNG and persists the preview file", async () => {
    const { ctx, root, variantId } = await openButtonFixture(
      createScreenshotProvider(), // the real thing — installed in this repo
    )
    const result = await viewNode(ctx, {
      target: variantId,
      format: "image",
      width: 640,
    })

    expect(result.format).toBe("image")
    expect(result.mimeType).toBe("image/png")
    expect(result.width).toBe(640)
    expect(result.html).toBeUndefined() // image responses drop the document

    const png = Buffer.from(result.imageBase64!, "base64")
    expect(png.subarray(0, 4).equals(PNG_MAGIC)).toBe(true)
    expect(png.length).toBeGreaterThan(1000)

    // Persisted next to the workspace file, path reported.
    expect(result.previewPath).toContain(path.join(root, ".seldon", "previews"))
    const onDisk = fs.readFileSync(result.previewPath!)
    expect(onDisk.equals(png)).toBe(true)
  }, 30_000)
})
