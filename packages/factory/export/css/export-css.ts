import { Workspace } from "@seldon/core"

import { buildExportContext } from "../../helpers/build-export-context"
import { buildStyleRegistry } from "./discovery/get-style-registry"
import { generateComponentStylesheet } from "./generation/generate-css-stylesheet"
import {
  type ThemeStylesheetFile,
  generateThemeStylesheetFiles,
} from "./generation/insert-theme-variables"

export type CssExportResult = {
  componentStylesheet: string
  themeStylesheets: ThemeStylesheetFile[]
}

export async function exportCss(
  workspace: Workspace,
  componentsFolder: string,
  forceRegeneration: boolean = false,
): Promise<CssExportResult> {
  const { parentIndex } = buildExportContext(workspace)

  const { classes, classNameToNodeId, nodeTreeDepths } = buildStyleRegistry(
    workspace,
    forceRegeneration,
    parentIndex,
  )

  const componentStylesheet = await generateComponentStylesheet(
    classes,
    workspace,
    classNameToNodeId,
    nodeTreeDepths,
  )

  const themeStylesheets = await generateThemeStylesheetFiles(
    workspace,
    componentsFolder,
  )

  return { componentStylesheet, themeStylesheets }
}
