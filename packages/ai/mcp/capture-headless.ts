import { createServer } from "node:http"
import path from "node:path"

import { exportWorkspace } from "@seldon/factory"
import puppeteer from "puppeteer"

import type { CapturedImage, McpCaptureOptions } from "./server"
import type { Workspace } from "@seldon/core/workspace/types"
import type { ExportWorkspaceInput, FileToExport } from "@seldon/factory"
import type { Server } from "node:http"

const DEFAULT_MAX_SIZE = 1200
const DEFAULT_QUALITY = 0.8
const ASSET_WAIT_TIMEOUT_MS = 8000
const CAPTURE_TIMEOUT_MS = 30_000
const JPEG_MIME = "image/jpeg"

interface CaptureHeadlessWorkspaceOptions {
  exportOptions: ExportWorkspaceInput
  workspace: Workspace
  capture?: McpCaptureOptions
}

interface CaptureSource {
  fragment: string
  path: string
  targetNodeId: string
}

interface VirtualServer {
  url: string
  close(): Promise<void>
}

export async function captureHeadlessWorkspace(
  options: CaptureHeadlessWorkspaceOptions,
): Promise<CapturedImage> {
  const files = await exportWorkspace(options.workspace, {
    ...options.exportOptions,
    captureNodeIds: true,
    includeScripts: false,
    includeWorkspace: false,
    output: {
      assetPublicPath: "/capture/assets",
      assetsFolder: "capture/assets",
      componentsFolder: "capture",
    },
    skipFormat: true,
    target: {
      framework: "html",
      styles: "css-properties",
    },
  })
  const source = resolveCaptureSource(files, options.workspace, options.capture)
  const server = await createVirtualServer(files, source)

  try {
    return await capturePage(server.url, source, options.capture)
  } finally {
    await server.close()
  }
}

function resolveCaptureSource(
  files: FileToExport[],
  workspace: Workspace,
  options?: McpCaptureOptions,
): CaptureSource {
  const targetNodeId = options?.nodeId ?? getBoardRootId(workspace, options?.boardKey)

  if (!targetNodeId) {
    throw new Error("Headless render_preview needs a nodeId or boardKey.")
  }

  const marker = `data-seldon-node-id="${targetNodeId}"`
  const fragment = files.find(
    (file) =>
      file.path.endsWith(".html") &&
      typeof file.content === "string" &&
      file.content.includes(marker),
  )

  if (!fragment || typeof fragment.content !== "string") {
    throw new Error(`No exported HTML found for capture target "${targetNodeId}".`)
  }

  return {
    fragment: fragment.content,
    path: fragment.path,
    targetNodeId,
  }
}

function getBoardRootId(workspace: Workspace, boardKey: string | undefined): string | undefined {
  if (!boardKey) return undefined

  const board = workspace.boards[boardKey] ?? workspace.playgrounds?.[boardKey]

  if (!board) throw new Error(`No board found for "${boardKey}".`)

  const rootId = board.variants[0]?.id

  if (!rootId) throw new Error(`Board "${boardKey}" has no variant to capture.`)

  return rootId
}

async function createVirtualServer(
  files: FileToExport[],
  source: CaptureSource,
): Promise<VirtualServer> {
  const fileMap = new Map(files.map((file) => [file.path, file.content]))
  const document = createCaptureDocument(files, source)
  const server = createServer((request, response) => {
    const requestPath = request.url ? new URL(request.url, "http://capture.local").pathname : "/"
    const filePath = normalizeRequestPath(requestPath)

    if (!filePath) {
      response.writeHead(400)
      response.end("Invalid capture asset path.")

      return
    }

    if (filePath === source.path) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      response.end(document)

      return
    }

    const content = fileMap.get(filePath)

    if (content === undefined) {
      response.writeHead(404)
      response.end("Capture asset not found.")

      return
    }

    response.writeHead(200, { "Content-Type": contentType(filePath) })
    response.end(typeof content === "string" ? content : Buffer.from(content))
  })
  const port = await listen(server)

  return {
    close: () => closeServer(server),
    url: `http://127.0.0.1:${port}/${source.path}`,
  }
}

function createCaptureDocument(files: FileToExport[], source: CaptureSource): string {
  const directory = path.posix.dirname(source.path)
  const styles = files
    .filter((file) => file.path.endsWith(".css"))
    .map((file) => relativeAssetPath(directory, file.path))
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join("")
  const fonts = files.find((file) => file.path.endsWith("fonts.html"))
  const fontMarkup = typeof fonts?.content === "string" ? fonts.content : ""

  return `<!doctype html><html><head><meta charset="utf-8">${fontMarkup}${styles}<style>html,body{margin:0;padding:0;background:#fff}</style></head><body>${source.fragment}</body></html>`
}

function relativeAssetPath(fromDirectory: string, assetPath: string): string {
  const relative = path.posix.relative(fromDirectory, assetPath)

  return encodeURI(relative || path.posix.basename(assetPath))
}

function normalizeRequestPath(requestPath: string): string | undefined {
  let decoded: string

  try {
    decoded = decodeURIComponent(requestPath)
  } catch {
    return undefined
  }

  const normalized = path.posix.normalize(decoded).replace(/^\/+/, "")

  if (!normalized || normalized.startsWith("../") || normalized === "..") return undefined

  return normalized
}

function contentType(filePath: string): string {
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8"
  if (filePath.endsWith(".svg")) return "image/svg+xml"
  if (filePath.endsWith(".png")) return "image/png"
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return JPEG_MIME
  if (filePath.endsWith(".webp")) return "image/webp"
  if (filePath.endsWith(".avif")) return "image/avif"
  if (filePath.endsWith(".gif")) return "image/gif"
  if (filePath.endsWith(".woff2")) return "font/woff2"
  if (filePath.endsWith(".woff")) return "font/woff"

  return "application/octet-stream"
}

async function capturePage(
  url: string,
  source: CaptureSource,
  options?: McpCaptureOptions,
): Promise<CapturedImage> {
  const browser = await puppeteer.launch({ headless: true })
  const maxSize = options?.maxSize ?? DEFAULT_MAX_SIZE
  const quality = options?.quality ?? DEFAULT_QUALITY

  try {
    const page = await browser.newPage()

    await page.setViewport({ width: maxSize, height: maxSize })
    await page.goto(url, { waitUntil: "networkidle0", timeout: CAPTURE_TIMEOUT_MS })
    await page.waitForFunction(
      () =>
        document.fonts.status === "loaded" &&
        Array.from(document.images).every((image) => image.complete),
      { timeout: ASSET_WAIT_TIMEOUT_MS },
    )

    const bounds = await page.evaluate((nodeId) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-seldon-node-id]"))
      const element = elements.find((entry) => entry.dataset.seldonNodeId === nodeId)

      if (!element) return null

      const rect = element.getBoundingClientRect()

      if (rect.width <= 0 || rect.height <= 0) return null

      return {
        height: rect.height,
        width: rect.width,
        x: rect.x,
        y: rect.y,
      }
    }, source.targetNodeId)

    if (!bounds) throw new Error(`Capture target "${source.targetNodeId}" has no layout size.`)

    const scale = Math.min(1, maxSize / Math.max(bounds.width, bounds.height))

    await page.setViewport({
      deviceScaleFactor: scale,
      height: maxSize,
      width: maxSize,
    })
    const image = await page.screenshot({
      captureBeyondViewport: true,
      clip: bounds,
      quality: Math.round(quality * 100),
      type: "jpeg",
    })

    return {
      data: Buffer.from(image).toString("base64"),
      height: Math.round(bounds.height * scale),
      label: options?.nodeId ? `node ${options.nodeId}` : `board ${options?.boardKey}`,
      mimeType: JPEG_MIME,
      width: Math.round(bounds.width * scale),
    }
  } finally {
    await browser.close()
  }
}

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject)
      const address = server.address()

      if (!address || typeof address === "string") {
        reject(new Error("Could not allocate a local port for capture."))

        return
      }

      resolve(address.port)
    })
  })
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)

        return
      }

      resolve()
    })
  })
}
