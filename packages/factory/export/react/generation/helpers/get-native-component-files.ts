import path from "node:path"

import { Workspace } from "@seldon/core"
import { NATIVE_REACT_PRIMITIVES } from "@seldon/core/components/constants"
import { CUSTOM_REACT_TEMPLATE_META } from "@seldon/core/components/catalog/custom/registry"

import { createNodeExportAssetReader } from "../../../asset-reader"
import { ComponentToExport, ExportOptions, FileToExport } from "../../../types"
import { getUsedNativeComponents } from "../../discovery/get-used-native-components"
import { getNativeFileStemsForUsedElements } from "../../discovery/native-html-file-stem"

/**
 * Native file stem for a primitive component name, e.g. `HTMLArticle` ->
 * `HTML.Article`. Mirrors the import path emitted by `insertImports`.
 */
function toNativeFileStem(componentName: string): string {
  return componentName.replace("HTML", "HTML.")
}

/**
 * Collect native file stems for the switch options of a component that returns
 * `htmlElement` or `wrapperElement`. The generated component imports a native
 * wrapper for every option, so each option must be written alongside it.
 */
function addSwitchOptionStems(
  component: ComponentToExport,
  usedFileStems: Set<string>,
): void {
  const { config, tree } = component

  if (config.react.returns === "htmlElement") {
    for (const option of tree.dataBinding.props.htmlElement?.options ?? []) {
      const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
        ([, value]) => value.htmlElementOption === option,
      )
      if (hit) usedFileStems.add(toNativeFileStem(hit[0]))
    }
  }

  if (config.react.returns === "wrapperElement") {
    for (const option of tree.dataBinding.props.wrapperElement?.options ?? []) {
      const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
        ([, value]) => value.wrapperElementOption === option,
      )
      if (hit) usedFileStems.add(toNativeFileStem(hit[0]))
    }
  }
}

/**
 * Get the native primitives that are actually used in the workspace.
 *
 * Stems come from three sources: the `htmlElement` values discovered on
 * workspace nodes, each exported component's `exportConfig.react.returns` when
 * it names an HTML wrapper, and the `htmlElement`/`wrapperElement` switch
 * options of components that return one of those. The generated Frame always
 * imports HTML.Div.
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

  // Bespoke templates whose sources must be copied when a custom component is
  // exported. Each `react.custom.template` resolves to one file stem.
  const usedCustomFileStems = new Set<string>()

  for (const component of componentsToExport) {
    const returns = component.config.react.returns
    if (returns.startsWith("HTML")) {
      usedFileStems.add(toNativeFileStem(returns))
    }
    if (returns === "custom" && component.config.react.custom) {
      usedCustomFileStems.add(
        CUSTOM_REACT_TEMPLATE_META[component.config.react.custom.template]
          .fileStem,
      )
    }
    addSwitchOptionStems(component, usedFileStems)
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

  for (const fileStem of usedCustomFileStems) {
    const content = reader.readCustomComponent?.(fileStem)
    if (!content) continue

    primitives.push({
      path: path.join(
        options.output.componentsFolder,
        "custom",
        `${fileStem}.tsx`,
      ),
      content,
    })
  }

  return primitives
}
