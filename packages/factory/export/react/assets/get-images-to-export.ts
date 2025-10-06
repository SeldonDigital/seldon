import * as path from "path"
import { Workspace, invariant } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { ExportOptions, ImageToExportMap } from "../../types"

/**
 * Gets all images that are used in a workspace
 * @param workspace - The workspace to analyze
 * @param options - Assets options for the export
 * @returns A set of images key is the url and value is the new path to
 */
export async function getImagesToExport(
  workspace: Workspace,
  options: ExportOptions,
) {
  const images: ImageToExportMap = {}

  const nodes = Object.values(workspace.byId)
  for (const node of nodes) {
    const properties = getNodeProperties(node, workspace)
    if (properties?.background?.image?.value) {
      await addIfNotExist(properties.background.image.value)
    }

    if (properties.source?.value) {
      await addIfNotExist(properties.source.value)
    }
  }

  async function addIfNotExist(value: string) {
    // If image already exists, don't add it
    if (images[value]) {
      return
    }

    let filename = value.split("/").pop()

    /**
     * The AI returns a generated image in an URL like this: https://URL/assets/GUID/file
     * Because we don't have a correct file extension, GitHub  will complain
     * Therefore we change the image url to be https://URL/assets/GUID.EXTENSION
     */
    if (value.endsWith("file")) {
      const extension = await getImageExtension(value)
      filename = value.replace("/file", `.${extension}`).split("/").pop()
    }

    invariant(filename, `Cannot find filename for ${value}`)

    images[value] = {
      uploadPath: `${options.output.assetsFolder}/${filename}`,
      relativePath: path.join(
        options.output.assetPublicPath,
        "seldon",
        filename,
      ),
    }
  }

  return images
}

async function getImageExtension(url: string) {
  try {
    const response = await fetch(url, { method: "HEAD" })
    const contentType = response.headers.get("content-type")
    invariant(contentType, `Cannot find content type for ${url}`)

    switch (contentType) {
      case "image/png":
        return "png"
      case "image/jpeg":
      case "image/jpg":
        return "jpg"
      case "image/webp":
        return "webp"
      default:
        throw new Error(`Unsupported image type: ${contentType}`)
    }
  } catch (error) {
    throw new Error(`Error fetching MIME type: ${error}`)
  }
}
