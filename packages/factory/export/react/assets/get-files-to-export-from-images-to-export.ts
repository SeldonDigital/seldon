import { ExportOptions, FileToExport, ImageToExportMap } from "../../types"

/**
 * Fetch the source of the external images to export from the workspace values
 * @param imagesToExport - The images to export
 * @returns The files to export
 */

export async function getFilesToExportFromImagesToExport(
  imagesToExport: ImageToExportMap,
  options: ExportOptions,
) {
  const filesToExport: FileToExport[] = []

  for (const url of Object.keys(imagesToExport)) {
    filesToExport.push({
      content: await getArrayBuffer(url, options.token),
      path: imagesToExport[url].uploadPath,
    })
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
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    )
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
