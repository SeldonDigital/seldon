import * as path from "path"
import { Workspace } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"
import { ExportOptions, ImageToExportMap } from "../../types"

export async function getImagesToExport(
  workspace: Workspace,
  options: ExportOptions,
) {
  const images: ImageToExportMap = {}

  for (const node of getWorkspaceNodeList(workspace)) {
    const properties = getNodeProperties(node, workspace)
    const backgroundImage = properties?.background?.[0]?.image?.value
    if (backgroundImage) {
      await addIfNotExist(backgroundImage)
    }

    if (properties.source?.value) {
      await addIfNotExist(properties.source.value)
    }
  }

  async function addIfNotExist(value: string) {
    if (images[value]) {
      return
    }

    let filename = value.split("/").pop()

    if (!filename || !filename.includes(".")) {
      filename = `${filename ?? "image"}.png`
    }

    const relativePath = path.posix.join(
      options.output.assetPublicPath,
      filename,
    )

    images[value] = {
      relativePath,
      uploadPath: path.posix.join(options.output.assetsFolder, filename),
    }
  }

  return images
}
