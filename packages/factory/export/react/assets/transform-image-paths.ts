import { produce } from "immer"

import { ValueType, Workspace } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"
import { ImageToExportMap } from "../../types"

export function replaceImagesWithRelativePaths(
  workspace: Workspace,
  imagesToExport: ImageToExportMap,
): Workspace {
  return produce(workspace, (draft) => {
    for (const node of getWorkspaceNodeList(draft)) {
      const entry = draft.nodes[node.id]
      if (!entry) continue

      const properties = getNodeProperties(node, draft)
      const overrides = { ...entry.overrides }

      const backgroundImage = properties?.background?.[0]?.image?.value
      if (backgroundImage) {
        const image = imagesToExport[backgroundImage]
        if (image) {
          overrides.background = overrides.background ?? [
            {
              image: {
                type: ValueType.EXACT,
                value: image.relativePath,
              },
            },
          ]
          if (Array.isArray(overrides.background) && overrides.background[0]) {
            overrides.background[0] = {
              ...overrides.background[0],
              image: {
                type: ValueType.EXACT,
                value: image.relativePath,
              },
            }
          }
        }
      }

      if (properties.source?.value) {
        const image = imagesToExport[properties.source.value]
        if (image) {
          overrides.source = {
            type: ValueType.EXACT,
            value: image.relativePath,
          }
        }
      }

      entry.overrides = overrides
    }

    return draft
  })
}

export const transformImagePaths = replaceImagesWithRelativePaths
