import { isIP } from "node:net"

import type { ExportOptions, FileToExport, ImageToExportMap } from "../../types"

const MAX_IMAGE_BYTES = 25 * 1024 * 1024

/**
 * Fetch the source of the external images to export from the workspace values
 * @param imagesToExport - The images to export
 * @returns The files to export
 */

export async function getFilesToExportFromImagesToExport(
  imagesToExport: ImageToExportMap,
  _options: ExportOptions,
) {
  const filesToExport: FileToExport[] = []

  for (const url of Object.keys(imagesToExport)) {
    filesToExport.push({
      content: await getArrayBuffer(url),
      path: imagesToExport[url].uploadPath,
    })
  }

  return filesToExport
}

async function getArrayBuffer(url: string) {
  try {
    if (url.startsWith("data:")) {
      return getDataUrlArrayBuffer(url)
    }

    const safeUrl = parseSafeImageUrl(url)
    const response = await fetch(safeUrl, {
      credentials: "omit",
      redirect: "error",
    })
    if (!response.ok) {
      throw new Error(`Image request failed with status ${response.status}`)
    }

    assertImageResponse(url, response)
    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("Image response is too large")
    }

    return buffer
  } catch (error) {
    const reason = error instanceof Error ? `: ${error.message}` : ""
    throw new Error(`Unable to fetch image from ${url}${reason}`)
  }
}

function getDataUrlArrayBuffer(value: string): ArrayBuffer {
  const dataPrefix = "data:"
  const separatorIndex = value.indexOf(",")
  if (!value.startsWith(dataPrefix) || separatorIndex === -1) {
    throw new Error("Invalid image data URL")
  }

  const metadata = value.slice(dataPrefix.length, separatorIndex)
  const data = value.slice(separatorIndex + 1)
  const [mediaType = "", ...parameters] = metadata.split(";")
  if (!mediaType.toLowerCase().startsWith("image/")) {
    throw new Error(
      `Expected image content-type for data URL, received "${mediaType || "missing"}"`,
    )
  }

  const isBase64 = parameters.some(
    (parameter) => parameter.toLowerCase() === "base64",
  )
  const bytes = isBase64
    ? Uint8Array.from(atob(data), (character) => character.charCodeAt(0))
    : new TextEncoder().encode(decodeURIComponent(data))

  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Image response is too large")
  }

  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  )
}

function parseSafeImageUrl(value: string): URL {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error("Invalid image URL")
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported image URL protocol "${url.protocol}"`)
  }

  if (isBlockedHost(url.hostname)) {
    throw new Error(
      `Refusing to fetch image from private host "${url.hostname}"`,
    )
  }

  return url
}

function assertImageResponse(url: string, response: Response): void {
  const contentType = response.headers.get("content-type")
  const mediaType = contentType?.split(";")[0]?.trim().toLowerCase()
  if (!mediaType?.startsWith("image/")) {
    throw new Error(
      `Expected image content-type for ${url}, received "${contentType ?? "missing"}"`,
    )
  }

  const contentLength = response.headers.get("content-length")
  if (!contentLength) return

  const size = Number(contentLength)
  if (!Number.isFinite(size) || size < 0) {
    throw new Error(`Invalid image content-length "${contentLength}"`)
  }
  if (size > MAX_IMAGE_BYTES) {
    throw new Error("Image response is too large")
  }
}

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[/, "").replace(/\]$/, "")
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "metadata.google.internal"
  ) {
    return true
  }

  const ipVersion = isIP(host)
  if (ipVersion === 4) return isBlockedIPv4(host)
  if (ipVersion === 6) return isBlockedIPv6(host)

  return false
}

function isBlockedIPv4(address: string): boolean {
  const parts = address.split(".").map((part) => Number(part))
  const [first, second] = parts
  if (parts.length !== 4 || first === undefined || second === undefined) {
    return true
  }

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  )
}

function isBlockedIPv6(address: string): boolean {
  const host = address.toLowerCase()
  return (
    host === "::" ||
    host === "::1" ||
    host.startsWith("::ffff:") ||
    host.startsWith("fc") ||
    host.startsWith("fd") ||
    /^fe[89ab]/.test(host)
  )
}
