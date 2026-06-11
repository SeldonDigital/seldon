import path from "node:path"

import { Workspace } from "@seldon/core"

import { createNodeExportAssetReader } from "../../../asset-reader"
import { ComponentToExport, ExportOptions, FileToExport } from "../../../types"
import { getUsedNativeComponents } from "../../discovery/get-used-native-components"
import { getNativeFileStemsForUsedElements } from "../../discovery/native-html-file-stem"

/**
 * Get the native primitives that are actually used in the workspace.
 *
 * Stems come from two sources: the `htmlElement` values discovered on
 * workspace nodes, and each exported component's `exportConfig.react.returns`
 * when it names an HTML wrapper. The generated Frame always imports HTML.Div.
 */
export function getNativeComponentFiles(
  workspace: Workspace,
  componentsToExport: ComponentToExport[],
  options: ExportOptions,
): FileToExport[] {
  const primitives: FileToExport[] = []
  const reader =
    options.assetReader ?? createNodeExportAssetReader(options.rootDirectory)

  const usedFileStems = getNativeFileStemsForUsedElements(
    getUsedNativeComponents(workspace),
  )

  for (const component of componentsToExport) {
    const returns = component.config.react.returns
    if (returns.startsWith("HTML")) {
      usedFileStems.add(returns.replace("HTML", "HTML."))
    }
  }

  usedFileStems.add("HTML.Div")

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
