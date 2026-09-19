import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import type { McpWriteImageOptions } from "./server"

/** Destination folder under the project root, matching the vite and next layouts. */
export const IMAGE_ASSETS_FOLDER = "public/sdn"

/** Site-root path the workspace stores and the editor canvas resolves. */
export const IMAGE_PUBLIC_PREFIX = "/sdn"

/** Decoded image size ceiling. Larger files bloat the project without helping design. */
const MAX_IMAGE_BYTES = 8 * 1024 * 1024

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".ico",
])

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
}

interface DecodedImage {
  bytes: Buffer
  extension: string
}

/**
 * Copies an image into `<project>/public/sdn` and returns the `/sdn/<name>` path
 * the workspace should store. Accepts a local file or a data URL. Rejects a name
 * that would leave the assets folder, a non-image type, or a file over the size
 * cap.
 */
export async function writeImageToProject(
  exportRoot: string,
  options: McpWriteImageOptions,
): Promise<{ publicPath: string }> {
  const hasPath = typeof options.path === "string" && options.path.trim().length > 0
  const hasDataUrl = typeof options.dataUrl === "string" && options.dataUrl.trim().length > 0

  if (hasPath && hasDataUrl) {
    throw new Error("Pass path or dataUrl, not both.")
  }

  if (!hasPath && !hasDataUrl) {
    throw new Error("Pass a local file path or a data URL.")
  }

  const decoded = hasPath
    ? await readImageFile(exportRoot, options.path!.trim())
    : decodeDataUrl(options.dataUrl!.trim())

  if (decoded.bytes.byteLength === 0) {
    throw new Error("The image file is empty.")
  }

  if (decoded.bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`Image is larger than ${MAX_IMAGE_BYTES / (1024 * 1024)} MB.`)
  }

  const fileName = resolveImageName(options.name, options.path, decoded)
  const destDir = path.resolve(exportRoot, IMAGE_ASSETS_FOLDER)
  const destPath = resolveInsideDirectory(destDir, fileName)

  await fs.promises.mkdir(destDir, { recursive: true })
  await fs.promises.writeFile(destPath, decoded.bytes)

  return { publicPath: `${IMAGE_PUBLIC_PREFIX}/${path.basename(destPath)}` }
}

/** Reads a local image, resolving a relative path against the project root. */
async function readImageFile(exportRoot: string, rawPath: string): Promise<DecodedImage> {
  const sourcePath = rawPath.startsWith("file:")
    ? fileURLToPath(rawPath)
    : path.isAbsolute(rawPath)
      ? rawPath
      : path.resolve(exportRoot, rawPath)

  let bytes: Buffer

  try {
    bytes = await fs.promises.readFile(sourcePath)
  } catch {
    throw new Error(`Could not read image file at "${rawPath}".`)
  }

  const extension = path.extname(sourcePath).toLowerCase()

  if (!IMAGE_EXTENSIONS.has(extension)) {
    throw new Error(
      `Unsupported image type "${extension || "unknown"}". Use png, jpg, gif, webp, svg, avif, or ico.`,
    )
  }

  return { bytes, extension }
}

/** Decodes a `data:image/...` URL into bytes and an extension. */
function decodeDataUrl(dataUrl: string): DecodedImage {
  const match = /^data:([^;,]+)((?:;[^,]*)?),(.+)$/.exec(dataUrl)

  if (!match) {
    throw new Error("dataUrl must be a data URL, such as data:image/png;base64,....")
  }

  const mimeType = match[1].toLowerCase()
  const params = match[2]
  const payload = match[3]
  const extension = MIME_TO_EXT[mimeType]

  if (!extension) {
    throw new Error(
      `Unsupported image type "${mimeType}". Use png, jpg, gif, webp, svg, avif, or ico.`,
    )
  }

  const bytes = /;base64/i.test(params)
    ? Buffer.from(payload, "base64")
    : Buffer.from(decodeURIComponent(payload), "utf8")

  return { bytes, extension }
}

/**
 * Picks a safe filename. An explicit name wins. A file path contributes its
 * basename. A data URL gets a content hash so two images do not collide.
 */
function resolveImageName(
  rawName: string | undefined,
  rawPath: string | undefined,
  decoded: DecodedImage,
): string {
  if (typeof rawName === "string" && rawName.trim().length > 0) {
    return sanitizeImageName(rawName.trim(), decoded.extension)
  }

  if (typeof rawPath === "string" && rawPath.trim().length > 0) {
    const fromPath = rawPath.startsWith("file:") ? fileURLToPath(rawPath.trim()) : rawPath.trim()

    return sanitizeImageName(path.basename(fromPath), decoded.extension)
  }

  const hash = createHash("sha256").update(decoded.bytes).digest("hex").slice(0, 8)

  return `image-${hash}${decoded.extension}`
}

/** Keeps only a basename with an allowed image extension. */
function sanitizeImageName(raw: string, fallbackExtension: string): string {
  const base = path.basename(raw).replace(/[^A-Za-z0-9._-]/g, "-")

  if (!base || base === "." || base === "..") {
    throw new Error("Image name must be a file name, not a path.")
  }

  const extension = path.extname(base).toLowerCase()
  const stem = extension ? base.slice(0, -extension.length) : base
  const safeStem = stem.replace(/^\.+/, "") || "image"
  const safeExtension = IMAGE_EXTENSIONS.has(extension) ? extension : fallbackExtension

  return `${safeStem}${safeExtension}`
}

/** Resolves `name` under `directory` and rejects any path that leaves it. */
function resolveInsideDirectory(directory: string, name: string): string {
  const destPath = path.resolve(directory, name)
  const relative = path.relative(directory, destPath)

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Image name must stay inside the public/sdn folder.")
  }

  return destPath
}
