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
  try {
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(url, { headers })
    return response.arrayBuffer()
  } catch (error) {
    console.error(error)
    throw new Error(`Unable to fetch image from ${url}`)
  }
}
