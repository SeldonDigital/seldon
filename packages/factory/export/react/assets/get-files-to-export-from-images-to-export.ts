import type { ExportOptions, FileToExport, ImageToExportMap } from "../../types"

/**
 * Resolves each image source to its exported asset file. A source that cannot be
 * read, such as an unreachable URL or a malformed data URL, is dropped from
 * `imagesToExport` and skipped rather than aborting the whole export. Dropping
 * it from the map lets the caller leave that source at its original value
 * instead of rewriting it to a missing asset path, and stops one bad image from
 * discarding every image that resolved.
 *
 * @param imagesToExport - The images to export. Mutated to drop failed sources.
 * @param options - The export options
 * @returns The files to export for the sources that resolved
 */
export async function getFilesToExportFromImagesToExport(
  imagesToExport: ImageToExportMap,
  options: ExportOptions,
) {
  const filesToExport: FileToExport[] = []

  for (const url of Object.keys(imagesToExport)) {
    try {
      const content = await getArrayBuffer(url, options.token)

      filesToExport.push({ content, path: imagesToExport[url].uploadPath })
    } catch {
      delete imagesToExport[url]
    }
  }

  return filesToExport
}

async function getArrayBuffer(url: string, token?: ExportOptions["token"]) {
  if (url.startsWith("data:")) {
    return decodeDataUrl(url)
  }

  try {
    const headers: HeadersInit = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, { headers })

    return response.arrayBuffer()
  } catch {
    throw new Error(`Unable to fetch image from ${url}`)
  }
}

function decodeBase64ToArrayBuffer(base64: string): ArrayBuffer {
  if (typeof Buffer !== "undefined") {
    const buffer = Buffer.from(base64, "base64")

    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  }

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

function decodeDataUrl(url: string): ArrayBuffer {
  const commaIndex = url.indexOf(",")

  if (commaIndex === -1) {
    throw new Error("Malformed data URL")
  }

  const meta = url.slice(0, commaIndex)
  const data = url.slice(commaIndex + 1)

  if (meta.includes(";base64")) {
    return decodeBase64ToArrayBuffer(data)
  }

  const bytes = new TextEncoder().encode(decodeURIComponent(data))

  return bytes.buffer
}
