import path from "node:path"
import { Workspace } from "@seldon/core"
import { createNodeExportAssetReader } from "../../../asset-reader"
import { ExportOptions, FileToExport } from "../../../types"
import { getNativeFileStemsForUsedElements } from "../../discovery/native-html-file-stem"
import { getUsedNativeComponents } from "../../discovery/get-used-native-components"

/**
 * Get the native primitives that are actually used in the workspace
 */
export function getNativeComponentFiles(
  workspace: Workspace,
  options: ExportOptions,
): FileToExport[] {
  const primitives: FileToExport[] = []
  const reader =
    options.assetReader ?? createNodeExportAssetReader(options.rootDirectory)

  const usedFileStems = getNativeFileStemsForUsedElements(
    getUsedNativeComponents(workspace),
  )

  for (const fileStem of usedFileStems) {
    const content = reader.readNativeComponent(fileStem)
    if (!content) continue

    primitives.push({
      path: path.join(
        options.output.componentsFolder,
        "native-react",
        `${fileStem}.tsx`,
      ),
      content,
    })
  }

  return primitives
}
