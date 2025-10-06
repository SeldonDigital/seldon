import { produce } from "immer"
import { Workspace } from "@seldon/core"
import { ImageToExportMap } from "../../types"

/**
 * Replaces image paths in a workspace with their relative paths after export
 * @param workspace - The workspace to update
 * @param imagesToExport - List of images to export with their original and exported paths
 * @returns Updated workspace with relative image paths
 */
export function replaceImagesWithRelativePaths(
  workspace: Workspace,
  imagesToExport: ImageToExportMap,
): Workspace {
  return produce(workspace, (draft) => {
    const nodes = Object.values(draft.byId)

    for (const node of nodes) {
      if (node.properties.background?.image?.value) {
        const image = imagesToExport[node.properties.background.image.value]
        if (image) {
          node.properties.background.image.value = image.relativePath
        }
      }
      if (node.properties.source?.value) {
        const image = imagesToExport[node.properties.source.value]
        if (image) {
          node.properties.source.value = image.relativePath
        }
      }
    }

    return draft
  })
}

// Export with the name expected by tests
export const transformImagePaths = replaceImagesWithRelativePaths
